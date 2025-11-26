import { client } from '@/lib/sanity'
import { RenderSections } from '@/components/RenderSections'

export default async function Home() {
  const page = await client.fetch(`*[_type == "page" && slug.current == "home"][0]{
    _id,
    _type,
    title,
    sections
  }`)
  
  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">No homepage found</h1>
        <p>Create a page with slug &ldquo;home&rdquo; in the admin at /admin</p>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen" data-sanity-document-id={page._id}>
      <RenderSections sections={page.sections} />
    </main>
  )
}
