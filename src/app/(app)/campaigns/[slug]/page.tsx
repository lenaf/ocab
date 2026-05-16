import { getPayload } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { LexicalRenderer } from '@/components/LexicalRenderer'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Campaign, Media } from '@/payload-types'

async function getCampaign(slug: string): Promise<Campaign | null> {
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
  const campaign = await getCampaign(slug)
  if (!campaign) return {}
  const seo = campaign.seo
  return {
    title: seo?.title || `${campaign.title} | Our City Action Buffalo`,
    description: seo?.description || campaign.summary || undefined,
  }
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const campaign = await getCampaign(slug)

  if (!campaign) notFound()

  const imageUrl = campaign.image && typeof campaign.image === 'object' ? (campaign.image as Media).url : ''

  return (
    <main className="min-h-screen pt-20">
      {imageUrl && (
        <div className="relative h-64 md:h-96">
          <img src={imageUrl} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-block px-3 py-1 text-sm font-bold rounded ${
            campaign.status === 'active' ? 'bg-green-500 text-white' :
            campaign.status === 'upcoming' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {campaign.status}
          </span>
          {campaign.year && (
            <span className="text-sm text-gray-500">
              {campaign.year}{campaign.endYear ? `–${campaign.endYear}` : ''}
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{campaign.title}</h1>
        {campaign.summary && (
          <p className="text-xl text-gray-600 mb-8">{campaign.summary}</p>
        )}
        {campaign.content && (
          <div className="prose prose-lg max-w-none">
            <LexicalRenderer content={campaign.content} />
          </div>
        )}
        {campaign.learnMoreUrl && (
          <a
            href={campaign.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-6 py-3 bg-accent text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {campaign.callToAction || 'Learn More'}
          </a>
        )}
        <div className="mt-12 pt-8 border-t">
          <Link href="/campaigns" className="text-primary font-bold hover:underline">
            ← All Campaigns
          </Link>
        </div>
      </div>
    </main>
  )
}
