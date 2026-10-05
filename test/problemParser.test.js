import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProblemUrl } from "../src/problemParser.js";

test("parses /problemset/problem URLs", () => {
  assert.deepEqual(
    parseProblemUrl("https://codeforces.com/problemset/problem/1234/A"),
    { contestId: "1234", problemIndex: "A" },
  );
});

test("parses /contest/.../problem URLs", () => {
  assert.deepEqual(
    parseProblemUrl("https://codeforces.com/contest/1234/problem/B"),
    { contestId: "1234", problemIndex: "B" },
  );
});

test("upper-cases the problem index", () => {
  assert.equal(
    parseProblemUrl("https://codeforces.com/contest/1234/problem/c")
      .problemIndex,
    "C",
  );
});

test("supports indices with digits such as A1", () => {
  assert.equal(
    parseProblemUrl("https://codeforces.com/problemset/problem/1234/A1")
      .problemIndex,
    "A1",
  );
});

test("ignores trailing slashes, query strings and hashes", () => {
  assert.deepEqual(
    parseProblemUrl(
      "https://codeforces.com/problemset/problem/99/D/?locale=en#top",
    ),
    { contestId: "99", problemIndex: "D" },
  );
});

test("works on codeforces subdomains", () => {
  assert.equal(
    parseProblemUrl("https://mirror.codeforces.com/contest/7/problem/E")
      .contestId,
    "7",
  );
});

test("rejects other Codeforces pages", () => {
  for (const url of [
    "https://codeforces.com/",
    "https://codeforces.com/problemset",
    "https://codeforces.com/contest/1234",
    "https://codeforces.com/contest/abc/problem/A",
    "https://codeforces.com/problemset/problem/1234",
    "https://codeforces.com/blog/entry/1234",
  ]) {
    assert.throws(() => parseProblemUrl(url), /Invalid Codeforces problem URL/);
  }
});
