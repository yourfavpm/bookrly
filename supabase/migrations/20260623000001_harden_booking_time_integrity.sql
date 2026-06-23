-- Add timezone-aware booking timestamps and server-side overlap protection.

alter table public.businesses
  add column if not exists timezone text not null default 'America/Toronto';

alter table public.bookings
  add column if not exists timezone text,
  add column if not exists appointment_start_at timestamptz,
  add column if not exists appointment_end_at timestamptz;

update public.bookings bk
set timezone = coalesce(bk.timezone, b.timezone, 'America/Toronto'),
    appointment_start_at = coalesce(bk.appointment_start_at, ((bk.date::text || ' ' || bk.start_time::text)::timestamp at time zone coalesce(b.timezone, 'America/Toronto'))),
    appointment_end_at = coalesce(bk.appointment_end_at, ((bk.date::text || ' ' || bk.end_time::text)::timestamp at time zone coalesce(b.timezone, 'America/Toronto')))
from public.businesses b
where b.id = bk.business_id;

create or replace function public.skeduley_prepare_booking_time()
returns trigger
language plpgsql
as $$
declare
  business_tz text;
begin
  select coalesce(timezone, 'America/Toronto')
  into business_tz
  from public.businesses
  where id = new.business_id;

  new.timezone := coalesce(new.timezone, business_tz, 'America/Toronto');
  new.appointment_start_at := ((new.date::text || ' ' || new.start_time::text)::timestamp at time zone new.timezone);
  new.appointment_end_at := ((new.date::text || ' ' || new.end_time::text)::timestamp at time zone new.timezone);

  if new.appointment_end_at <= new.appointment_start_at then
    raise exception 'Booking end time must be after start time';
  end if;

  if new.appointment_start_at <= now() then
    raise exception 'Booking start time must be in the future';
  end if;

  return new;
end;
$$;

create or replace function public.skeduley_prevent_booking_overlap()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.bookings existing
    where existing.business_id = new.business_id
      and existing.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and existing.status not in ('cancelled', 'no_show')
      and (new.staff_id is null or existing.staff_id is null or existing.staff_id = new.staff_id)
      and tstzrange(existing.appointment_start_at, existing.appointment_end_at, '[)') &&
          tstzrange(new.appointment_start_at, new.appointment_end_at, '[)')
  ) then
    raise exception 'This time is no longer available';
  end if;

  if exists (
    select 1
    from public.blocked_times blocked
    where blocked.business_id = new.business_id
      and blocked.date = new.date
      and (blocked.staff_id is null or new.staff_id is null or blocked.staff_id = new.staff_id)
      and tstzrange(
        ((blocked.date::text || ' ' || blocked.start_time::text)::timestamp at time zone new.timezone),
        ((blocked.date::text || ' ' || blocked.end_time::text)::timestamp at time zone new.timezone),
        '[)'
      ) && tstzrange(new.appointment_start_at, new.appointment_end_at, '[)')
  ) then
    raise exception 'This time is blocked off and cannot be booked';
  end if;

  return new;
end;
$$;

drop trigger if exists skeduley_prepare_booking_time_trigger on public.bookings;
create trigger skeduley_prepare_booking_time_trigger
before insert or update of date, start_time, end_time, business_id, timezone
on public.bookings
for each row
execute function public.skeduley_prepare_booking_time();

drop trigger if exists skeduley_prevent_booking_overlap_trigger on public.bookings;
create trigger skeduley_prevent_booking_overlap_trigger
before insert or update of date, start_time, end_time, business_id, staff_id, status, timezone
on public.bookings
for each row
execute function public.skeduley_prevent_booking_overlap();

create index if not exists bookings_business_time_idx
  on public.bookings (business_id, appointment_start_at, appointment_end_at);

create index if not exists bookings_business_staff_time_idx
  on public.bookings (business_id, staff_id, appointment_start_at, appointment_end_at);
