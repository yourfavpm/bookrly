-- Drop the trigger that forces staff assignment
drop trigger if exists skeduley_assign_any_available_staff_trigger on public.bookings;

-- Drop the function
drop function if exists public.skeduley_assign_any_available_staff();
