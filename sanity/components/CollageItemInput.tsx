import React, { useState, useRef, useCallback } from 'react';
import { ObjectInputProps, set, unset } from 'sanity';
import { Stack, Card, Text, Button, Flex } from '@sanity/ui';

export function CollageItemInput(props: ObjectInputProps) {
  const { value, onChange, renderDefault } = props;
  const [aspectRatio, setAspectRatio] = useState<'desktop' | 'mobile'>('desktop');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, itemX: 0, itemY: 0, itemW: 0, itemH: 0 });

  const position = aspectRatio === 'desktop' ? value?.position : value?.mobilePosition;
  const imageUrl = value?.image?.asset?._ref 
    ? `https://cdn.sanity.io/images/mttfjag0/production/${value.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
    : null;

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'drag' | 'resize') => {
    if (!containerRef.current || !position) return;
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: position.x || 10,
      itemY: position.y || 10,
      itemW: position.width || 30,
      itemH: position.height || 30,
    };

    if (type === 'drag') setIsDragging(true);
    else setIsResizing(true);
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || (!isDragging && !isResizing)) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - startPos.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - startPos.current.y) / rect.height) * 100;

    if (isDragging) {
      const newX = Math.max(0, Math.min(100, startPos.current.itemX + deltaX));
      const newY = Math.max(0, Math.min(100, startPos.current.itemY + deltaY));
      
      const posField = aspectRatio === 'desktop' ? 'position' : 'mobilePosition';
      onChange(set({ ...position, x: Math.round(newX), y: Math.round(newY) }, [posField]));
    } else if (isResizing) {
      const newW = Math.max(5, Math.min(100, startPos.current.itemW + deltaX));
      const newH = Math.max(5, Math.min(100, startPos.current.itemH + deltaY));
      
      const posField = aspectRatio === 'desktop' ? 'position' : 'mobilePosition';
      onChange(set({ ...position, width: Math.round(newW), height: Math.round(newH) }, [posField]));
    }
  }, [isDragging, isResizing, aspectRatio, position, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <Stack space={4}>
      {renderDefault(props)}
      
      {imageUrl && position && (
        <Card padding={4} border>
          <Stack space={3}>
            <Flex gap={2}>
              <Button
                mode={aspectRatio === 'desktop' ? 'default' : 'ghost'}
                text="Desktop (16:9)"
                onClick={() => setAspectRatio('desktop')}
                fontSize={1}
              />
              <Button
                mode={aspectRatio === 'mobile' ? 'default' : 'ghost'}
                text="Mobile (9:16)"
                onClick={() => setAspectRatio('mobile')}
                fontSize={1}
              />
            </Flex>
            
            <div
              ref={containerRef}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: aspectRatio === 'desktop' ? '16/9' : '9/16',
                backgroundColor: '#f0f0f0',
                border: '2px solid #ccc',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'default',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  width: `${position.width}%`,
                  height: `${position.height}%`,
                  border: '2px solid #3D9BE9',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -4,
                    bottom: -4,
                    width: 12,
                    height: 12,
                    backgroundColor: '#3D9BE9',
                    cursor: 'nwse-resize',
                    border: '2px solid white',
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />
              </div>
            </div>
            
            <Text size={1} muted>
              Drag to move, drag corner to resize. Position: {position.x}%, {position.y}% | Size: {position.width}% × {position.height}%
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
