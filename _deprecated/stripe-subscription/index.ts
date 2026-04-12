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
    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    )

    // Handle Webhooks
    if (req.headers.get('stripe-signature')) {
      const signature = req.headers.get('stripe-signature')!
      const body = await req.text()
      let event

      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
        )
      } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
      }

      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object
          await adminClient
            .from('businesses')
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              trial_end_date: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            })
            .eq('stripe_customer_id', subscription.customer)
          break
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object
          await adminClient
            .from('businesses')
            .update({
              subscription_status: 'canceled',
            })
            .eq('stripe_subscription_id', subscription.id)
          break
        }
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object
          if (invoice.subscription) {
            await adminClient
              .from('businesses')
              .update({
                subscription_status: 'active',
              })
              .eq('stripe_subscription_id', invoice.subscription)
          }
          break
        }
        case 'invoice.payment_failed': {
          const invoice = event.data.object
          if (invoice.subscription) {
            await adminClient
              .from('businesses')
              .update({
                subscription_status: 'past_due',
              })
              .eq('stripe_subscription_id', invoice.subscription)
          }
          break
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Handle API Actions
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { action } = await req.json()

    const { data: business, error: bError } = await supabaseClient
      .from('businesses')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    if (bError || !business) throw new Error('Business not found')

    if (action === 'create-checkout-session') {
      let customerId = business.stripe_customer_id

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            business_id: business.id,
            owner_id: user.id
          }
        })
        customerId = customer.id
        await supabaseClient
          .from('businesses')
          .update({ stripe_customer_id: customerId })
          .eq('id', business.id)
      }

      // Check if they are still in trial
      const now = new Date();
      const trialEndDate = business.trial_end_date ? new Date(business.trial_end_date) : null;
      const trialDaysRemaining = trialEndDate ? Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

      const origin = req.headers.get('origin') || Deno.env.get('VITE_ROOT_DOMAIN') || 'http://localhost:5173';
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: Deno.env.get('STRIPE_PRO_PRICE_ID'),
            quantity: 1,
          },
        ],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: trialDaysRemaining > 0 ? trialDaysRemaining : undefined,
          metadata: {
            business_id: business.id
          }
        },
        success_url: `${origin}/dashboard/settings?section=billing&success=true`,
        cancel_url: `${origin}/dashboard/settings?section=billing&canceled=true`,
      })

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
