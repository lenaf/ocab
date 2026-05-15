import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts' as const,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
    group: '📚 Collections',
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
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'media' as any,
      label: 'Hero / Preview Image',
      admin: {
        position: 'sidebar',
        description: 'Shown as hero on the post page and as thumbnail in lists',
      },
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
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'News', value: 'News' },
        { label: 'Campaign Update', value: 'campaign-update' },
        { label: 'Action Alert', value: 'Action' },
        { label: 'Victory', value: 'Victory' },
        { label: 'Analysis', value: 'Analysis' },
        { label: 'Press Release', value: 'press-release' },
        { label: 'Community', value: 'community' },
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
      admin: { position: 'sidebar' },
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
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Select related blog posts to display',
      },
    },
  ],
}
