import { defineType } from "sanity";

export default defineType({
  name: "pageSectionContainer",
  title: "Page Section Container",
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
      initialValue: "center",
    },
    {
      name: "maxWidth",
      title: "Content Max Width",
      type: "string",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "2/3 Width", value: "2/3" },
          { title: "1/2 Width", value: "1/2" },
          { title: "1/3 Width", value: "1/3" },
        ],
        layout: "radio",
      },
      initialValue: "full",
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
      title: "Background Image (Desktop)",
      fieldset: "background",
      options: { hotspot: true },
    },
    {
      name: "backgroundMobileImage",
      type: "image",
      title: "Background Image (Mobile)",
      description: "Optional vertical aspect ratio image for mobile",
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
