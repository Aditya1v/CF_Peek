export function parseProblemUrl(url) {
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;

  // /problemset/problem/1234/A
  let match = path.match(/^\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)\/?$/);

  if (match) {
    return {
      contestId: match[1],
      problemIndex: match[2].toUpperCase(),
    };
  }

  // /contest/1234/problem/A
  match = path.match(/^\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)\/?$/);

  if (match) {
    return {
      contestId: match[1],
      problemIndex: match[2].toUpperCase(),
    };
  }

  throw new Error("Invalid Codeforces problem URL");
}