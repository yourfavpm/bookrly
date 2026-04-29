-- Add slug column to businesses
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Populate slug from subdomain for existing records
UPDATE public.businesses SET slug = subdomain WHERE slug IS NULL;

-- Ensure all current businesses are published so links work immediately
UPDATE public.businesses SET is_published = true;

-- Update RLS for staff_members to allow public viewing of staff for published businesses
-- (This was missing or restricted in previous migrations)
DROP POLICY IF EXISTS "Public can view active staff" ON public.staff_members;
CREATE POLICY "Public can view active staff"
  ON public.staff_members FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_id AND is_published = true
    )
  );
