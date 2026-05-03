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

    // --- Create Onboarding Link ---
    if (action === "create-onboarding-link") {
      let stripeAccountId = business.stripe_account_id

      if (!stripeAccountId) {
        const account = await stripe.accounts.create({
          type: "standard",
          email: user.email,
          business_profile: {
            name: business.name || undefined,
            url: business.custom_domain
              ? `https://${business.custom_domain}`
              : business.subdomain
                ? `https://${business.subdomain}.skeduley.co`
                : undefined,
            support_phone: business.phone || undefined,
          },
          metadata: {
            business_id: business.id,
            owner_id: user.id,
          },
        })
        stripeAccountId = account.id

        await supabaseClient
          .from("businesses")
          .update({ stripe_account_id: stripeAccountId })
          .eq("id", business.id)
      }

      const origin = req.headers.get("origin") || Deno.env.get("APP_URL") || "http://localhost:5173"

      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${origin}/dashboard/settings?section=payments&refresh=true`,
        return_url: `${origin}/dashboard/settings?section=payments&return=true`,
        type: "account_onboarding",
      })

      return new Response(JSON.stringify({ url: accountLink.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // --- Refresh Status ---
    if (action === "refresh-status") {
      if (!business.stripe_account_id) throw new Error("No Stripe account connected")

      const account = await stripe.accounts.retrieve(business.stripe_account_id)

      const updates = {
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_details_submitted: account.details_submitted,
        stripe_enabled: account.charges_enabled && account.payouts_enabled,
        stripe_onboarding_status: account.details_submitted ? "complete" : "pending",
      }

      const { error: uError } = await supabaseClient
        .from("businesses")
        .update(updates)
        .eq("id", business.id)

      if (uError) throw uError

      return new Response(JSON.stringify(updates), {
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
