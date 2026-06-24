import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { bookingId, authorName, rating, content } = await req.json()
    if (!bookingId || !authorName || !rating || !content) throw new Error("Missing review fields")

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("business_id")
      .eq("id", bookingId)
      .single()

    if (error || !booking) throw new Error("Booking not found")

    await supabaseAdmin.from("reviews").insert({
      business_id: booking.business_id,
      author_name: authorName,
      rating,
      content,
    })

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
