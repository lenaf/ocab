import {defineType} from 'sanity'

export default defineType({
  name: 'colorAnnotation',
  title: 'Color',
  type: 'object',
  fields: [{name: 'value', type: 'simplerColor', title: 'Color'}],
})
