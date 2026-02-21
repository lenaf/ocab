import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import crypto from 'crypto'

interface ActionNetworkWebhook {
  action: 'created' | 'updated' | 'deleted'
  resource_type: string
  resource: {
    identifiers: string[]
    title: string
    description: string
    start_date: string
    end_date?: string
    location?: {
      venue?: string
      address_lines?: string[]
      locality?: string
      region?: string
      postal_code?: string
    }
    browser_url: string
    capacity?: number
    total_accepted?: number
  }
}

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.ACTION_NETWORK_WEBHOOK_SECRET
  if (!secret) return true // Skip verification if no secret configured
  
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-action-network-signature') || ''
    
    // Verify webhook signature
    if (!verifySignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    const webhook: ActionNetworkWebhook = JSON.parse(body)
    
    // Only process event webhooks
    if (webhook.resource_type !== 'event') {
      return NextResponse.json({ message: 'Not an event webhook' }, { status: 200 })
    }
    
    const payload = await getPayload({ config })
    const actionNetworkId = webhook.resource.identifiers[0]
    
    // Find existing event
    const existing = await payload.find({
      collection: 'events',
      where: {
        actionNetworkId: {
          equals: actionNetworkId,
        },
      },
      limit: 1,
    })
    
    if (webhook.action === 'deleted') {
      // Delete the event
      if (existing.docs.length > 0) {
        await payload.delete({
          collection: 'events',
          id: existing.docs[0].id,
        })
        console.log(`Event ${actionNetworkId} deleted`)
      }
      return NextResponse.json({ message: 'Event deleted' }, { status: 200 })
    }
    
    // Map Action Network data to Payload format
    const eventData = {
      actionNetworkId,
      title: webhook.resource.title,
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: webhook.resource.description || '',
                },
              ],
            },
          ],
        },
      },
      startDate: webhook.resource.start_date,
      endDate: webhook.resource.end_date,
      location: webhook.resource.location ? {
        venue: webhook.resource.location.venue,
        address: webhook.resource.location.address_lines?.[0],
        city: webhook.resource.location.locality,
        state: webhook.resource.location.region,
        zip: webhook.resource.location.postal_code,
      } : undefined,
      browserUrl: webhook.resource.browser_url,
      capacity: webhook.resource.capacity,
      totalAccepted: webhook.resource.total_accepted,
    }
    
    if (existing.docs.length > 0) {
      // Update existing event (preserve Payload-only fields)
      await payload.update({
        collection: 'events',
        id: existing.docs[0].id,
        // @ts-expect-error - Payload type inference doesn't match runtime structure
        data: eventData,
      })
      console.log(`Event ${actionNetworkId} updated`)
    } else {
      // Create new event
      await payload.create({
        collection: 'events',
        // @ts-expect-error - Payload type inference doesn't match runtime structure
        data: eventData,
      })
      console.log(`Event ${actionNetworkId} created`)
    }
    
    return NextResponse.json({ message: 'Event synced successfully' }, { status: 200 })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
