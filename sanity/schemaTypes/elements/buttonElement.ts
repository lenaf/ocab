import {defineType} from 'sanity'

export default defineType({
  name: 'buttonElement',
  title: 'Button',
  type: 'object',
  fields: [
    {name: 'text', title: 'Button Text', type: 'string', validation: (Rule) => Rule.required()},
    {name: 'link', title: 'Link', type: 'string', validation: (Rule) => Rule.required()},
    {name: 'color', title: 'Background/Outline Color', type: 'simplerColor'},
    {name: 'textColor', title: 'Text Color', type: 'simplerColor'},
    {name: 'style', title: 'Style', type: 'string', options: {list: [{title: 'Solid', value: 'solid'}, {title: 'Transparent Outline', value: 'transparent'}]}, initialValue: 'solid'},
    {name: 'size', title: 'Size', type: 'string', options: {list: [{title: 'Small', value: 'sm'}, {title: 'Medium', value: 'default'}, {title: 'Large', value: 'lg'}]}, initialValue: 'default'},
  ],
  preview: {
    select: {title: 'text'},
    prepare({title}) {
      return {title: title || 'Button', media: () => '🔘'}
    },
  },
})
