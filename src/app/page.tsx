
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Edit3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blueprint - AI-Powered Design',
  description: 'Welcome to Blueprint, your AI-powered design assistant. Create stunning graphics with ease.',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Blueprint</h1>
          </Link>
          <Button asChild>
            <Link href="/blueprint">
              Open Editor
              <Edit3 className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <Zap className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-5xl font-bold font-headline mb-4">
          Design at the Speed of Thought
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Blueprint is an intuitive, AI-powered design tool that helps you create beautiful graphics, marketing materials, and more in minutes.
        </p>
        <Button size="lg" asChild>
          <Link href="/blueprint">
            Get Started with Blueprint
            <Edit3 className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        <p>&copy; {new Date().getFullYear()} Blueprint. All rights reserved.</p>
      </footer>
    </div>
  );
}
