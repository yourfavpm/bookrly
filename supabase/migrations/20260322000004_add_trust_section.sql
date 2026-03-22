-- Add trust_section column to businesses table
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS trust_section text DEFAULT 'none';
