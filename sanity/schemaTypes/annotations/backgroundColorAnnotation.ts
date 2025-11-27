import { defineType } from "sanity";

export default defineType({
  name: "backgroundColorAnnotation",
  title: "Background Color",
  type: "object",
  fields: [
    {
      name: "value",
      type: "simplerColor",
      title: "Color",
    },
  ],
});
