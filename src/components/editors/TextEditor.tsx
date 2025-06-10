'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface TextEditorProps {
  element: DesignElement & { type: 'text' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function TextEditor({ element, onUpdateElement }: TextEditorProps) {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateElement({ ...element, content: e.target.value });
  };

  const handleStyleChange = (property: keyof React.CSSProperties, value: string) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = e.target.value;
    // Keep fontSize as string like "24px" for consistency with AI, but allow number input
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        fontSize: newSize ? `${parseFloat(newSize)}px` : undefined,
      },
    });
  };


  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`text-content-${element.id}`} className="text-sm font-medium">Content</Label>
        <Textarea
          id={`text-content-${element.id}`}
          value={element.content || ''}
          onChange={handleContentChange}
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`text-font-size-${element.id}`} className="text-sm font-medium">Font Size (px)</Label>
        <Input
          id={`text-font-size-${element.id}`}
          type="number"
          value={element.style?.fontSize ? parseFloat(element.style.fontSize as string) : ''}
          onChange={handleFontSizeChange}
          className="mt-1"
          placeholder="e.g., 24"
        />
      </div>
      <div>
        <Label htmlFor={`text-color-${element.id}`} className="text-sm font-medium">Color</Label>
        <Input
          id={`text-color-${element.id}`}
          type="color"
          value={(element.style?.color as string) || '#000000'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className="mt-1 h-10 p-1"
        />
      </div>
       <div>
        <Label htmlFor={`text-font-family-${element.id}`} className="text-sm font-medium">Font Family</Label>
        <Input
          id={`text-font-family-${element.id}`}
          type="text"
          value={(element.style?.fontFamily as string) || 'Inter'}
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          className="mt-1"
          placeholder="e.g., Inter, Arial"
        />
      </div>
    </div>
  );
}
