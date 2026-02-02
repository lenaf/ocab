import { getPayload } from "@/lib/payload";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// todo - is this the best way to retrieve media data?
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await getPayload();
    const media = await payload.findByID({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: "media" as any,
      id,
    });

    if (!media?.filename) {
      console.error(`Media not found for ID: ${id}`);
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "media", media.filename);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Media file error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
