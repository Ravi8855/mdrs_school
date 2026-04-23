/**
 * Shared class voting totals via Supabase (RPC + Realtime).
 * Local picks still use ../lib/votingStorage (unchanged).
 */
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";

const VOTER_KEY_LS = "mdrs_class_voting_voter_key_v1";

function randomVoterKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `vk_${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
}

/** Stable id per browser for one ballot row per category on the server. */
export function getOrCreateClassVotingVoterKey() {
  if (typeof window === "undefined") return randomVoterKey();
  try {
    const existing = window.localStorage.getItem(VOTER_KEY_LS);
    if (typeof existing === "string" && existing.trim().length >= 8) {
      return existing.trim();
    }
    const next = randomVoterKey();
    window.localStorage.setItem(VOTER_KEY_LS, next);
    return next;
  } catch {
    return randomVoterKey();
  }
}

export { isSupabaseConfigured };

/**
 * @returns {Promise<{ totals: Record<string, Record<string, number>> | null, error: Error | null }>}
 */
export async function fetchClassVotingTotals() {
  const sb = getSupabaseClient();
  if (!sb) {
    return { totals: null, error: new Error("not configured") };
  }
  const { data, error } = await sb.rpc("get_class_voting_counts");
  if (error) {
    return { totals: null, error: new Error(error.message) };
  }
  /** @type {Record<string, Record<string, number>>} */
  const totals = {};
  const rows = Array.isArray(data) ? data : [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const cat = row.category_id;
    const nom = row.nominee_id;
    const c = Number(row.vote_count);
    if (typeof cat !== "string" || typeof nom !== "string" || !Number.isFinite(c)) continue;
    if (!totals[cat]) totals[cat] = {};
    totals[cat][nom] = c;
  }
  return { totals, error: null };
}

/**
 * @param {string} voterKey
 * @param {string} categoryId
 * @param {string} nomineeId
 * @returns {Promise<{ error: Error | null }>}
 */
export async function upsertClassVotingBallot(voterKey, categoryId, nomineeId) {
  const sb = getSupabaseClient();
  if (!sb) {
    return { error: new Error("not configured") };
  }
  const { error } = await sb.rpc("upsert_class_voting_ballot", {
    p_voter_key: voterKey,
    p_category_id: categoryId,
    p_nominee_id: nomineeId,
  });
  if (error) {
    return { error: new Error(error.message) };
  }
  return { error: null };
}

/**
 * @param {(totals: Record<string, Record<string, number>>) => void} onTotals
 * @returns {() => void} unsubscribe
 */
export function subscribeClassVotingTotals(onTotals) {
  const sb = getSupabaseClient();
  if (!sb) {
    return () => {};
  }
  const channel = sb
    .channel("class-voting-ballots")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "class_voting_ballots" },
      () => {
        void fetchClassVotingTotals().then(({ totals, error }) => {
          if (!error && totals) onTotals(totals);
        });
      }
    )
    .subscribe();

  return () => {
    void sb.removeChannel(channel);
  };
}
