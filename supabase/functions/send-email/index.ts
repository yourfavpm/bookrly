import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { Resend } from "npm:resend@3.2.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const getWelcomeEmailHtml = (businessName: string = 'Provider') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Skeduley</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 40px 32px; text-align: center; }
    .logo { color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 48px 40px; color: #1a1a1a; }
    h1 { font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; }
    p { font-size: 16px; color: #4a4a4a; margin-bottom: 24px; }
    .features { margin: 32px 0; padding: 0; list-style: none; }
    .feature-item { padding-left: 28px; position: relative; margin-bottom: 16px; font-size: 15px; color: #333333; }
    .feature-item::before { content: '✨'; position: absolute; left: 0; top: -2px; font-size: 14px; }
    .cta-container { text-align: center; margin: 40px 0; }
    .btn { display: inline-block; background-color: #111111; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 100px; font-weight: 500; font-size: 15px; }
    .footer { background-color: #fcfcfc; padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0; }
    .footer p { font-size: 13px; color: #888888; margin: 0; }
    .links { margin-top: 16px; }
    .links a { color: #6B21A8; text-decoration: none; font-size: 13px; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Skeduley</h1>
    </div>
    <div class="content">
      <h1>Welcome to Skeduley!</h1>
      <p>Hi ${businessName},</p>
      <p>We're absolutely thrilled to have you on board. You've just taken the first step towards automating your bookings, reclaiming your time, and growing your business effortlessly.</p>
      
      <p>Here are a few powerful things you can do right now to get the most out of Skeduley:</p>
      
      <ul class="features">
        <li class="feature-item"><strong>Set up your services:</strong> Add your offerings, set pricing, and configure durations in your dashboard.</li>
        <li class="feature-item"><strong>Require booking fees:</strong> Connect Stripe and start taking deposits to reduce no-shows.</li>
        <li class="feature-item"><strong>Manage your availability:</strong> Block off personal time or set custom recurring working hours.</li>
        <li class="feature-item"><strong>Share your link:</strong> Put your beautiful new booking link in your Instagram bio or send it directly to clients.</li>
      </ul>

      <div class="cta-container">
        <a href="https://skeduley.com/dashboard" class="btn">Go to your Dashboard</a>
      </div>

      <p>If you ever get stuck or have any questions, simply reply to this email. We're here to help you succeed.</p>
      <p>Best,<br>The Skeduley Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Skeduley. All rights reserved.</p>
      <div class="links">
        <a href="https://skeduley.com/help">Help Center</a>
        <a href="https://skeduley.com/privacy">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable")
    }

    const resend = new Resend(resendApiKey)

    // Parse request body
    const body = await req.json()
    const { to, template, data: templateData, from: requestedFrom } = body
    
    // We can support either arbitrary email sending (if authorized) or template-based
    let subject = body.subject;
    let html = body.html;
    let text = body.text;

    // Use "hello@skeduley.com" as default, fall back to onboarding@resend.dev if not verified on Resend yet
    const senderEmail = requestedFrom || "Skeduley <hello@skeduley.com>";

    if (template === 'welcome') {
      subject = "Welcome to Skeduley! 🎉";
      html = getWelcomeEmailHtml(templateData?.name || 'there');
    }

    if (!to || !subject || (!html && !text)) {
      throw new Error("Missing required fields: 'to', 'subject', and either 'html' or 'text' are required.")
    }

    const data = await resend.emails.send({
      from: senderEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    })

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Error sending email:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
