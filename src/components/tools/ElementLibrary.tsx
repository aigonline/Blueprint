'use client';

import { Shapes, Image as ImageIcon, Type, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ElementLibrary() {
  const elements = [
    { name: 'Text', icon: Type },
    { name: 'Shapes', icon: Shapes },
    { name: 'Images', icon: ImageIcon },
    { name: 'Icons', icon: Smile },
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
            disabled // Placeholder functionality
          >
            <element.icon className="w-8 h-8 mb-2 text-primary" />
            <span className="text-xs">{element.name}</span>
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-auto">
        Drag and drop elements onto your canvas. (Interaction coming soon)
      </p>
    </div>
  );
}
