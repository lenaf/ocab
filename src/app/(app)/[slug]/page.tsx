import { getPayload } from '@/lib/payload'
import { RenderSections } from '@/components/RenderSections'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Page, Media } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload()
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        not_equals: 'home'
      }
    }
  })

  return pages.docs.map((page) => ({
    slug: page.slug,
  }))
}

async function getPage(slug: string): Promise<Page | null> {
  const payload = await getPayload()
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 3,
  })
  return (pages.docs[0] as Page) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await getPage(slug)
    if (!page) return {}

    const seo = (page as { seo?: { title?: string; description?: string; ogImage?: Media | string | null; noIndex?: boolean } }).seo
    const title = seo?.title || `${page.title} | Our City Action Buffalo`
    const description = seo?.description || undefined
    const ogImage = seo?.ogImage && typeof seo.ogImage === 'object' ? (seo.ogImage as Media).url : undefined

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
      robots: seo?.noIndex ? 'noindex, nofollow' : 'index, follow',
    }
  } catch {
    return {}
  }
}

export default async function PageComponent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  const sections = page.sections || []

  return (
    <main className="min-h-screen pt-20">
      <RenderSections sections={sections} />
    </main>
  )
}
