'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuideModal } from './GuideModal';

interface GuideFABProps {
  className?: string;
}

export function GuideFAB({ className }: GuideFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-250 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50',
          'flex items-center justify-center text-white',
          className
        )}
        aria-label="Open AI Guide"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      <GuideModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
} 