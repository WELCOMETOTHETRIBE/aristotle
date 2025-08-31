'use client';

import { BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  title: string;
  summary: string;
  framework: string;
  duration: string;
  onApply?: () => void;
  className?: string;
}

export function LessonCard({ 
  title, 
  summary, 
  framework, 
  duration, 
  onApply, 
  className 
}: LessonCardProps) {
  return (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-4 transition-all duration-150 hover:shadow-md',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Wisdom Tile</h3>
            <p className="text-xs text-muted">From {framework}</p>
          </div>
        </div>
        <div className="text-xs text-muted bg-surface-2 px-2 py-1 rounded">
          {duration}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-text mb-2 line-clamp-2">
          {title}
        </h4>
        <p className="text-xs text-muted line-clamp-3 leading-relaxed">
          {summary}
        </p>
      </div>

      {onApply && (
        <button
          onClick={onApply}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-150"
        >
          <span className="text-sm font-medium">Apply today</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
} 