'use client';

import { ReactNode } from 'react';
import { Navigation } from './navigation';
import AuroraBackground from './AuroraBackground';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showAurora?: boolean;
  className?: string;
}

export default function PageLayout({ 
  children, 
  title, 
  description, 
  showAurora = true,
  className = '' 
}: PageLayoutProps) {
  return (
    <div className="page-layout">
      {/* Aurora Background */}
      {showAurora && <AuroraBackground />}
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className={`container-academy relative z-10 ${className}`}>
        {/* Page Header */}
        {title && (
          <div className="mb-8">
            <h1 className="headline mb-4">{title}</h1>
            {description && (
              <p className="body-text text-lg max-w-3xl">{description}</p>
            )}
          </div>
        )}
        
        {/* Page Content */}
        {children}
      </main>
      
      {/* Bottom Navigation Dock */}
      <VirtueNavigation />
    </div>
  );
}

// Bottom Navigation Component
function VirtueNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          <VirtueLink href="/" icon="🏠" label="Home" />
          <VirtueLink href="/wisdom" icon="🧠" label="Wisdom" />
          <VirtueLink href="/courage" icon="🛡️" label="Courage" />
          <VirtueLink href="/justice" icon="⚖️" label="Justice" />
          <VirtueLink href="/temperance" icon="⚖️" label="Temperance" />
        </div>
      </div>
    </nav>
  );
}

interface VirtueLinkProps {
  href: string;
  icon: string;
  label: string;
}

function VirtueLink({ href, icon, label }: VirtueLinkProps) {
  return (
    <a 
      href={href}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 active:scale-95"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
} 