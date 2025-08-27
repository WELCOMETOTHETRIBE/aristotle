import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { VirtueNavigation } from '@/components/VirtueNavigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Aristotle's Academy - Philosophy-Driven Life Coaching",
  description: 'Transform Aristotle\'s teachings into daily practices for modern flourishing. Cultivate wisdom, courage, justice, and temperance.',
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
            <VirtueNavigation />

            <main>
              {children}
            </main>
          </ErrorBoundary>

          {/* Footer */}
          <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p>© 2024 Aristotle's Academy. Built on ancient wisdom for modern flourishing.</p>
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