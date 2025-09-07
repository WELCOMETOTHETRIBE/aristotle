'use client';

import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: 'stable' | 'borderline' | 'out' | 'completed';
}

export function ProgressRing({ 
  progress, 
  size, 
  strokeWidth = 8, 
  className = '',
  children,
  color = 'stable'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);
  
  const getColor = () => {
    switch (color) {
      case 'stable':
        return '#16A34A'; // green-600
      case 'borderline':
        return '#F59E0B'; // amber-500
      case 'out':
        return '#EF4444'; // red-500
      case 'completed':
        return '#10B981'; // emerald-500
      default:
        return '#16A34A';
    }
  };
  
  const getBackgroundColor = () => {
    return 'rgba(55, 65, 81, 0.3)'; // gray-700 with opacity
  };
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getBackgroundColor()}
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-50"
        />
        
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          style={{
            filter: color === 'out' ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : 'none'
          }}
        />
      </svg>
      
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

interface AnimatedProgressRingProps extends Omit<ProgressRingProps, 'progress'> {
  targetProgress: number;
  isAnimating?: boolean;
}

export function AnimatedProgressRing({ 
  targetProgress, 
  isAnimating = true,
  ...props 
}: AnimatedProgressRingProps) {
  const [currentProgress, setCurrentProgress] = React.useState(0);
  
  React.useEffect(() => {
    if (!isAnimating) {
      setCurrentProgress(targetProgress);
      return;
    }
    
    const duration = 300; // ms
    const startTime = Date.now();
    const startProgress = currentProgress;
    const progressDiff = targetProgress - startProgress;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCurrentProgress(startProgress + (progressDiff * easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetProgress, isAnimating, currentProgress]);
  
  return <ProgressRing {...props} progress={currentProgress} />;
}
