import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

export const Events: CollectionConfig = {
  slug: 'events' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'status', 'featured'],
    description: 'Community events, rallies, fundraisers, and meetings. Some fields are synced from Action Network and cannot be edited.',
    group: '📚 Collections',
    listSearchableFields: ['title', 'description'],
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
    {
      name: 'actionNetworkId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Synced from Action Network — do not edit manually',
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
        description: 'RSVP link from Action Network — do not edit manually',
      },
    },
    {
      name: 'registrationUrl',
      type: 'text',
      label: 'Registration / RSVP URL',
      admin: {
        position: 'sidebar',
        description: 'For manually-created events not from Action Network',
        condition: (_, s) => !s?.actionNetworkId,
      },
    },
    {
      name: 'capacity',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Synced from Action Network',
      },
    },
    {
      name: 'totalAccepted',
      type: 'number',
      label: 'RSVPs',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Synced from Action Network',
      },
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
        { label: 'Town Hall', value: 'town-hall' },
        { label: 'Rally', value: 'rally' },
        { label: 'Fundraiser', value: 'fundraiser' },
        { label: 'Drag Brunch / Social', value: 'social' },
        { label: 'Training / Workshop', value: 'workshop' },
        { label: 'Canvassing / Phone Bank', value: 'canvassing' },
        { label: 'Community Meeting', value: 'community-meeting' },
        { label: 'Press Event', value: 'press' },
      ],
    },
    {
      name: 'ticketed',
      type: 'checkbox',
      label: 'Ticketed Event',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Ticket Purchase URL',
      admin: { position: 'sidebar', condition: (_, s) => !!s?.ticketed },
    },
    {
      name: 'isFree',
      type: 'checkbox',
      label: 'Free Event',
      defaultValue: true,
      admin: { position: 'sidebar', condition: (_, s) => !!s?.ticketed },
    },
    {
      name: 'price',
      type: 'text',
      label: 'Ticket Price',
      admin: { position: 'sidebar', condition: (_, s) => !!s?.ticketed && !s?.isFree },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media' as never,
      label: 'Event Image',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags' as never,
      hasMany: true,
      label: 'Tags',
      admin: { position: 'sidebar' },
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
      type: 'collapsible',
      label: 'SEO',
      admin: { initCollapsed: true },
      fields: [
        { name: 'seoTitle', type: 'text', label: 'SEO Title' },
        { name: 'seoDescription', type: 'textarea', label: 'Meta Description', maxLength: 160 },
        { name: 'seoKeywords', type: 'text', label: 'Keywords' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Card Color',
      options: [
        { label: 'Primary (blue)', value: 'primary' },
        { label: 'Secondary (black)', value: 'secondary' },
        { label: 'Accent (orange)', value: 'accent' },
        { label: 'Secondary Accent', value: 'accent2' },
        { label: 'White', value: 'base-100' },
        { label: 'Light Gray', value: 'base-200' },
      ],
    },
  ],
}
