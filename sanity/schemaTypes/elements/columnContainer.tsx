import { defineType } from "sanity";

export default defineType({
  name: "columnContainer",
  title: "Column Container",
  type: "object",
  fieldsets: [
    {
      name: "background",
      title: "Background",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    {
      name: "content",
      title: "Content",
      type: "richText",
      initialValue: [],
    },
    {
      name: "textColor",
      title: "Text Color",
      type: "string",
      options: {
        list: [
          { title: "Dark", value: "dark" },
          { title: "Light", value: "light" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    },
    {
      name: "contentAlignment",
      title: "Content Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    },
    {
      name: "backgroundColor",
      type: "customColor",
      title: "Background Color",
      fieldset: "background",
    },
    {
      name: "backgroundImage",
      type: "image",
      title: "Background Image",
      fieldset: "background",
      options: { hotspot: true },
    },
    {
      name: "collageItems",
      title: "Collage Items",
      type: "array",
      of: [{ type: "collageItem" }],
      description: "Images that overlay on background, behind content",

    },
  ],
});
