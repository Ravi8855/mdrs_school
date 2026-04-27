import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";
import { hashStudentPassword } from "./profilePassword";

const PROFILE_BUCKET = "profile-photos";

const PROFILE_PUBLIC_COLUMNS =
  "user_key,name,qualification,college,location,image_url,bio,updated_at,created_at";

export { isSupabaseConfigured };

/**
 * @returns {Promise<{ data: Array<Record<string, unknown>> | null, error: Error | null }>}
 */
export async function fetchAllProfiles() {
  const sb = getSupabaseClient();
  if (!sb) return { data: null, error: new Error("not configured") };
  const { data, error } = await sb
    .from("profiles")
    .select(PROFILE_PUBLIC_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) return { data: null, error: new Error(error.message) };
  return { data: Array.isArray(data) ? data : [], error: null };
}

/**
 * @param {string} userKey
 * @returns {Promise<{ data: Record<string, unknown> | null, error: Error | null }>}
 */
export async function fetchProfileByUserKey(userKey) {
  const key = String(userKey || "")
    .trim()
    .toLowerCase();
  if (!key) return { data: null, error: null };
  const sb = getSupabaseClient();
  if (!sb) return { data: null, error: new Error("not configured") };
  const { data, error } = await sb
    .from("profiles")
    .select(PROFILE_PUBLIC_COLUMNS)
    .eq("user_key", key)
    .maybeSingle();
  if (error) return { data: null, error: new Error(error.message) };
  return { data: data || null, error: null };
}

/**
 * Insert or update the row for this user_key only (caller must pass matching session key).
 * @param {object} row
 * @param {string} row.user_key
 * @param {string} row.name
 * @param {string} [row.qualification]
 * @param {string} [row.college]
 * @param {string} [row.location]
 * @param {string} [row.image_url]
 * @param {string} [row.bio]
 */
export async function upsertProfile(row) {
  return updateStudentProfileDetails(row.user_key, {
    name: row.name,
    qualification: row.qualification,
    college: row.college,
    location: row.location,
    image_url: row.image_url,
    bio: row.bio,
  });
}

/**
 * Create a new student row (fails if user_key already exists).
 * @param {object} p
 * @param {string} p.user_key
 * @param {string} p.password
 * @param {string} p.name
 * @param {string} [p.qualification]
 * @param {string} [p.college]
 * @param {string} [p.location]
 * @param {string} [p.bio]
 * @param {string} [p.image_url]
 */
