import {defineType} from 'sanity'

export default defineType({
  name: 'eventsCarouselSection',
  title: 'Events Carousel Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'limit',
      title: 'Number of Events',
      type: 'number',
      initialValue: 12,
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'simplerColor',
    },
    {
      name: 'showCalendar',
      title: 'Show Calendar View',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Events Carousel',
        subtitle: 'Events Carousel Section',
      }
    },
  },
})
