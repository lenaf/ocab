import type { CollectionConfig } from 'payload'

export const PressArticles: CollectionConfig = {
  slug: 'press-articles' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publication', 'publishedAt', 'tags'],
    description: 'News coverage of OCAB from external publications',
    group: '📚 Collections',
    listSearchableFields: ['title', 'publication'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publication',
      type: 'text',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'media' as any,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags' as never,
      hasMany: true,
      label: 'Tags',
      admin: { position: 'sidebar' },
    },
  ],
}
