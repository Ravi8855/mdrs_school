-- Optional bio + optional password hash for student-created accounts (SHA-256 hex from app).
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists password_hash text;

notify pgrst, 'reload schema';
