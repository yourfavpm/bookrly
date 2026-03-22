-- Add Stripe fields to businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS stripe_enabled BOOLEAN DEFAULT false;
