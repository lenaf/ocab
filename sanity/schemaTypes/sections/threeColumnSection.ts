import { defineType } from "sanity";

export default defineType({
  name: "threeColumnSection",
  title: "Three Column Section",
  type: "object",
  fields: [
    {
      name: "description",
      title: "Description",
      type: "string",
      description: "Internal label to identify this section",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "backgroundColor",
      title: "Background Color",
      type: "simplerColor",
    },
    {
      name: "ratio",
      title: "Column Ratio",
      type: "string",
      options: {
        list: [
          { title: "Equal (33/33/33)", value: "1-1-1" },
          { title: "50/25/25", value: "2-1-1" },
          { title: "25/50/25", value: "1-2-1" },
          { title: "25/25/50", value: "1-1-2" },
        ],
      },
      initialValue: "1-1-1",
    },
    {name: "column1", title: "Column 1", type: "richText"},
    {name: "column2", title: "Column 2", type: "richText"},
    {name: "column3", title: "Column 3", type: "richText"},
  ],
  preview: {
    select: { description: "description" },
    prepare({ description }) {
      return {
        title: description || "Three Column Section",
        subtitle: "Three Column Section",
        media: () => "⚍",
      };
    },
  },
});
