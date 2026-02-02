'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

export const ColorPickerField = ({ field, path, readOnly }) => {
  const { value, setValue } = useField({ path })

  const handleColorChange = (e) => {
    setValue(e.target.value)
  }

  const handleHexChange = (e) => {
    const hex = e.target.value
    // Allow partial hex values while typing
    if (hex === '' || hex.match(/^#[0-9A-Fa-f]{0,6}$/)) {
      setValue(hex)
    }
  }

  return (
    <div className="field-type">
      <label className="field-label">{field.label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="color"
          value={value && value.match(/^#[0-9A-Fa-f]{6}$/) ? value : '#000000'}
          onChange={handleColorChange}
          disabled={readOnly}
          style={{
            width: '50px',
            height: '40px',
            border: '2px solid #ccc',
            borderRadius: '6px',
            cursor: readOnly ? 'default' : 'pointer',
            backgroundColor: 'transparent'
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={handleHexChange}
          placeholder="#000000"
          disabled={readOnly}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            width: '100px',
            backgroundColor: readOnly ? '#f5f5f5' : 'white'
          }}
        />
      </div>
    </div>
  )
}