-- Migration to add publishing and multi-tenant support
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;

-- Force slug generation for existing businesses based on their current subdomain or name
UPDATE businesses 
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Ensure no trailing hyphens in generated slugs
UPDATE businesses
SET slug = TRIM(TRAILING '-' FROM slug)
WHERE slug LIKE '%-';
