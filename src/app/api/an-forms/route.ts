import { NextResponse } from "next/server";
import { listForms } from "@/lib/actionNetwork";

/** Lists the org's Action Network forms — powers the CMS form picker. */
export async function GET() {
  try {
    const forms = await listForms();
    return NextResponse.json({ forms });
  } catch (err) {
    console.error("[an-forms] list failed:", err);
    return NextResponse.json({ forms: [], error: "Could not load Action Network forms." }, { status: 502 });
  }
}
