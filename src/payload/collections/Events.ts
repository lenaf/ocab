import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location'],
    group: 'Content',
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
      type: 'select',
      label: 'Background Color',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Base 100', value: 'base-100' },
        { label: 'Base 200', value: 'base-200' },
        { label: 'Base 300', value: 'base-300' },
      ],
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
