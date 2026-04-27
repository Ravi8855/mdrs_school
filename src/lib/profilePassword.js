/**
 * Deterministic hash for client-side profile passwords (not a substitute for server-side auth).
 * @param {string} userKey
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashStudentPassword(userKey, password) {
  const key = String(userKey || "")
    .trim()
    .toLowerCase();
  const raw = `${key}|${String(password)}|mdrs-school-profiles-v1`;
  const enc = new TextEncoder().encode(raw);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
