-- Ensure business-assets bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete to business-assets" ON storage.objects;

-- Allow public read access to all objects in the business-assets bucket
CREATE POLICY "Public Access to business-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-assets');

-- Allow authenticated users to upload their own assets
CREATE POLICY "Authenticated Upload to business-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-assets' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- Allow authenticated users to update their own assets
CREATE POLICY "Authenticated Update to business-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- Allow authenticated users to delete their own assets
CREATE POLICY "Authenticated Delete to business-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);
