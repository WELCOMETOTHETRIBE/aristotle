import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { VirtueNavigation } from "@/components/VirtueNavigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/lib/auth-context";
import DeveloperAuth from "@/components/DeveloperAuth";
import DeveloperToolbar from "@/components/DeveloperToolbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ancient Wisdom Wellness System",
  description: "A comprehensive wellness system based on ancient philosophical wisdom and modern science",
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
                <VirtueNavigation />
                {children}
                <DeveloperAuth>
                  <DeveloperToolbar />
                </DeveloperAuth>
              </div>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 