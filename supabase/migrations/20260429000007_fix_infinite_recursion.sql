-- ============================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ============================================================

-- 1. DROP ALL PROBLEMATIC POLICIES
DROP POLICY IF EXISTS "Managers can view staff" ON public.staff_members;
DROP POLICY IF EXISTS "Staff can view peers" ON public.staff_members;
DROP POLICY IF EXISTS "Staff can view own record" ON public.staff_members;
DROP POLICY IF EXISTS "Staff can update own record" ON public.staff_members;
DROP POLICY IF EXISTS "Owners manage staff" ON public.staff_members;

DROP POLICY IF EXISTS "Staff manage own availability" ON public.staff_availability;
DROP POLICY IF EXISTS "Owners manage staff availability" ON public.staff_availability;

DROP POLICY IF EXISTS "Staff can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can update own bookings" ON public.bookings;

-- 2. HELPER FUNCTIONS (SECURITY DEFINER to bypass RLS)
CREATE OR REPLACE FUNCTION public.get_user_business_ids(_user_id UUID)
RETURNS TABLE(business_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT id FROM public.businesses WHERE owner_id = _user_id
    UNION
    SELECT sm.business_id FROM public.staff_members sm WHERE sm.user_id = _user_id AND sm.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff_member(_staff_id UUID, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.staff_members 
        WHERE id = _staff_id AND user_id = _user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. NEW NON-RECURSIVE POLICIES FOR staff_members

-- Business owners can manage all staff (Direct check on businesses table)
CREATE POLICY "Owners manage staff"
  ON public.staff_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = staff_members.business_id AND owner_id = auth.uid()
    )
  );

-- Staff can view peers and themselves if they belong to the same business
-- We use the helper function to avoid recursive SELECT on staff_members
CREATE POLICY "Staff view peers"
  ON public.staff_members FOR SELECT
  USING (
    business_id IN (SELECT public.get_user_business_ids(auth.uid()))
  );

-- Staff can update their own record
CREATE POLICY "Staff update own record"
  ON public.staff_members FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 4. NEW POLICIES FOR staff_availability

CREATE POLICY "Owners manage staff availability"
  ON public.staff_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.staff_members sm ON sm.business_id = b.id
      WHERE sm.id = staff_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Staff manage own availability"
  ON public.staff_availability FOR ALL
  USING (
    public.is_staff_member(staff_id, auth.uid())
  );

-- 5. NEW POLICIES FOR bookings

CREATE POLICY "Staff view own bookings"
  ON public.bookings FOR SELECT
  USING (
    public.is_staff_member(staff_id, auth.uid())
  );

CREATE POLICY "Staff update own bookings"
  ON public.bookings FOR UPDATE
  USING (
    public.is_staff_member(staff_id, auth.uid())
  )
  WITH CHECK (
    public.is_staff_member(staff_id, auth.uid())
  );

-- 6. ENSURE PUBLIC VIEWS ARE STILL WORKING
DROP POLICY IF EXISTS "Public can view active staff" ON public.staff_members;
CREATE POLICY "Public can view active staff"
  ON public.staff_members FOR SELECT
  TO anon, authenticated
  USING (
    status = 'active' AND EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_id AND is_published = true
    )
  );
