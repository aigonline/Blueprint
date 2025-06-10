
'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import React, { useRef } from 'react'; // Added useRef
import { useToast } from '@/hooks/use-toast'; // Added useToast

interface ImageEditorProps {
  element: DesignElement & { type: 'image' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function ImageEditor({ element, onUpdateElement }: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateElement({ ...element, source: e.target.value });
  };

  const handleImageUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (e.g., PNG, JPG, GIF).',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateElement({ ...element, source: reader.result as string });
        toast({
          title: 'Image Uploaded',
          description: `${file.name} has been set as the image source.`,
        });
      };
      reader.onerror = () => {
        toast({
          title: 'File Read Error',
          description: 'Could not read the selected file.',
          variant: 'destructive',
        });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input to allow uploading the same file again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`image-source-${element.id}`} className="text-sm font-medium">Image URL</Label>
        <Input
          id={`image-source-${element.id}`}
          value={element.source || ''}
          onChange={handleSourceChange}
          placeholder="https://example.com/image.png or upload"
          className="mt-1"
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button variant="outline" onClick={handleImageUploadButtonClick} className="w-full">
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload Image from Device
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Or paste an image URL above.
      </p>
    </div>
  );
}
