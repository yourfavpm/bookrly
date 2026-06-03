import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { Resend } from "npm:resend@3.2.0"

// Hook payload from Supabase
interface EmailHookPayload {
  user: {
    id: string;
    email: string;
    user_metadata: any;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: 'signup' | 'recovery' | 'invite' | 'magiclink' | 'email_change';
    site_url: string;
  };
}

const getEmailTemplate = (actionType: string, token: string, redirect_to: string, token_hash: string) => {
  let title = "Verify your email";
  let greeting = "Welcome to Skeduley!";
  let message = "Please verify your email address to get started with your new booking website. We're excited to have you!";
  let ctaText = "Verify Email Address";
  
  const verifyUrl = `${redirect_to}?token_hash=${token_hash}&type=${actionType}`;

  if (actionType === 'recovery') {
    title = "Reset your password";
    greeting = "Password Reset Request";
    message = "Someone requested a password reset for your Skeduley account. If this was you, click the button below to set a new password.";
    ctaText = "Reset Password";
  } else if (actionType === 'invite') {
    title = "You've been invited";
    greeting = "You've been invited!";
    message = "You've been invited to join a Skeduley team. Click below to accept your invitation and set up your account.";
    ctaText = "Accept Invitation";
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 40px 32px; text-align: center; }
    .logo { color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 48px 40px; color: #1a1a1a; text-align: center; }
    h1 { font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.5px; }
    p { font-size: 16px; color: #4a4a4a; margin-bottom: 32px; }
    .cta-container { text-align: center; margin: 32px 0; }
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
      <h1>${greeting}</h1>
      <p>${message}</p>
      
      <div class="cta-container">
        <a href="${verifyUrl}" class="btn">${ctaText}</a>
      </div>

      <p style="font-size: 13px; color: #888; margin-top: 48px;">If you didn't request this email, you can safely ignore it.</p>
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
};

serve(async (req) => {
  try {
    const payload: EmailHookPayload = await req.json();
    const { user, email_data } = payload;
    
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY environment variable")
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    let subject = "Verify your Skeduley account";
    if (email_data.email_action_type === 'recovery') subject = "Reset your Skeduley password";
    if (email_data.email_action_type === 'invite') subject = "You've been invited to Skeduley";

    const html = getEmailTemplate(
      email_data.email_action_type, 
      email_data.token, 
      email_data.redirect_to, 
      email_data.token_hash
    );

    // Send the email directly via Resend
    const { error: resendError } = await resend.emails.send({
      from: 'Skeduley <hello@skeduley.com>',
      to: [user.email],
      subject: subject,
      html: html,
    });

    if (resendError) {
      console.error('Failed to send email via Resend:', resendError);
      return new Response(JSON.stringify({ error: resendError }), { status: 400 });
    }

    // Return empty JSON to tell Supabase NOT to send its default email
    return new Response(JSON.stringify({}), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error processing email hook:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
