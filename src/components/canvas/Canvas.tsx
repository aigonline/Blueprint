
'use client';

import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { CanvasElement } from './CanvasElement';
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CanvasProps {
  design: DesignLayout | null;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  className?: string;
}

const CANVAS_BASE_WIDTH = 1000;
const CANVAS_BASE_HEIGHT = 1000;

export function Canvas({ design, selectedElementId, onSelectElement, className }: CanvasProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_BASE_WIDTH, height: CANVAS_BASE_HEIGHT });

  useEffect(() => {
    const calculateScale = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const newScale = containerWidth / CANVAS_BASE_WIDTH;
        setScale(newScale);
        setCanvasSize({ width: CANVAS_BASE_WIDTH * newScale, height: CANVAS_BASE_HEIGHT * newScale });
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  const canvasStyle: React.CSSProperties = {
    width: `${canvasSize.width}px`,
    height: `${canvasSize.height}px`,
    position: 'relative', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', 
  };

  if (design?.canvasBackgroundColor) {
    canvasStyle.backgroundColor = design.canvasBackgroundColor;
  } else {
    canvasStyle.backgroundColor = 'hsl(var(--card))'; 
  }


  return (
    <div 
      ref={canvasContainerRef} 
      className={cn("w-full h-full flex items-center justify-center bg-muted/50 p-4 overflow-hidden", className)}
    >
      <div
        style={canvasStyle}
        onClick={handleCanvasClick}
      >
        {design && design.elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            scale={scale}
            isSelected={element.id === selectedElementId}
            onClick={(e) => {
              e.stopPropagation(); 
              onSelectElement(element.id);
            }}
          />
        ))}
        {!design && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p>No design loaded. Use the AI tool or templates to start.</p>
          </div>
        )}
        {design && design.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p>Canvas is blank. Add elements or use AI to generate a design.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function addIdsToLayout(layout: Omit<DesignLayout, 'id' | 'elements' | 'canvasBackgroundColor'> & { elements: Omit<DesignElement, 'id'>[] }): DesignLayout {
  return {
    ...layout,
    id: crypto.randomUUID(),
    elements: layout.elements.map(el => ({ ...el, id: crypto.randomUUID() })),
    canvasBackgroundColor: layout.canvasBackgroundColor || 'hsl(var(--card))', 
  };
}

export function addIdsToElements(elements: Omit<DesignElement, 'id'>[]): DesignElement[] {
  return elements.map(el => ({ ...el, id: crypto.randomUUID() }));
}
