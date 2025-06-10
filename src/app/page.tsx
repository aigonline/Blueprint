
'use client'; // Required because AppHeader now uses client hooks

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Edit3 } from 'lucide-react';
import type { Metadata } from 'next';
import { AppHeader } from '@/components/shared/AppHeader'; // Import AppHeader
import { useAuth } from '@/context/AuthContext'; // Import useAuth to check login status

// Metadata needs to be defined in a server component or layout if dynamic.
// For a static page, it can be like this but won't be dynamic based on auth state here.
// export const metadata: Metadata = {
//   title: 'Blueprint - AI-Powered Design',
//   description: 'Welcome to Blueprint, your AI-powered design assistant. Create stunning graphics with ease.',
// };

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader /> {/* Use AppHeader here */}
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
            {user ? "Open Editor" : "Get Started with Blueprint"}
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
