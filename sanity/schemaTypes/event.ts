import {defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required()},
    {name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}},
    {name: 'date', type: 'datetime', title: 'Event Date'},
    {name: 'location', type: 'string', title: 'Location'},
    {name: 'description', type: 'array', of: [{type: 'block'}], title: 'Description'},
    {name: 'actionNetworkUrl', type: 'url', title: 'Action Network Event URL', description: 'Link to RSVP on Action Network'},
    {name: 'image', type: 'image', title: 'Image'},
    {name: 'backgroundColor', type: 'simplerColor', title: 'Background Color'},
  ],
})
