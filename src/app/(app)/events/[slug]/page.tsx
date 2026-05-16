import { getPayload } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { LexicalRenderer } from '@/components/LexicalRenderer'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Event, Media } from '@/payload-types'

async function getEvent(slug: string): Promise<Event | null> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    depth: 2,
  })
  return (result.docs[0] as unknown as Event) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}
  return {
    title: `${event.title} | Our City Action Buffalo`,
    description: event.seoDescription || undefined,
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) notFound()

  const imageUrl = event.featuredImage && typeof event.featuredImage === 'object' ? (event.featuredImage as Media).url : ''
  const rsvpUrl = event.browserUrl || event.registrationUrl || event.ticketUrl

  return (
    <main className="min-h-screen pt-20">
      {imageUrl && (
        <div className="relative h-64 md:h-96">
          <img src={imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-4">
          {event.eventType && (
            <span className="inline-block px-3 py-1 text-sm font-bold rounded bg-primary/10 text-primary">
              {event.eventType.replace('-', ' ')}
            </span>
          )}
          {event.status === 'cancelled' && (
            <span className="inline-block px-3 py-1 text-sm font-bold rounded bg-red-500 text-white">Cancelled</span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>

        <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-bold">Date:</span>
            <span>{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {event.startDate && (
            <div className="flex items-center gap-2">
              <span className="font-bold">Time:</span>
              <span>{new Date(event.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              {event.endDate && <span>– {new Date(event.endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>}
            </div>
          )}
        </div>

        {event.location && (event.location.venue || event.location.address) && (
          <div className="mb-8 p-4 bg-base-200 rounded-lg">
            <p className="font-bold">{event.location.venue}</p>
            {event.location.address && <p>{event.location.address}</p>}
            <p>{[event.location.city, event.location.state, event.location.zip].filter(Boolean).join(', ')}</p>
          </div>
        )}

        {event.description && (
          <div className="prose prose-lg max-w-none mb-8">
            <LexicalRenderer content={event.description} />
          </div>
        )}

        {event.longDescription && (
          <div className="prose prose-lg max-w-none mb-8">
            <LexicalRenderer content={event.longDescription} />
          </div>
        )}

        {rsvpUrl && (
          <a
            href={rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-accent text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            {event.ticketed ? 'Get Tickets' : 'RSVP Now'}
          </a>
        )}

        <div className="mt-12 pt-8 border-t">
          <Link href="/events" className="text-primary font-bold hover:underline">
            ← All Events
          </Link>
        </div>
      </div>
    </main>
  )
}
