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
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { action } = await req.json()

    // Get existing business info
    const { data: business, error: bError } = await supabaseClient
      .from('businesses')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    if (bError || !business) throw new Error('Business not found')

    if (action === 'create-onboarding-link') {
      let stripeAccountId = business.stripe_account_id

      if (!stripeAccountId) {
        // Create a new connected account
        const account = await stripe.accounts.create({
          type: 'standard',
          email: user.email,
          business_profile: {
            name: business.name,
            url: business.custom_domain 
              ? `https://${business.custom_domain}` 
              : `https://${business.subdomain}.skeduley.co`,
            support_phone: business.phone || undefined,
          },
          metadata: {
            business_id: business.id,
            owner_id: user.id
          }
        })
        stripeAccountId = account.id

        // Store account ID immediately
        await supabaseClient
          .from('businesses')
          .update({ stripe_account_id: stripeAccountId })
          .eq('id', business.id)
      }

      const origin = req.headers.get('origin') || Deno.env.get('VITE_ROOT_DOMAIN') || 'http://localhost:5173';

      // Create an account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${origin}/dashboard/settings?section=payments&refresh=true`,
        return_url: `${origin}/dashboard/settings?section=payments&return=true`,
        type: 'account_onboarding',
      })

      return new Response(JSON.stringify({ url: accountLink.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'refresh-status') {
      if (!business.stripe_account_id) throw new Error('No Stripe account connected')
      
      const account = await stripe.accounts.retrieve(business.stripe_account_id)
      
      const updates = {
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_details_submitted: account.details_submitted,
        stripe_enabled: account.charges_enabled && account.payouts_enabled,
        stripe_onboarding_status: account.details_submitted ? 'complete' : 'pending'
      }

      const { error: uError } = await supabaseClient
        .from('businesses')
        .update(updates)
        .eq('id', business.id)

      if (uError) throw uError

      return new Response(JSON.stringify(updates), {
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
