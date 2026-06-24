-- Add a secure function for the public booking flow to upsert clients
-- without exposing the clients table to public SELECT/UPDATE policies.

create or replace function public.skeduley_upsert_booking_client(
  p_business_id uuid,
  p_name text,
  p_email text,
  p_phone text
) returns uuid
language plpgsql
security definer
as $$
declare
  v_client_id uuid;
begin
  -- Try to find by email first
  if p_email is not null and p_email <> '' then
    select id into v_client_id
    from public.clients
    where business_id = p_business_id
      and email ilike p_email
      and is_deleted = false
    limit 1;
  end if;

  -- If not found by email, try by phone
  if v_client_id is null and p_phone is not null and p_phone <> '' then
    select id into v_client_id
    from public.clients
    where business_id = p_business_id
      and phone = p_phone
      and is_deleted = false
    limit 1;
  end if;

  if v_client_id is not null then
    -- Update existing
    update public.clients
    set name = coalesce(p_name, name),
        phone = coalesce(p_phone, phone),
        email = coalesce(p_email, email),
        updated_at = now()
    where id = v_client_id;
  else
    -- Insert new
    insert into public.clients (business_id, name, email, phone)
    values (p_business_id, p_name, p_email, p_phone)
    returning id into v_client_id;
  end if;

  return v_client_id;
end;
$$;
