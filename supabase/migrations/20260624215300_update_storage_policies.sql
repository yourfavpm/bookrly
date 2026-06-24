-- Storage policies for business-assets bucket with Staff Management

-- 1. Ensure the bucket is public
update storage.buckets
set public = true
where id = 'business-assets';

-- 2. Drop existing conflicting policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update to business-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete to business-assets" ON storage.objects;

-- 3. Allow public read access
CREATE POLICY "Public Access to business-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-assets');

-- 4. Allow authenticated upload for owner OR admin/manager staff
CREATE POLICY "Authenticated Upload to business-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-assets' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
    OR
    (storage.foldername(name))[1] IN (
      SELECT business_id::text FROM public.staff_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
      AND role IN ('admin', 'manager')
    )
  )
);

-- 5. Allow authenticated update for owner OR admin/manager staff
CREATE POLICY "Authenticated Update to business-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
    OR
    (storage.foldername(name))[1] IN (
      SELECT business_id::text FROM public.staff_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
      AND role IN ('admin', 'manager')
    )
  )
);

-- 6. Allow authenticated delete for owner OR admin/manager staff
CREATE POLICY "Authenticated Delete to business-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
    OR
    (storage.foldername(name))[1] IN (
      SELECT business_id::text FROM public.staff_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
      AND role IN ('admin', 'manager')
    )
  )
);
