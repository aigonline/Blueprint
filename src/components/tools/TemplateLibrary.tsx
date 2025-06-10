
'use client';

import { LayoutDashboard, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { DesignLayout as ClientDesignLayout, DesignElement } from '@/types/blueprint';
import { addIdsToLayout } from '@/components/canvas/Canvas';
import { useToast } from '@/hooks/use-toast';

interface TemplateLibraryProps {
  onLayoutSelect: (layout: ClientDesignLayout) => void;
}

const predefinedTemplates: (Omit<ClientDesignLayout, 'id' | 'elements'> & { elements: Omit<DesignElement, 'id'>[], canvasBackgroundColor?: string })[] = [
  {
    description: "Simple Title and Subtitle",
    canvasBackgroundColor: "#FFFFFF",
    elements: [
      { type: "text", position: { x: 50, y: 100 }, size: { width: 900, height: 100 }, content: "Main Title", style: { fontSize: "72px", fontWeight: "bold", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" } },
      { type: "text", position: { x: 100, y: 220 }, size: { width: 800, height: 50 }, content: "A catchy subtitle goes here.", style: { fontSize: "24px", textAlign: "center", fontFamily: "Inter, sans-serif" } }
    ]
  },
  {
    description: "Image with a Caption",
    canvasBackgroundColor: "#F0F0F0",
    elements: [
      { type: "image", position: { x: 100, y: 100 }, size: { width: 800, height: 600 }, source: "https://placehold.co/800x600.png", style: { }, content: "placeholder image" }, // Added content for alt text
      { type: "text", position: { x: 100, y: 720 }, size: { width: 800, height: 50 }, content: "Image Caption Text", style: { fontSize: "18px", textAlign: "center", fontFamily: "Inter, sans-serif" } }
    ]
  },
  {
    description: "Basic Three Column Layout",
    canvasBackgroundColor: "#E6E6FA",
    elements: [
      { type: "text", position: { x: 50, y: 50 }, size: { width: 900, height: 50 }, content: "Three Column Section", style: { fontSize: "36px", fontWeight: "bold", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" } },
      { type: "shape", position: { x: 50, y: 150 }, size: { width: 280, height: 700 }, style: { backgroundColor: "#D3D3D3", borderRadius: "8px" } },
      { type: "text", position: { x: 60, y: 160 }, size: { width: 260, height: 50 }, content: "Column 1", style: { fontSize: "20px", textAlign: "center" } },
      { type: "shape", position: { x: 360, y: 150 }, size: { width: 280, height: 700 }, style: { backgroundColor: "#C0C0C0", borderRadius: "8px" } },
      { type: "text", position: { x: 370, y: 160 }, size: { width: 260, height: 50 }, content: "Column 2", style: { fontSize: "20px", textAlign: "center" } },
      { type: "shape", position: { x: 670, y: 150 }, size: { width: 280, height: 700 }, style: { backgroundColor: "#A9A9A9", borderRadius: "8px" } },
      { type: "text", position: { x: 680, y: 160 }, size: { width: 260, height: 50 }, content: "Column 3", style: { fontSize: "20px", textAlign: "center" } }
    ]
  }
];


export function TemplateLibrary({ onLayoutSelect }: TemplateLibraryProps) {
  const { toast } = useToast();

  const handleSelectTemplate = (templateSchema: Omit<ClientDesignLayout, 'id' | 'elements'> & { elements: Omit<DesignElement, 'id'>[], canvasBackgroundColor?: string }) => {
    const layoutWithIds = addIdsToLayout(templateSchema);
    // Ensure image elements have data-ai-hint for placeholders
    layoutWithIds.elements = layoutWithIds.elements.map(el => {
      if (el.type === 'image' && el.source && el.source.startsWith('https://placehold.co')) {
        return { ...el, style: { ...el.style, ['data-ai-hint' as any]: 'illustration' } };
      }
      return el;
    });
    onLayoutSelect(layoutWithIds);
    toast({ title: "Template Loaded", description: `"${layoutWithIds.description}" has been loaded onto the canvas.` });
  };
  
  if (predefinedTemplates.length === 0) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-muted-foreground">
        <LayoutDashboard className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold font-headline">Template Library</h2>
        <p className="text-sm text-center mt-2">
          No templates available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <h2 className="text-xl font-semibold font-headline mb-2">Templates</h2>
      <div className="grid grid-cols-1 gap-4 overflow-y-auto flex-grow pr-2">
        {predefinedTemplates.map((template, index) => (
          <Card key={index} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-md font-headline leading-tight">{template.description}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs pt-0 pb-3">
              <CardDescription>{template.elements.length} elements. Canvas: {template.canvasBackgroundColor || 'Default'}</CardDescription>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectTemplate(template)}
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Use this Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
