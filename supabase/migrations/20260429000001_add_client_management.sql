-- ===========================================
-- CLIENT MANAGEMENT (CRM) SYSTEM
-- ===========================================

-- 1. Create Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, phone)
);

-- 2. Create Client Notes Table
CREATE TABLE IF NOT EXISTS client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES staff_members(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Add client_id to Bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- 4. RLS Policies for Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Owner/Manager access to clients
CREATE POLICY "Users can manage their business clients"
  ON clients FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
      UNION
      SELECT business_id FROM staff_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Staff can view clients they have bookings with (or all if we want to keep it simple for now)
-- For MVP, let's allow all staff to view clients in the same business
CREATE POLICY "Staff can view business clients"
  ON clients FOR SELECT
  USING (
    business_id IN (
      SELECT business_id FROM staff_members WHERE user_id = auth.uid()
    )
  );

-- 5. RLS Policies for Client Notes
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their client notes"
  ON client_notes FOR ALL
  USING (
    client_id IN (
      SELECT id FROM clients WHERE business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
        UNION
        SELECT business_id FROM staff_members WHERE user_id = auth.uid()
      )
    )
  );

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_notes_updated_at BEFORE UPDATE ON client_notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Logic for auto-CRM is best handled in the application layer (store) 
-- to manage the "merge" logic and name updates easily, but we could do it in a trigger too.
-- Let's stick to the store for more complex logic.
