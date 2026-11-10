import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSponsorRequest, saveSponsorRequest, toAirtableFields } from "./sponsorAirtable.ts";

const body = {
  name: " John Smith ",
  organization: "Example Company",
  email: "john@example.com",
  phone: "",
  interests: ["A workshop", "Sponsorship tiers", "Not a real option"],
  message: "",
  website: "",
};

test("a filled honeypot is treated as spam, even if the rest is invalid", () => {
  assert.deepEqual(parseSponsorRequest({ ...body, website: "http://spam.example", email: "" }), { kind: "spam" });
});

test("missing or malformed required fields are rejected", () => {
  assert.equal(parseSponsorRequest(null).kind, "invalid");
  const result = parseSponsorRequest({ ...body, name: "", organization: " ", email: "nope" });
  assert.equal(result.kind, "invalid");
  assert.deepEqual(Object.keys(result.errors).sort(), ["email", "name", "organization"]);
});

test("a valid body is trimmed, and unknown interests are dropped and put in the form's order", () => {
  const result = parseSponsorRequest(body);
  assert.equal(result.kind, "valid");
  assert.equal(result.request.name, "John Smith");
  assert.deepEqual(result.request.interests, ["Sponsorship tiers", "A workshop"]);
});

test("non-string values do not crash parsing", () => {
  const result = parseSponsorRequest({ ...body, name: 5, interests: "A workshop", message: { x: 1 } });
  assert.equal(result.kind, "invalid");
});

test("Airtable fields use the table's names, and empty optional fields are left out", () => {
  const { request } = parseSponsorRequest(body);
  assert.deepEqual(toAirtableFields(request), {
    Name: "John Smith",
    Company: "Example Company",
    Email: "john@example.com",
    "Interested In": ["Sponsorship tiers", "A workshop"],
    Status: "New",
  });

  const full = toAirtableFields({ ...request, phone: "(239) 555-0100", message: "Hello", interests: [] });
  assert.equal(full.Phone, "(239) 555-0100");
  assert.equal(full.Message, "Hello");
  assert.ok(!("Interested In" in full));
});

test("saveSponsorRequest posts one typecast record to the Sponsors table with the bearer token", async () => {
  const { request } = parseSponsorRequest(body);
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ records: [{ id: "rec1" }] }), { status: 200 });
  };

  await saveSponsorRequest(request, { token: "pat123", baseId: "app456" }, fakeFetch);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.airtable.com/v0/app456/Sponsors");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers.Authorization, "Bearer pat123");
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.typecast, true);
  assert.equal(sent.records.length, 1);
  assert.equal(sent.records[0].fields.Status, "New");
});

test("saveSponsorRequest throws when Airtable rejects the record", async () => {
  const { request } = parseSponsorRequest(body);
  const fakeFetch = async () => new Response('{"error":"NOT_AUTHORIZED"}', { status: 403 });
  await assert.rejects(saveSponsorRequest(request, { token: "bad", baseId: "app456" }, fakeFetch), /403/);
});
