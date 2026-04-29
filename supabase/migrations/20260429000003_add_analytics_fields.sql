-- Add payment_method and update status handling for bookings
alter table public.bookings 
  add column if not exists payment_method text default 'UNPAID' check (payment_method in ('CARD', 'CASH', 'GIFT_CARD', 'PACKAGE', 'UNPAID'));

-- Ensure status can handle NO_SHOW
-- (It's already text, but we'll add a check constraint now for safety)
alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check 
  check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show'));
