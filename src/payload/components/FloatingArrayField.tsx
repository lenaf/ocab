'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useFormFields, ArrayField, useForm } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'

export const FloatingArrayField: React.FC<any> = (props) => {
  const { path } = props
  const fields = useFormFields(([fields]) => fields)
  const { dispatchFields, setModified } = useForm()
  const config = useConfig()
  const [aspectRatio, setAspectRatio] = useState<'desktop' | 'mobile'>('desktop')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<Record<string, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0, itemX: 0, itemY: 0, itemW: 0, itemH: 0 })

  // Reconstruct array from flattened fields
  const arrayItems: any[] = []
  
  // Find all array items by looking for .id fields
  Object.keys(fields || {}).forEach(key => {
    const match = key.match(new RegExp(`^${path.replace(/\./g, '\\.')}\\.(\\d+)\\.image$`))
    if (match) {
      const index = parseInt(match[1])
      const itemPath = `${path}.${index}`
      arrayItems[index] = {
        id: fields[`${itemPath}.id`]?.value,
        image: fields[`${itemPath}.image`]?.value,
        position: {
          x: fields[`${itemPath}.position.x`]?.value ?? 10,
          y: fields[`${itemPath}.position.y`]?.value ?? 10,
          width: fields[`${itemPath}.position.width`]?.value ?? 200,
          height: fields[`${itemPath}.position.height`]?.value ?? 200,
        },
        mobilePosition: {
          x: fields[`${itemPath}.mobilePosition.x`]?.value ?? 10,
          y: fields[`${itemPath}.mobilePosition.y`]?.value ?? 10,
          width: fields[`${itemPath}.mobilePosition.width`]?.value ?? 200,
          height: fields[`${itemPath}.mobilePosition.height`]?.value ?? 200,
        },
      }
    }
  })
  
  // Filter out undefined entries
  const validItems = arrayItems.filter(item => item !== undefined)

  // Set media URLs
  useEffect(() => {
    const mediaIds = validItems.map(item => item?.image).filter(Boolean)
    mediaIds.forEach((id) => {
      if (!mediaFiles[id]) {
        setMediaFiles(prev => ({ ...prev, [id]: `/api/media/file/${id}` }))
      }
    })
  }, [validItems.map(i => i?.image).join(',')])

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number, type: 'drag' | 'resize') => {
    if (!containerRef.current) return
    e.preventDefault()
    e.stopPropagation()
    
    const item = arrayItems[index]
    const position = aspectRatio === 'desktop' ? item?.position : item?.mobilePosition
    if (!position) return

    setActiveIndex(index)
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: position.x || 10,
      itemY: position.y || 10,
      itemW: position.width || 200,
      itemH: position.height || 200,
    }

    if (type === 'drag') setIsDragging(true)
    else setIsResizing(true)
  }, [validItems, aspectRatio])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || activeIndex === null || (!isDragging && !isResizing)) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const deltaX = ((e.clientX - startPos.current.x) / rect.width) * 100
    const deltaY = ((e.clientY - startPos.current.y) / rect.height) * 100

    const posField = aspectRatio === 'desktop' ? 'position' : 'mobilePosition'
    const itemPath = `${path}.${activeIndex}.${posField}`

    if (isDragging) {
      const newX = Math.max(0, Math.min(100, startPos.current.itemX + deltaX))
      const newY = Math.max(0, Math.min(100, startPos.current.itemY + deltaY))
      
      dispatchFields({
        type: 'UPDATE',
        path: `${itemPath}.x`,
        value: Math.round(newX),
      })
      dispatchFields({
        type: 'UPDATE',
        path: `${itemPath}.y`,
        value: Math.round(newY),
      })
      setModified(true)
    } else if (isResizing) {
      const newW = Math.max(50, Math.min(500, startPos.current.itemW + (deltaX * rect.width / 100)))
      const newH = Math.max(50, Math.min(500, startPos.current.itemH + (deltaY * rect.height / 100)))
      
      dispatchFields({
        type: 'UPDATE',
        path: `${itemPath}.width`,
        value: Math.round(newW),
      })
      dispatchFields({
        type: 'UPDATE',
        path: `${itemPath}.height`,
        value: Math.round(newH),
      })
      setModified(true)
    }
  }, [isDragging, isResizing, activeIndex, aspectRatio, validItems, fields, path, dispatchFields])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  return (
    <div style={{ marginBottom: '1rem' }}>
      <ArrayField {...props} />
      
      {validItems.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setAspectRatio('desktop')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: aspectRatio === 'desktop' ? '#0070f3' : 'white',
                  color: aspectRatio === 'desktop' ? 'white' : '#666',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('mobile')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: aspectRatio === 'mobile' ? '#0070f3' : 'white',
                  color: aspectRatio === 'mobile' ? 'white' : '#666',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Mobile
              </button>
            </div>
            
            <div
              ref={containerRef}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: aspectRatio === 'desktop' ? '16/9' : '9/16',
                backgroundColor: '#fff',
                border: '2px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'default',
              }}
            >
              {validItems.map((item: any, index: number) => {
                const position = aspectRatio === 'desktop' ? item?.position : item?.mobilePosition
                if (!position) return null

                const isActive = activeIndex === index
                const imageUrl = item?.image ? mediaFiles[item.image] : null

                return (
                  <div
                    key={item.id || index}
                    style={{
                      position: 'absolute',
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      width: `${position.width}px`,
                      height: `${position.height}px`,
                      border: isActive ? '2px solid #0070f3' : '1px solid rgba(0, 112, 243, 0.3)',
                      cursor: isDragging && isActive ? 'grabbing' : 'grab',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '2px',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, index, 'drag')}
                    onClick={() => setActiveIndex(index)}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          pointerEvents: 'none',
                        }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '11px', color: '#999' }}>
                        {index + 1}
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        right: -5,
                        bottom: -5,
                        width: 12,
                        height: 12,
                        backgroundColor: '#0070f3',
                        cursor: 'nwse-resize',
                        border: '2px solid white',
                        borderRadius: '50%',
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        handleMouseDown(e, index, 'resize')
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          
          <details open style={{ marginTop: '0.75rem', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#666', userSelect: 'none' }}>
              {activeIndex !== null ? `Fine-tune Item ${activeIndex + 1}` : 'Fine-tune Position (select an item above)'}
            </summary>
            {activeIndex !== null && validItems[activeIndex] && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#333', marginBottom: '0.5rem' }}>Desktop Position</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>X (%)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.position?.x ?? 10}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.position.x`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>Y (%)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.position?.y ?? 10}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.position.y`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>W (px)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.position?.width ?? 200}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.position.width`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>H (px)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.position?.height ?? 200}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.position.height`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#333', marginBottom: '0.5rem' }}>Mobile Position</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>X (%)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.mobilePosition?.x ?? 10}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.mobilePosition.x`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>Y (%)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.mobilePosition?.y ?? 10}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.mobilePosition.y`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>W (px)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.mobilePosition?.width ?? 200}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.mobilePosition.width`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>H (px)</label>
                      <input
                        type="number"
                        value={validItems[activeIndex]?.mobilePosition?.height ?? 200}
                        onChange={(e) => dispatchFields({ type: 'UPDATE', path: `${path}.${activeIndex}.mobilePosition.height`, value: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.25rem', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </details>
        </div>
      )}
    </div>
  )
}
