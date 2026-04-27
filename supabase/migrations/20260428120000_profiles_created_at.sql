-- Alumni list ordering: latest profiles first
alter table public.profiles add column if not exists created_at timestamptz;

update public.profiles
set created_at = coalesce(created_at, updated_at, now())
where created_at is null;

alter table public.profiles alter column created_at set default now();

alter table public.profiles
  alter column created_at set not null;

notify pgrst, 'reload schema';
