import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'gradient' | 'glass' | 'none';
}

export default function PageLayout({
  children,
  className,
  containerClassName,
  header,
  footer,
  maxWidth = '7xl',
  padding = 'lg',
  background = 'default'
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-6',
    md: 'px-6 py-8',
    lg: 'px-8 py-12',
    xl: 'px-10 py-16',
  };

  const backgroundClasses = {
    default: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    gradient: 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900',
    glass: 'bg-white/5 backdrop-blur-sm',
    none: '',
  };

  return (
    <div className={cn(
      'min-h-screen',
      backgroundClasses[background],
      className
    )}>
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className={cn(
            'mx-auto',
            maxWidthClasses[maxWidth],
            'px-4 py-4'
          )}>
            {header}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className={cn(
          'mx-auto',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          containerClassName
        )}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {footer && (
        <footer className="bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className={cn(
            'mx-auto',
            maxWidthClasses[maxWidth],
            'px-4 py-6'
          )}>
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

// Typography components for consistent text styling
export function PageTitle({ 
  children, 
  className,
  size = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: 'small' | 'default' | 'large' | 'xl';
}) {
  const sizeClasses = {
    small: 'text-2xl md:text-3xl font-bold',
    default: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    large: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    xl: 'text-5xl md:text-6xl lg:text-7xl font-bold',
  };

  return (
    <h1 className={cn(
      'text-white font-serif leading-tight tracking-tight',
      sizeClasses[size],
      className
    )}>
      {children}
    </h1>
  );
}

export function PageSubtitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <p className={cn(
      'text-xl md:text-2xl text-gray-300 font-medium leading-relaxed',
      className
    )}>
      {children}
    </p>
  );
}

export function SectionTitle({ 
  children, 
  className,
  size = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: 'small' | 'default' | 'large';
}) {
  const sizeClasses = {
    small: 'text-xl md:text-2xl font-semibold',
    default: 'text-2xl md:text-3xl font-semibold',
    large: 'text-3xl md:text-4xl font-semibold',
  };

  return (
    <h2 className={cn(
      'text-white font-serif leading-tight',
      sizeClasses[size],
      className
    )}>
      {children}
    </h2>
  );
}

export function SectionDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <p className={cn(
      'text-lg text-gray-300 leading-relaxed',
      className
    )}>
      {children}
    </p>
  );
}

export function CardTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <h3 className={cn(
      'text-lg md:text-xl font-semibold text-white leading-tight',
      className
    )}>
      {children}
    </h3>
  );
}

export function CardDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <p className={cn(
      'text-sm md:text-base text-gray-300 leading-relaxed',
      className
    )}>
      {children}
    </p>
  );
}

export function BodyText({ 
  children, 
  className,
  size = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: 'small' | 'default' | 'large';
}) {
  const sizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
  };

  return (
    <p className={cn(
      'text-gray-300 leading-relaxed',
      sizeClasses[size],
      className
    )}>
      {children}
    </p>
  );
}

// Layout components for consistent spacing
export function PageSection({ 
  children, 
  className,
  spacing = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  spacing?: 'none' | 'small' | 'default' | 'large' | 'xl';
}) {
  const spacingClasses = {
    none: '',
    small: 'mb-6',
    default: 'mb-12',
    large: 'mb-16',
    xl: 'mb-20',
  };

  return (
    <section className={cn(
      spacingClasses[spacing],
      className
    )}>
      {children}
    </section>
  );
}

export function PageGrid({ 
  children, 
  className,
  cols = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 'default' | 'auto';
}) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  return (
    <div className={cn(
      'grid gap-6 md:gap-8',
      colsClasses[cols],
      className
    )}>
      {children}
    </div>
  );
} 