export async function createStudentProfileAccount(p) {
  const sb = getSupabaseClient();
  if (!sb) return { error: new Error("not configured") };
  const user_key = String(p.user_key || "")
    .trim()
    .toLowerCase();
  if (!user_key) return { error: new Error("Account username is required") };
  const name = String(p.name || "").trim();
  if (!name) return { error: new Error("Name is required") };
  const pw = String(p.password || "");
  if (pw.length < 6) return { error: new Error("Password must be at least 6 characters") };

  const { data: existing, error: exErr } = await sb
    .from("profiles")
    .select("user_key")
    .eq("user_key", user_key)
    .maybeSingle();
  if (exErr) return { error: new Error(exErr.message) };
  if (existing) return { error: new Error("That account username is already taken.") };

  const password_hash = await hashStudentPassword(user_key, pw);
  const payload = {
    user_key,
    password_hash,
    name,
    qualification: p.qualification != null ? String(p.qualification).trim() : "",
    college: p.college != null ? String(p.college).trim() : "",
    location: p.location != null ? String(p.location).trim() : "",
    bio: p.bio != null ? String(p.bio).trim() : "",
    image_url: p.image_url != null ? String(p.image_url).trim() : "",
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("profiles").insert(payload);
  if (error) return { error: new Error(error.message) };
  return { error: null };
}

/**
 * Update profile fields without changing password_hash.
 */
export async function updateStudentProfileDetails(userKey, fields) {
  const sb = getSupabaseClient();
  if (!sb) return { error: new Error("not configured") };
  const key = String(userKey || "")
    .trim()
    .toLowerCase();
  if (!key) return { error: new Error("user_key is required") };
  const name = fields.name != null ? String(fields.name).trim() : "";
  if (!name) return { error: new Error("Name is required") };
  const payload = {
    name,
    qualification: fields.qualification != null ? String(fields.qualification).trim() : "",
    college: fields.college != null ? String(fields.college).trim() : "",
    location: fields.location != null ? String(fields.location).trim() : "",
    bio: fields.bio != null ? String(fields.bio).trim() : "",
    image_url: fields.image_url != null ? String(fields.image_url).trim() : "",
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("profiles").update(payload).eq("user_key", key);
  if (error) return { error: new Error(error.message) };
  return { error: null };
}

/**
 * First-time profile row (e.g. staff session) without a student password.
 */
export async function insertProfileWithoutPassword(row) {
  const sb = getSupabaseClient();
  if (!sb) return { error: new Error("not configured") };
  const user_key = String(row.user_key || "")
    .trim()
    .toLowerCase();
  const name = String(row.name || "").trim();
  if (!user_key || !name) return { error: new Error("user_key and name are required") };
  const payload = {
    user_key,
    name,
    qualification: row.qualification != null ? String(row.qualification).trim() : "",
    college: row.college != null ? String(row.college).trim() : "",
    location: row.location != null ? String(row.location).trim() : "",
    bio: row.bio != null ? String(row.bio).trim() : "",
    image_url: row.image_url != null ? String(row.image_url).trim() : "",
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("profiles").insert(payload);
  if (error) return { error: new Error(error.message) };
  return { error: null };
}

/**
 * @returns {Promise<{ ok: boolean, error: Error | null }>}
 */
export async function verifyStudentSignIn(userKey, password) {
  const key = String(userKey || "")
    .trim()
    .toLowerCase();
  if (!key) return { ok: false, error: new Error("Enter your account username") };
  const sb = getSupabaseClient();
  if (!sb) return { ok: false, error: new Error("not configured") };
  const { data, error } = await sb
    .from("profiles")
    .select("password_hash")
    .eq("user_key", key)
    .maybeSingle();
  if (error) return { ok: false, error: new Error(error.message) };
  if (!data) return { ok: false, error: new Error("No account found for that username.") };
  const stored = data.password_hash != null ? String(data.password_hash) : "";
  if (!stored) {
    return { ok: true, error: null };
  }
  const pw = String(password ?? "");
  if (!pw) return { ok: false, error: new Error("Enter your password.") };
  const expected = await hashStudentPassword(key, pw);
  if (expected !== stored) return { ok: false, error: new Error("Wrong password.") };
  return { ok: true, error: null };
}

/**
 * @param {File} file
 * @param {string} userKey
 * @returns {Promise<{ publicUrl: string | null, error: Error | null }>}
 */
export async function uploadProfileImage(file, userKey) {
  const key = String(userKey || "")
    .trim()
    .toLowerCase();
  if (!key) return { publicUrl: null, error: new Error("missing user key") };
  const sb = getSupabaseClient();
  if (!sb) return { publicUrl: null, error: new Error("not configured") };
  const safeName = String(file.name || "photo").replace(/[^\w.\-]+/g, "_");
  const path = `${key}/${Date.now()}-${safeName}`;
  const { error: upErr } = await sb.storage.from(PROFILE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (upErr) return { publicUrl: null, error: new Error(upErr.message) };
  const { data } = sb.storage.from(PROFILE_BUCKET).getPublicUrl(path);
  const publicUrl = data?.publicUrl || null;
  if (!publicUrl) return { publicUrl: null, error: new Error("no public URL") };
  return { publicUrl, error: null };
}

export function getProfilePhotoBucket() {
  return PROFILE_BUCKET;
}
