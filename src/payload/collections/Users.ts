import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users' as const,
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: '⚙️ Settings',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
