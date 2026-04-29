-- Fix Recursive RLS Policies for staff_members
-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Managers can view staff" ON public.staff_members;

-- 1. Helper function to check if a user is a manager or owner of a business
-- This avoids recursion because we use security definer to bypass RLS for the check
CREATE OR REPLACE FUNCTION public.is_business_manager(_business_id UUID, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.businesses 
        WHERE id = _business_id AND owner_id = _user_id
    ) OR EXISTS (
        -- We use a subquery that doesn't trigger the policy itself
        -- by selecting directly from the table using the function's elevated privilege
        SELECT 1 FROM public.staff_members 
        WHERE business_id = _business_id 
          AND user_id = _user_id 
          AND role IN ('admin', 'manager')
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. New non-recursive policy for staff members
CREATE POLICY "Staff can view peers"
  ON public.staff_members FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
      UNION
      -- This check is now safer because we use auth.uid() directly
      SELECT business_id FROM public.staff_members WHERE user_id = auth.uid()
    )
  );

-- 3. Fix staff_availability recursion if any (they were okay but let's make them robust)
DROP POLICY IF EXISTS "Owners manage staff availability" ON public.staff_availability;
CREATE POLICY "Owners manage staff availability"
  ON public.staff_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.staff_members sm ON sm.business_id = b.id
      WHERE sm.id = staff_id AND b.owner_id = auth.uid()
    )
  );

-- 4. Fix staff_services recursion
DROP POLICY IF EXISTS "Owners manage staff services" ON public.staff_services;
CREATE POLICY "Owners manage staff services"
  ON public.staff_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.staff_members sm ON sm.business_id = b.id
      WHERE sm.id = staff_id AND b.owner_id = auth.uid()
    )
  );
