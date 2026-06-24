import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"
import { Resend } from "npm:resend@3.2.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const getSmsLimitForPlan = (planType: string | null | undefined) => {
  const normalized = (planType || "pro").toLowerCase()
  if (normalized === "starter") return 1000
  if (normalized === "business" || normalized === "enterprise") return 20000
  if (normalized === "pro") return 5000
  return 500
}

const getBusinessUrl = (subdomain: string | null | undefined, customDomain: string | null | undefined) => {
  if (customDomain) return `https://${customDomain}`
  const rootDomain = (Deno.env.get("ROOT_DOMAIN") || "skeduley.com").replace(/^https?:\/\//, "").replace(/\/$/, "")
  if (!subdomain) return rootDomain
  if (rootDomain.includes("localhost") || rootDomain.includes("vercel.app")) {
    return `${rootDomain}/${subdomain}`
  }
  return `https://${subdomain}.${rootDomain}`
}

const renderTemplate = (template: string, vars: Record<string, string>) =>
  Object.entries(vars).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, value), template)

const sendSms = async (to: string, body: string) => {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID")
  const token = Deno.env.get("TWILIO_AUTH_TOKEN")
  const from = Deno.env.get("TWILIO_PHONE_NUMBER")
  if (!sid || !token || !from) {
    throw new Error("SMS provider not configured")
  }

  const auth = btoa(`${sid}:${token}`)
  const payload = new URLSearchParams({ To: to, From: from, Body: body })
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.json()
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    const resend = resendApiKey ? new Resend(resendApiKey) : null

    const { processAll = true, limit = 25, businessId } = await req.json().catch(() => ({}))

    let query = supabaseAdmin
      .from("scheduled_messages")
      .select("*")
      .eq("status", "QUEUED")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(limit)

    if (businessId) query = query.eq("business_id", businessId)

    const { data: messages, error } = await query
    if (error) throw error

    const results: Array<{ id: string; status: string; message?: string }> = []

    for (const message of messages || []) {
      const [{ data: business }, { data: client }, { data: booking }] = await Promise.all([
        supabaseAdmin.from("businesses").select("id,name,subdomain,plan_type,timezone,phone").eq("id", message.business_id).maybeSingle(),
        supabaseAdmin.from("clients").select("id,name,email,phone").eq("id", message.client_id).maybeSingle(),
        supabaseAdmin.from("bookings").select("id,date,start_time,end_time,service_id,status,payment_status").eq("id", message.booking_id).maybeSingle(),
      ])

      const { data: service } = booking
        ? await supabaseAdmin.from("services").select("id,name").eq("id", booking.service_id).maybeSingle()
        : { data: null }

      if (!business || !booking || !client) {
        await supabaseAdmin.from("scheduled_messages").update({
          status: "FAILED",
          failure_reason: "Missing related booking, business, or client data",
        }).eq("id", message.id)
        continue
      }

      const businessUrl = getBusinessUrl(business.subdomain)
      const baseVars = {
        client_name: client.name || "there",
        service: service?.name || "Service",
        date: new Date(booking.date).toLocaleDateString(),
        time: booking.start_time?.slice(0, 5) || "",
        provider_name: business.name,
        business_name: business.name,
        cancel_link: `${businessUrl}/c/${booking.id}`,
        review_link: `${businessUrl}/r/${booking.id}`,
        booking_link: businessUrl,
      }
      const template = message.template_snapshot || ""
      const rendered = renderTemplate(template, baseVars)

      try {
        if (message.channel === "EMAIL") {
          if (!resend) throw new Error("RESEND_API_KEY is not configured")
          if (!client.email) throw new Error("Client email is missing")
          
          const envFrom = Deno.env.get("RESEND_FROM_EMAIL") || "Skeduley <hello@skeduley.com>";
          const fromEmail = envFrom.includes("<") ? `${business.name} <${envFrom.split("<")[1]}` : `${business.name} <${envFrom}>`;

          const htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #111; letter-spacing: -0.5px;">${business.name}</h1>
              </div>
              <div style="background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; padding: 40px; font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">${rendered}</div>
              <div style="margin-top: 40px; font-size: 13px; color: #888; text-align: center;">
                <p style="margin: 0;">Sent via Skeduley on behalf of <strong>${business.name}</strong></p>
                <p style="margin: 8px 0 0;"><a href="${businessUrl}" style="color: #666; text-decoration: underline;">Visit our website</a></p>
              </div>
            </div>
          `;

          const response = await resend.emails.send({
            from: fromEmail,
            to: [client.email],
            subject:
              message.type === "FOLLOWUP"
                ? `Thanks for visiting ${business.name}`
                : `${business.name} booking ${message.type.toLowerCase()}`,
            text: rendered,
            html: htmlContent,
            headers: {
              "X-Entity-Ref-ID": message.id,
            },
          })

          await supabaseAdmin.from("scheduled_messages").update({
            status: "SENT",
            sent_at: new Date().toISOString(),
            sendgrid_id: response.data?.id || null,
          }).eq("id", message.id)
        } else {
          const suffix = "\nReply STOP to unsubscribe"
          const maxLen = 160 - suffix.length
          const sms = rendered.length > maxLen ? rendered.slice(0, maxLen - 3) + "..." : rendered
          const planLimit = getSmsLimitForPlan(business.plan_type)
          const monthKey = new Date().toISOString().slice(0, 7)
          const { data: usageRow } = await supabaseAdmin
            .from("business_sms_usage")
            .select("*")
            .eq("business_id", business.id)
            .eq("month_year", monthKey)
            .maybeSingle()

          const currentCount = usageRow?.count || 0
          if (currentCount >= planLimit) {
            throw new Error("SMS limit reached for this plan")
          }

          const twilioResponse = await sendSms(client.phone, `${sms}${suffix}`)
          await supabaseAdmin.from("business_sms_usage").upsert({
            business_id: business.id,
            month_year: monthKey,
            count: currentCount + 1,
          })

          await supabaseAdmin.from("scheduled_messages").update({
            status: "SENT",
            sent_at: new Date().toISOString(),
            twilio_sid: twilioResponse.sid || null,
          }).eq("id", message.id)
        }

        results.push({ id: message.id, status: "processed" })
      } catch (sendError: any) {
        await supabaseAdmin.from("scheduled_messages").update({
          status: "FAILED",
          failure_reason: sendError.message || "Message send failed",
        }).eq("id", message.id)
        results.push({ id: message.id, status: "failed", message: sendError.message })
      }

      if (!processAll) break
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
