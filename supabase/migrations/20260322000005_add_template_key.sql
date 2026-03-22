-- Add template_key column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS template_key TEXT DEFAULT 'clean_classic';
