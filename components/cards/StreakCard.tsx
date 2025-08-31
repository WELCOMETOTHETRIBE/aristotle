'use client';

import { Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  title: string;
  count: number;
  lastActivity: Date;
  target?: number;
  className?: string;
}

export function StreakCard({ 
  title, 
  count, 
  lastActivity, 
  target = 7, 
  className 
}: StreakCardProps) {
  const progress = Math.min((count / target) * 100, 100);
  const isActive = count > 0;
  const isOnTrack = count >= target;

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-4 transition-all duration-150 hover:shadow-md',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isActive ? 'bg-primary/20' : 'bg-surface-2'
          )}>
            <Flame className={cn(
              'w-4 h-4',
              isActive ? 'text-primary' : 'text-muted'
            )} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">{title}</h3>
            <p className="text-xs text-muted">
              Last: {formatLastActivity(lastActivity)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            'text-lg font-bold',
            isActive ? 'text-primary' : 'text-muted'
          )}>
            {count}
          </div>
          <div className="text-xs text-muted">days</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted">Progress</span>
          <span className="text-xs text-muted">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-surface-2 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              isOnTrack ? 'bg-success' : 'bg-primary'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <TrendingUp className={cn(
            'w-3 h-3',
            isOnTrack ? 'text-success' : 'text-muted'
          )} />
          <span className={cn(
            'text-xs font-medium',
            isOnTrack ? 'text-success' : 'text-muted'
          )}>
            {isOnTrack ? 'On track' : `${target - count} more to goal`}
          </span>
        </div>
      </div>
    </div>
  );
} 