import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"
import Stripe from "https://esm.sh/stripe@22.0.1?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-04-30.basil",
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) throw new Error("Missing authorization header")

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error("Unauthorized")

    const { action } = await req.json()

    const { data: business, error: bError } = await supabaseClient
      .from("businesses")
      .select("*")
      .eq("owner_id", user.id)
      .single()

    if (bError || !business) throw new Error("Business not found")

    // --- Create Checkout Session ---
    if (action === "create-checkout-session") {
      let customerId = business.stripe_customer_id

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            business_id: business.id,
            owner_id: user.id,
          },
        })
        customerId = customer.id

        await supabaseClient
          .from("businesses")
          .update({ stripe_customer_id: customerId })
          .eq("id", business.id)
      }

      // Calculate remaining trial days
      const now = new Date()
      const trialEndDate = business.trial_end_date ? new Date(business.trial_end_date) : null
      const trialDaysRemaining = trialEndDate
        ? Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0

      const origin = req.headers.get("origin") || Deno.env.get("APP_URL") || "http://localhost:5173"

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: Deno.env.get("STRIPE_PRO_PRICE_ID"),
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: {
          trial_period_days: trialDaysRemaining > 0 ? trialDaysRemaining : undefined,
          metadata: { business_id: business.id },
        },
        success_url: `${origin}/dashboard/settings?section=billing&upgraded=true`,
        cancel_url: `${origin}/dashboard/settings?section=billing&canceled=true`,
      })

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // --- Create Customer Portal Session ---
    if (action === "create-portal-session") {
      const customerId = business.stripe_customer_id
      if (!customerId) throw new Error("No Stripe customer found. Please subscribe first.")

      const origin = req.headers.get("origin") || Deno.env.get("APP_URL") || "http://localhost:5173"

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/dashboard/settings?section=billing`,
      })

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    throw new Error("Invalid action")
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
