import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { listForms } from "@/lib/actionNetwork";

/**
 * Lists the org's Action Network forms for the CMS picker.
 *
 * Live-first: calls AN's forms API directly (works now that we avoid the
 * `per_page=100` query that tripped AN's WAF). Falls back to the
 * `action-network-forms` global (populated by `pnpm sync:an-forms`) if the
 * live call fails, so the picker keeps working regardless.
 */
export async function GET() {
  try {
    const forms = await listForms();
    return NextResponse.json({ forms, source: "live" });
  } catch (liveErr) {
    console.error("[an-forms] live list failed, falling back to synced global:", liveErr);
    try {
      const payload = await getPayload({ config });
      const global = (await payload.findGlobal({
        // @ts-expect-error - Payload global slug typing is overly strict
        slug: "action-network-forms",
      })) as { forms?: { formId?: string; slug?: string; title?: string }[] };
      const forms = (global.forms || [])
        .filter((f) => f.formId && f.slug)
        .map((f) => ({ id: f.formId, slug: f.slug, title: f.title }));
      return NextResponse.json({ forms, source: "synced" });
    } catch (dbErr) {
      console.error("[an-forms] synced fallback failed:", dbErr);
      return NextResponse.json({ forms: [], error: "Could not load Action Network forms." }, { status: 502 });
    }
  }
}
