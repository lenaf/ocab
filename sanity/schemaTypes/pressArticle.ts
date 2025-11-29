import {defineType} from 'sanity'

export default defineType({
  name: 'pressArticle',
  title: 'Press Articles',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publication',
      title: 'Publication',
      type: 'string',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'simplerColor',
    },
  ],
})
