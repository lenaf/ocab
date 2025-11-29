import {defineType} from 'sanity'
import React from 'react'

export default defineType({
  name: 'fullWidthSection',
  title: 'Full Width Section',
  type: 'object',
  fields: [
    {name: 'container', title: 'Container', type: 'pageSectionContainer'},
  ],
  preview: {
    select: {
      content: 'container.content',
      bgImage: 'container.backgroundImage',
      bgColor: 'container.backgroundColor.value',
    },
    prepare({content, bgImage, bgColor}) {
      const firstBlock = content?.find((block: {_type: string}) => block._type === 'block') as {children?: Array<{text?: string}>} | undefined
      const text = firstBlock?.children?.map((child) => child.text).join('') || ''
      return {
        title: 'Full Width',
        subtitle: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
        media: bgImage || (bgColor ? () => <div style={{backgroundColor: bgColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>📝</div> : () => '📝'),
      }
    },
  },
})
