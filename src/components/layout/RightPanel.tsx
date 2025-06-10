'use client';

import { PropertiesEditor } from '@/components/editors/PropertiesEditor';
import type { DesignElement } from '@/types/blueprint';

interface RightPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function RightPanel({ selectedElement, onUpdateElement }: RightPanelProps) {
  return (
    <aside className="w-[300px] border-l bg-card flex flex-col h-full">
      <PropertiesEditor selectedElement={selectedElement} onUpdateElement={onUpdateElement} />
    </aside>
  );
}
