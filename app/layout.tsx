import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/lib/auth-context";
import { LyceumProvider } from "@/lib/lyceum-context";
import ClickToFeedback from "@/components/ClickToFeedback";
import DeveloperToolbar from "@/components/DeveloperToolbar";
import ScrollRestoration from "@/components/ScrollRestoration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aristotle's Lyceum - 12-Path Wisdom Journey",
  description: "Master Aristotle's wisdom through 36 interactive lessons across 12 paths of philosophical study, with AI-powered guidance and personalized learning",
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
              <LyceumProvider>
                <div className="min-h-screen bg-bg">
                  <ScrollRestoration />
                  <ClickToFeedback>
                    {children}
                  </ClickToFeedback>
                  <DeveloperToolbar />
                </div>
              </LyceumProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 