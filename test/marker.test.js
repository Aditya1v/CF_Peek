import { test } from "node:test";
import assert from "node:assert/strict";
import { isSectionHeading, isSectionStart } from "../src/marker.js";

test("isSectionStart matches the problem's own heading", () => {
  assert.ok(isSectionStart("1234A - Watermelon", "1234", "A"));
  assert.ok(isSectionStart("  1234A – Watermelon", "1234", "A"));
  assert.ok(isSectionStart("1234A", "1234", "A"));
  assert.ok(isSectionStart("1234A. Watermelon", "1234", "A"));
});

test("isSectionStart does not confuse A with A1 or A2", () => {
  assert.equal(isSectionStart("1234A1 - Easy", "1234", "A"), false);
  assert.equal(isSectionStart("1234A2 - Hard", "1234", "A"), false);
  assert.ok(isSectionStart("1234A1 - Easy", "1234", "A1"));
  assert.ok(isSectionStart("1234A2 - Hard", "1234", "A2"));
});

test("isSectionStart does not match other contests or problems", () => {
  assert.equal(isSectionStart("1235A - Other contest", "1234", "A"), false);
  assert.equal(isSectionStart("1234B - Next", "1234", "A"), false);
  assert.equal(isSectionStart("Hint: see 1234A", "1234", "A"), false);
  assert.equal(isSectionStart("11234A - Longer id", "1234", "A"), false);
});

test("isSectionStart is case-insensitive", () => {
  assert.ok(isSectionStart("1234a - lowercase", "1234", "A"));
});

test("isSectionHeading recognises problem headings", () => {
  assert.ok(isSectionHeading("1234B - Title"));
  assert.ok(isSectionHeading("1234B1 — Title"));
  assert.ok(isSectionHeading("987C – Title"));
  assert.ok(isSectionHeading("1234D: Title"));
});

test("isSectionHeading ignores ordinary text", () => {
  assert.equal(isSectionHeading("Hint 1"), false);
  assert.equal(isSectionHeading("The answer is 42 - obviously."), false);
  assert.equal(isSectionHeading("2024 - the year of the contest"), false);
  assert.equal(isSectionHeading(""), false);
});
