-- Guarantee server-side staff assignment for "Any Available" bookings
-- and normalize booking payment status vocabulary.

alter table public.bookings
  alter column payment_status set default 'unpaid';

update public.bookings
set payment_status = 'unpaid'
where payment_status is null;

alter table public.bookings
  drop constraint if exists bookings_payment_status_check;

alter table public.bookings
  add constraint bookings_payment_status_check
  check (payment_status in ('unpaid', 'pending', 'partially_paid', 'paid', 'failed', 'refunded'));

create or replace function public.skeduley_assign_any_available_staff()
returns trigger
language plpgsql
as $$
declare
  business_tz text;
  booking_dow integer;
  booking_start_at timestamptz;
  booking_end_at timestamptz;
  selected_staff_id uuid;
begin
  if new.staff_id is not null then
    return new;
  end if;

  select coalesce(timezone, 'America/Toronto')
  into business_tz
  from public.businesses
  where id = new.business_id;

  booking_dow := extract(dow from new.date)::integer;
  booking_start_at := ((new.date::text || ' ' || new.start_time::text)::timestamp at time zone business_tz);
  booking_end_at := ((new.date::text || ' ' || new.end_time::text)::timestamp at time zone business_tz);

  select sm.id
  into selected_staff_id
  from public.staff_members sm
  where sm.business_id = new.business_id
    and sm.status = 'active'
    and exists (
      select 1
      from public.staff_services ss
      where ss.staff_id = sm.id
        and ss.service_id = new.service_id
    )
    and (
      not exists (
        select 1
        from public.staff_availability sa
        where sa.staff_id = sm.id
          and sa.day_of_week = booking_dow
      )
      or exists (
        select 1
        from public.staff_availability sa
        where sa.staff_id = sm.id
          and sa.day_of_week = booking_dow
          and sa.is_open = true
          and new.start_time::time >= sa.start_time
          and new.end_time::time <= sa.end_time
      )
    )
    and not exists (
      select 1
      from public.bookings existing
      where existing.business_id = new.business_id
        and existing.staff_id = sm.id
        and existing.status not in ('cancelled', 'no_show')
        and tstzrange(existing.appointment_start_at, existing.appointment_end_at, '[)') &&
            tstzrange(booking_start_at, booking_end_at, '[)')
    )
    and not exists (
      select 1
      from public.blocked_times blocked
      where blocked.business_id = new.business_id
        and (blocked.staff_id is null or blocked.staff_id = sm.id)
        and blocked.date = new.date
        and tstzrange(
          ((blocked.date::text || ' ' || blocked.start_time::text)::timestamp at time zone business_tz),
          ((blocked.date::text || ' ' || blocked.end_time::text)::timestamp at time zone business_tz),
          '[)'
        ) && tstzrange(booking_start_at, booking_end_at, '[)')
    )
  order by sm.created_at asc
  limit 1;

  if selected_staff_id is null then
    raise exception 'No available staff member found for this booking time';
  end if;

  new.staff_id := selected_staff_id;
  return new;
end;
$$;

drop trigger if exists skeduley_assign_any_available_staff_trigger on public.bookings;
create trigger skeduley_assign_any_available_staff_trigger
before insert on public.bookings
for each row
execute function public.skeduley_assign_any_available_staff();
