'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiDesignTool } from '@/components/tools/AiDesignTool';
import { TemplateLibrary } from '@/components/tools/TemplateLibrary';
import { ElementLibrary } from '@/components/tools/ElementLibrary';
import type { DesignLayout } from '@/types/blueprint';
import { Wand2, LayoutDashboard, Puzzle } from 'lucide-react';

interface LeftPanelProps {
  onLayoutSelect: (layout: DesignLayout) => void;
}

export function LeftPanel({ onLayoutSelect }: LeftPanelProps) {
  return (
    <aside className="w-[350px] border-r bg-card flex flex-col h-full">
      <Tabs defaultValue="ai-tool" className="flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
          <TabsTrigger value="ai-tool" className="rounded-none">
            <Wand2 className="mr-2 h-4 w-4" /> AI Tool
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-none">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="elements" className="rounded-none">
            <Puzzle className="mr-2 h-4 w-4" /> Elements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai-tool" className="flex-grow mt-0 overflow-y-auto">
          <AiDesignTool onLayoutSelect={onLayoutSelect} />
        </TabsContent>
        <TabsContent value="templates" className="flex-grow mt-0 overflow-y-auto">
          <TemplateLibrary />
        </TabsContent>
        <TabsContent value="elements" className="flex-grow mt-0 overflow-y-auto">
          <ElementLibrary />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
