-- Migration to add subscription and trial fields to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'pro';

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_businesses_stripe_customer_id ON businesses(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_businesses_stripe_subscription_id ON businesses(stripe_subscription_id);
