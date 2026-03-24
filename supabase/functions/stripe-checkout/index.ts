import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@11.16.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingId, businessId, successUrl, cancelUrl } = await req.json()

    // Use service role key to bypass RLS for checking business/booking
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*, service:service_id(*)')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) throw new Error('Booking not found')
    
    // Get business details for Stripe Account ID
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('stripe_account_id, name')
      .eq('id', businessId)
      .single()

    if (businessError || !business || !business.stripe_account_id) {
      throw new Error('Business payment setup incomplete')
    }

    const amountInCents = Math.round(booking.paid_amount * 100)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.service.name} - Deposit`,
              description: `Booking for ${booking.customer_name} on ${booking.date} at ${booking.start_time}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: bookingId,
      customer_email: booking.customer_email,
      payment_intent_data: {
        application_fee_amount: 0, // We are not taking a platform fee yet
        transfer_data: {
          destination: business.stripe_account_id,
        },
      },
      metadata: {
        booking_id: bookingId,
        business_id: businessId,
      },
    })

    // Update booking with session ID
    await supabaseAdmin
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', bookingId)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
