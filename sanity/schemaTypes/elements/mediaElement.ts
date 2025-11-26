import {defineType} from 'sanity'

export default defineType({
  name: 'mediaElement',
  title: 'Media',
  type: 'object',
  fields: [
    {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
    {name: 'alt', title: 'Alt Text', type: 'string'},
    {name: 'caption', title: 'Caption', type: 'string'},
  ],
  preview: {
    select: {media: 'image'},
    prepare({media}) {
      return {title: 'Media', media}
    },
  },
})
