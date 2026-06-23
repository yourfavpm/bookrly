-- Keep Skeduley subdomains generated from the business name and mirrored
-- in the domains table whenever a site is published.

create or replace function public.skeduley_slugify_domain_label(value text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'),
    '-+',
    '-',
    'g'
  ));
$$;

create or replace function public.skeduley_available_subdomain(p_base text, p_business_id uuid)
returns text
language plpgsql
as $$
declare
  candidate text;
  base_candidate text;
  suffix text;
  counter integer := 2;
begin
  candidate := left(nullif(public.skeduley_slugify_domain_label(p_base), ''), 50);

  if candidate is null or length(candidate) < 3 then
    candidate := 'biz-' || left(p_business_id::text, 8);
  end if;

  if candidate in (
    'www', 'app', 'api', 'admin', 'dashboard', 'mail', 'smtp', 'support',
    'help', 'billing', 'auth', 'login', 'signup', 'onboarding', 'preview',
    'demo', 'invite', 'unsubscribe', 'p'
  ) then
    candidate := left(candidate || '-' || left(p_business_id::text, 6), 63);
  end if;

  base_candidate := candidate;

  if not exists (select 1 from public.businesses where subdomain = candidate and id <> p_business_id)
     and not exists (select 1 from public.domains where domain = candidate and business_id <> p_business_id) then
    return candidate;
  end if;

  suffix := left(p_business_id::text, 6);
  candidate := left(trim(trailing '-' from candidate), 56 - length(suffix)) || '-' || suffix;

  if not exists (select 1 from public.businesses where subdomain = candidate and id <> p_business_id)
     and not exists (select 1 from public.domains where domain = candidate and business_id <> p_business_id) then
    return candidate;
  end if;

  loop
    candidate := left(base_candidate, 61 - length(counter::text)) || '-' || counter::text;
    exit when not exists (select 1 from public.businesses where subdomain = candidate and id <> p_business_id)
      and not exists (select 1 from public.domains where domain = candidate and business_id <> p_business_id);
    counter := counter + 1;
  end loop;

  return candidate;
end;
$$;

create or replace function public.skeduley_set_published_subdomain()
returns trigger
language plpgsql
as $$
declare
  next_subdomain text;
begin
  if new.is_published is not true then
    return new;
  end if;

  next_subdomain := public.skeduley_slugify_domain_label(new.subdomain);

  if next_subdomain is null
     or next_subdomain = ''
     or next_subdomain ~ '^biz-[a-z0-9-]+$'
     or exists (select 1 from public.businesses where subdomain = next_subdomain and id <> new.id)
     or exists (select 1 from public.domains where domain = next_subdomain and business_id <> new.id) then
    next_subdomain := public.skeduley_available_subdomain(new.name, new.id);
  end if;

  new.subdomain := next_subdomain;
  new.slug := next_subdomain;

  return new;
end;
$$;

create or replace function public.skeduley_sync_published_domain()
returns trigger
language plpgsql
as $$
begin
  if new.is_published is not true or new.subdomain is null or new.subdomain = '' then
    return new;
  end if;

  update public.domains
  set is_primary = false
  where business_id = new.id;

  insert into public.domains (
    business_id,
    domain,
    type,
    status,
    is_primary,
    ssl_enabled,
    ssl_status,
    verified_at,
    dns_records
  )
  values (
    new.id,
    new.subdomain,
    'subdomain',
    'active',
    true,
    true,
    'active',
    now(),
    '{}'::jsonb
  )
  on conflict (domain) do update
  set status = 'active',
      is_primary = true,
      ssl_enabled = true,
      ssl_status = 'active',
      verified_at = coalesce(public.domains.verified_at, now()),
      dns_records = '{}'::jsonb;

  return new;
end;
$$;

drop trigger if exists skeduley_set_published_subdomain_trigger on public.businesses;
create trigger skeduley_set_published_subdomain_trigger
before insert or update of is_published, name, subdomain on public.businesses
for each row
execute function public.skeduley_set_published_subdomain();

drop trigger if exists skeduley_sync_published_domain_trigger on public.businesses;
create trigger skeduley_sync_published_domain_trigger
after insert or update of is_published, name, subdomain on public.businesses
for each row
execute function public.skeduley_sync_published_domain();

update public.businesses
set subdomain = null
where is_published is not true
  and subdomain ~ '^biz-[a-z0-9-]+$';

update public.businesses
set is_published = is_published
where is_published is true;
