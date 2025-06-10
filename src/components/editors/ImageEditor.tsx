'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

interface ImageEditorProps {
  element: DesignElement & { type: 'image' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function ImageEditor({ element, onUpdateElement }: ImageEditorProps) {
  
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateElement({ ...element, source: e.target.value });
  };

  // Placeholder for image upload functionality
  const handleImageUpload = () => {
    alert("Image upload functionality coming soon!");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`image-source-${element.id}`} className="text-sm font-medium">Image URL</Label>
        <Input
          id={`image-source-${element.id}`}
          value={element.source || ''}
          onChange={handleSourceChange}
          placeholder="https://example.com/image.png"
          className="mt-1"
        />
      </div>
      <Button variant="outline" onClick={handleImageUpload} className="w-full">
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload Image
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Basic editing like cropping and resizing will be available here. (Coming Soon)
      </p>
    </div>
  );
}
