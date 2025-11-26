import {defineType} from 'sanity'

export default defineType({
  name: 'columnElement',
  title: 'Column',
  type: 'object',
  fields: [
    {name: 'backgroundColor', title: 'Background Color', type: 'simplerColor'},
    {name: 'backgroundImage', title: 'Background Image', type: 'image', options: {hotspot: true}},
    {name: 'elements', title: 'Elements', type: 'array', of: [{type: 'richTextElement'}, {type: 'mediaElement'}, {type: 'buttonElement'}, {type: 'carouselElement'}]},
  ],
})
