-- EagleHacks 2027 schema. Access rules live in the next migration.

create type public.application_status as enum (
  'accepted', 'waitlisted', 'rejected', 'confirmed', 'declined', 'expired', 'checked_in'
);
create type public.staff_role as enum ('admin', 'volunteer');
create type public.scan_kind as enum ('check_in', 'meal');

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.staff_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.staff_role not null,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  airtable_record_id text not null unique,
  status public.application_status not null,
  confirm_by timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.qr_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  -- two v4 uuids = ~244 random bits, unguessable; no pgcrypto needed
  token text not null unique
    default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at)
);

create table public.meal_windows (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at)
);

create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.scan_kind not null,
  meal_window_id uuid references public.meal_windows (id) on delete cascade,
  scanned_by uuid not null references auth.users (id),
  scanned_at timestamptz not null default now(),
  check ((kind = 'meal') = (meal_window_id is not null))
);

-- one check-in per hacker, one scan per hacker per meal window
create unique index scans_one_check_in on public.scans (user_id) where kind = 'check_in';
create unique index scans_one_per_meal on public.scans (user_id, meal_window_id) where kind = 'meal';

create index meal_windows_event_id_idx on public.meal_windows (event_id);
create index scans_meal_window_id_idx on public.scans (meal_window_id);
create index scans_scanned_by_idx on public.scans (scanned_by);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();
