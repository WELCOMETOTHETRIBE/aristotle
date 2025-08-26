import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import Link from 'next/link';
import { Brain, Target, Heart, Home, Clock } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aion - Aristotle-Inspired Life Coach',
  description: 'Your voice-first personal assistant for flourishing and intentional living',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {/* Navigation */}
          <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                  <Brain className="h-6 w-6" />
                  Aion
                </Link>
                
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Target className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link href="/coach" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Brain className="h-4 w-4" />
                    Coach
                  </Link>
                  <Link href="/breath" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    Breathwork
                  </Link>
                  <Link href="/fasting" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Clock className="h-4 w-4" />
                    Fasting
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main>
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p>© 2024 Aion. Built with Aristotle-inspired wisdom for intentional living.</p>
                <p className="mt-2">
                  "We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle
                </p>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
} 