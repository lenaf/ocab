import { defineType } from "sanity";
import React from 'react';

export default defineType({
  name: "twoColumnSection",
  title: "Two Column Section",
  type: "object",
  fields: [
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
        layout: "radio",
      },
      initialValue: "1-1",
    },
    {name: "leftColumn", title: "Left Column", type: "columnContainer"},
    {name: "rightColumn", title: "Right Column", type: "columnContainer"},
  ],
  preview: {
    select: { 
      leftContent: "leftColumn.content",
      rightContent: "rightColumn.content",
      leftImage: "leftColumn.backgroundImage",
      leftColor: "leftColumn.backgroundColor.value",
    },
    prepare({ leftContent, rightContent, leftImage, leftColor }) {
      const getFirstText = (content: Array<{_type: string; children?: Array<{text?: string}>}> | undefined) => {
        const firstBlock = content?.find((block) => block._type === 'block')
        return firstBlock?.children?.map((child) => child.text).join('') || ''
      }
      const left = getFirstText(leftContent).slice(0, 30)
      const right = getFirstText(rightContent).slice(0, 30)
      return {
        title: 'Two Column',
        subtitle: `${left} | ${right}`,
        media: leftImage || (leftColor ? () => <div style={{backgroundColor: leftColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>📋</div> : () => '📋'),
      };
    },
  },
});
