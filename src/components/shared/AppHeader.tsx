
'use client'; // Add 'use client' because we use hooks like useAuth, useToast

import { Download, Zap, LogOut, User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { DesignLayout } from '@/types/blueprint';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation'; // Import for redirecting

interface AppHeaderProps {
  currentDesign?: DesignLayout | null;
}

export function AppHeader({ currentDesign }: AppHeaderProps) {
  const { toast } = useToast();
  const { user, logout, loading } = useAuth(); // Get user and logout from AuthContext
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      toast({ title: 'Logout Failed', description: 'Could not log out. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Go to Homepage">
          <Zap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Blueprint</h1>
        </Link>
        <div className="flex items-center gap-2">
          {currentDesign !== undefined && (
            <Button variant="outline" onClick={handleDownload} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          )}
          {!loading && user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button variant="ghost" onClick={handleLogout} size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : !loading ? (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="default" asChild size="sm">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          ) : (
             <div className="h-8 w-20 animate-pulse bg-muted rounded-md"></div> // Simple loader
          )}
        </div>
      </div>
    </header>
  );
}
