'use client'

import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

interface ColorSelectFieldProps {
  field: { label: string }
  path: string
}

interface BrandColor {
  id: string
  name: string
  hexValue: string
}

export const ColorSelectField = ({ field, path }: ColorSelectFieldProps) => {
  const { value, setValue } = useField({ path })
  const [colors, setColors] = useState<BrandColor[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetch('/api/brand-colors?limit=100')
      .then(res => res.json())
      .then(data => setColors(data.docs || []))
  }, [])

  const selectedColor = colors.find(c => c.id === value)

  return (
    <div className="field-type" style={{ position: 'relative' }}>
      <label className="field-label">{field.label}</label>
      
      {/* Selected value display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {selectedColor ? (
          <>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: selectedColor.hexValue,
              border: '1px solid #ddd',
              borderRadius: '3px',
            }} />
            <span>{selectedColor.name}</span>
            <span style={{ color: '#999', fontSize: '12px' }}>({selectedColor.hexValue})</span>
          </>
        ) : (
          <span style={{ color: '#999' }}>Select a color...</span>
        )}
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {colors.map(color => (
              <div
                key={color.id}
                onClick={() => {
                  setValue(color.id)
                  setIsOpen(false)
                }}
                style={{
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: value === color.id ? '#f0f0f0' : 'white',
                  borderBottom: '1px solid #eee',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === color.id ? '#f0f0f0' : 'white'}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color.hexValue,
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  flexShrink: 0,
                }} />
                <span style={{ fontWeight: value === color.id ? '600' : '400' }}>{color.name}</span>
                <span style={{ color: '#999', fontSize: '12px', marginLeft: 'auto' }}>{color.hexValue}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
