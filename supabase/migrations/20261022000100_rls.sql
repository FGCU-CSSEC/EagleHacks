-- Row-level security. Roles: hacker (any signed-in user), volunteer, admin (rows in staff_roles).

-- Helpers live in a schema the API does not expose. security definer lets them read
-- staff_roles without tripping its own policies.
create schema private;
grant usage on schema private to authenticated;

create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create function private.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_roles where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_admin(), private.is_staff() from public, anon;
grant execute on function private.is_admin(), private.is_staff() to authenticated;

alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.staff_roles enable row level security;
alter table public.applications enable row level security;
alter table public.qr_tokens enable row level security;
alter table public.events enable row level security;
alter table public.meal_windows enable row level security;
alter table public.scans enable row level security;

-- Admins can do everything on every table.
create policy admin_all on public.site_settings for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.profiles for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.staff_roles for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.applications for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.qr_tokens for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.events for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.meal_windows for all to authenticated
  using (private.is_admin()) with check (private.is_admin());
create policy admin_all on public.scans for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- Site settings are public (the site reads them). Never store secrets here.
create policy public_read on public.site_settings for select to anon, authenticated
  using (true);

-- Hackers: own rows only.
create policy own_select on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy own_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy own_select on public.staff_roles for select to authenticated
  using (user_id = (select auth.uid()));

-- Read-only for hackers: status changes and token creation go through server code
-- with the secret key.
create policy own_select on public.applications for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_select on public.qr_tokens for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_select on public.scans for select to authenticated
  using (user_id = (select auth.uid()));

-- Schedule data is readable by anyone signed in.
create policy signed_in_read on public.events for select to authenticated using (true);
create policy signed_in_read on public.meal_windows for select to authenticated using (true);

-- Staff (volunteers and admins) record scans as themselves and can see their own.
create policy staff_insert on public.scans for insert to authenticated
  with check (private.is_staff() and scanned_by = (select auth.uid()));
create policy staff_select_own on public.scans for select to authenticated
  using (private.is_staff() and scanned_by = (select auth.uid()));

-- Volunteers have no table access to qr_tokens/applications/profiles. They look up
-- one token at a time through this function, so the list can't be enumerated.
create function public.lookup_qr_token(p_token text)
returns table (user_id uuid, full_name text, status public.application_status)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_staff() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  return query
    select t.user_id, p.full_name, a.status
    from public.qr_tokens t
    left join public.profiles p on p.id = t.user_id
    left join public.applications a on a.user_id = t.user_id
    where t.token = p_token;
end $$;

revoke execute on function public.lookup_qr_token(text) from public, anon;
grant execute on function public.lookup_qr_token(text) to authenticated;

-- A check-in scan moves a confirmed application to checked_in.
create function public.mark_checked_in() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.applications set status = 'checked_in'
  where user_id = new.user_id and status = 'confirmed';
  return new;
end $$;

revoke execute on function public.mark_checked_in() from public, anon, authenticated;

create trigger scans_check_in after insert on public.scans
  for each row when (new.kind = 'check_in') execute function public.mark_checked_in();

-- Every new auth user gets a profile.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
