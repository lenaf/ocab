import type { CollectionConfig } from 'payload'

export const PressArticles: CollectionConfig = {
  slug: 'press-articles' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publication', 'type', 'featured', 'order', 'publishedAt'],
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
      name: 'type',
      type: 'select',
      label: 'Article Type',
      options: [
        { label: 'News Coverage', value: 'news' },
        { label: 'Op-Ed / Another Voice', value: 'op-ed' },
        { label: 'Interview', value: 'interview' },
        { label: 'Photo Essay', value: 'photo-essay' },
      ],
      admin: { position: 'sidebar' },
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
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Featured articles appear in the press section on the homepage',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      admin: { position: 'sidebar', description: 'Lower numbers appear first' },
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
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
