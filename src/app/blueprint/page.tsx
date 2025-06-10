
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { CenterPanel } from '@/components/layout/CenterPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
// Removed Metadata import as it's handled in layout.tsx

export default function BlueprintEditorPage() {
  const [currentDesign, setCurrentDesign] = useState<DesignLayout | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleLayoutSelect = (layout: DesignLayout | null) => {
    setCurrentDesign(layout);
    setSelectedElementId(null); // Deselect any element when a new layout is chosen
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

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 min-h-0"> {/* min-h-0 is crucial for flex children to scroll correctly */}
        <LeftPanel onLayoutSelect={handleLayoutSelect} />
        <CenterPanel 
          currentDesign={currentDesign} 
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement} 
        />
        <RightPanel 
          selectedElement={getSelectedElement()}
          onUpdateElement={handleUpdateElement}
        />
      </div>
    </div>
  );
}
