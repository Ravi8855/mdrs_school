/** Session key for which profile row this browser may edit (set from login username). */
export const PROFILE_SESSION_KEY = "mdrs_profile_key";

/** Same rules as student profile usernames: trim, lowercase, collapse spaces. */
export function normalizeProfileKey(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function getProfileKey() {
  try {
    const v = sessionStorage.getItem(PROFILE_SESSION_KEY);
    const key = normalizeProfileKey(v);
    return key || "";
  } catch {
    return "";
  }
}

export function setProfileKeyFromLogin(username) {
  const key = normalizeProfileKey(username);
  if (!key) return;
  try {
    sessionStorage.setItem(PROFILE_SESSION_KEY, key);
  } catch {
    /* ignore */
  }
}

export function clearProfileSession() {
  try {
    sessionStorage.removeItem(PROFILE_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
