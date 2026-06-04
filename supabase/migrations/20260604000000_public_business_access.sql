-- ============================================================
-- PUBLIC BUSINESS ACCESS + SUBDOMAIN ROUTING FIX
-- Allows unauthenticated visitors to read published businesses
-- and all their associated public data (services, reviews, etc.)
-- ============================================================

-- 1. BUSINESSES — Allow anyone to SELECT published businesses
DROP POLICY IF EXISTS "Public can view published businesses" ON public.businesses;
CREATE POLICY "Public can view published businesses"
  ON public.businesses FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- 2. SERVICES — Allow public read for businesses that are published
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = services.business_id AND is_published = true
    )
  );

-- 3. ADDONS — Allow public read for active addons on published businesses
DROP POLICY IF EXISTS "Public can view addons" ON public.addons;
CREATE POLICY "Public can view addons"
  ON public.addons FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.services s
      JOIN public.businesses b ON b.id = s.business_id
      WHERE s.id = addons.service_id AND b.is_published = true
    )
  );

-- 4. REVIEWS — Allow public read for published businesses
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = reviews.business_id AND is_published = true
    )
  );

-- 5. PROOF_ITEMS — Allow public read for published businesses
DROP POLICY IF EXISTS "Public can view proof items" ON public.proof_items;
CREATE POLICY "Public can view proof items"
  ON public.proof_items FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = proof_items.business_id AND is_published = true
    )
  );

-- 6. AVAILABILITY — Allow public read for published businesses (needed for booking slots)
DROP POLICY IF EXISTS "Public can view availability" ON public.availability;
CREATE POLICY "Public can view availability"
  ON public.availability FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = availability.business_id AND is_published = true
    )
  );

-- 7. Ensure logo_url column exists (some older schemas use 'logo' text column)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE public.businesses ADD COLUMN logo_url text;
  END IF;
END $$;

-- Sync logo -> logo_url for existing rows that might have old 'logo' field
UPDATE public.businesses SET logo_url = logo WHERE logo_url IS NULL AND logo IS NOT NULL;
