-- ============================================================
-- BUFFER TIME AND BLOCKED TIMES
-- Allows providers to add buffer time between appointments
-- and explicitly block off specific times in their calendar
-- ============================================================

-- 1. Add buffer_time to services
alter table public.services
  add column if not exists buffer_time integer default 0;

-- 2. Create blocked_times table
create table public.blocked_times (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  staff_id uuid references public.staff_members(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.blocked_times enable row level security;

-- Owners can manage blocked times
create policy "Owners can manage blocked times"
  on public.blocked_times for all to authenticated
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

-- Staff can manage their own blocked times
create policy "Staff manage own blocked times"
  on public.blocked_times for all to authenticated
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

-- Public can view blocked times for booking calculation
create policy "Public can view blocked times"
  on public.blocked_times for select to anon, authenticated
  using (
    exists (
      select 1 from public.businesses
      where id = business_id and is_published = true
    )
  );
