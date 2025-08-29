'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Shield, Scale, Leaf, ChevronDown, ChevronUp, Home, Target, Users, BookOpen, Heart, Clock } from 'lucide-react';

const modules = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
    color: 'from-accent to-accent-2',
    description: 'Main dashboard'
  },
  {
    name: 'Wisdom',
    path: '/wisdom',
    icon: Brain,
    color: 'from-blue-400 to-cyan-400',
    description: 'Knowledge & understanding'
  },
  {
    name: 'Courage',
    path: '/courage',
    icon: Shield,
    color: 'from-red-400 to-orange-400',
    description: 'Strength & determination'
  },
  {
    name: 'Justice',
    path: '/justice',
    icon: Scale,
    color: 'from-green-400 to-emerald-400',
    description: 'Fairness & relationships'
  },
  {
    name: 'Temperance',
    path: '/temperance',
    icon: Leaf,
    color: 'from-purple-400 to-violet-400',
    description: 'Self-control & harmony'
  },
  {
    name: 'Academy',
    path: '/academy',
    icon: BookOpen,
    color: 'from-indigo-400 to-blue-400',
    description: 'Learning hub'
  },
  {
    name: 'Breathwork',
    path: '/breath',
    icon: Heart,
    color: 'from-pink-400 to-rose-400',
    description: 'Breathing practices'
  },
  {
    name: 'Fasting',
    path: '/fasting',
    icon: Clock,
    color: 'from-amber-400 to-orange-400',
    description: 'Fasting guidance'
  },
  {
    name: 'Coach',
    path: '/coach',
    icon: Target,
    color: 'from-teal-400 to-cyan-400',
    description: 'AI coaching'
  },
  {
    name: 'Community',
    path: '/community',
    icon: Users,
    color: 'from-emerald-400 to-green-400',
    description: 'Connect with others'
  }
];

export function ModuleNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-12 left-4 z-30">
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          title="Quick Navigation"
        >
          {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>

        {/* Expanded Navigation */}
        {isExpanded && (
          <div className="absolute top-14 left-0 w-72 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl">
            <div className="p-4 border-b border-white/10">
              <div className="text-sm text-white font-semibold">Quick Navigation</div>
              <div className="text-xs text-white/60 mt-1">All modules at your fingertips</div>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {modules.map((module) => {
                const IconComponent = module.icon;
                const isActive = pathname === module.path;
                
                return (
                  <Link key={module.path} href={module.path}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                        isActive 
                          ? 'bg-white/25 border border-white/30 shadow-lg' 
                          : 'hover:bg-white/15 border border-transparent hover:border-white/20'
                      }`}
                      onClick={() => setIsExpanded(false)}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                        <IconComponent size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${
                          isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                        }`}>
                          {module.name}
                        </div>
                        <div className="text-xs text-white/70 truncate">
                          {module.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 