
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { CenterPanel } from '@/components/layout/CenterPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
import type { Metadata } from 'next';

// Note: 'export const metadata' only works in Server Components.
// For client components, metadata should be handled in a parent layout or page.
// However, Next.js might pick this up if this file is treated as a route entry point.
// For robust metadata, ensure it's in a server component (e.g., layout.tsx for this route).
// Since this is the main page for /blueprint, we can define it here.
// However, for client components, it's better to set dynamic titles via `document.title` or a context.
// For static metadata, it's typically defined in a `layout.tsx` or a server `page.tsx`.
// For now, we'll keep it simple as if it were a server component for metadata purposes.

// This is a workaround for Client Component metadata.
// Ideally, this page would be a Server Component if static metadata is primary.
// Or, metadata would be in a `src/app/blueprint/layout.tsx`.
export function generateMetadata(): Metadata {
  return {
    title: 'Blueprint Editor | AI Design Tool',
    description: 'Create and edit your designs using the Blueprint AI-powered editor.',
  };
}


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
