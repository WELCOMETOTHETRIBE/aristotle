'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Shield, Scale, Leaf, BookOpen, Target, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtuePath {
  name: string;
  path: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  practices: string[];
}

const virtuePaths: VirtuePath[] = [
  {
    name: 'Wisdom',
    path: '/wisdom',
    description: 'The virtue of knowledge and understanding',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    practices: ['Learning', 'Reflection', 'Study', 'Philosophy']
  },
  {
    name: 'Courage',
    path: '/courage',
    description: 'The virtue of facing challenges with strength',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    practices: ['Action', 'Challenge', 'Growth', 'Resilience']
  },
  {
    name: 'Justice',
    path: '/justice',
    description: 'The virtue of fairness and right relationships',
    icon: Scale,
    color: 'from-green-500 to-emerald-600',
    practices: ['Relationships', 'Community', 'Service', 'Balance']
  },
  {
    name: 'Temperance',
    path: '/temperance',
    description: 'The virtue of self-control and moderation',
    icon: Leaf,
    color: 'from-purple-500 to-pink-600',
    practices: ['Mindfulness', 'Discipline', 'Balance', 'Harmony']
  }
];

const additionalPaths = [
  {
    name: 'Academy',
    path: '/academy',
    description: 'Your learning journey',
    icon: BookOpen,
    color: 'from-amber-500 to-yellow-600'
  },
  {
    name: 'Progress',
    path: '/progress',
    description: 'Track your virtue development',
    icon: Target,
    color: 'from-teal-500 to-cyan-600'
  },
  {
    name: 'Community',
    path: '/community',
    description: 'Connect with fellow seekers',
    icon: Users,
    color: 'from-violet-500 to-purple-600'
  },
  {
    name: 'Coach',
    path: '/coach',
    description: 'Aristotle AI guidance',
    icon: Sparkles,
    color: 'from-rose-500 to-pink-600'
  }
];

export function VirtueNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aristotle's Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {virtuePaths.map((virtue) => {
              const isActive = pathname.startsWith(virtue.path);
              return (
                <Link
                  key={virtue.path}
                  href={virtue.path}
                  className={cn(
                    "group relative px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50",
                    isActive && "bg-gradient-to-r " + virtue.color + " text-white shadow-lg"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <virtue.icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                    )} />
                    <span className="font-medium">{virtue.name}</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    <div className="font-medium">{virtue.description}</div>
                    <div className="text-xs text-gray-300 mt-1">
                      Practices: {virtue.practices.join(', ')}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Link>
              );
            })}
            
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            {additionalPaths.map((path) => {
              const isActive = pathname === path.path;
              return (
                <Link
                  key={path.path}
                  href={path.path}
                  className={cn(
                    "group relative px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50",
                    isActive && "bg-gradient-to-r " + path.color + " text-white shadow-lg"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <path.icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                    )} />
                    <span className="font-medium">{path.name}</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {path.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-2 space-y-1">
          {virtuePaths.map((virtue) => {
            const isActive = pathname.startsWith(virtue.path);
            return (
              <Link
                key={virtue.path}
                href={virtue.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive ? "bg-gradient-to-r " + virtue.color + " text-white" : "hover:bg-gray-50"
                )}
              >
                <virtue.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{virtue.name}</div>
                  <div className={cn(
                    "text-sm",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}>
                    {virtue.description}
                  </div>
                </div>
              </Link>
            );
          })}
          
          <div className="border-t border-gray-200 my-2"></div>
          
          {additionalPaths.map((path) => {
            const isActive = pathname === path.path;
            return (
              <Link
                key={path.path}
                href={path.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive ? "bg-gradient-to-r " + path.color + " text-white" : "hover:bg-gray-50"
                )}
              >
                <path.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{path.name}</div>
                  <div className={cn(
                    "text-sm",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}>
                    {path.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 