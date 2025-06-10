
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateBlueprintLayout, type GenerateDesignLayoutOutput } from '@/lib/actions';
import type { DesignLayout as ClientDesignLayout } from '@/types/blueprint';
import { Wand2, Loader2, Eye, FilePlus2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addIdsToLayout } from '@/components/canvas/Canvas'; 

interface AiDesignToolProps {
  onLayoutSelect: (layout: ClientDesignLayout | null) => void;
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
        const layoutsWithIds = result.layouts.map(layout => 
          addIdsToLayout(layout as Omit<ClientDesignLayout, 'id' | 'elements'> & { elements: Omit<ClientDesignLayout['elements'][0], 'id'>[] })
        );
        setGeneratedLayouts(layoutsWithIds);
        toast({ title: "Layouts Generated", description: `${layoutsWithIds.length} layouts created successfully.` });
      } else {
        setGeneratedLayouts([]); // Ensure it's cleared
        toast({ title: "Generation Failed", description: "No layouts were returned by the AI. Try a different prompt.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating layout:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ title: "Generation Error", description: errorMessage, variant: "destructive" });
      setGeneratedLayouts([]); // Ensure it's cleared on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlankCanvas = () => {
    const blankLayout = addIdsToLayout({
      description: 'Blank Canvas',
      elements: [],
    });
    onLayoutSelect(blankLayout);
    setGeneratedLayouts([]); // Clear previous AI suggestions
    setPrompt(''); // Clear prompt
    toast({ title: "Blank Canvas", description: "Started a new empty design." });
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="space-y-3">
        <Button onClick={handleBlankCanvas} variant="outline" className="w-full">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Start with Blank Canvas
        </Button>
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-xs">OR</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="e.g., a birthday party invitation for a 5 year old"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </form>
      </div>
      

      {isLoading && generatedLayouts.length === 0 && (
         <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground py-6">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Generating layouts...</p>
            <p className="text-xs">This can take a few moments.</p>
         </div>
      )}

      {!isLoading && generatedLayouts.length > 0 && (
        <ScrollArea className="flex-grow mt-4">
          <div className="space-y-3 pr-3">
            <h3 className="text-lg font-semibold font-headline">AI Generated Layouts</h3>
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
      
       {!isLoading && generatedLayouts.length === 0 && prompt && !isLoading && (
         <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground py-6">
            <p>No layouts generated for this prompt.</p>
            <p className="text-xs">Try refining your prompt or try again.</p>
         </div>
       )}
        {!isLoading && generatedLayouts.length === 0 && !prompt && (
         <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground py-6">
            <p className="text-sm">Enter a prompt above to generate designs with AI.</p>
         </div>
       )}
    </div>
  );
}
