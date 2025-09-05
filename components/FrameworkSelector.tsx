'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
  description?: string;
}

interface FrameworkSelectorProps {
  selectedFrameworks: string[];
  onFrameworksChange: (frameworks: string[]) => void;
  className?: string;
}

export function FrameworkSelector({ 
  selectedFrameworks, 
  onFrameworksChange, 
  className 
}: FrameworkSelectorProps) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load frameworks from API
  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        const response = await fetch('/api/frameworks');
        if (response.ok) {
          const data = await response.json();
          setFrameworks(data.frameworks || []);
        }
      } catch (error) {
        console.error('Error loading frameworks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFrameworks();
  }, []);

  const toggleFramework = (frameworkId: string) => {
    const newFrameworks = selectedFrameworks.includes(frameworkId)
      ? selectedFrameworks.filter(id => id !== frameworkId)
      : [...selectedFrameworks, frameworkId];
    
    onFrameworksChange(newFrameworks);
  };

  const getFrameworkEmoji = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    return framework?.nav.emoji || '📚';
  };

  const getFrameworkName = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    return framework?.name || frameworkId;
  };

  const getToneColor = (tone: string) => {
    const toneMap: Record<string, string> = {
      'gritty': 'from-red-500/20 to-orange-500/20 border-red-500/30',
      'honor': 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      'calm': 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
      'mystical': 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
      'crisp': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      'fierce': 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
      'serene': 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
      'bold': 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
      'wise': 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      'balanced': 'from-teal-500/20 to-green-500/20 border-teal-500/30'
    };
    return toneMap[tone] || 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className={cn("p-4 bg-surface-2 rounded-lg", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-surface-3 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-surface-3 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-surface border border-border rounded-lg", className)}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-2 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-sm font-semibold text-text">Selected Frameworks</h3>
          <p className="text-xs text-muted mt-1">
            {selectedFrameworks.length === 0 
              ? 'No frameworks selected' 
              : `${selectedFrameworks.length} framework${selectedFrameworks.length === 1 ? '' : 's'} selected`
            }
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted" />
        </motion.div>
      </div>

      {/* Selected Frameworks Preview */}
      {selectedFrameworks.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {selectedFrameworks.map((frameworkId) => (
              <div
                key={frameworkId}
                className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                <span>{getFrameworkEmoji(frameworkId)}</span>
                <span>{getFrameworkName(frameworkId)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFramework(frameworkId);
                  }}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Framework List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                    selectedFrameworks.includes(framework.id)
                      ? getToneColor(framework.nav.tone)
                      : "bg-surface-2 border-border hover:bg-surface-3"
                  )}
                  onClick={() => toggleFramework(framework.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{framework.nav.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-text">
                        {framework.name}
                      </div>
                      <div className="text-xs text-muted">
                        {framework.nav.badge}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedFrameworks.includes(framework.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
