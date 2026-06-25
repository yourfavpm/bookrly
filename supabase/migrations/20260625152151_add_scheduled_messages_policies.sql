-- Allow anon and authenticated users to insert scheduled messages
CREATE POLICY "Insert scheduled messages" ON scheduled_messages
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to manage scheduled messages for their business
CREATE POLICY "Manage scheduled messages" ON scheduled_messages
FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses
  )
)
WITH CHECK (
  business_id IN (
    SELECT id FROM businesses
  )
);
