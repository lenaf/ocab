import { defineType } from "sanity";

export default defineType({
  name: "blogPostsCarouselSection",
  title: "Blog Posts Carousel Section",
  type: "object",
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
    },
    {
      name: "limit",
      title: "Number of Articles",
      type: "number",
      initialValue: 12,
    },
    {
      name: "backgroundColor",
      title: "Background Color",
      type: "customColor",
    },
  ],
  preview: {
    select: { 
      title: "heading",
      limit: "limit",
    },
    prepare({ title, limit }) {
      return {
        title: title || 'Blog Posts',
        subtitle: `Carousel • ${limit || 12} articles`,
        media: () => '📰',
      };
    },
  },
});
