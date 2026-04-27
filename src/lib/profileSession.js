/** Session key for which profile row this browser may edit (set from login username). */
export const PROFILE_SESSION_KEY = "mdrs_profile_key";

export function getProfileKey() {
  try {
    const v = sessionStorage.getItem(PROFILE_SESSION_KEY);
    return v && String(v).trim() ? String(v).trim().toLowerCase() : "";
  } catch {
    return "";
  }
}

export function setProfileKeyFromLogin(username) {
  const key = String(username || "")
    .trim()
    .toLowerCase();
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
