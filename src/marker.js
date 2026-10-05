const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Check if this is the start of the current problem's section.
export function isSectionStart(text, contestId, problemIndex) {
  const prefix = escapeRegExp(`${contestId}${problemIndex}`);

  return new RegExp(`^${prefix}(?![A-Za-z0-9])`, "i").test(text.trim());
}

// Check if this looks like a problem section heading.
export function isSectionHeading(text) {
  return /^\d+[A-Za-z]\d*\s*[-–—:.]/.test(text.trim());
}
