import { getPayload } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Media } from '@/payload-types'

async function getTag(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'tags' as never,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] as { id: string; name: string; slug: string; color?: string | null } | undefined
}

async function getTaggedContent(tagId: string) {
  const payload = await getPayload()

  const [work, blog, press] = await Promise.all([
    payload.find({
      collection: 'campaigns' as never,
      where: { tags: { contains: tagId } },
      depth: 1,
      limit: 50,
    }),
    payload.find({
      collection: 'blog-posts' as never,
      where: { tags: { contains: tagId } },
      depth: 1,
      limit: 50,
    }),
    payload.find({
      collection: 'press-articles' as never,
      where: { tags: { contains: tagId } },
      depth: 1,
      limit: 50,
    }),
  ])

  return {
    work: work.docs as Array<{ id: string; title: string; slug: string; summary?: string | null; image?: string | Media | null }>,
    blog: blog.docs as Array<{ id: string; title: string; slug: string; excerpt?: string | null; coverImage?: string | Media | null; publishedAt?: string | null }>,
    press: press.docs as Array<{ id: string; title: string; slug?: string | null; publication?: string | null; url?: string | null; publishedAt?: string | null }>,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTag(slug)
  if (!tag) return {}
  return {
    title: `${tag.name} | Our City Action Buffalo`,
  }
}

function getImageUrl(media: string | Media | null | undefined): string {
  if (!media || typeof media === 'string') return ''
  return media.url || ''
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tag = await getTag(slug)
  if (!tag) notFound()

  const { work, blog, press } = await getTaggedContent(tag.id)
  const hasContent = work.length > 0 || blog.length > 0 || press.length > 0

  return (
    <main className="min-h-screen pt-16 lg:pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            {tag.color && (
              <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: tag.color }} />
            )}
            <h1 className="text-4xl md:text-5xl font-bold">{tag.name}</h1>
          </div>
          <p className="text-gray-500">All content tagged with &ldquo;{tag.name}&rdquo;</p>
        </div>

        {!hasContent && (
          <p className="text-gray-500 text-lg">No content with this tag yet.</p>
        )}

        {work.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Work</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {work.map((item) => (
                <Link key={item.id} href={`/work/${item.slug}`} className="block group">
                  <div className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                    {getImageUrl(item.image) && (
                      <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                      {item.summary && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.summary}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {blog.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Blog</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blog.map((item) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="block group">
                  <div className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                    {getImageUrl(item.coverImage) && (
                      <img src={getImageUrl(item.coverImage)} alt={item.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                      {item.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.excerpt}</p>}
                      {item.publishedAt && (
                        <p className="text-xs text-gray-400 mt-2">{new Date(item.publishedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {press.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Press</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {press.map((item) => {
                const href = item.url || (item.slug ? `/press/${item.slug}` : '#')
                const isExternal = !!item.url
                return (
                  <a
                    key={item.id}
                    href={href}
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="block group"
                  >
                    <div className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full p-4">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                      {item.publication && <p className="text-sm text-gray-500 mt-1">{item.publication}</p>}
                      {item.publishedAt && (
                        <p className="text-xs text-gray-400 mt-2">{new Date(item.publishedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
