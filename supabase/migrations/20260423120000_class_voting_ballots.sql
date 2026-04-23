-- Class voting: one row per browser (voter_key) per category; everyone sees the same totals.
-- Clients call RPCs only (writes); counts via get_class_voting_counts.

create table if not exists public.class_voting_ballots (
  voter_key text not null,
  category_id text not null,
  nominee_id text not null,
  updated_at timestamptz not null default now(),
  primary key (voter_key, category_id)
);

create index if not exists class_voting_ballots_category_nominee_idx
  on public.class_voting_ballots (category_id, nominee_id);

alter table public.class_voting_ballots enable row level security;

-- Reads for Realtime / optional tooling; app uses RPC for aggregates.
create policy "class_voting_ballots_select_anon"
  on public.class_voting_ballots
  for select
  to anon, authenticated
  using (true);

-- No direct inserts/updates from clients (use upsert_class_voting_ballot).

create or replace function public.upsert_class_voting_ballot(
  p_voter_key text,
  p_category_id text,
  p_nominee_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_cat text;
  v_nom text;
begin
  v_key := trim(coalesce(p_voter_key, ''));
  if length(v_key) < 8 then
    raise exception 'invalid voter_key';
  end if;

  v_cat := trim(coalesce(p_category_id, ''));
  if v_cat is null or v_cat = '' or length(v_cat) > 120 then
    raise exception 'invalid category_id';
  end if;

  v_nom := trim(coalesce(p_nominee_id, ''));
  if v_nom is null or v_nom = '' or length(v_nom) > 120 then
    raise exception 'invalid nominee_id';
  end if;

  insert into public.class_voting_ballots (voter_key, category_id, nominee_id)
  values (v_key, v_cat, v_nom)
  on conflict (voter_key, category_id) do update set
    nominee_id = excluded.nominee_id,
    updated_at = now();
end;
$$;

grant execute on function public.upsert_class_voting_ballot(text, text, text) to anon, authenticated;

create or replace function public.get_class_voting_counts()
returns table (category_id text, nominee_id text, vote_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select b.category_id, b.nominee_id, count(*)::bigint as vote_count
  from public.class_voting_ballots b
  group by b.category_id, b.nominee_id;
$$;

grant execute on function public.get_class_voting_counts() to anon, authenticated;

-- Broadcast changes so all open voting pages refresh totals.
do $body$
begin
  alter publication supabase_realtime add table public.class_voting_ballots;
exception
  when duplicate_object then null;
end
$body$;
