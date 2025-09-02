'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, BookOpen, Quote, Brain, RotateCcw, Settings, Info, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DailyWisdomCardProps {
  className?: string;
}

interface DailyWisdom {
  quote: string;
  author: string;
  framework: string;
  reflection: string;
}

interface WisdomSettings {
  autoRefresh: boolean;
  preferredFrameworks: string[];
  showReflection: boolean;
  enableNotifications: boolean;
}

const frameworks = ['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic', 'Buddhist', 'Confucian', 'Taoist'];

export function DailyWisdomCard({ className }: DailyWisdomCardProps) {
  const [wisdom, setWisdom] = useState<DailyWisdom>({
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    framework: "Stoic",
    reflection: "What aspect of your life needs deeper examination today?"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [settings, setSettings] = useState<WisdomSettings>({
    autoRefresh: true,
    preferredFrameworks: ['Stoic', 'Spartan', 'Samurai'],
    showReflection: true,
    enableNotifications: true,
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('dailyWisdomSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings
  const saveSettings = (newSettings: WisdomSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dailyWisdomSettings', JSON.stringify(newSettings));
  };

  const loadDailyWisdom = async () => {
    setIsLoading(true);
    try {
      const randomFramework = settings.preferredFrameworks[
        Math.floor(Math.random() * settings.preferredFrameworks.length)
      ] || 'Stoic';
      
      const response = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          framework: randomFramework,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        const newWisdom = await response.json();
        setWisdom(newWisdom);
      }
    } catch (error) {
      console.error('Error loading daily wisdom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load wisdom on mount
  useEffect(() => {
    loadDailyWisdom();
  }, []);

  const getFrameworkColor = (framework: string) => {
    const colors: { [key: string]: string } = {
      'Stoic': 'from-blue-500 to-indigo-500',
      'Spartan': 'from-red-500 to-orange-500',
      'Samurai': 'from-gray-700 to-gray-900',
      'Monastic': 'from-purple-500 to-violet-500',
      'Yogic': 'from-green-500 to-emerald-500',
      'Buddhist': 'from-yellow-500 to-orange-500',
      'Confucian': 'from-red-600 to-red-800',
      'Taoist': 'from-green-600 to-green-800',
    };
    return colors[framework] || 'from-purple-500 to-violet-500';
  };

  const getFrameworkEmoji = (framework: string) => {
    const emojis: { [key: string]: string } = {
      'Stoic': '🏛️',
      'Spartan': '🛡️',
      'Samurai': '⚔️',
      'Monastic': '⛪',
      'Yogic': '🧘',
      'Buddhist': '☸️',
      'Confucian': '📚',
      'Taoist': '☯️',
    };
    return emojis[framework] || '🧠';
  };

  return (
    <motion.div
      className={cn(
        "p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 backdrop-blur-sm",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">Daily Wisdom</h3>
            <p className="text-sm text-muted">Ancient insights for modern life</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-muted hover:text-text transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-muted hover:text-text transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-surface/50 rounded-lg border border-border/50"
          >
            <p className="text-sm text-muted">
              Each day brings a new piece of wisdom from ancient philosophical traditions. 
              Take a moment to reflect on how this insight applies to your life today.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-surface/50 rounded-lg border border-border/50 space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-text mb-2 block">
                Preferred Traditions
              </label>
              <div className="flex flex-wrap gap-2">
                {frameworks.map((framework) => (
                  <button
                    key={framework}
                    onClick={() => {
                      const newFrameworks = settings.preferredFrameworks.includes(framework)
                        ? settings.preferredFrameworks.filter(f => f !== framework)
                        : [...settings.preferredFrameworks, framework];
                      saveSettings({ ...settings, preferredFrameworks: newFrameworks });
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      settings.preferredFrameworks.includes(framework)
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-surface/50 text-muted border border-border/50 hover:bg-surface"
                    )}
                  >
                    {getFrameworkEmoji(framework)} {framework}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">
                Show Reflection Questions
              </label>
              <button
                onClick={() => saveSettings({ ...settings, showReflection: !settings.showReflection })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors",
                  settings.showReflection ? "bg-purple-500" : "bg-surface/50"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full transition-transform",
                  settings.showReflection ? "translate-x-7" : "translate-x-1"
                )} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wisdom Content */}
      <div className="space-y-4">
        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={wisdom.quote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Quote className="absolute -top-2 -left-2 w-6 h-6 text-purple-400/50" />
            <blockquote className="text-lg font-serif italic text-text leading-relaxed pl-6">
              "{wisdom.quote}"
            </blockquote>
          </motion.div>
        </AnimatePresence>

        {/* Author and Framework */}
        <div className="flex items-center justify-between">
          <cite className="text-purple-300 font-medium">— {wisdom.author}</cite>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
            `bg-gradient-to-r ${getFrameworkColor(wisdom.framework)} text-white`
          )}>
            <span>{getFrameworkEmoji(wisdom.framework)}</span>
            <span>{wisdom.framework} Tradition</span>
          </div>
        </div>

        {/* Reflection */}
        {settings.showReflection && wisdom.reflection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-semibold text-text">Reflection</h4>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {wisdom.reflection}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={loadDailyWisdom}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            New Wisdom
          </button>
          
          <Link 
            href={`/coach?quote=${encodeURIComponent(wisdom.quote)}&author=${encodeURIComponent(wisdom.author)}&framework=${encodeURIComponent(wisdom.framework)}`}
            className="flex items-center gap-2 px-4 py-2 bg-surface/50 border border-border/50 text-muted rounded-lg hover:bg-surface transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Philosopher
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 