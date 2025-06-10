
'use client';

import type { DesignElement } from '@/types/blueprint';
import Image from 'next/image';

interface CanvasElementProps {
  element: DesignElement;
  scale: number;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void; // Pass event for stopPropagation
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
    transition: 'border 0.2s ease-in-out, transform 0.2s ease-in-out',
    cursor: 'pointer',
    ...element.style, // Spread AI-provided styles first
  };

  // Apply specific, potentially controlled styles
  if (element.style?.fontFamily) style.fontFamily = element.style.fontFamily as string;
  if (element.style?.fontSize) style.fontSize = `${parseFloat(element.style.fontSize as string) * scale}px`; // Scale font size
  if (element.style?.color) style.color = element.style.color as string;
  if (element.style?.backgroundColor) style.backgroundColor = element.style.backgroundColor as string;
  
  // Text-specific styles from editor
  if (element.style?.fontWeight) style.fontWeight = element.style.fontWeight;
  if (element.style?.letterSpacing) style.letterSpacing = element.style.letterSpacing;
  if (element.style?.lineHeight) style.lineHeight = element.style.lineHeight;
  if (element.style?.textAlign) style.textAlign = element.style.textAlign;
  if (element.style?.textShadow) style.textShadow = element.style.textShadow;

  // Generic styles from editor
  if (element.style?.zIndex) style.zIndex = Number(element.style.zIndex);
  if (element.style?.rotation) {
    style.transform = `${style.transform || ''} rotate(${element.style.rotation}deg)`;
  }
  

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onClick(e);
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
            width={Math.max(1, element.size.width * scale)} // Ensure width/height are at least 1
            height={Math.max(1, element.size.height * scale)}
            className="object-cover w-full h-full"
            data-ai-hint="graphic design"
            unoptimized={element.source?.startsWith('data:image/')} // Prevent optimization for data URIs
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
