
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { CenterPanel } from '@/components/layout/CenterPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { addIdsToElements } from '@/components/canvas/Canvas';

export default function BlueprintEditorPage() {
  const [currentDesign, setCurrentDesign] = useState<DesignLayout | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleLayoutSelect = (layout: DesignLayout | null) => {
    setCurrentDesign(layout);
    setSelectedElementId(null); 
  };

  const handleSelectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };
  
  const getSelectedElement = (): DesignElement | null => {
    if (!currentDesign || !selectedElementId) return null;
    return currentDesign.elements.find(el => el.id === selectedElementId) || null;
  };

  const handleUpdateElement = (updatedElement: DesignElement) => {
    setCurrentDesign(prevDesign => {
      if (!prevDesign) return null;
      return {
        ...prevDesign,
        elements: prevDesign.elements.map(el =>
          el.id === updatedElement.id ? updatedElement : el
        ),
      };
    });
  };

  const handleAddElement = (newElementSchema: Omit<DesignElement, 'id'>) => {
    const [newElementWithId] = addIdsToElements([newElementSchema]);
    setCurrentDesign(prevDesign => {
      if (!prevDesign) {
        // If there's no current design, create one with this new element
        return {
          id: crypto.randomUUID(),
          description: 'New Design with Element',
          elements: [newElementWithId],
          canvasBackgroundColor: 'hsl(var(--card))',
        };
      }
      // Add to existing design
      return {
        ...prevDesign,
        elements: [...prevDesign.elements, newElementWithId],
      };
    });
  };

  const handleUpdateCanvasBackgroundColor = (color: string) => {
    setCurrentDesign(prevDesign => {
      if (!prevDesign) return { id: crypto.randomUUID(), description: 'New Design', elements: [], canvasBackgroundColor: color };
      return {
        ...prevDesign,
        canvasBackgroundColor: color,
      };
    });
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <AppHeader currentDesign={currentDesign} />
      <div className="flex flex-1 min-h-0">
        <LeftPanel onLayoutSelect={handleLayoutSelect} onAddElement={handleAddElement} />
        <CenterPanel 
          currentDesign={currentDesign} 
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement} 
        />
        <RightPanel 
          selectedElement={getSelectedElement()}
          onUpdateElement={handleUpdateElement}
          canvasBackgroundColor={currentDesign?.canvasBackgroundColor}
          onUpdateCanvasBackgroundColor={handleUpdateCanvasBackgroundColor}
        />
      </div>
    </div>
  );
}
