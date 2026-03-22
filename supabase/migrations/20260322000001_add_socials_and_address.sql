-- Add social links and address to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS socials jsonb DEFAULT '{"instagram": "", "facebook": "", "twitter": ""}'::jsonb;

-- Ensure proof_items matches the UI expectation (image_url, caption)
ALTER TABLE public.proof_items 
RENAME COLUMN title TO caption;

-- Ensure reviews matches the UI expectation (customer_name, rating, comment)
ALTER TABLE public.reviews
RENAME COLUMN author_name TO customer_name;

ALTER TABLE public.reviews
RENAME COLUMN content TO comment;
