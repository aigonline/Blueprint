'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateBlueprintLayout, type GenerateDesignLayoutOutput } from '@/lib/actions';
import type { DesignLayout as ClientDesignLayout } from '@/types/blueprint';
import { Wand2, Loader2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addIdsToLayout } from '@/components/canvas/Canvas'; // Helper for adding IDs

interface AiDesignToolProps {
  onLayoutSelect: (layout: ClientDesignLayout) => void;
}

export function AiDesignTool({ onLayoutSelect }: AiDesignToolProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLayouts, setGeneratedLayouts] = useState<ClientDesignLayout[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({ title: "Prompt is empty", description: "Please enter a design prompt.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedLayouts([]);
    try {
      const result: GenerateDesignLayoutOutput = await generateBlueprintLayout({ prompt });
      if (result && result.layouts) {
        // Add client-side IDs to layouts and their elements
        const layoutsWithIds = result.layouts.map(layout => 
          addIdsToLayout(layout as Omit<ClientDesignLayout, 'id' | 'elements'> & { elements: Omit<ClientDesignLayout['elements'][0], 'id'>[] })
        );
        setGeneratedLayouts(layoutsWithIds);
        toast({ title: "Layouts Generated", description: `${layoutsWithIds.length} layouts created successfully.` });
      } else {
        toast({ title: "Generation Failed", description: "No layouts were returned by the AI.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating layout:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ title: "Generation Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="e.g., marketing material for a new bakery"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Designs
        </Button>
      </form>

      {generatedLayouts.length > 0 && (
        <ScrollArea className="flex-grow">
          <div className="space-y-3 pr-3">
            <h3 className="text-lg font-semibold font-headline">Generated Layouts</h3>
            {generatedLayouts.map((layout, index) => (
              <Card key={layout.id || index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline">Layout Option {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <CardDescription>{layout.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">{layout.elements.length} elements</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLayoutSelect(layout)}
                    className="w-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Use this Layout
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      {isLoading && generatedLayouts.length === 0 && (
         <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Generating layouts...</p>
         </div>
      )}
       {!isLoading && generatedLayouts.length === 0 && prompt && (
         <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground">
            <p>No layouts generated for this prompt yet.</p>
         </div>
       )}
    </div>
  );
}
