'use client'

import { useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import type { BrandColor } from '@/payload-types'

export const ButtonPreview = () => {
  const [colors, setColors] = useState<Record<string, BrandColor>>({})
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorSettings = useFormFields(([fields]) => fields.colorSettings?.value) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const borderSettings = useFormFields(([fields]) => fields.borderSettings?.value) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shapeSettings = useFormFields(([fields]) => fields.shapeSettings?.value) as any

  useEffect(() => {
    fetch('/api/brand-colors?limit=100')
      .then(res => res.json())
      .then(data => {
        const colorMap: Record<string, BrandColor> = {}
        data.docs?.forEach((color: BrandColor) => {
          colorMap[color.id] = color
        })
        setColors(colorMap)
      })
  }, [])

  const bgColorId = colorSettings?.backgroundColor
  const textColorId = colorSettings?.textColor
  const borderColorId = borderSettings?.borderColor
  
  const bgColor = colors[bgColorId]?.hexValue || '#3D9BE9'
  const textColor = colors[textColorId]?.hexValue || '#ffffff'
  const borderColor = colors[borderColorId]?.hexValue || 'transparent'
  const borderWidth = borderSettings?.borderWidth || 0
  const borderRadius = shapeSettings?.borderRadius || '8'

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <button
          style={{
            backgroundColor: bgColor,
            color: textColor,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: borderRadius === '999' ? '999px' : `${borderRadius}px`,
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Preview Button
        </button>
      </div>
    </div>
  )
}
