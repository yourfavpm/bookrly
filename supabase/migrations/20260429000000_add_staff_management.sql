-- ============================================================
-- MULTI-STAFF & ROLE MANAGEMENT
-- Adds staff members, per-staff availability, service mapping,
-- and links bookings to individual staff.
-- ============================================================

-- 1. STAFF MEMBERS
create table public.staff_members (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  role text default 'staff' check (role in ('admin', 'manager', 'staff')),
  status text default 'invited' check (status in ('invited', 'active', 'inactive')),
  invite_token text unique default encode(gen_random_bytes(16), 'hex'),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(business_id, email)
);

-- 2. STAFF AVAILABILITY (independent per-staff weekly schedule)
create table public.staff_availability (
  id uuid default uuid_generate_v4() primary key,
  staff_id uuid references public.staff_members(id) on delete cascade not null,
  day_of_week integer check (day_of_week >= 0 and day_of_week <= 6),
  start_time time not null,
  end_time time not null,
  is_open boolean default true,
  unique(staff_id, day_of_week)
);

-- 3. STAFF-SERVICE MAPPING
create table public.staff_services (
  staff_id uuid references public.staff_members(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  primary key (staff_id, service_id)
);

-- 4. ADD staff_id TO BOOKINGS (nullable for backward compat with existing bookings)
alter table public.bookings
  add column if not exists staff_id uuid references public.staff_members(id) on delete set null;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.staff_members enable row level security;
alter table public.staff_availability enable row level security;
alter table public.staff_services enable row level security;

-- STAFF_MEMBERS policies

-- Business owners can manage all staff
create policy "Owners manage staff"
  on public.staff_members for all to authenticated
  using (
    exists (
      select 1 from public.businesses
      where id = business_id and owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses
      where id = business_id and owner_id = auth.uid()
    )
  );

-- Managers can view and update staff (not delete)
create policy "Managers can view staff"
  on public.staff_members for select to authenticated
  using (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.user_id = auth.uid()
        and sm.role = 'manager'
        and sm.status = 'active'
        and sm.business_id = staff_members.business_id
    )
  );

-- Staff can view their own record
create policy "Staff can view own record"
  on public.staff_members for select to authenticated
  using (user_id = auth.uid());

-- Staff can update their own record (limited fields handled in app)
create policy "Staff can update own record"
  on public.staff_members for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Public can view active staff of published businesses (for booking flow)
create policy "Public can view active staff"
  on public.staff_members for select to anon
  using (
    status = 'active'
    and exists (
      select 1 from public.businesses
      where id = business_id and is_published = true
    )
  );

-- Allow anonymous access for invite token lookup
create policy "Anon can view by invite token"
  on public.staff_members for select to anon
  using (invite_token is not null);

-- STAFF_AVAILABILITY policies

-- Owners manage all staff availability
create policy "Owners manage staff availability"
  on public.staff_availability for all to authenticated
  using (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.id = staff_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.id = staff_id and b.owner_id = auth.uid()
    )
  );

-- Staff can manage their own availability
create policy "Staff manage own availability"
  on public.staff_availability for all to authenticated
  using (
    exists (
      select 1 from public.staff_members
      where id = staff_id and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.staff_members
      where id = staff_id and user_id = auth.uid()
    )
  );

-- Public can view staff availability (for booking time slots)
create policy "Public can view staff availability"
  on public.staff_availability for select to anon, authenticated
  using (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.id = staff_id
        and sm.status = 'active'
        and b.is_published = true
    )
  );

-- STAFF_SERVICES policies

-- Owners manage service assignments
create policy "Owners manage staff services"
  on public.staff_services for all to authenticated
  using (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.id = staff_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.id = staff_id and b.owner_id = auth.uid()
    )
  );

-- Public can view staff-service mappings (for booking flow filtering)
create policy "Public can view staff services"
  on public.staff_services for select to anon, authenticated
  using (
    exists (
      select 1 from public.staff_members sm
      join public.businesses b on b.id = sm.business_id
      where sm.id = staff_id
        and sm.status = 'active'
        and b.is_published = true
    )
  );

-- BOOKINGS: Staff can view their own bookings
create policy "Staff can view own bookings"
  on public.bookings for select to authenticated
  using (
    exists (
      select 1 from public.staff_members
      where id = staff_id and user_id = auth.uid()
    )
  );

-- BOOKINGS: Staff can update their own bookings (mark complete, etc.)
create policy "Staff can update own bookings"
  on public.bookings for update to authenticated
  using (
    exists (
      select 1 from public.staff_members
      where id = staff_id and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.staff_members
      where id = staff_id and user_id = auth.uid()
    )
  );
