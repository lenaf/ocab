import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users' as const,
  auth: {
    disableLocalStrategy: false,
    useAPIKey: false,
  },
  admin: {
    useAsTitle: 'email',
    components: {
      views: {
        account: {
          Component: '@/payload/components/AccountWithLogout#AccountWithLogout',
        },
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
