import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Subscribe / Take Action endpoint.
 *
 * Adds a person to Our City Action Buffalo's Action Network account using the
 * OSDI "person signup helper" (POST /api/v2/people). Action Network handles
 * list membership, double opt-in, and unsubscribe compliance; the API key
 * stays server-side. An optional message (from the contact form) is stored as
 * an Action Network custom field so it is visible on the person's record even
 * though no transactional email provider is configured.
 */

const AN_PEOPLE_ENDPOINT = "https://actionnetwork.org/api/v2/people";

const SubscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(100).optional().or(z.literal("")),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Where the signup came from, e.g. "newsletter", "take-action", "contact".
  source: z.string().trim().max(80).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const apiKey = process.env.ACTION_NETWORK_API_KEY;
  if (!apiKey) {
    console.error("[subscribe] ACTION_NETWORK_API_KEY is not configured");
    return NextResponse.json(
      { ok: false, error: "Signups are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  let parsed;
  try {
    parsed = SubscribeSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const { email, firstName, lastName, message, source } = parsed;

  const person: Record<string, unknown> = {
    email_addresses: [{ address: email }],
  };
  if (firstName) person.given_name = firstName;
  if (lastName) person.family_name = lastName;
  if (message) {
    person.custom_fields = { website_message: message };
  }

  const tags = ["Website Signup"];
  if (source) tags.push(`Source: ${source}`);

  try {
    const anRes = await fetch(AN_PEOPLE_ENDPOINT, {
      method: "POST",
      headers: {
        "OSDI-API-Token": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ person, add_tags: tags }),
    });

    if (!anRes.ok) {
      const detail = await anRes.text().catch(() => "");
      console.error(`[subscribe] Action Network returned ${anRes.status}: ${detail.slice(0, 500)}`);
      return NextResponse.json(
        { ok: false, error: "Something went wrong signing you up. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Request to Action Network failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong signing you up. Please try again." },
      { status: 502 },
    );
  }
}
