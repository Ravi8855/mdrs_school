/**
 * Shared class voting via Supabase (direct table writes + Realtime).
 * Uses getSupabaseClient from ./supabaseClient.
 */
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";

const VOTER_KEY_LS = "mdrs_class_voting_voter_key_v1";
const PG_UNIQUE_VIOLATION = "23505";

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

const BALLOTS_PAGE = 1000;

/**
 * Read all rows from `class_voting_ballots` and aggregate counts by category_id + nominee_id.
 * @returns {Promise<{ totals: Record<string, Record<string, number>> | null, error: Error | null }>}
 */
export async function fetchClassVotingTotals() {
  const sb = getSupabaseClient();
  if (!sb) {
    return { totals: null, error: new Error("not configured") };
  }

  /** @type {Array<{ category_id?: string, nominee_id?: string }>} */
  const allRows = [];
  let from = 0;

  for (;;) {
    const { data, error } = await sb
      .from("class_voting_ballots")
      .select("category_id, nominee_id")
      .range(from, from + BALLOTS_PAGE - 1);

    if (error) {
      return { totals: null, error: new Error(error.message) };
    }

    const chunk = Array.isArray(data) ? data : [];
    allRows.push(...chunk);

    if (chunk.length < BALLOTS_PAGE) {
      break;
    }
    from += BALLOTS_PAGE;
  }

  /** @type {Record<string, Record<string, number>>} */
  const totals = {};
  for (const row of allRows) {
    if (!row || typeof row !== "object") continue;
    const cat = row.category_id;
    const nom = row.nominee_id;
    if (typeof cat !== "string" || typeof nom !== "string") continue;
    if (!totals[cat]) totals[cat] = {};
    totals[cat][nom] = (totals[cat][nom] || 0) + 1;
  }

  return { totals, error: null };
}

/**
 * Insert or update one ballot: one row per (voter_key, category_id).
 * @returns {Promise<{
 *   success: boolean,
 *   duplicateVote: boolean,
 *   error: Error | null,
 *   response: unknown
 * }>}
 */
export async function submitClassVotingBallot(voterKey, categoryId, nomineeId) {
  const sb = getSupabaseClient();
  if (!sb) {
    const response = { step: "no_client" };
    console.log("[class-voting] submitClassVotingBallot response", response);
    return {
      success: false,
      duplicateVote: false,
      error: new Error("not configured"),
      response,
    };
  }

  const payload = {
    voter_key: voterKey,
    category_id: categoryId,
    nominee_id: nomineeId,
  };

  const { data: existing, error: selectError } = await sb
    .from("class_voting_ballots")
    .select("nominee_id")
    .eq("voter_key", voterKey)
    .eq("category_id", categoryId)
    .maybeSingle();

  console.log("[class-voting] submitClassVotingBallot select", {
    existing,
    selectError,
    payload,
  });

  if (selectError) {
    const response = { step: "select", existing, selectError };
    console.log("[class-voting] submitClassVotingBallot response", response);
    return {
      success: false,
      duplicateVote: false,
      error: new Error(selectError.message),
      response,
    };
  }

  if (existing && existing.nominee_id === nomineeId) {
    const response = { step: "duplicate_same_nominee", existing };
    console.log("[class-voting] submitClassVotingBallot response", response);
    return {
      success: false,
      duplicateVote: true,
      error: null,
      response,
    };
  }

  if (existing) {
    const { data, error } = await sb
      .from("class_voting_ballots")
      .update({
        nominee_id: nomineeId,
        updated_at: new Date().toISOString(),
      })
      .eq("voter_key", voterKey)
      .eq("category_id", categoryId)
      .select();

    const response = { step: "update", data, error };
    console.log("[class-voting] submitClassVotingBallot response", response);

    if (error) {
      return {
        success: false,
        duplicateVote: false,
        error: new Error(error.message),
        response,
      };
    }
    return { success: true, duplicateVote: false, error: null, response };
  }

  const { data: inserted, error: insertError } = await sb
    .from("class_voting_ballots")
    .insert(payload)
    .select();

  const insertResponse = { step: "insert", data: inserted, error: insertError };
  console.log("[class-voting] submitClassVotingBallot response", insertResponse);

  if (!insertError) {
    return {
      success: true,
      duplicateVote: false,
      error: null,
      response: insertResponse,
    };
  }

  if (insertError.code === PG_UNIQUE_VIOLATION) {
    const { data: rowAfterRace, error: raceSelectErr } = await sb
      .from("class_voting_ballots")
      .select("nominee_id")
      .eq("voter_key", voterKey)
      .eq("category_id", categoryId)
      .maybeSingle();

    console.log("[class-voting] submitClassVotingBallot insert race", {
      rowAfterRace,
      raceSelectErr,
    });

    if (raceSelectErr) {
      const response = { step: "race_select", raceSelectErr };
      console.log("[class-voting] submitClassVotingBallot response", response);
      return {
        success: false,
        duplicateVote: false,
        error: new Error(raceSelectErr.message),
        response,
      };
    }

    if (rowAfterRace && rowAfterRace.nominee_id === nomineeId) {
      const response = { step: "duplicate_after_race", rowAfterRace };
      console.log("[class-voting] submitClassVotingBallot response", response);
      return {
        success: false,
        duplicateVote: true,
        error: null,
        response,
      };
    }

    const { data: updated, error: updateAfterRace } = await sb
      .from("class_voting_ballots")
      .update({
        nominee_id: nomineeId,
        updated_at: new Date().toISOString(),
      })
      .eq("voter_key", voterKey)
      .eq("category_id", categoryId)
      .select();

    const response = { step: "update_after_race", data: updated, error: updateAfterRace };
    console.log("[class-voting] submitClassVotingBallot response", response);

    if (updateAfterRace) {
      return {
        success: false,
        duplicateVote: false,
        error: new Error(updateAfterRace.message),
        response,
      };
    }
    return { success: true, duplicateVote: false, error: null, response };
  }

  return {
    success: false,
    duplicateVote: false,
    error: new Error(insertError.message),
    response: insertResponse,
  };
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
