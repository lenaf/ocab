import { defineType } from "sanity";

export default defineType({
  name: "twoColumnSection",
  title: "Two Column Section",
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
          { title: "50/50", value: "1-1" },
          { title: "60/40", value: "3-2" },
          { title: "40/60", value: "2-3" },
          { title: "67/33", value: "2-1" },
          { title: "33/67", value: "1-2" },
        ],
      },
      initialValue: "1-1",
    },
    {name: "leftColumn", title: "Left Column", type: "columnElement"},
    {name: "rightColumn", title: "Right Column", type: "columnElement"},
  ],
  preview: {
    select: { description: "description" },
    prepare({ description }) {
      return {
        title: description || "Two Column Section",
        subtitle: "Two Column Section",
        media: () => "⚌",
      };
    },
  },
});
