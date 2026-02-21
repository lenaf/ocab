/**
 * Sync existing events from Action Network to Payload
 * Run with: npm run sync:events
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables from .env.local
dotenvConfig({ path: '.env.local' })

interface ActionNetworkEvent {
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

async function syncEvents() {
  const apiKey = process.env.ACTION_NETWORK_API_KEY
  
  if (!apiKey) {
    console.error('❌ ACTION_NETWORK_API_KEY not found')
    process.exit(1)
  }
  
  console.log('🔄 Fetching events from Action Network...')
  
  try {
    const response = await fetch('https://actionnetwork.org/api/v2/events', {
      headers: {
        'OSDI-API-Token': apiKey,
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    const events: ActionNetworkEvent[] = data._embedded?.['osdi:events'] || []
    
    console.log(`📥 Found ${events.length} events`)
    
    const payload = await getPayload({ config })
    let created = 0
    let updated = 0
    
    for (const event of events) {
      const actionNetworkId = event.identifiers[0]
      
      // Check if exists
      const existing = await payload.find({
        collection: 'events',
        where: {
          actionNetworkId: {
            equals: actionNetworkId,
          },
        },
        limit: 1,
      })
      
      const eventData = {
        actionNetworkId,
        title: event.title,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: event.description || '',
                  },
                ],
              },
            ],
          },
        },
        startDate: event.start_date,
        endDate: event.end_date,
        location: event.location ? {
          venue: event.location.venue,
          address: event.location.address_lines?.[0],
          city: event.location.locality,
          state: event.location.region,
          zip: event.location.postal_code,
        } : undefined,
        browserUrl: event.browser_url,
        capacity: event.capacity,
        totalAccepted: event.total_accepted,
      }
      
      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'events',
          id: existing.docs[0].id,
          data: eventData,
        })
        updated++
      } else {
        await payload.create({
          collection: 'events',
          data: {
            ...eventData,
            status: 'published',
          },
        })
        created++
      }
      
      console.log(`  ✓ ${event.title}`)
    }
    
    console.log(`\n✅ Sync complete!`)
    console.log(`   Created: ${created}`)
    console.log(`   Updated: ${updated}`)
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

syncEvents()
