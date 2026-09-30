import { parseProblemUrl } from "./problemParser.js";

const urls = [
  "https://codeforces.com/problemset/problem/1234/A",
  "https://codeforces.com/contest/1234/problem/B",
];

for (const url of urls) {
  console.log(parseProblemUrl(url));
}