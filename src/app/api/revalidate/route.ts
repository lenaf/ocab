import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Check for secret to confirm this is a valid request
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, collection } = body

    // Revalidate based on collection type
    if (collection === 'pages') {
      if (slug === 'home') {
        // Revalidate home page
        revalidatePath('/')
        console.log(`Revalidated home page`)
      } else {
        // Revalidate specific page
        revalidatePath(`/${slug}`)
        console.log(`Revalidated /${slug}`)
      }
    }

    // Also revalidate the page that was updated
    if (slug) {
      revalidatePath(`/${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      slug,
      collection
    })
  } catch (err) {
    console.error('Error revalidating:', err)
    return NextResponse.json({
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
