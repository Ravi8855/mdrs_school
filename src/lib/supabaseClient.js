/**
 * Supabase: browser client from env + fetch helpers for feedback.
 * Bell Ring leaderboard uses @supabase/supabase-js when configured.
 */
import { createClient } from "@supabase/supabase-js";

let supabaseBrowserClient = null;

function getConfig() {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL;
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const baseUrl =
    typeof rawUrl === "string" && rawUrl.trim() ? rawUrl.trim().replace(/\/$/, "") : "";
  const anonKey = typeof rawKey === "string" && rawKey.trim() ? rawKey.trim() : "";
  if (!baseUrl || !anonKey) return null;
  return { baseUrl, anonKey };
}

export function isSupabaseConfigured() {
  return getConfig() !== null;
}

/**
 * Shared Supabase client (singleton). Null if env vars are missing.
 * @returns {import("@supabase/supabase-js").SupabaseClient | null}
 */
export function getSupabaseClient() {
  const cfg = getConfig();
  if (!cfg) return null;
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient(cfg.baseUrl, cfg.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseBrowserClient;
}

const LOCAL_STORAGE_KEY = "mdrs_school_feedback_submissions";
const LOCAL_MAX_ENTRIES = 100;

/**
 * Save one feedback row in the browser when Supabase is not configured (or as backup).
 * @param {Record<string, unknown>} row
 * @returns {{ error: Error | null }}
 */
export function saveFeedbackLocally(row) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) ? parsed : [];
    }
    list.push({
      ...row,
      savedAt: new Date().toISOString(),
      source: "browser",
    });
    while (list.length > LOCAL_MAX_ENTRIES) {
      list.shift();
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return { error: null };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { error: err };
  }
}

/**
 * @param {Record<string, unknown>} row
 * @returns {Promise<{ error: Error | null }>}
 */
export async function insertFeedbackSubmission(row) {
  const cfg = getConfig();
  if (!cfg) {
    return { error: new Error("not configured") };
  }
  const { baseUrl, anonKey } = cfg;
  const res = await fetch(`${baseUrl}/rest/v1/feedback_submissions`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify([row]),
  });
  if (!res.ok) {
    const text = await res.text();
    return { error: new Error(text || `HTTP ${res.status}`) };
  }
  return { error: null };
}

/**
 * Bell Ring Madness: top rows from `bell_ring_leaderboard` as { name, score }.
 * @param {{ limit?: number }} [opts] — default limit 10 (API); use higher limit after a score update if needed for rank.
 * @returns {Promise<{ data: Array<{ name: string, score: number }> | null, error: Error | null }>}
 */
export async function fetchBellRingLeaderboard(opts = {}) {
  const limit = typeof opts.limit === "number" && opts.limit > 0 ? opts.limit : 10;
  const sb = getSupabaseClient();
  if (!sb) {
    return { data: null, error: new Error("not configured") };
  }
  const { data: rows, error } = await sb
    .from("bell_ring_leaderboard")
    .select("display_name,score")
    .order("score", { ascending: false })
    .limit(limit);
  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  const data = (Array.isArray(rows) ? rows : []).map((r) => ({
    name: String(r.display_name ?? "Anonymous"),
    score: Number(r.score),
  }));
  return { data, error: null };
}

/**
 * Atomically add a session score (RPC `add_bell_ring_score`).
 * Args match Postgres parameters: p_player_key, p_display_name, p_delta.
 * @returns {Promise<{ error: Error | null }>}
 */
export async function addBellRingScore(playerKey, displayName, delta) {
  const sb = getSupabaseClient();
  if (!sb) {
    return { error: new Error("not configured") };
  }
  const { error } = await sb.rpc("add_bell_ring_score", {
    p_player_key: playerKey,
    p_display_name: displayName,
    p_delta: delta,
  });
  if (error) {
    return { error: new Error(error.message) };
  }
  return { error: null };
}

export async function invokeSendFeedbackSms(body) {
  const cfg = getConfig();
  if (!cfg) {
    return { error: null };
  }
  const { baseUrl, anonKey } = cfg;
  const res = await fetch(`${baseUrl}/functions/v1/send-feedback-sms`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    return { error: new Error(text || `HTTP ${res.status}`) };
  }
  return { error: null };
}
