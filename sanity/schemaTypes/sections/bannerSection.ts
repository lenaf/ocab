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
      name: "elements",
      title: "Elements",
      type: "array",
      of: [
        { type: "richTextElement" },
        { type: "mediaElement" },
        { type: "buttonElement" },
      ],
    },
  ],
  preview: {
    select: { elements: "elements" },
    prepare({ elements }) {
      return {
        title: `Banner (${elements?.length || 0} elements)`,
        media: () => "🎯",
      };
    },
  },
});
