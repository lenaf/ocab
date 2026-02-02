'use client'

import type { ButtonVariant } from '@/payload-types'

interface ButtonPreviewCellProps {
  cellData: any
  rowData: ButtonVariant
}

export const ButtonPreviewCell = ({ cellData, rowData }: ButtonPreviewCellProps) => {
  const bgColor = typeof rowData?.colorSettings?.backgroundColor === 'object' 
    ? rowData.colorSettings.backgroundColor?.hexValue 
    : undefined
  const textColor = typeof rowData?.colorSettings?.textColor === 'object'
    ? rowData.colorSettings.textColor?.hexValue
    : rowData?.colorSettings?.textColor
  const borderColor = typeof rowData?.borderSettings?.borderColor === 'object'
    ? rowData.borderSettings.borderColor?.hexValue
    : undefined
  const borderWidth = rowData?.borderSettings?.borderWidth || 0
  const borderRadius = rowData?.shapeSettings?.borderRadius || '8'

  return (
    <button
      style={{
        backgroundColor: bgColor || '#3D9BE9',
        color: textColor || '#ffffff',
        border: `${borderWidth}px solid ${borderColor || 'transparent'}`,
        borderRadius: `${borderRadius}px`,
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'default',
      }}
    >
      Preview
    </button>
  )
}
