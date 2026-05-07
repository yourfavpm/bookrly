-- Add faqs and before_after_images to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS before_after_images JSONB DEFAULT '[]'::jsonb;
