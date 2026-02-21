/**
 * Register webhook with Action Network
 * Run with: npx tsx scripts/registerWebhook.ts
 */

async function registerWebhook() {
  const apiKey = process.env.ACTION_NETWORK_API_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  if (!apiKey) {
    console.error('❌ ACTION_NETWORK_API_KEY not found in environment variables')
    process.exit(1)
  }
  
  const webhookUrl = `${siteUrl}/api/webhooks/action-network`
  
  console.log(`📡 Registering webhook with Action Network...`)
  console.log(`   URL: ${webhookUrl}`)
  
  try {
    const response = await fetch('https://actionnetwork.org/api/v2/webhooks', {
      method: 'POST',
      headers: {
        'OSDI-API-Token': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        resource_type: 'event',
        actions: ['created', 'updated', 'deleted'],
      }),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP ${response.status}: ${error}`)
    }
    
    const data = await response.json()
    console.log('✅ Webhook registered successfully!')
    console.log('   Webhook ID:', data.identifiers?.[0] || 'N/A')
    console.log('\n💡 Save this webhook ID for future reference')
    
  } catch (error) {
    console.error('❌ Failed to register webhook:', error)
    process.exit(1)
  }
}

registerWebhook()
