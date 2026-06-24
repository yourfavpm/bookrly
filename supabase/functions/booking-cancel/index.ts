import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { bookingId } = await req.json()
    if (!bookingId) throw new Error("Missing bookingId")

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("id,payment_status")
      .eq("id", bookingId)
      .single()

    if (error || !booking) throw new Error("Booking not found")

    const updates: Record<string, unknown> = {
      status: "cancelled",
    }

    if (booking.payment_status !== "paid" && booking.payment_status !== "refunded") {
      updates.payment_status = "unpaid"
    }

    await supabaseAdmin.from("bookings").update(updates).eq("id", bookingId)

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
