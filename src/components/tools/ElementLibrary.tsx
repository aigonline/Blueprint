
'use client';

import { Shapes, Image as ImageIcon, Type, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DesignElement } from '@/types/blueprint';
import { useToast } from '@/hooks/use-toast';

interface ElementLibraryProps {
  onAddElement: (elementSchema: Omit<DesignElement, 'id'>) => void;
}

export function ElementLibrary({ onAddElement }: ElementLibraryProps) {
  const { toast } = useToast();

  const getDefaultElementPosition = () => ({ x: 450, y: 450 }); // Center of 1000x1000 canvas

  const handleAddText = () => {
    onAddElement({
      type: 'text',
      position: getDefaultElementPosition(),
      size: { width: 150, height: 50 },
      content: 'New Text',
      style: { fontFamily: 'Inter, sans-serif', fontSize: '24px', color: '#333333', textAlign: 'center' },
    });
    toast({ title: 'Text Element Added', description: 'A new text element has been added to the canvas.' });
  };

  const handleAddShape = () => {
    onAddElement({
      type: 'shape',
      position: getDefaultElementPosition(),
      size: { width: 100, height: 100 },
      style: { backgroundColor: '#cccccc', borderRadius: '0px', opacity: 1 },
    });
    toast({ title: 'Shape Element Added', description: 'A new shape element has been added to the canvas.' });
  };
  
  const handleAddImagePlaceholder = () => {
     onAddElement({
      type: 'image',
      position: getDefaultElementPosition(),
      size: { width: 200, height: 150 },
      source: `https://placehold.co/200x150.png`,
      content: 'Placeholder image',
      style: {},
    });
    toast({ title: 'Image Placeholder Added', description: 'A placeholder image has been added. Update its source in the properties panel.' });
  };


  const elements = [
    { name: 'Text', icon: Type, action: handleAddText, disabled: false },
    { name: 'Shape', icon: Shapes, action: handleAddShape, disabled: false },
    { name: 'Image', icon: ImageIcon, action: handleAddImagePlaceholder, disabled: false },
    { name: 'Icons', icon: Smile, action: () => toast({title: "Coming Soon!", description: "Icon library is not yet implemented."}), disabled: true },
  ];

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <h2 className="text-xl font-semibold font-headline mb-2">Elements</h2>
      <div className="grid grid-cols-2 gap-3">
        {elements.map((element) => (
          <Button
            key={element.name}
            variant="outline"
            className="flex flex-col items-center justify-center h-24 p-2 text-center shadow-sm hover:shadow-md transition-shadow"
            onClick={element.action}
            disabled={element.disabled}
          >
            <element.icon className={`w-8 h-8 mb-2 ${element.disabled ? 'text-muted-foreground' : 'text-primary'}`} />
            <span className={`text-xs ${element.disabled ? 'text-muted-foreground' : ''}`}>{element.name}</span>
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-auto pt-4">
        Click an element to add it to the canvas.
      </p>
    </div>
  );
}
