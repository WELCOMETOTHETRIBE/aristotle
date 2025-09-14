'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, BookOpen, Quote, Brain, RotateCcw, Settings, Info, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { logToJournal } from '@/lib/journal-logger';

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

// Available frameworks from onboarding
const availableFrameworks = [
  { id: 'stoic', name: 'Stoicism', emoji: '🧱', description: 'Rational thinking and emotional control' },
  { id: 'spartan', name: 'Spartan Agōgē', emoji: '🛡️', description: 'Discipline and resilience' },
  { id: 'bushido', name: 'Samurai Bushidō', emoji: '🗡️', description: 'Honor and rectitude' },
  { id: 'monastic', name: 'Monastic Rule', emoji: '⛪', description: 'Contemplation and service' },
  { id: 'berserker', name: 'Viking Berserker', emoji: '⚔️', description: 'Courage and strength' },
  { id: 'druid', name: 'Celtic Druid', emoji: '🌿', description: 'Nature and wisdom' },
  { id: 'monk', name: 'Tibetan Monk', emoji: '🧘', description: 'Mindfulness and compassion' },
  { id: 'taoist', name: 'Taoist Sage', emoji: '☯️', description: 'Balance and flow' },
  { id: 'epicurean', name: 'Epicurean', emoji: '🍇', description: 'Pleasure and moderation' },
  { id: 'aristotelian', name: 'Aristotelian', emoji: '📚', description: 'Virtue and flourishing' }
];

