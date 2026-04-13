/**
 * Resolves profile photos from `src/assets` for hostel teachers and students.
 * Add a JPG/PNG whose filename (without extension) matches the display name in a
 * case-insensitive way, e.g. `Marilinga.jpg` → student "Marilinga", `Subhas sir.jpg` → "Subhas Sir".
 */

function normalizeLabel(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\./g, "");
}

function stemFromGlobPath(path) {
  const file = path.replace(/^.*\//, "");
  return file.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim().toLowerCase().replace(/\s+/g, " ");
}

const assetUrls = import.meta.glob("../assets/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

/** Map: normalized filename stem → resolved URL */
const byStem = {};
for (const [path, url] of Object.entries(assetUrls)) {
  byStem[stemFromGlobPath(path)] = url;
}

/** No profile photo on hostel pages (initials placeholder instead). */
const NAMES_WITHOUT_PHOTO = new Set(["ningappa"]);

/** Map person name (normalized) → asset stem to look up in `byStem` */
const PHOTO_STEM_ALIASES = {
  jettappa: "jattappa",
  jatteppa: "jattappa",
};

/**
 * @param {string} displayName — House master, leader, or student name as shown in UI
 * @returns {string|null} image URL for `<img src>`, or `null` to hide photo
 */
export function getHostelPersonPhoto(displayName) {
  const n = normalizeLabel(displayName);
  if (NAMES_WITHOUT_PHOTO.has(n)) return null;

  const aliasStem = PHOTO_STEM_ALIASES[n];
  if (aliasStem && byStem[aliasStem]) return byStem[aliasStem];

  if (byStem[n]) return byStem[n];

  const withSir = n.endsWith(" sir") ? n : `${n} sir`;
  if (byStem[withSir]) return byStem[withSir];

  const noSir = n.replace(/\s+sir$/i, "").trim();
  if (noSir && byStem[noSir]) return byStem[noSir];
  if (noSir && byStem[`${noSir} sir`]) return byStem[`${noSir} sir`];

  const withMam = n.endsWith(" mam") ? n : `${n} mam`;
  if (byStem[withMam]) return byStem[withMam];

  const noMam = n.replace(/\s+mam$/i, "").trim();
  if (noMam && byStem[noMam]) return byStem[noMam];
  if (noMam && byStem[`${noMam} mam`]) return byStem[`${noMam} mam`];

  /* No matching file → initials avatar (see HostelAvatar placeholder) */
  return null;
}
