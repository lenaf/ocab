export async function revalidate(paths: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!baseUrl || !secret) return;

  try {
    const res = await fetch(`${baseUrl}/api/revalidate?secret=${secret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
    if (!res.ok) {
      console.error(`Revalidation failed:`, await res.text());
    }
  } catch (error) {
    console.error("Revalidation error:", error);
  }
}
