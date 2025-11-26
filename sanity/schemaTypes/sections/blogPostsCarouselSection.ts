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
      type: "simplerColor",
    },
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return {
        title: title || "Blog Posts Carousel",
        subtitle: "Blog Posts Carousel Section",
      };
    },
  },
});