export function DailyWisdomCard({ className }: DailyWisdomCardProps) {
  const [wisdom, setWisdom] = useState<DailyWisdom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [settings, setSettings] = useState<WisdomSettings>({
    autoRefresh: true,
    preferredFrameworks: ['stoic'], // Default to stoic
    showReflection: true,
    enableNotifications: false
  });
  
  // Add ref to track if wisdom has been loaded today
  const hasLoadedToday = useRef(false);

  // Load settings on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedSettings = localStorage.getItem('dailyWisdomSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error parsing wisdom settings:', error);
      }
    }
  }, []);

  // Save settings when they change
  const saveSettings = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('dailyWisdomSettings', JSON.stringify(settings));
      console.log('📚 Wisdom settings saved');
    } catch (error) {
      console.error('Error saving wisdom settings:', error);
    }
  };

  const loadDailyWisdom = async (forceRefresh = false) => {
    // Check if we already have wisdom for today and don't force refresh
    if (!forceRefresh && typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const dailyWisdomKey = `dailyWisdom_${today}`;
      const savedWisdom = localStorage.getItem(dailyWisdomKey);
      
      if (savedWisdom) {
        try {
          const parsedWisdom = JSON.parse(savedWisdom);
          setWisdom(parsedWisdom);
          console.log('📚 Using existing daily wisdom for today');
          return; // Exit early if we have wisdom for today
        } catch (error) {
          console.error('Error parsing saved wisdom:', error);
          // Continue to load new wisdom if parsing fails
        }
      }
    }

    setIsLoading(true);
    try {
      // Use user's preferred frameworks from settings
      const frameworksToUse = settings.preferredFrameworks.length > 0 
        ? settings.preferredFrameworks 
        : ['stoic']; // Default fallback
      
      console.log(`🎯 Loading daily wisdom for frameworks:`, frameworksToUse);
      console.log('📱 Mobile Debug - Settings object:', settings);
      console.log('📱 Mobile Debug - Preferred frameworks:', settings.preferredFrameworks);
      console.log('📱 Mobile Debug - Frameworks to use:', frameworksToUse);      
      console.log('�� Mobile Debug - Request body:', {
        frameworks: frameworksToUse,
        date: new Date().toISOString().split('T')[0],
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      });      
      
      const response = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameworks: frameworksToUse,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        const newWisdom = await response.json();
        setWisdom(newWisdom);
        
        // Save wisdom for today
        const today = new Date().toDateString();
        const dailyWisdomKey = `dailyWisdom_${today}`;
        localStorage.setItem(dailyWisdomKey, JSON.stringify(newWisdom));
        localStorage.setItem('lastDailyWisdomCheck', today);
        
        console.log('📚 Saved new daily wisdom for today:', newWisdom.framework);
        
        // Log new wisdom to journal
        const wisdomLogData = {
          type: 'daily_wisdom_refresh',
          content: `Daily wisdom loaded: "${newWisdom.quote}" - ${newWisdom.author} (${newWisdom.framework})`,
          category: 'wisdom',
          metadata: {
            quote: newWisdom.quote,
            author: newWisdom.author,
            framework: newWisdom.framework,
            frameworks: frameworksToUse,
            timestamp: new Date().toISOString(),
            isDailyWisdom: true
          },
          moduleId: 'daily_wisdom',
          widgetId: 'daily_wisdom_card',
        };
        await logToJournal(wisdomLogData);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('📱 Mobile Debug - API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          requestBody: {
            frameworks: frameworksToUse,
            date: new Date().toISOString().split('T')[0]
          }
        });
        // Fallback to default wisdom if API fails
        setWisdom({
          quote: "The unexamined life is not worth living.",
          author: "Socrates",
          framework: "Stoicism",
          reflection: "What aspect of your life needs deeper examination today?"
        });
      }
    } catch (error) {
      console.error('Error loading daily wisdom:', error);
      // Fallback to default wisdom if API fails
      setWisdom({
        quote: "The unexamined life is not worth living.",
        author: "Socrates",
        framework: "Stoicism",
        reflection: "What aspect of your life needs deeper examination today?"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load wisdom on mount and check for daily reset - FIXED VERSION
  useEffect(() => {
    // Only load once per day, not on every settings change
    if (hasLoadedToday.current) return;
    
    const loadWisdomIfNeeded = () => {
      if (typeof window === 'undefined') return;
      
      const now = new Date();
      const today = now.toDateString(); // e.g., "Mon Jan 01 2024"
      
      // Check if we have wisdom for today
      const dailyWisdomKey = `dailyWisdom_${today}`;
      const savedWisdom = localStorage.getItem(dailyWisdomKey);
      
      if (savedWisdom) {
        // Load existing wisdom for today
        try {
          const parsedWisdom = JSON.parse(savedWisdom);
          setWisdom(parsedWisdom);
          setIsLoading(false);
          hasLoadedToday.current = true;
          console.log('📚 Loaded existing daily wisdom for today');
        } catch (error) {
          console.error('Error parsing saved wisdom:', error);
          // Fallback to loading new wisdom
          loadDailyWisdom();
          hasLoadedToday.current = true;
        }
      } else {
        // No wisdom for today, load new one
        console.log('📚 No wisdom for today, loading new daily wisdom');
        loadDailyWisdom();
        hasLoadedToday.current = true;
      }
    };

    loadWisdomIfNeeded();
    
    // Set up interval to check for midnight reset every minute
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toDateString();
      const lastCheck = localStorage.getItem('lastDailyWisdomCheck');
      
      if (lastCheck !== today) {
        // New day detected, clear old wisdom and load new
        console.log('📚 New day detected, loading fresh daily wisdom');
        localStorage.removeItem(`dailyWisdom_${lastCheck}`);
        hasLoadedToday.current = false; // Reset the flag for new day
        loadDailyWisdom();
        localStorage.setItem('lastDailyWisdomCheck', today);
      }
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  // Handle manual refresh
  const handleRefresh = () => {
    loadDailyWisdom(true); // Force refresh
  };

  // Handle framework toggle
  const toggleFramework = (frameworkId: string) => {
    const newFrameworks = settings.preferredFrameworks.includes(frameworkId)
      ? settings.preferredFrameworks.filter(f => f !== frameworkId)
      : [...settings.preferredFrameworks, frameworkId];
    
    setSettings(prev => ({
      ...prev,
      preferredFrameworks: newFrameworks
    }));
  };

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [settings]);

  if (!wisdom) {
    return (
      <div className={cn("p-6 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Loading wisdom...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Wisdom</h2>
          <p className="text-gray-600 dark:text-gray-300">Today's insight for reflection</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-5 h-5 text-gray-600 dark:text-gray-300", isLoading && "animate-spin")} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Framework Preferences</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableFrameworks.map((framework) => (
                  <button
                    key={framework.id}
                    onClick={() => toggleFramework(framework.id)}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 text-left",
                      settings.preferredFrameworks.includes(framework.id)
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
                        : "bg-white/5 border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{framework.emoji} {framework.name}</span>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        settings.preferredFrameworks.includes(framework.id)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      )} />
                    </div>
                    <p className="text-xs opacity-75">{framework.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About Daily Wisdom</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Wisdom refreshes once per day at midnight</p>
                <p>• Select your preferred philosophical frameworks</p>
                <p>• Each quote includes a reflection prompt</p>
                <p>• Use the refresh button to get new wisdom</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wisdom Content */}
      <motion.div
        key={wisdom.quote}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Quote */}
        <blockquote className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 italic">
          "{wisdom.quote}"
        </blockquote>

        {/* Author and Framework */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Quote className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{wisdom.author}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{wisdom.framework}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>Daily</span>
          </div>
        </div>

        {/* Reflection */}
        {settings.showReflection && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-900 dark:text-white">Reflection</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{wisdom.reflection}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/journal"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Journal</span>
          </Link>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Wisdom</span>
          </button>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Loading wisdom...</span>
          </div>
        </div>
      )}
    </div>
  );
}
