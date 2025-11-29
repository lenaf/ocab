import {defineType} from 'sanity'
import React from 'react'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'pageSectionContainer',
})

export default defineType({
  name: 'heroCarouselSection',
  title: 'Hero Carousel Section',
  type: 'object',
  fields: [
    {
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [{type: 'heroSlide'}],
    },
  ],
  preview: {
    select: {
      slides: 'slides',
      firstImage: 'slides.0.backgroundImage',
      firstColor: 'slides.0.backgroundColor.value',
    },
    prepare({slides, firstImage, firstColor}) {
      const count = slides?.length || 0
      const firstSlide = slides?.[0]
      const firstBlock = firstSlide?.content?.find((block: {_type: string}) => block._type === 'block') as {children?: Array<{text?: string}>} | undefined
      const text = firstBlock?.children?.map((child) => child.text).join('') || ''
      return {
        title: `Hero Carousel (${count})`,
        subtitle: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
        media: firstImage || (firstColor ? () => <div style={{backgroundColor: firstColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>🎬</div> : () => '🎬'),
      }
    },
  },
})
