
'use client';

import type { DesignElement } from '@/types/blueprint';
import { TextEditor } from './TextEditor';
import { ImageEditor } from './ImageEditor';
import { ShapeEditor } from './ShapeEditor';
import { GenericElementEditor } from './GenericElementEditor';
import { CanvasPropertiesEditor } from './CanvasPropertiesEditor'; // New Import
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings2, SquareAsterisk } from 'lucide-react'; // Added SquareAsterisk for Canvas

interface PropertiesEditorProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (updatedElement: DesignElement) => void;
  canvasBackgroundColor?: string;
  onUpdateCanvasBackgroundColor: (color: string) => void;
}

export function PropertiesEditor({ 
  selectedElement, 
  onUpdateElement,
  canvasBackgroundColor,
  onUpdateCanvasBackgroundColor
}: PropertiesEditorProps) {
  if (!selectedElement) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground mb-4">
            <Settings2 className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold font-headline">Properties</h3>
            <p className="text-sm mt-1">Select an element on the canvas to edit its properties.</p>
          </div>
          <CanvasPropertiesEditor 
            backgroundColor={canvasBackgroundColor} 
            onUpdateBackgroundColor={onUpdateCanvasBackgroundColor} 
          />
        </div>
      </ScrollArea>
    );
  }

  const renderEditor = () => {
    switch (selectedElement.type) {
      case 'text':
        return <TextEditor element={selectedElement as DesignElement & { type: 'text' }} onUpdateElement={onUpdateElement} />;
      case 'image':
        return <ImageEditor element={selectedElement as DesignElement & { type: 'image' }} onUpdateElement={onUpdateElement} />;
      case 'shape':
        return <ShapeEditor element={selectedElement as DesignElement & { type: 'shape' }} onUpdateElement={onUpdateElement} />;
      default:
        return <p className="text-sm text-muted-foreground">No specific editor for type: {selectedElement.type}</p>;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h3 className="text-lg font-semibold font-headline mb-1 capitalize">{selectedElement.type} Properties</h3>
        <p className="text-xs text-muted-foreground mb-4">ID: {selectedElement.id}</p>
        {renderEditor()}
        <GenericElementEditor element={selectedElement} onUpdateElement={onUpdateElement} />
      </div>
    </ScrollArea>
  );
}
