import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const parseFormBody = async (req: Request) => {
  const raw = await req.text()
  return Object.fromEntries(new URLSearchParams(raw))
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const payload = await parseFormBody(req)
    const body = (payload.Body || payload.body || "").toString().trim().toUpperCase()
    const from = (payload.From || payload.from || "").toString()
    const to = (payload.To || payload.to || "").toString()

    if (!from || !to) throw new Error("Missing SMS sender or recipient")

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { data: business } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .eq("phone", to)
      .maybeSingle()

    if (!business) throw new Error("Business not found for inbound SMS")

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("phone", from)
      .eq("business_id", business.id)
      .maybeSingle()

    if (!client) throw new Error("Client not found for inbound SMS")

    const shouldOptOut = body.includes("STOP") || body.includes("UNSUBSCRIBE") || body.includes("CANCEL") || body.includes("END") || body.includes("QUIT")

    if (shouldOptOut) {
      await supabaseAdmin.from("client_notification_preferences").upsert({
        client_id: client.id,
        business_id: business.id,
        sms_opt_out: true,
        updated_at: new Date().toISOString(),
      })
    }

    return new Response("<Response></Response>", {
      headers: { ...corsHeaders, "Content-Type": "text/xml" },
    })
  } catch (error: any) {
    return new Response("<Response></Response>", {
      status: 200, // Twilio needs 200 to stop retrying
      headers: { ...corsHeaders, "Content-Type": "text/xml" },
    })
  }
})
