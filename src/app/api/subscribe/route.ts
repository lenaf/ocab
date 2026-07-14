import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Signup / Take Action endpoint.
 *
 * Adds a person to Our City Action Buffalo's Action Network account using the
 * OSDI "person signup helper" (POST /api/v2/people). AN handles list
 * membership, double opt-in, and unsubscribe compliance; the API key stays
 * server-side, and the person is created with exactly the values the visitor
 * typed (no browser-session override).
 *
 * Accepts the normalized person fields our Form block collects. Any field can
 * be omitted; only email is required.
 *
 * Note: Action Network's server returns a 500 for reserved test domains like
 * `example.com` — use a real domain when testing.
 */

const AN_PEOPLE_ENDPOINT = "https://actionnetwork.org/api/v2/people";

const SubscribeSchema = z.object({
  email: z.string().email(),
  givenName: z.string().trim().max(100).optional(),
  familyName: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(20).optional(),
  country: z.string().trim().max(60).optional(),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
  // Where the signup came from, e.g. "newsletter", "membership", "contact".
  source: z.string().trim().max(80).optional(),
});

export async function POST(request: NextRequest) {
  const apiKey = process.env.ACTION_NETWORK_API_KEY;
  if (!apiKey || apiKey === "your_action_network_api_key_here") {
    console.error("[subscribe] ACTION_NETWORK_API_KEY is not configured");
    return NextResponse.json(
      { ok: false, error: "Signups are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  let data;
  try {
    data = SubscribeSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const person: Record<string, unknown> = {
    email_addresses: [{ address: data.email }],
  };
  if (data.givenName) person.given_name = data.givenName;
  if (data.familyName) person.family_name = data.familyName;
  if (data.postalCode || data.country) {
    person.postal_addresses = [
      { ...(data.postalCode ? { postal_code: data.postalCode } : {}), ...(data.country ? { country: data.country } : {}) },
    ];
  }
  if (data.phone) person.phone_numbers = [{ number: data.phone }];

  const customFields = { ...(data.customFields || {}) };
  if (data.message) customFields.website_message = data.message;
  if (Object.keys(customFields).length > 0) person.custom_fields = customFields;

  const tags = ["Website Signup"];
  if (data.source) tags.push(`Source: ${data.source}`);

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
      console.error(`[subscribe] Action Network returned ${anRes.status}: ${detail.slice(0, 300)}`);
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
