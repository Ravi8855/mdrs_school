/** URL slug from display name (same rules as alumni list). */
export function batch2014Slug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** @param {string} slug from route */
export function getBatch2014BySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return BATCH_2014_STUDENTS.find((s) => batch2014Slug(s.name) === decoded) || null;
}

/**
 * Static 2014 batch entries — optional `collegeUniversity`; omit or leave empty for "—" on profile.
 * @typedef {{ name: string, qualification: string, location: string, image: string, collegeUniversity?: string }} Batch2014Student
 * @type {Batch2014Student[]}
 */
export const BATCH_2014_STUDENTS = [];

/** Display-only class list (no profile cards). */
export const BATCH_2014_CLASS_NAMES = [
  "Gyanappa",
  "Revansiddappa",
  "Prakash",
  "Ramesh",
  "Mahesh",
  "Kiran Kumara",
  "Ashok",
  "Jattappa",
  "Arun",
  "Sanjay",
  "Devaraj",
  "Venugopal",
  "Kaif",
  "Musthafa",
  "Rahul",
  "Kaveri",
  "Laxmi",
  "Radhika",
  "Sangita",
  "Bhagyashree",
  "Sakareppa",
  "Hulagappa",
  "Aishwarya",
  "Sharanamma",
  "Girija",
  "Prashant Rathod",
  "Chandu",
  "Suma",
  "vanitha",
  "uma",
  "Roopa",
  

];
