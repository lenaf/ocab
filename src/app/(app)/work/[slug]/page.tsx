import { getPayload } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { LexicalRenderer } from '@/components/LexicalRenderer'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Campaign, Media } from '@/payload-types'

async function getWork(slug: string): Promise<Campaign | null> {
  const payload = await getPayload()
  const result = await payload.find({
    // @ts-expect-error - types not yet regenerated
    collection: 'campaigns',
    where: { slug: { equals: slug } },
    depth: 2,
  })
  return (result.docs[0] as unknown as Campaign) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getWork(slug)
  if (!item) return {}
  const seo = item.seo
  return {
    title: seo?.title || `${item.title} | Our City Action Buffalo`,
    description: seo?.description || item.summary || undefined,
  }
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getWork(slug)

  if (!item) notFound()

  const imageUrl = item.image && typeof item.image === 'object' ? (item.image as Media).url : ''
  return (
    <main className="min-h-screen pt-16 lg:pt-16">
      {imageUrl && (
        <div className="relative h-64 md:h-96">
          <img src={imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {item.year && (
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              {item.year}{item.endYear === 'present' ? '–Present' : item.endYear && item.endYear !== 'same' ? `–${item.endYear}` : ''}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{item.title}</h1>
        {item.summary && (
          <p className="text-xl text-gray-600 mb-8">{item.summary}</p>
        )}
        {item.content && (
          <div className="prose prose-lg max-w-none">
            <LexicalRenderer content={item.content} />
          </div>
        )}
        <div className="mt-12 pt-8 border-t">
          <Link href="/work" className="text-primary font-bold hover:underline">
            ← All Work
          </Link>
        </div>
      </div>
    </main>
  )
}
