import { client } from '@/lib/sanity'
import { RenderSections } from '@/components/RenderSections'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const pages = await client.fetch(`*[_type == "page" && slug.current != "home"]{
    "slug": slug.current
  }`)
  
  return pages.map((page: any) => ({
    slug: page.slug,
  }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await client.fetch(`*[_type == "page" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    sections
  }`, { slug: params.slug })
  
  if (!page) {
    notFound()
  }
  
  return (
    <main className="min-h-screen" data-sanity-document-id={page._id}>
      <RenderSections sections={page.sections} />
    </main>
  )
}
