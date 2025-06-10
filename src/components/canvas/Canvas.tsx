'use client';

import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { CanvasElement } from './CanvasElement';
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; // Added import

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
        // Maintain aspect ratio for a square canvas, fitting into available width
        const newScale = containerWidth / CANVAS_BASE_WIDTH;
        setScale(newScale);
        setCanvasSize({ width: CANVAS_BASE_WIDTH * newScale, height: CANVAS_BASE_HEIGHT * newScale });
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);
  
  const handleCanvasClick = () => {
    onSelectElement(null); // Deselect element when clicking on canvas background
  };

  return (
    <div ref={canvasContainerRef} className={cn("w-full h-full flex items-center justify-center bg-muted/50 p-4 overflow-hidden", className)}>
      <div
        className="relative bg-card shadow-lg"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
        onClick={handleCanvasClick}
      >
        {design && design.elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            scale={scale}
            isSelected={element.id === selectedElementId}
            onClick={() => onSelectElement(element.id)}
          />
        ))}
        {!design && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p>No design loaded. Use the AI tool or templates to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to generate unique IDs, to be used when processing AI response
export function addIdsToLayout(layout: Omit<DesignLayout, 'id' | 'elements'> & { elements: Omit<DesignElement, 'id'>[] }): DesignLayout {
  return {
    ...layout,
    id: crypto.randomUUID(),
    elements: layout.elements.map(el => ({ ...el, id: crypto.randomUUID() })),
  };
}

export function addIdsToElements(elements: Omit<DesignElement, 'id'>[]): DesignElement[] {
  return elements.map(el => ({ ...el, id: crypto.randomUUID() }));
}
