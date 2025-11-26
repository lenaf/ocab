import {defineType} from 'sanity'

export default defineType({
  name: 'linkAnnotation',
  title: 'Link',
  type: 'object',
  fields: [
    {name: 'href', type: 'url', title: 'URL'},
    {name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true},
  ],
})
