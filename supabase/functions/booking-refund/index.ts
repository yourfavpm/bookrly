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

    const { bookingId } = await req.json()
    if (!bookingId) throw new Error("Missing bookingId")

    // Verify booking belongs to this user's business
    const { data: business, error: bError } = await supabaseClient
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    if (bError || !business) throw new Error("Business not found")

    const { data: booking, error: bookError } = await supabaseClient
      .from("bookings")
      .select("stripe_payment_intent_id, payment_status")
      .eq("id", bookingId)
      .eq("business_id", business.id)
      .single()

    if (bookError || !booking) throw new Error("Booking not found")
    if (!booking.stripe_payment_intent_id) throw new Error("No payment to refund")
    if (booking.payment_status === "refunded") throw new Error("Already refunded")

    // Issue refund via Stripe
    await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent_id,
    })

    // Update booking status
    await supabaseClient
      .from("bookings")
      .update({
        payment_status: "refunded",
        status: "cancelled",
      })
      .eq("id", bookingId)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
