import { defineType } from "sanity";

export default defineType({
  name: "richTextButton",
  title: "Button",
  type: "object",
  fields: [
    { name: "text", type: "string", title: "Text", validation: (Rule) => Rule.required() },
    { name: "link", type: "string", title: "Link", validation: (Rule) => Rule.required() },
    { name: "color", type: "simplerColor", title: "Color" },
    { name: "textColor", type: "simplerColor", title: "Text Color" },
    { name: "style", type: "string", title: "Style", options: { list: [{ title: "Solid", value: "solid" }, { title: "Transparent", value: "transparent" }] }, initialValue: "solid" },
    { name: "size", type: "string", title: "Size", options: { list: [{ title: "Small", value: "sm" }, { title: "Default", value: "default" }, { title: "Large", value: "lg" }] }, initialValue: "default" },
  ],
  preview: {
    select: { text: "text" },
    prepare({ text }) {
      return { title: text || "Button", subtitle: "Button" };
    },
  },
});
