'use client';

import { Canvas } from '@/components/canvas/Canvas';
import type { DesignLayout, DesignElement } from '@/types/blueprint';

interface CenterPanelProps {
  currentDesign: DesignLayout | null;
  selectedElementId: string | null;
  onSelectElement: (elementId: string |null) => void;
}

export function CenterPanel({ currentDesign, selectedElementId, onSelectElement }: CenterPanelProps) {
  return (
    <main className="flex-1 bg-background flex items-center justify-center overflow-auto h-full">
      <Canvas 
        design={currentDesign} 
        selectedElementId={selectedElementId}
        onSelectElement={onSelectElement}
        className="w-full h-full max-w-full max-h-full"
      />
    </main>
  );
}
