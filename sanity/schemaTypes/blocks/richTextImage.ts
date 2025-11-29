import {defineType} from 'sanity'

export default defineType({
  name: 'richTextImage',
  title: 'Image',
  type: 'object',
  fields: [
    {name: 'asset', type: 'image', title: 'Image', options: {hotspot: true}},
    {name: 'alt', type: 'string', title: 'Alt text'},
    {name: 'caption', type: 'string', title: 'Caption'},
  ],
  preview: {
    select: {asset: 'asset', alt: 'alt'},
    prepare({asset, alt}) {
      return {
        title: alt || 'Image',
        media: asset,
      }
    },
  },
})
