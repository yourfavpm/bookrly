-- Add Stripe tracking fields to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE;

-- Ensure payment_status has the correct check constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check CHECK (payment_status IN ('pending', 'partially_paid', 'paid', 'failed', 'refunded'));
