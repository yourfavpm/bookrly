-- Add Automated Reminders System

-- 1. Scheduled Messages Table
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CONFIRMATION', 'REMINDER', 'FOLLOWUP')),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('SMS', 'EMAIL')),
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'OPENED', 'FAILED', 'SKIPPED')),
    failure_reason TEXT,
    template_snapshot TEXT,
    twilio_sid VARCHAR(100),
    sendgrid_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Client Notification Preferences
CREATE TABLE IF NOT EXISTS public.client_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    sms_opt_out BOOLEAN DEFAULT false,
    email_opt_out BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(client_id, business_id)
);

-- 3. Provider Notification Settings
CREATE TABLE IF NOT EXISTS public.provider_notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE UNIQUE,
    confirmation_enabled BOOLEAN DEFAULT true,
    reminder_enabled BOOLEAN DEFAULT true,
    followup_enabled BOOLEAN DEFAULT true,
    reminder_lead_time_hours INTEGER DEFAULT 24,
    sms_confirm_template TEXT,
    email_confirm_template TEXT,
    sms_reminder_template TEXT,
    email_reminder_template TEXT,
    email_followup_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. SMS Usage Tracking (for Starter plan limits)
CREATE TABLE IF NOT EXISTS public.business_sms_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    count INTEGER DEFAULT 0,
    UNIQUE(business_id, month_year)
);

-- Enable RLS
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_sms_usage ENABLE ROW LEVEL SECURITY;

-- Policies for provider notification settings (Business owner/admin/manager can manage)
CREATE POLICY "Manage notification settings" ON public.provider_notification_settings
    FOR ALL TO authenticated
    USING (business_id IN (
        SELECT id FROM businesses WHERE id = provider_notification_settings.business_id
    ));

-- Policies for scheduled messages
CREATE POLICY "View scheduled messages" ON public.scheduled_messages
    FOR SELECT TO authenticated
    USING (business_id IN (
        SELECT id FROM businesses WHERE id = scheduled_messages.business_id
    ));

-- Policies for client preferences
CREATE POLICY "Manage client preferences" ON public.client_notification_preferences
    FOR ALL TO authenticated
    USING (business_id IN (
        SELECT id FROM businesses WHERE id = client_notification_preferences.business_id
    ));

-- Grant access
GRANT ALL ON public.scheduled_messages TO authenticated;
GRANT ALL ON public.client_notification_preferences TO authenticated;
GRANT ALL ON public.provider_notification_settings TO authenticated;
GRANT ALL ON public.business_sms_usage TO authenticated;
