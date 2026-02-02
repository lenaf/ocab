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
      relationTo: 'media',
    },
    {
      name: 'backgroundColor',
      type: 'relationship',
      relationTo: 'brand-colors',
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
