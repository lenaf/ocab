import { defineType } from "sanity";
import React from 'react';
import { buttonStyles } from '../colorPalette';

export default defineType({
  name: "richTextButton",
  title: "Button",
  type: "object",
  fields: [
    { name: "text", type: "string", title: "Text", validation: (Rule) => Rule.required() },
    { name: "link", type: "string", title: "Link", validation: (Rule) => Rule.required() },
    { 
      name: "variant", 
      type: "string", 
      title: "Style", 
      options: { 
        list: buttonStyles.map(s => ({ title: s.title, value: s.value })),
        layout: "radio"
      }, 
      initialValue: "primary" 
    },
    { 
      name: "size", 
      type: "string", 
      title: "Size", 
      options: { 
        list: [
          { title: "Small", value: "sm" }, 
          { title: "Default", value: "default" }, 
          { title: "Large", value: "lg" }
        ],
        layout: "radio"
      }, 
      initialValue: "default" 
    },
    { 
      name: "icon", 
      type: "string", 
      title: "Icon", 
      options: { 
        list: [
          { title: "None", value: "none" }, 
          { title: "Arrow Right", value: "arrow-right" }, 
          { title: "Arrow Left", value: "arrow-left" }, 
          { title: "Arrow Down", value: "arrow-down" }, 
          { title: "External Link", value: "external" }
        ],
        layout: "radio"
      }, 
      initialValue: "none" 
    },
  ],
  preview: {
    select: { 
      text: "text", 
      variant: "variant",
      link: "link"
    },
    prepare({ text, variant, link }) {
      const style = buttonStyles.find(s => s.value === variant) || buttonStyles[0]
      return {
        title: text || 'Button',
        subtitle: `${style.title} → ${link || '(no link)'}`,
      }
    }
  },
});
