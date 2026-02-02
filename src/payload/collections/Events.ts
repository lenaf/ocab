import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'media' as any,
    },
    {
      name: 'backgroundColor',
      type: 'relationship',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'brand-colors' as any,
      admin: {
        components: {
          Field: '@/payload/components/ColorSelectField#ColorSelectField',
        },
      },
    },
    {
      name: 'actionNetworkUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
