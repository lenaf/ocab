import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveFormId, submitForm } from "@/lib/actionNetwork";

/**
 * Records a submission against an Action Network form (server-side, so it
 * counts as a real form submission and fires the form's tags/autoresponder,
 * with no on-page widget and no logged-in-browser override).
 */

const SubmitSchema = z.object({
  // Prefer the AN form id (stored by the CMS picker); fall back to slug lookup.
  formId: z.string().trim().min(1).optional(),
  values: z.record(z.string(), z.string()),
  source: z.string().trim().max(80).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let data;
  try {
    data = SubmitSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  const email = (data.values.email || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const formId = data.formId || (await resolveFormId(slug));
    if (!formId) {
      return NextResponse.json({ ok: false, error: "Form not found." }, { status: 404 });
    }

    const tags = ["Website Signup"];
    if (data.source) tags.push(`Source: ${data.source}`);

    const result = await submitForm(formId, data.values, tags);
    if (!result.ok) {
      console.error(`[an-forms] submit to ${slug} (${formId}) returned ${result.status}`);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[an-forms] submit to ${slug} failed:`, err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
