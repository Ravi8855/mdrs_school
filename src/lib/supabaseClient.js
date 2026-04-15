/**
 * Supabase via fetch when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set.
 * If they are missing, feedback is stored only in the browser (localStorage).
 */

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
 * @param {Record<string, unknown>} body
 * @returns {Promise<{ error: Error | null }>}
 */
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
