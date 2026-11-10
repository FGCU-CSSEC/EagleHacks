import { createRateLimiter } from "@/lib/rateLimit";
import { parseSponsorRequest, saveSponsorRequest } from "@/lib/sponsorAirtable";

const MAX_BODY_BYTES = 20_000;

// Each accepted request is one Airtable API call, and the free plan allows 1,000 a month.
// These caps are per server instance; see createRateLimiter.
const perVisitor = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });
const overall = createRateLimiter({ limit: 30, windowMs: 60 * 60_000 });

function visitorKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function tooManyRequests(retryAfterSeconds: number) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return Response.json({ error: "Request too large." }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseSponsorRequest(body);

  // Bots fill the hidden `website` field. Answer as if it worked, but save nothing.
  if (parsed.kind === "spam") return Response.json({ ok: true });

  if (parsed.kind === "invalid") {
    return Response.json({ error: "Please check the form and try again.", fields: parsed.errors }, { status: 400 });
  }

  const visitorLimit = perVisitor(visitorKey(request));
  if (!visitorLimit.allowed) return tooManyRequests(visitorLimit.retryAfterSeconds);
  const overallLimit = overall("all");
  if (!overallLimit.allowed) return tooManyRequests(overallLimit.retryAfterSeconds);

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    console.error("[sponsor] AIRTABLE_TOKEN or AIRTABLE_BASE_ID is not set.");
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  try {
    await saveSponsorRequest(parsed.request, { token, baseId });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[sponsor] Could not save the request to Airtable:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
