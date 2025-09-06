import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/lib/auth-context";
import ClickToFeedback from "@/components/ClickToFeedback";
import DeveloperToolbar from "@/components/DeveloperToolbar";
import ScrollRestoration from "@/components/ScrollRestoration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EudAimonia Academy - Ancient Wisdom, AI-Powered Growth",
  description: "A comprehensive wellness system based on ancient philosophical wisdom and modern AI technology",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <div className="min-h-screen bg-bg">
                <ScrollRestoration />
                <ClickToFeedback>
                  {children}
                </ClickToFeedback>
                <DeveloperToolbar />
              </div>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 