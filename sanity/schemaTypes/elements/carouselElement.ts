import {defineType} from 'sanity'

export const carouselImage = defineType({
  name: 'carouselImage',
  title: 'Carousel Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    {name: 'alt', type: 'string', title: 'Alt Text'},
    {name: 'caption', type: 'string', title: 'Caption'},
  ],
})

export default defineType({
  name: 'carouselElement',
  title: 'Carousel',
  type: 'object',
  fields: [
    {name: 'images', title: 'Images', type: 'array', of: [{type: 'carouselImage'}]},
    {name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false},
  ],
  preview: {
    select: {images: 'images'},
    prepare({images}) {
      return {title: `Carousel (${images?.length || 0} images)`, media: () => '🎠'}
    },
  },
})
