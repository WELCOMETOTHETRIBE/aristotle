import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { virtueColors } from '@/lib/tone';

interface AcademyCardProps {
  title: string;
  subtitle?: string;
  tone?: 'wisdom' | 'courage' | 'justice' | 'temperance';
  children?: ReactNode;
  onExplore?: () => void;
  onStart?: () => void;
  exploreText?: string;
  startText?: string;
}

export function AcademyCard({ 
  title, 
  subtitle, 
  tone = 'wisdom',
  children,
  onExplore,
  onStart,
  exploreText = 'Explore',
  startText = 'Start'
}: AcademyCardProps) {
  const colors = virtueColors[tone];

  return (
    <div className={`rounded-2xl p-5 border border-[rgb(var(--border))] shadow-card ${colors.grad}`}>
      <h3 className="font-display text-xl text-[rgb(var(--text))]">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-[rgb(var(--muted))] text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        {onExplore && (
          <Button 
            variant="secondary"
            size="sm"
            onClick={onExplore}
            className="rounded-xl px-4 py-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))]
              hover:bg-[rgb(var(--surface-2))] transition duration-fast ease-soft"
          >
            {exploreText}
          </Button>
        )}
        {onStart && (
          <Button 
            size="sm"
            onClick={onStart}
            className={`rounded-xl px-4 py-2 text-black font-medium ${colors.bg}
              hover:brightness-110 transition duration-fast ease-snap`}
          >
            {startText}
          </Button>
        )}
      </div>
    </div>
  );
}

export function FrameworkChip({ 
  framework, 
  children 
}: { 
  framework: string; 
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1
      text-xs font-medium bg-[rgb(var(--surface-2))] border border-[rgb(var(--border))]
      shadow-card">
      <span className={`size-2 rounded-full bg-fw-${framework}`} />
      {children}
    </span>
  );
}

export function VirtueBadge({ 
  virtue, 
  children 
}: { 
  virtue: 'wisdom' | 'courage' | 'justice' | 'temperance'; 
  children: ReactNode;
}) {
  const colors = virtueColors[virtue];
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1
      text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
      {children}
    </span>
  );
} 