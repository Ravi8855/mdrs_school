/** PostgREST / Supabase when `public.profiles` was never created or schema cache is stale. */
export function isProfilesTableMissingError(message) {
  const m = String(message || "").toLowerCase();
  if (!m) return false;
  if (m.includes("profiles") && m.includes("schema cache")) return true;
  if (m.includes("could not find the table") && m.includes("profiles")) return true;
  if (/relation\s+["']?public\.profiles["']?\s+does not exist/.test(m)) return true;
  if (m.includes("public.profiles") && (m.includes("does not exist") || m.includes("not find"))) return true;
  return false;
}

/** Human-readable hint when the table is missing (run repo SQL in Supabase). */
export function profilesTableSetupHint() {
  return "Open Supabase → SQL Editor, run the full script in `supabase/profiles_setup.sql` from this repo, then refresh this page.";
}
