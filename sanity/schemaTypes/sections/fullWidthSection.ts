import {defineType} from 'sanity'

export default defineType({
  name: 'fullWidthSection',
  title: 'Full Width Section',
  type: 'object',
  fields: [
    {name: 'description', title: 'Description', type: 'string', description: 'Internal label to identify this section', validation: (Rule) => Rule.required()},
    {name: 'content', title: 'Content', type: 'richText'},
  ],
  preview: {
    select: {description: 'description'},
    prepare({description}) {
      return {title: description || 'Full Width Section', subtitle: 'Full Width Section', media: () => '📐'}
    },
  },
})
