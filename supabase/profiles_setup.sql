-- One-shot setup for student profiles + storage (run in Supabase Dashboard → SQL → New query → Run).
-- Fixes: "Could not find the table 'public.profiles' in the schema cache"
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS where applicable.

-- --- Table ---
create table if not exists public.profiles (
  user_key text primary key,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  qualification text,
  college text,
  location text,
  image_url text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists password_hash text;

alter table public.profiles add column if not exists created_at timestamptz;

update public.profiles
set created_at = coalesce(created_at, updated_at, now())
where created_at is null;

alter table public.profiles alter column created_at set default now();
alter table public.profiles alter column created_at set not null;

create index if not exists profiles_name_lower_idx on public.profiles (lower(name));

alter table public.profiles enable row level security;

-- Realtime (ignore if already in publication)
do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception
  when duplicate_object then null;
end $$;

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles_insert_anon" on public.profiles;
create policy "profiles_insert_anon"
  on public.profiles
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "profiles_update_anon" on public.profiles;
create policy "profiles_update_anon"
  on public.profiles
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- --- Storage bucket for profile photos ---
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "profile_photos_select_public" on storage.objects;
create policy "profile_photos_select_public"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'profile-photos');

drop policy if exists "profile_photos_insert_public" on storage.objects;
create policy "profile_photos_insert_public"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'profile-photos');

drop policy if exists "profile_photos_update_public" on storage.objects;
create policy "profile_photos_update_public"
  on storage.objects
  for update
  to anon, authenticated
  using (bucket_id = 'profile-photos')
  with check (bucket_id = 'profile-photos');

-- Notify PostgREST to reload schema (Supabase usually picks this up within a minute; refresh the app).
notify pgrst, 'reload schema';
