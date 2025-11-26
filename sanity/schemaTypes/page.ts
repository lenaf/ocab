import {defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title,
        subtitle: slug === 'home' ? '/' : `/${slug}`,
      }
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {type: 'heroCarouselSection'},
        {type: 'bannerSection'},
        {type: 'fullWidthSection'},
        {type: 'twoColumnSection'},
        {type: 'threeColumnSection'},
        {type: 'blogPostsCarouselSection'},
        {type: 'pressCarouselSection'},
        {type: 'eventsCarouselSection'},
      ],
    },
  ],
})
