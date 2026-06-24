import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"
import { Resend } from "npm:resend@3.2.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const sendSms = async (to: string, body: string) => {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID")
  const token = Deno.env.get("TWILIO_AUTH_TOKEN")
  const from = Deno.env.get("TWILIO_PHONE_NUMBER")
  if (!sid || !token || !from) throw new Error("SMS provider not configured")
  const auth = btoa(`${sid}:${token}`)
  const payload = new URLSearchParams({ To: to, From: from, Body: body })
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  })
  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

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

    const { channel, businessId, templateText, notificationType } = await req.json()

    if (!businessId || !channel) throw new Error("Missing required parameters")

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { data: business, error: bError } = await supabaseAdmin
      .from("businesses")
      .select("id,name,email,phone,subdomain")
      .eq("id", businessId)
      .single()

    if (bError || !business) throw new Error("Business not found")

    // Replace placeholders with dummy data for the test email
    let personalizedMessage = templateText || `Hi ${business.name}, this is a test email sent to your signup account (${user.email}).`
    personalizedMessage = personalizedMessage
      .replace(/{client_name}/g, "John Doe")
      .replace(/{service}/g, "Premium Haircut")
      .replace(/{date}/g, "October 15, 2026")
      .replace(/{time}/g, "2:00 PM")
      .replace(/{provider_name}/g, "Alex Smith")
      .replace(/{business_name}/g, business.name || "Our Business")
      .replace(/{cancel_link}/g, "https://example.com/cancel")
      .replace(/{review_link}/g, "https://example.com/review")
      .replace(/{booking_link}/g, `https://${business.subdomain}.skeduley.com`)

    let subjectLine = "Test email from your application"
    if (notificationType === "confirmation") subjectLine = "Booking Confirmed - Test Email"
    else if (notificationType === "reminder") subjectLine = "Upcoming Booking Reminder - Test Email"
    else if (notificationType === "followup") subjectLine = "Thank you for visiting! - Test Email"

    if (channel === "email") {
      if (!user.email) throw new Error("No user email found to send the test email to.");
      
      const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "")
      const envFrom = Deno.env.get("RESEND_FROM_EMAIL") || "Skeduley <hello@skeduley.com>";
      const fromEmail = envFrom.includes("<") ? `${business.name} <${envFrom.split("<")[1]}` : `${business.name} <${envFrom}>`;
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subjectLine}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 40px 32px; text-align: center; }
    .logo { color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 48px 40px; color: #1a1a1a; }
    .footer { background-color: #fcfcfc; padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0; }
    .footer p { font-size: 13px; color: #888888; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">${business.name || 'Provider'}</h1>
    </div>
    <div class="content">
      <div style="font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap;">${personalizedMessage}</div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `;

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [user.email],
        subject: subjectLine,
        text: personalizedMessage,
        html: htmlContent,
      })
      if (error) {
        throw new Error(`Resend Error: ${error.message}. (Note: If it says 'From address is not verified', make sure your RESEND_FROM_EMAIL secret matches your verified domain in Resend.)`);
      }
    } else {
      // SMS
      const sid = Deno.env.get("TWILIO_ACCOUNT_SID")
      const token = Deno.env.get("TWILIO_AUTH_TOKEN")
      const from = Deno.env.get("TWILIO_FROM_NUMBER")
      
      if (!sid || !token || !from) throw new Error("SMS provider (Twilio) not configured in secrets.")
      
      if (!business.phone) throw new Error("Your business phone number is missing. Please add it to your profile first.")
      
      await sendSms(business.phone, personalizedMessage)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error: any) {
    console.error("Function error:", error)
    // We return 200 so the frontend gets the JSON payload instead of a generic "non-2xx" error.
    return new Response(JSON.stringify({ error: error.message || "Unknown error occurred" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
