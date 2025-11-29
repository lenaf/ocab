import { defineType } from "sanity";

export default defineType({
  name: "collageItem",
  title: "Collage Item",
  type: "object",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "alt",
      title: "Alt Text",
      type: "string",
    },
    {
      name: "position",
      title: "Position & Size",
      type: "object",
      fields: [
        {
          name: "x",
          title: "X Position (%)",
          type: "number",
          initialValue: 10,
          validation: (Rule) => Rule.required().min(0).max(100),
        },
        {
          name: "y",
          title: "Y Position (%)",
          type: "number",
          initialValue: 10,
          validation: (Rule) => Rule.required().min(0).max(100),
        },
        {
          name: "width",
          title: "Width (%)",
          type: "number",
          initialValue: 30,
          validation: (Rule) => Rule.required().min(5).max(100),
        },
        {
          name: "height",
          title: "Height (%)",
          type: "number",
          initialValue: 30,
          validation: (Rule) => Rule.required().min(5).max(100),
        },
      ],
    },
    {
      name: "mobilePosition",
      title: "Mobile Position & Size",
      type: "object",
      fields: [
        {
          name: "x",
          title: "X Position (%)",
          type: "number",
          initialValue: 10,
          validation: (Rule) => Rule.required().min(0).max(100),
        },
        {
          name: "y",
          title: "Y Position (%)",
          type: "number",
          initialValue: 10,
          validation: (Rule) => Rule.required().min(0).max(100),
        },
        {
          name: "width",
          title: "Width (%)",
          type: "number",
          initialValue: 40,
          validation: (Rule) => Rule.required().min(5).max(100),
        },
        {
          name: "height",
          title: "Height (%)",
          type: "number",
          initialValue: 40,
          validation: (Rule) => Rule.required().min(5).max(100),
        },
      ],
    },
  ],
  preview: {
    select: {
      media: "image",
      x: "position.x",
      y: "position.y",
    },
    prepare({ media, x, y }) {
      return {
        title: `Collage Item`,
        subtitle: `Position: ${x}%, ${y}%`,
        media,
      };
    },
  },
});
