import assert from "node:assert/strict";
import { test } from "node:test";
import { fromEasternInput, toEasternInput } from "./eastern.ts";
import { resolveState } from "./registration.ts";

const opensAt = "2027-01-15T17:00:00.000Z";
const closesAt = "2027-02-15T17:00:00.000Z";
const at = (iso) => Date.parse(iso);
const base = { override: null, opensAt, closesAt, fallback: "coming-soon" };

test("button switches at opens_at and closes_at", () => {
  assert.equal(resolveState({ ...base, now: at("2027-01-15T16:59:59Z") }), "coming-soon");
  assert.equal(resolveState({ ...base, now: at(opensAt) }), "open");
  assert.equal(resolveState({ ...base, now: at("2027-02-15T16:59:59Z") }), "open");
  assert.equal(resolveState({ ...base, now: at(closesAt) }), "closed");
});

test("override wins, and no dates falls back to site.ts", () => {
  assert.equal(resolveState({ ...base, override: "waitlist", now: at(closesAt) }), "waitlist");
  const none = { override: null, opensAt: null, closesAt: null, fallback: "coming-soon", now: Date.now() };
  assert.equal(resolveState(none), "coming-soon");
});

test("Eastern time converts both ways across DST", () => {
  assert.equal(fromEasternInput("2027-01-15T12:00"), "2027-01-15T17:00:00.000Z"); // EST
  assert.equal(fromEasternInput("2027-03-20T12:00"), "2027-03-20T16:00:00.000Z"); // EDT
  assert.equal(toEasternInput("2027-03-20T16:00:00.000Z"), "2027-03-20T12:00");
  assert.equal(fromEasternInput("nope"), null);
});
