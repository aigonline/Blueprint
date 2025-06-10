
import { Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { DesignLayout } from '@/types/blueprint'; // Added
import { useToast } from '@/hooks/use-toast'; // Added

interface AppHeaderProps {
  currentDesign?: DesignLayout | null; // Made optional for landing page
}

export function AppHeader({ currentDesign }: AppHeaderProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!currentDesign) {
      toast({
        title: "No Design to Download",
        description: "There is no active design to download.",
        variant: "destructive",
      });
      return;
    }
    try {
      const designJson = JSON.stringify(currentDesign, null, 2);
      const blob = new Blob([designJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = currentDesign.description.replace(/\s+/g, '_').toLowerCase() || 'blueprint_design';
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Design Downloaded",
        description: "Your design layout has been downloaded as a JSON file.",
      });
    } catch (error) {
      console.error("Error downloading design:", error);
      toast({
        title: "Download Failed",
        description: "Could not download the design. See console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Go to Homepage">
          <Zap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Blueprint</h1>
        </Link>
        {currentDesign !== undefined && ( // Only show download if on blueprint page (where currentDesign is passed)
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        )}
      </div>
    </header>
  );
}
