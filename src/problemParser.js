// Supported Codeforces problem URLs
const PATTERNS = [
  /^\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)\/?$/,
  /^\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)\/?$/,
];

// Get the contest ID and problem index from the URL

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
