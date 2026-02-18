import { getPayload } from "@/lib/payload";
import { RenderSections } from "@/components/RenderSections";
import type { Page } from "@/payload-types";

export default async function Home() {
  const payload = await getPayload();

  const pages = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: "home",
      },
    },
    depth: 3,
  });

  const page = pages.docs[0] as Page;

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">No homepage found</h1>
        <p>
          Create a page with slug containing &ldquo;home&rdquo; in the admin at
          /admin
        </p>
      </div>
    );
  }

  const sections = page.sections || [];

  return (
    // add padding top for nav
    <main className="min-h-screen pt-20">
      <RenderSections sections={sections} />
    </main>
  );
}
