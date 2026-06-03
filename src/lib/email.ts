import { supabase } from "./supabase"

export interface SendEmailParams {
  to: string | string[]
  from?: string
  subject: string
  html?: string
  text?: string
}

/**
 * Utility function to send an email via the Supabase Edge Function `send-email`.
 * This calls the Resend API on the backend.
 */
export async function sendEmail(params: SendEmailParams) {
  const { data, error } = await supabase.functions.invoke("send-email", {
    body: params,
  })

  if (error) {
    console.error("Failed to send email via edge function:", error)
    throw error
  }

  return data
}
