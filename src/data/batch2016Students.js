/** URL slug from display name (same rules as other batches). */
export function batch2016Slug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** @param {string} slug from route */
export function getBatch2016BySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return BATCH_2016_STUDENTS.find((s) => batch2016Slug(s.name) === decoded) || null;
}

/**
 * Static 2016 batch profile cards (optional photos / fields).
 * @typedef {{ name: string, qualification: string, location: string, image: string, collegeUniversity?: string }} Batch2016Student
 * @type {Batch2016Student[]}
 */
export const BATCH_2016_STUDENTS = [];

/** Names shown in the 2016 batch aquarium. */
export const BATCH_2016_CLASS_NAMES = [
  "Darshan",
  "Vireesh",
  "Dhanaraddi",
  "Ravi.P",
  "Ravi.M",
  "Yallappa",
  "Lingaraja",
  "Shweta",
  "Sangita",
  "kavya",
];
