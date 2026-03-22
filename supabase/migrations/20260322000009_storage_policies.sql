-- Storage policies for business-assets bucket

-- 1. Ensure the bucket is public
update storage.buckets
set public = true
where id = 'business-assets';

-- 2. Allow public read access to all objects in the business-assets bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'business-assets' );

-- 3. Allow authenticated users to upload their own assets
-- We use business_id in the path: e.g., bucket/business_id/filename
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'business-assets' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- 4. Allow authenticated users to update their own assets
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'business-assets' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- 5. Allow authenticated users to delete their own assets
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'business-assets' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);
