import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media' as const,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (req.file && !data.alt) {
          data.alt = req.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }
        return data
      },
    ],
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: ({ doc }) => `/api/media/file/${doc.id}`,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      console.log('[Media] Create access check - user:', user ? 'authenticated' : 'not authenticated')
      return !!user
    },
    update: ({ req: { user } }) => {
      console.log('[Media] Update access check - user:', user ? 'authenticated' : 'not authenticated')
      return !!user
    },
    delete: ({ req: { user } }) => {
      console.log('[Media] Delete access check - user:', user ? 'authenticated' : 'not authenticated')
      return !!user
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
