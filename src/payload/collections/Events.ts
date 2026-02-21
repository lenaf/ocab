import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

export const Events: CollectionConfig = {
  slug: 'events' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'status', 'featured'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    // Action Network synced fields (read-only in admin)
    {
      name: 'actionNetworkId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Synced from Action Network',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      access: {
        update: ({ data }) => !data?.actionNetworkId,
      },
    },
    {
      name: 'description',
      type: 'richText',
      access: {
        update: ({ data }) => !data?.actionNetworkId,
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      access: {
        update: ({ data }) => !data?.actionNetworkId,
      },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      access: {
        update: ({ data }) => !data?.actionNetworkId,
      },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'group',
      access: {
        update: ({ data }) => !data?.actionNetworkId,
      },
      fields: [
        { name: 'venue', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'zip', type: 'text' },
      ],
    },
    {
      name: 'browserUrl',
      type: 'text',
      label: 'Action Network URL',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'RSVP link from Action Network',
      },
    },
    {
      name: 'capacity',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'totalAccepted',
      type: 'number',
      label: 'RSVPs',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    
    // Payload-only enhanced fields
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'media' as any,
      label: 'Featured Image',
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'Additional Details',
    },
    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Conference', value: 'conference' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Rally', value: 'rally' },
        { label: 'Fundraiser', value: 'fundraiser' },
        { label: 'Training', value: 'training' },
        { label: 'Social', value: 'social' },
        { label: 'Networking', value: 'networking' },
      ],
    },
    {
      name: 'speakers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'title', type: 'text' },
        { name: 'bio', type: 'textarea' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { name: 'photo', type: 'upload', relationTo: 'media' as any },
      ],
    },
    {
      name: 'sponsors',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { name: 'logo', type: 'upload', relationTo: 'media' as any },
        { name: 'url', type: 'text' },
        {
          name: 'tier',
          type: 'select',
          options: [
            { label: 'Platinum', value: 'platinum' },
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Bronze', value: 'bronze' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea', maxLength: 160 },
        { name: 'keywords', type: 'text' },
      ],
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
  ],
}
