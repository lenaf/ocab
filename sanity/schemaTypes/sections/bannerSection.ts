import { defineType } from "sanity";

export default defineType({
  name: "bannerSection",
  title: "Banner Section",
  type: "object",
  fields: [
    {
      name: "backgroundColor",
      title: "Background Color",
      type: "simplerColor",
    },
    {
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "content",
      title: "Content",
      type: "richText",
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Banner Section",
        media: () => "🎯",
      };
    },
  },
});
