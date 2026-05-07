-- Add theme_mode and hidden_sections to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS theme_mode TEXT DEFAULT 'light';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS hidden_sections TEXT[] DEFAULT '{}';
