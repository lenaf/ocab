import {defineType} from 'sanity'

export default defineType({
  name: 'richTextImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    {name: 'alt', type: 'string', title: 'Alt text'},
    {name: 'caption', type: 'string', title: 'Caption'},
  ],
})
