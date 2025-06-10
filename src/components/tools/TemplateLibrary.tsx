'use client';

import { LayoutDashboard } from 'lucide-react';

export function TemplateLibrary() {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-muted-foreground">
      <LayoutDashboard className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold font-headline">Template Library</h2>
      <p className="text-sm text-center mt-2">
        Browse pre-designed templates for various use cases.
      </p>
      <p className="text-xs text-center mt-1">(Coming Soon)</p>
    </div>
  );
}
