-- Allow anon/authenticated clients to insert/update rows directly (React app).
-- Reads were already allowed; RPC upsert remains available but is optional.

drop policy if exists "class_voting_ballots_insert_anon" on public.class_voting_ballots;
drop policy if exists "class_voting_ballots_update_anon" on public.class_voting_ballots;

create policy "class_voting_ballots_insert_anon"
  on public.class_voting_ballots
  for insert
  to anon, authenticated
  with check (true);

create policy "class_voting_ballots_update_anon"
  on public.class_voting_ballots
  for update
  to anon, authenticated
  using (true)
  with check (true);
