import React, { useState, useRef, useCallback } from 'react';
import { ArrayOfObjectsInputProps, set } from 'sanity';
import { Stack, Card, Button, Flex, Text } from '@sanity/ui';
import { AddIcon } from '@sanity/icons';

type CollageItem = {
  _key?: string;
  image?: {asset?: {_ref?: string}};
  position?: {x: number; y: number; width: number; height: number};
  mobilePosition?: {x: number; y: number; width: number; height: number};
};

export const CollageArrayInput = (props: ArrayOfObjectsInputProps) => {
  const { value = [], onChange, schemaType, renderDefault } = props;
  const [aspectRatio, setAspectRatio] = useState<'desktop' | 'mobile'>('desktop');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, itemX: 0, itemY: 0, itemW: 0, itemH: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number, type: 'drag' | 'resize') => {
    if (!containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    
    const item = value[index] as CollageItem;
    const position = aspectRatio === 'desktop' ? item?.position : item?.mobilePosition;
    if (!position) return;

    setActiveIndex(index);
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
  }, [value, aspectRatio]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || activeIndex === null || (!isDragging && !isResizing)) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - startPos.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - startPos.current.y) / rect.height) * 100;

    const item = value[activeIndex] as CollageItem;
    const position = aspectRatio === 'desktop' ? item?.position : item?.mobilePosition;
    const posField = aspectRatio === 'desktop' ? 'position' : 'mobilePosition';

    if (isDragging) {
      const newX = Math.max(0, Math.min(100, startPos.current.itemX + deltaX));
      const newY = Math.max(0, Math.min(100, startPos.current.itemY + deltaY));
      
      onChange(set({ ...position, x: Math.round(newX), y: Math.round(newY) }, [activeIndex, posField]));
    } else if (isResizing) {
      const newW = Math.max(5, Math.min(100, startPos.current.itemW + deltaX));
      const newH = Math.max(5, Math.min(100, startPos.current.itemH + deltaY));
      
      onChange(set({ ...position, width: Math.round(newW), height: Math.round(newH) }, [activeIndex, posField]));
    }
  }, [isDragging, isResizing, activeIndex, aspectRatio, value, onChange]);

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
      <Card padding={4} border>
        <Stack space={3}>
          <Flex gap={2} align="center">
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
            {value.map((item: CollageItem, index: number) => {
              const position = aspectRatio === 'desktop' ? item?.position : item?.mobilePosition;
              if (!position || !item?.image?.asset) return null;
              
              const imageUrl = item.image.asset._ref 
                ? `https://cdn.sanity.io/images/mttfjag0/production/${item.image.asset._ref.replace('image-', '').replace(/-png$/, '.png').replace(/-jpg$/, '.jpg').replace(/-jpeg$/, '.jpeg')}`
                : null;

              const isActive = activeIndex === index;

              return (
                <div
                  key={item._key || index}
                  style={{
                    position: 'absolute',
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: `${position.width}%`,
                    height: `${position.height}%`,
                    border: isActive ? '3px solid #3D9BE9' : '2px solid rgba(61, 155, 233, 0.5)',
                    cursor: isDragging && isActive ? 'grabbing' : 'grab',
                    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, index, 'drag')}
                  onClick={() => setActiveIndex(index)}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: -6,
                      bottom: -6,
                      width: 16,
                      height: 16,
                      backgroundColor: '#3D9BE9',
                      cursor: 'nwse-resize',
                      border: '2px solid white',
                      borderRadius: '50%',
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, index, 'resize');
                    }}
                  />
                </div>
              );
            })}
          </div>
          
          {activeIndex !== null && value[activeIndex] && (() => {
            const activeItem = value[activeIndex] as CollageItem;
            return (
              <Text size={1} muted>
                Selected: Item {activeIndex + 1} | Position: {aspectRatio === 'desktop' ? activeItem?.position?.x : activeItem?.mobilePosition?.x}%, {aspectRatio === 'desktop' ? activeItem?.position?.y : activeItem?.mobilePosition?.y}% | Size: {aspectRatio === 'desktop' ? activeItem?.position?.width : activeItem?.mobilePosition?.width}% × {aspectRatio === 'desktop' ? activeItem?.position?.height : activeItem?.mobilePosition?.height}%
              </Text>
            );
          })()}
        </Stack>
      </Card>
      
      {renderDefault(props)}
    </Stack>
  );
}
