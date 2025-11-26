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
      type: 'simplerColor',
    },
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Press Carousel',
        subtitle: 'Press Carousel Section',
      }
    },
  },
})
