/** URL slug from display name (same rules as other batches). */
export function batch2015Slug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** @param {string} slug from route */
export function getBatch2015BySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return BATCH_2015_STUDENTS.find((s) => batch2015Slug(s.name) === decoded) || null;
}

/**
 * Static 2015 batch profile cards (optional photos / fields).
 * @typedef {{ name: string, qualification: string, location: string, image: string, collegeUniversity?: string }} Batch2015Student
 * @type {Batch2015Student[]}
 */
export const BATCH_2015_STUDENTS = [];

/** Names shown in the 2015 batch aquarium. */
export const BATCH_2015_CLASS_NAMES = [
  "Ambadas",
  "Arun",
  "Bhimu",
  "Bhimashankar",
  "Hrutik",
  "Jattappa",
  "Ningappa",
  "Mallikarjun",
  "Marilinga",
  "Ravi",
  "Vinod",
  "Viresh",
  "Chandrashekar",
  "Gollalappa",
  "Sunil",
  "Ambika",
  "Bheembai",
  "Chaitra",
  "Ganga",
  "Mallamma",
  "Ningamma",
  "Parvati",
  "Prema",
  "Roopa",
  "Savita",
  "Sharanamma",
  "Shweta",
  "Shweta H",
  "Suvarna",
  "Umashree",
  "Mahesh",
  "Praveen",
  "Suchitra",
  "Shreedevi",
  "Mamtha",
  "Archana",
];
