-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BUSINESSES
create table public.businesses (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  category text,
  subdomain text unique,
  logo text,
  cover_image text,
  primary_color text default '#4f46e5',
  hero_title text,
  hero_subtitle text,
  cta_text text default 'Book Now',
  about_title text,
  about_description text,
  about_image text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICES
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  name text not null,
  description text,
  price decimal(12,2) not null,
  duration integer not null, -- in minutes
  booking_fee_enabled boolean default false,
  booking_fee_amount decimal(12,2) default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ADDONS
create table public.addons (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) on delete cascade not null,
  name text not null,
  price decimal(12,2) not null,
  duration integer default 0,
  active boolean default true
);

-- REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  author_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROOF_ITEMS (Gallery/Proof of Work)
create table public.proof_items (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  image_url text not null,
  title text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AVAILABILITY
create table public.availability (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  day_of_week integer check (day_of_week >= 0 and day_of_week <= 6), -- 0=Sunday
  start_time time not null,
  end_time time not null,
  is_open boolean default true,
  unique(business_id, day_of_week)
);

-- BOOKINGS
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  date date not null,
  start_time time not null,
  end_time time not null,
  total_amount decimal(12,2) not null,
  paid_amount decimal(12,2) default 0,
  payment_status text default 'pending', -- pending, partial, paid
  status text default 'pending', -- pending, confirmed, cancelled, completed
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BOOKING_ADDONS
create table public.booking_addons (
  booking_id uuid references public.bookings(id) on delete cascade,
  addon_id uuid references public.addons(id) on delete cascade,
  primary key (booking_id, addon_id)
);

-- RLS POLICIES

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.services enable row level security;
alter table public.addons enable row level security;
alter table public.reviews enable row level security;
alter table public.proof_items enable row level security;
alter table public.availability enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_addons enable row level security;

-- Profiles: Users can edit their own profile
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Businesses: Owners can manage their own business. Public can view published.
create policy "Owners can manage their own business" on public.businesses 
  for all using (auth.uid() = owner_id);
create policy "Public can view published businesses" on public.businesses 
  for select using (is_published = true);

-- Services: Owners can manage. Public can view active services of published businesses.
create policy "Owners can manage services" on public.services 
  for all using (exists (select 1 from public.businesses where id = business_id and owner_id = auth.uid()));
create policy "Public can view active services" on public.services 
  for select using (active = true and exists (select 1 from public.businesses where id = business_id and is_published = true));

-- Addons: Follow services.
create policy "Owners can manage addons" on public.addons 
  for all using (exists (select 1 from public.services s join public.businesses b on s.business_id = b.id where s.id = service_id and b.owner_id = auth.uid()));
create policy "Public can view active addons" on public.addons 
  for select using (active = true and exists (select 1 from public.services s join public.businesses b on s.business_id = b.id where s.id = service_id and b.is_published = true));

-- Reviews & Proof Items: Owners manage, Public views published.
create policy "Owners can manage reviews" on public.reviews for all using (exists (select 1 from public.businesses where id = business_id and owner_id = auth.uid()));
create policy "Public can view reviews" on public.reviews for select using (exists (select 1 from public.businesses where id = business_id and is_published = true));

create policy "Owners can manage proof items" on public.proof_items for all using (exists (select 1 from public.businesses where id = business_id and owner_id = auth.uid()));
create policy "Public can view proof items" on public.proof_items for select using (exists (select 1 from public.businesses where id = business_id and is_published = true));

-- Availability: Owners manage, Public views for booking.
create policy "Owners can manage availability" on public.availability for all using (exists (select 1 from public.businesses where id = business_id and owner_id = auth.uid()));
create policy "Public can view availability" on public.availability for select using (exists (select 1 from public.businesses where id = business_id and is_published = true));

-- Bookings: Owners manage. Public can insert (create booking).
create policy "Owners can manage bookings" on public.bookings for all using (exists (select 1 from public.businesses where id = business_id and owner_id = auth.uid()));
create policy "Public can create bookings" on public.bookings for insert with check (true);
create policy "Customers can view their own booking" on public.bookings for select using (true); -- Simplified for MVP, better to use session/token

-- Trigger for profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
