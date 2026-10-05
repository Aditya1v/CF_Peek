const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * True if `text` begins the editorial section of the given problem.
 *
 * "1234A - Title" matches (1234, A), but "1234A1 - Title" does not, so
 * problems like A1/A2 are never mistaken for A.
 */
export function isSectionStart(text, contestId, problemIndex) {
  const prefix = escapeRegExp(`${contestId}${problemIndex}`);

  return new RegExp(`^${prefix}(?![A-Za-z0-9])`, "i").test(text.trim());
}

/**
 * True if `text` looks like the heading of *any* problem section,
 * e.g. "1234B - Title". Used to find where the current section ends.
 */
export function isSectionHeading(text) {
  return /^\d+[A-Za-z]\d*\s*[-–—:.]/.test(text.trim());
}
