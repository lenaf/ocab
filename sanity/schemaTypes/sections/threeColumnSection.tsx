import { defineType } from "sanity";
import React from 'react';

export default defineType({
  name: "threeColumnSection",
  title: "Three Column Section",
  type: "object",
  fields: [
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
        layout: "radio",
      },
      initialValue: "1-1-1",
    },
    {name: "column1", title: "Column 1", type: "columnContainer"},
    {name: "column2", title: "Column 2", type: "columnContainer"},
    {name: "column3", title: "Column 3", type: "columnContainer"},
  ],
  preview: {
    select: { 
      col1: "column1.content",
      col2: "column2.content",
      col3: "column3.content",
      col1Image: "column1.backgroundImage",
      col1Color: "column1.backgroundColor.value",
    },
    prepare({ col1, col2, col3, col1Image, col1Color }) {
      const getFirstText = (content: Array<{_type: string; children?: Array<{text?: string}>}> | undefined) => {
        const firstBlock = content?.find((block) => block._type === 'block')
        return firstBlock?.children?.map((child) => child.text).join('') || ''
      }
      const texts = [col1, col2, col3].map(c => getFirstText(c).slice(0, 20)).filter(Boolean)
      return {
        title: 'Three Column',
        subtitle: texts.join(' | '),
        media: col1Image || (col1Color ? () => <div style={{backgroundColor: col1Color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>📋</div> : () => '📋'),
      };
    },
  },
});
