'use client';

import { ReactNode } from 'react';
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
    </div>
  );
} 