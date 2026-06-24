import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const parseBody = async (req: Request) => {
  const raw = await req.text()
  const contentType = req.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.parse(raw)
  }
  return Object.fromEntries(new URLSearchParams(raw))
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const payload = await parseBody(req)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const messageId = payload.message_id || payload.MessageSid || payload.email_id || payload.id || payload.metadata?.message_id
    const status = (payload.status || payload.event || payload.type || "").toString().toUpperCase()

    if (!messageId) throw new Error("Missing message identifier")

    const nextStatus =
      status.includes("DELIVER") ? "DELIVERED" :
      status.includes("OPEN") ? "OPENED" :
      status.includes("FAIL") || status.includes("BOUNCE") ? "FAILED" :
      status.includes("QUEUE") ? "QUEUED" :
      "SENT"

    const updates: Record<string, unknown> = {
      status: nextStatus,
    }

    if (nextStatus === "FAILED") {
      updates.failure_reason = payload.failure_reason || payload.error || "Delivery failed"
    }

    if (payload.twilio_sid || payload.MessageSid) {
      updates.twilio_sid = payload.twilio_sid || payload.MessageSid
    }

    if (payload.sendgrid_id || payload.email_id || payload.id) {
      updates.sendgrid_id = payload.sendgrid_id || payload.email_id || payload.id
    }

    const messageQuery = supabaseAdmin.from("scheduled_messages").update(updates)

    if (payload.twilio_sid || payload.MessageSid) {
      await messageQuery.eq("twilio_sid", payload.twilio_sid || payload.MessageSid)
    } else if (payload.sendgrid_id || payload.email_id) {
      await messageQuery.eq("sendgrid_id", payload.sendgrid_id || payload.email_id)
    } else {
      await messageQuery.eq("id", messageId)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
