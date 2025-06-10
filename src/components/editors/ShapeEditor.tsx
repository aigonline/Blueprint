'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ShapeEditorProps {
  element: DesignElement & { type: 'shape' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function ShapeEditor({ element, onUpdateElement }: ShapeEditorProps) {
  const handleStyleChange = (property: keyof React.CSSProperties, value: string) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`shape-bgcolor-${element.id}`} className="text-sm font-medium">Background Color</Label>
        <Input
          id={`shape-bgcolor-${element.id}`}
          type="color"
          value={(element.style?.backgroundColor as string) || '#cccccc'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="mt-1 h-10 p-1"
        />
      </div>
      <div>
        <Label htmlFor={`shape-bordercolor-${element.id}`} className="text-sm font-medium">Border Color</Label>
        <Input
          id={`shape-bordercolor-${element.id}`}
          type="color"
          value={(element.style?.borderColor as string) || '#333333'}
          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
          className="mt-1 h-10 p-1"
        />
      </div>
       <div>
        <Label htmlFor={`shape-borderwidth-${element.id}`} className="text-sm font-medium">Border Width (px)</Label>
        <Input
          id={`shape-borderwidth-${element.id}`}
          type="number"
          min="0"
          value={element.style?.borderWidth ? parseFloat(element.style.borderWidth as string) : '1'}
          onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
          className="mt-1"
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        More shape properties like border radius, opacity, etc. (Coming Soon)
      </p>
    </div>
  );
}
