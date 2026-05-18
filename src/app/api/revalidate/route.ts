import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, collection, paths } = body

    // New: revalidate an array of paths
    if (paths && Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p)
      }
      return NextResponse.json({ revalidated: true, paths, now: Date.now() })
    }

    // Legacy: single slug + collection
    if (collection === 'pages') {
      if (slug === 'home') {
        revalidatePath('/')
      } else if (slug) {
        revalidatePath(`/${slug}`)
      }
    }

    if (slug) {
      revalidatePath(`/${slug}`)
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), slug, collection })
  } catch (err) {
    console.error('Error revalidating:', err)
    return NextResponse.json({
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
