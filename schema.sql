-- SCELL GECWC Portal Database Schema
-- Target: Supabase Postgres / Storage

create extension if not exists pgcrypto;

create table if not exists public.events (
  id text primary key,
  title text not null,
  category text default 'WORKSHOP',
  status text default 'UPCOMING',
  event_date text,
  time text,
  venue text,
  collaborator text,
  poster_url text,
  rulebook_url text,
  description text,
  registration_open boolean default true,
  seats_total integer default 100,
  seats_filled integer default 0,
  featured boolean default false,
  badge text,
  winners jsonb default '[]'::jsonb,
  gallery_urls jsonb default '[]'::jsonb,
  custom_form jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events add column if not exists custom_form jsonb default '{}'::jsonb;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll text not null unique,
  branch text,
  batch text,
  year text,
  sem text,
  email text not null unique,
  mobile text,
  domain text,
  password text not null,
  photo_url text,
  xp integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.registrations (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  event_name text not null,
  name text not null,
  roll text not null,
  email text not null,
  branch text,
  sem text,
  year text,
  batch text,
  phone text,
  qr_payload jsonb,
  custom_answers jsonb default '{}'::jsonb,
  custom_form jsonb default '{}'::jsonb,
  status text default 'confirmed',
  created_at timestamptz default now(),
  unique(event_id, roll)
);

alter table public.registrations add column if not exists year text;
alter table public.registrations add column if not exists batch text;
alter table public.registrations add column if not exists phone text;
alter table public.registrations add column if not exists qr_payload jsonb;
alter table public.registrations add column if not exists custom_answers jsonb default '{}'::jsonb;
alter table public.registrations add column if not exists custom_form jsonb default '{}'::jsonb;
alter table public.registrations add column if not exists status text default 'confirmed';

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  role text,
  department text,
  tenure text,
  bio text,
  avatar_url text,
  category text default 'team',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id text primary key,
  name text not null,
  category text,
  status text,
  team jsonb default '[]'::jsonb,
  problem text,
  solution text,
  tech_stack jsonb default '[]'::jsonb,
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.startups (
  id text primary key,
  name text not null,
  stage text,
  founders text,
  category text,
  valuation text,
  description text,
  achievements text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text,
  event_date text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.daily_game_logs (
  id uuid primary key default gen_random_uuid(),
  student_roll text not null,
  date_claimed date not null,
  xp_awarded integer default 50,
  created_at timestamptz default now(),
  unique(student_roll, date_claimed)
);

create index if not exists idx_events_status on public.events(status);
create index if not exists idx_registrations_event on public.registrations(event_id);
create index if not exists idx_students_roll on public.students(roll);
create index if not exists idx_students_email on public.students(email);
create index if not exists idx_daily_game_logs_roll on public.daily_game_logs(student_roll);

-- Storage bucket setup helper
-- This bucket is created in Supabase dashboard or via storage API.
create policy "Public read access to scell assets"
on storage.objects for select
using (bucket_id = 'scell-assets');

create policy "Authenticated users can upload scell assets"
on storage.objects for insert
with check (bucket_id = 'scell-assets' and auth.role() = 'authenticated');

create policy "Authenticated users can update scell assets"
on storage.objects for update
using (bucket_id = 'scell-assets' and auth.role() = 'authenticated');

create policy "Authenticated users can delete scell assets"
on storage.objects for delete
using (bucket_id = 'scell-assets' and auth.role() = 'authenticated');

-- Public read policy for app content
alter table public.events enable row level security;
alter table public.students enable row level security;
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.startups enable row level security;
alter table public.memories enable row level security;
alter table public.daily_game_logs enable row level security;

create policy "Public events are readable" on public.events for select using (true);
create policy "Public projects are readable" on public.projects for select using (true);
create policy "Public startups are readable" on public.startups for select using (true);
create policy "Public team members are readable" on public.team_members for select using (true);
create policy "Public memories are readable" on public.memories for select using (true);
create policy "Public registration reads are allowed" on public.registrations for select using (true);
create policy "Public student lookup is allowed by roll or email" on public.students for select using (true);
create policy "Users may insert their own student record" on public.students for insert with check (true);
create policy "Users may update their own student record" on public.students for update using (true) with check (true);
create policy "Users may insert their own registration" on public.registrations for insert with check (true);
create policy "Users may update own registration" on public.registrations for update using (true) with check (true);
create policy "Open daily game log writes" on public.daily_game_logs for insert with check (true);

-- Optional: bucket creation command for Supabase SQL editor
-- select storage.create_bucket('scell-assets', true, 'Public SCELL asset storage');
