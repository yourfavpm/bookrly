-- Drop the restrictive overlap trigger
drop trigger if exists skeduley_prevent_booking_overlap_trigger on public.bookings;
drop function if exists public.skeduley_prevent_booking_overlap();
