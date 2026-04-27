-- Student profiles (alumni card data + optional photo URL).
-- Run in Supabase SQL Editor or via CLI.
--
-- Security note: With the anon key alone, Postgres cannot prove browser identity.
-- Policies below allow anon read (alumni list) and open writes keyed by user_key.
-- Harden for production: add Supabase Auth and policies using auth.uid() = user_id.

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

create index if not exists profiles_name_lower_idx on public.profiles (lower(name));

alter table public.profiles enable row level security;

-- Optional: live updates on Alumni (postgres_changes). Safe to ignore errors if already added.
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

notify pgrst, 'reload schema';
