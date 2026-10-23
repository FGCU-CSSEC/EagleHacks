-- RLS check. Run against a local/scratch database only (it inserts fake users),
-- after `supabase db reset`:
--   psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql
-- Everything is rolled back at the end. Any failure raises and stops the script.

begin;

-- Fixtures (run as the superuser, bypassing RLS)
insert into auth.users (id, aud, role, email) values
  ('00000000-0000-0000-0000-00000000000a', 'authenticated', 'authenticated', 'alice@example.com'),
  ('00000000-0000-0000-0000-00000000000b', 'authenticated', 'authenticated', 'bob@example.com'),
  ('00000000-0000-0000-0000-0000000000c1', 'authenticated', 'authenticated', 'vol@example.com'),
  ('00000000-0000-0000-0000-0000000000ad', 'authenticated', 'authenticated', 'admin@example.com');

insert into public.staff_roles (user_id, role) values
  ('00000000-0000-0000-0000-0000000000c1', 'volunteer'),
  ('00000000-0000-0000-0000-0000000000ad', 'admin');

insert into public.applications (user_id, airtable_record_id, status) values
  ('00000000-0000-0000-0000-00000000000a', 'recA', 'confirmed'),
  ('00000000-0000-0000-0000-00000000000b', 'recB', 'confirmed');

insert into public.qr_tokens (user_id, token) values
  ('00000000-0000-0000-0000-00000000000a', 'token-alice'),
  ('00000000-0000-0000-0000-00000000000b', 'token-bob');

-- Alice, a hacker -------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);

do $$
declare n int;
begin
  select count(*) into n from public.applications;
  assert n = 1, format('hacker sees %s applications, expected only her own', n);

  select count(*) into n from public.applications
    where user_id = '00000000-0000-0000-0000-00000000000b';
  assert n = 0, 'hacker can read another hacker''s application';

  select count(*) into n from public.qr_tokens;
  assert n = 1, format('hacker sees %s qr_tokens, expected only her own', n);

  select count(*) into n from public.qr_tokens where token = 'token-bob';
  assert n = 0, 'hacker can read another hacker''s qr token';

  select count(*) into n from public.profiles;
  assert n = 1, format('hacker sees %s profiles, expected only her own', n);

  select count(*) into n from public.staff_roles;
  assert n = 0, 'hacker can see staff roles of others';

  -- writes: updates to another row or to applications affect nothing
  update public.applications set status = 'declined';
  get diagnostics n = row_count;
  assert n = 0, 'hacker can update applications';

  begin
    insert into public.scans (user_id, kind, scanned_by)
    values ('00000000-0000-0000-0000-00000000000a', 'check_in',
            '00000000-0000-0000-0000-00000000000a');
    assert false, 'hacker can insert a scan';
  exception when insufficient_privilege then null;
  end;

  begin
    perform * from public.lookup_qr_token('token-bob');
    assert false, 'hacker can use lookup_qr_token';
  exception when insufficient_privilege then null;
  end;
end $$;

-- Volunteer -------------------------------------------------------------------
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

do $$
declare n int;
begin
  select count(*) into n from public.applications;
  assert n = 0, 'volunteer can read applications directly';
  select count(*) into n from public.qr_tokens;
  assert n = 0, 'volunteer can list qr_tokens';

  select count(*) into n from public.lookup_qr_token('token-bob');
  assert n = 1, 'volunteer cannot look up a token';

  insert into public.scans (user_id, kind, scanned_by)
  values ('00000000-0000-0000-0000-00000000000b', 'check_in',
          '00000000-0000-0000-0000-0000000000c1');

  begin
    insert into public.scans (user_id, kind, scanned_by)
    values ('00000000-0000-0000-0000-00000000000a', 'check_in',
            '00000000-0000-0000-0000-00000000000b');  -- scanned_by is someone else
    assert false, 'volunteer can record a scan as another user';
  exception when insufficient_privilege then null;
  end;
end $$;

-- Admin -----------------------------------------------------------------------
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000ad","role":"authenticated"}', true);

do $$
declare n int;
begin
  select count(*) into n from public.applications;
  assert n = 2, format('admin sees %s applications, expected 2', n);
  select count(*) into n from public.qr_tokens;
  assert n = 2, format('admin sees %s qr_tokens, expected 2', n);
  update public.site_settings set value = '{}'::jsonb;  -- allowed, no rows needed
end $$;

-- Bob's check-in scan (by the volunteer) flipped his application
reset role;
do $$
declare s public.application_status;
begin
  select status into s from public.applications
    where user_id = '00000000-0000-0000-0000-00000000000b';
  assert s = 'checked_in', format('bob status is %s, expected checked_in', s);
end $$;

rollback;
select 'rls tests passed' as result;
