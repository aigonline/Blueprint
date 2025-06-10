
import { Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Added Link

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Go to Homepage">
          <Zap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Blueprint</h1>
        </Link>
        <Button variant="outline" onClick={() => alert('Download functionality coming soon!')}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </header>
  );
}
