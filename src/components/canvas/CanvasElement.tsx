'use client';

import type { DesignElement } from '@/types/blueprint';
import Image from 'next/image';

interface CanvasElementProps {
  element: DesignElement;
  scale: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CanvasElement({ element, scale, isSelected, onClick }: CanvasElementProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position.x * scale}px`,
    top: `${element.position.y * scale}px`,
    width: `${element.size.width * scale}px`,
    height: `${element.size.height * scale}px`,
    boxSizing: 'border-box',
    border: isSelected ? '2px solid hsl(var(--accent))' : '1px dashed hsl(var(--border))',
    transition: 'border 0.2s ease-in-out',
    ...element.style, // Spread AI-provided styles
  };

  // Ensure specific styles from AI are applied correctly
  if (element.style?.fontFamily) style.fontFamily = element.style.fontFamily as string;
  if (element.style?.fontSize) style.fontSize = `${parseFloat(element.style.fontSize as string) * scale}px`; // Scale font size
  if (element.style?.color) style.color = element.style.color as string;
  if (element.style?.backgroundColor) style.backgroundColor = element.style.backgroundColor as string;
  if (element.style?.textAlign) style.textAlign = element.style.textAlign as React.CSSProperties['textAlign'];

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to canvas if elements overlap
    onClick();
  };

  switch (element.type) {
    case 'text':
      return (
        <div style={style} onClick={handleElementClick} className="flex items-center justify-center p-1 overflow-hidden">
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{element.content}</span>
        </div>
      );
    case 'image':
      return (
        <div style={style} onClick={handleElementClick} className="overflow-hidden">
          <Image
            src={element.source && element.source !== "https://example.com/image.jpg" ? element.source : `https://placehold.co/${Math.round(element.size.width)}x${Math.round(element.size.height)}.png`}
            alt={element.content || 'Design image'}
            width={element.size.width * scale}
            height={element.size.height * scale}
            className="object-cover w-full h-full"
            data-ai-hint="graphic design"
          />
        </div>
      );
    case 'shape':
      return (
        <div style={style} onClick={handleElementClick}>
          {/* Content for shape can be inside if needed, or just rely on background styles */}
        </div>
      );
    default:
      return (
        <div style={{...style, border:'1px dashed red'}} onClick={handleElementClick}>
          <span className="text-xs">Unknown type: {element.type}</span>
        </div>
      );
  }
}
