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

const PLATFORM_FEE_PERCENT = 0.03

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { bookingId, businessId, successUrl, cancelUrl } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Get booking with service details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*, service:service_id(*)")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) throw new Error("Booking not found")

    // Get business for Stripe account
    const { data: business, error: businessError } = await supabaseAdmin
      .from("businesses")
      .select("stripe_account_id, name")
      .eq("id", businessId)
      .single()

    if (businessError || !business || !business.stripe_account_id) {
      throw new Error("Business payment setup incomplete")
    }

    const amountInCents = Math.round(booking.total_amount * 100)
    const platformFee = Math.round(amountInCents * PLATFORM_FEE_PERCENT)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.service.name,
              description: `Booking with ${business.name} on ${booking.date} at ${booking.start_time}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: bookingId,
      customer_email: booking.customer_email,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: business.stripe_account_id,
        },
      },
      metadata: {
        booking_id: bookingId,
        business_id: businessId,
      },
    })

    // Store session ID on booking
    await supabaseAdmin
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", bookingId)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
