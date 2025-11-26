import {defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload your logo (PNG or SVG recommended)',
    },
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Our City Action Buffalo',
    },
  ],
})
