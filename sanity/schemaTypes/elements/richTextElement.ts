import {defineType} from 'sanity'

export default defineType({
  name: 'richTextElement',
  title: 'Rich Text',
  type: 'object',
  fields: [{name: 'content', title: 'Content', type: 'richText'}],
  preview: {
    prepare() {
      return {title: 'Rich Text', media: () => '📝'}
    },
  },
})
