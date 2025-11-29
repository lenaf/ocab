import {defineType} from 'sanity'

export default defineType({
  name: 'pressCarouselSection',
  title: 'Press Carousel Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'limit',
      title: 'Number of Articles',
      type: 'number',
      initialValue: 8,
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'customColor',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      limit: 'limit',
    },
    prepare({title, limit}) {
      return {
        title: title || 'Press',
        subtitle: `Carousel • ${limit || 8} articles`,
        media: () => '📰',
      }
    },
  },
})
