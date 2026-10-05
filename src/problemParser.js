// Supported problem URL shapes:
//   /problemset/problem/1234/A
//   /contest/1234/problem/A
const PATTERNS = [
  /^\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)\/?$/,
  /^\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)\/?$/,
];

/**
 * Extracts the contest id and problem index from a Codeforces problem URL.
 * The problem index is normalised to upper case ("a" -> "A").
 *
 * @param {string} url
 * @returns {{ contestId: string, problemIndex: string }}
 * @throws {Error} if the URL is not a Codeforces problem URL
 */
export function parseProblemUrl(url) {
  const { pathname } = new URL(url);

  for (const pattern of PATTERNS) {
    const match = pathname.match(pattern);

    if (match) {
      return {
        contestId: match[1],
        problemIndex: match[2].toUpperCase(),
      };
    }
  }

  throw new Error("Invalid Codeforces problem URL");
}
