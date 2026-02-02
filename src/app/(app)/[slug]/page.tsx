import { getPayload } from '@/lib/payload'
import { RenderSections } from '@/components/RenderSections'
import { notFound } from 'next/navigation'
import type { Page } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload()
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        not_contains: 'home'
      }
    }
  })
  
  return pages.docs.map((page) => ({
    slug: page.slug,
  }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload()
  
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug
      }
    },
    depth: 3
  })
  
  const page = pages.docs[0] as Page
  
  if (!page) {
    notFound()
  }
  
  const sections = JSON.parse(JSON.stringify(page.sections || []))
  
  return (
    <main className="min-h-screen">
      <RenderSections sections={sections} />
    </main>
  )
}
