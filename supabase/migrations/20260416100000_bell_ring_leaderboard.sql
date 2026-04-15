-- Bell Ring Madness: one global scoreboard (shared across all visitors).
-- Run via Supabase CLI / Dashboard after deploy. Anon may read; writes go through RPC (atomic add).

create table if not exists public.bell_ring_leaderboard (
  player_key text primary key,
  display_name text not null,
  score bigint not null default 0 check (score >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists bell_ring_leaderboard_score_desc_idx
  on public.bell_ring_leaderboard (score desc);

alter table public.bell_ring_leaderboard enable row level security;

create policy "bell_ring_leaderboard_select_anon"
  on public.bell_ring_leaderboard
  for select
  to anon, authenticated
  using (true);

-- No direct insert/update from clients; use add_bell_ring_score for atomic cumulative updates.

create or replace function public.add_bell_ring_score(
  p_player_key text,
  p_display_name text,
  p_delta bigint
)
returns setof public.bell_ring_leaderboard
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_name text;
begin
  v_key := lower(trim(p_player_key));
  if v_key is null or v_key = '' then
    raise exception 'invalid player_key';
  end if;
  if p_delta is null or p_delta < 0 or p_delta > 100000 then
    raise exception 'invalid delta';
  end if;

  v_name := left(coalesce(nullif(trim(p_display_name), ''), 'Anonymous'), 120);

  insert into public.bell_ring_leaderboard (player_key, display_name, score)
  values (v_key, v_name, p_delta)
  on conflict (player_key) do update set
    score = bell_ring_leaderboard.score + excluded.score,
    display_name = case
      when length(excluded.display_name) >= length(bell_ring_leaderboard.display_name)
      then excluded.display_name
      else bell_ring_leaderboard.display_name
    end,
    updated_at = now();

  return query
  select * from public.bell_ring_leaderboard where player_key = v_key;
end;
$$;

grant execute on function public.add_bell_ring_score(text, text, bigint) to anon, authenticated;
