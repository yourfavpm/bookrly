import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"
import Stripe from "https://esm.sh/stripe@22.0.1?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-04-30.basil",
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    )
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
  }

  // Use service role key — webhooks come from Stripe, not an authenticated user
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await adminClient
          .from("businesses")
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            trial_end_date: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          })
          .eq("stripe_customer_id", subscription.customer as string)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await adminClient
          .from("businesses")
          .update({ subscription_status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await adminClient
            .from("businesses")
            .update({ subscription_status: "active" })
            .eq("stripe_subscription_id", invoice.subscription as string)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await adminClient
            .from("businesses")
            .update({ subscription_status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription as string)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    console.error("Webhook processing error:", err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
