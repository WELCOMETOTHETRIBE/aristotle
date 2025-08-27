import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { Navigation } from '@/components/navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
          <ErrorBoundary>
            <Navigation />

            <main>
              {children}
            </main>
          </ErrorBoundary>

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