import {defineType} from 'sanity'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'object',
  fields: [
    {name: 'image', type: 'image', title: 'Image'},
    {name: 'heading', type: 'string', title: 'Heading'},
    {name: 'text', type: 'text', title: 'Text'},
    {name: 'buttonText', type: 'string', title: 'Button Text'},
    {name: 'buttonLink', type: 'string', title: 'Button Link'},
    {name: 'buttonColor', type: 'simplerColor', title: 'Button Color'},
    {name: 'buttonTextColor', type: 'simplerColor', title: 'Button Text Color'},
    {name: 'overlayColor', type: 'simplerColor', title: 'Overlay Color'},
    {name: 'overlayOpacity', type: 'number', title: 'Overlay Opacity', initialValue: 40},
  ],
})

export default defineType({
  name: 'heroCarouselSection',
  title: 'Hero Carousel Section',
  type: 'object',
  fields: [
    {
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [{type: 'heroSlide'}],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Hero Carousel',
        subtitle: 'Hero Carousel Section',
      }
    },
  },
})
