import { NextRequest, NextResponse } from "next/server";
import { getFormFields } from "@/lib/actionNetwork";

/** Returns a form's visible field definitions, parsed from its widget HTML. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const fields = await getFormFields(slug);
    return NextResponse.json({ fields });
  } catch (err) {
    console.error(`[an-forms] fields failed for ${slug}:`, err);
    return NextResponse.json({ fields: [], error: "Could not load form fields." }, { status: 502 });
  }
}
