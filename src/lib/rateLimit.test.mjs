import assert from "node:assert/strict";
import { test } from "node:test";
import { createRateLimiter } from "./rateLimit.ts";

const MINUTE = 60_000;

test("allows up to the limit, then blocks and says how long to wait", () => {
  const check = createRateLimiter({ limit: 3, windowMs: 10 * MINUTE });
  const t0 = 1_000_000;
  assert.deepEqual(check("a", t0), { allowed: true });
  assert.deepEqual(check("a", t0 + 1000), { allowed: true });
  assert.deepEqual(check("a", t0 + 2000), { allowed: true });

  const blocked = check("a", t0 + 3000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 597); // the oldest hit leaves the window at t0 + 10 min
});

test("requests are allowed again once the window has passed", () => {
  const check = createRateLimiter({ limit: 1, windowMs: MINUTE });
  assert.equal(check("a", 0).allowed, true);
  assert.equal(check("a", 30_000).allowed, false);
  assert.equal(check("a", MINUTE).allowed, true);
});

test("keys are counted separately", () => {
  const check = createRateLimiter({ limit: 1, windowMs: MINUTE });
  assert.equal(check("a", 0).allowed, true);
  assert.equal(check("b", 0).allowed, true);
  assert.equal(check("a", 1).allowed, false);
});

test("blocked attempts do not extend the block", () => {
  const check = createRateLimiter({ limit: 1, windowMs: MINUTE });
  check("a", 0);
  for (let t = 1; t < 50; t++) check("a", t * 1000);
  assert.equal(check("a", MINUTE).allowed, true);
});

test("expired keys are dropped when the key limit is exceeded", () => {
  const check = createRateLimiter({ limit: 1, windowMs: MINUTE, maxKeys: 3 });
  for (const key of ["a", "b", "c", "d"]) check(key, 0);
  // After the window, a new key triggers cleanup and everything else can be used again.
  assert.equal(check("e", 2 * MINUTE).allowed, true);
  assert.equal(check("a", 2 * MINUTE).allowed, true);
});
