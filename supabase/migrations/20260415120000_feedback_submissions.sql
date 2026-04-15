-- Feedback form rows from the school website.
-- SMS to the admin number is sent by the optional Edge Function `send-feedback-sms` (Twilio secrets).

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  role text not null,
  message text not null,
  more_memories text not null check (more_memories in ('yes', 'no')),
  notify_phone text not null default '8855025560'
);

alter table public.feedback_submissions enable row level security;

-- Public site: anyone with the anon key may insert a feedback row (no read access).
create policy "feedback_submissions_insert_anon"
  on public.feedback_submissions
  for insert
  to anon
  with check (true);

create policy "feedback_submissions_insert_authenticated"
  on public.feedback_submissions
  for insert
  to authenticated
  with check (true);
