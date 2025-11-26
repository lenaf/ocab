import {defineType} from 'sanity'

export default defineType({
  name: 'fullWidthSection',
  title: 'Full Width Section',
  type: 'object',
  fields: [
    {name: 'description', title: 'Description', type: 'string', description: 'Internal label to identify this section', validation: (Rule) => Rule.required()},
    {name: 'backgroundColor', title: 'Background Color', type: 'simplerColor'},
    {name: 'backgroundImage', title: 'Background Image', type: 'image', options: {hotspot: true}},
    {name: 'alignment', title: 'Content Alignment', type: 'string', options: {list: [{title: 'Left', value: 'left'}, {title: 'Center', value: 'center'}, {title: 'Right', value: 'right'}]}, initialValue: 'left'},
    {name: 'elements', title: 'Elements', type: 'array', of: [{type: 'richTextElement'}, {type: 'mediaElement'}, {type: 'buttonElement'}, {type: 'carouselElement'}]},
  ],
  preview: {
    select: {description: 'description'},
    prepare({description}) {
      return {title: description || 'Full Width Section', subtitle: 'Full Width Section', media: () => '📐'}
    },
  },
})
