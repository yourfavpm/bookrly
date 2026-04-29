-- ============================================================
-- DOMAIN MANAGEMENT SYSTEM
-- ============================================================

-- 1. Create Domains Table
CREATE TABLE IF NOT EXISTS public.domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    domain TEXT NOT NULL UNIQUE, -- e.g. "sarah-yoga.bukd.co" or "sarahyoga.com"
    type TEXT NOT NULL CHECK (type IN ('subdomain', 'custom')),
    status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN (
        'pending_verification',
        'dns_configured',
        'active',
        'failed',
        'suspended',
        'transferred'
    )),
    is_primary BOOLEAN DEFAULT false,
    ssl_enabled BOOLEAN DEFAULT false,
    ssl_status TEXT DEFAULT 'none',
    dns_records JSONB DEFAULT '{}'::jsonb, -- Store the required DNS records for display
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Add domain fields to businesses (if not already present or for redundancy)
-- We already have subdomain and custom_domain in businesses table from initial schema,
-- but the domains table will be the source of truth for verification status.

-- 3. Enable RLS
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Owners can manage their domains"
    ON public.domains FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Public can view active domains"
    ON public.domains FOR SELECT
    USING (status = 'active');

-- 5. Helper Function for subdomain generation (Postgres side if needed)
-- (We'll handle the logic in the app for now as per the store structure)

-- 6. Grant Permissions
GRANT ALL ON public.domains TO authenticated;
GRANT SELECT ON public.domains TO anon;
