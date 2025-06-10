
'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation'; // Added useRouter
import { AppHeader } from '@/components/shared/AppHeader';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { CenterPanel } from '@/components/layout/CenterPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { addIdsToElements } from '@/components/canvas/Canvas';
import { useAuth } from '@/context/AuthContext'; // Added useAuth
import { Loader2 } from 'lucide-react'; // Added Loader2

export default function BlueprintEditorPage() {
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const router = useRouter(); // Initialize router
  const [currentDesign, setCurrentDesign] = useState<DesignLayout | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!authLoading && !user) {
      router.push('/login?redirect=/blueprint');
    }
  }, [user, authLoading, router]);


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
        return {
          id: crypto.randomUUID(),
          description: 'New Design with Element',
          elements: [newElementWithId],
          canvasBackgroundColor: 'hsl(var(--card))',
        };
      }
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
  
  // Show a loading spinner while checking auth or if user is not yet available
  if (authLoading || !user) {
    return (
      <div className="flex flex-col h-screen max-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

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
