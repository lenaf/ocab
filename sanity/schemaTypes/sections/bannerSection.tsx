import { defineType } from "sanity";
import React from 'react';

export default defineType({
  name: "bannerSection",
  title: "Banner Section",
  type: "object",
  fields: [
    {
      name: "backgroundColor",
      title: "Background Color",
      type: "customColor",
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
      initialValue: [],
    },
  ],
  preview: {
    select: {
      content: 'content',
      bgImage: 'backgroundImage',
      bgColor: 'backgroundColor.value',
    },
    prepare({content, bgImage, bgColor}) {
      const firstBlock = content?.find((block: {_type: string}) => block._type === 'block') as {children?: Array<{text?: string}>} | undefined
      const text = firstBlock?.children?.map((child) => child.text).join('') || ''
      return {
        title: 'Banner',
        subtitle: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
        media: bgImage || (bgColor ? () => <div style={{backgroundColor: bgColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>🏷️</div> : () => '🏷️'),
      };
    },
  },
});
