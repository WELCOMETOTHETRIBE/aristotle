'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, BookOpen, Users, TrendingUp, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    name: 'Academy',
    href: '/academy',
    icon: MessageSquare,
    activeColor: 'text-primary',
  },
  {
    name: 'Frameworks',
    href: '/frameworks',
    icon: BookOpen,
    activeColor: 'text-primary',
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    activeColor: 'text-primary',
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: TrendingUp,
    activeColor: 'text-primary',
  },
  {
    name: 'Tools',
    href: '/tools',
    icon: Wrench,
    activeColor: 'text-primary',
  },
];

export function TabBar() {
  const pathname = usePathname();

  // Hide on auth and onboarding pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/onboarding')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all duration-150',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              )}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 