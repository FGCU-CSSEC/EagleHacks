import assert from "node:assert/strict";
import { test } from "node:test";
import { validateSponsorRequest } from "./sponsorRequest.ts";

const valid = {
  name: "Jordan Smith",
  organization: "Acme Corp",
  email: "jordan@acmecorp.com",
  phone: "",
  interests: [],
  message: "",
  website: "",
};

test("a complete request has no errors, and phone and message are optional", () => {
  assert.deepEqual(validateSponsorRequest(valid), {});
  assert.deepEqual(validateSponsorRequest({ ...valid, phone: "(239) 555-0100" }), {});
});

test("name, organization and email are required", () => {
  const errors = validateSponsorRequest({ ...valid, name: " ", organization: "", email: "" });
  assert.deepEqual(Object.keys(errors).sort(), ["email", "name", "organization"]);
});

test("email must look like an email address", () => {
  assert.ok(validateSponsorRequest({ ...valid, email: "jordan@acme" }).email);
  assert.ok(validateSponsorRequest({ ...valid, email: "not an email" }).email);
  assert.equal(validateSponsorRequest({ ...valid, email: " jordan@acmecorp.com " }).email, undefined);
});

test("a phone number, if given, needs at least seven digits", () => {
  assert.ok(validateSponsorRequest({ ...valid, phone: "555" }).phone);
  assert.equal(validateSponsorRequest({ ...valid, phone: "+1 239 555 0100" }).phone, undefined);
});
