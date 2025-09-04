'use client';

import { useState, useEffect } from 'react';
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
  const [availableFrameworks, setAvailableFrameworks] = useState<string[]>([]);
  const [settings, setSettings] = useState<WisdomSettings>({
    autoRefresh: true,
    preferredFrameworks: ['Stoic', 'Spartan', 'Samurai'],
    showReflection: true,
    enableNotifications: true,
  });

  // Load saved settings and available frameworks
  useEffect(() => {
    const loadSettingsAndFrameworks = async () => {
      // Load saved settings
      const savedSettings = localStorage.getItem('dailyWisdomSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Load available frameworks from user preferences
      try {
        const response = await fetch('/api/prefs');
        if (response.ok) {
          const data = await response.json();
          if (data.preferences?.framework) {
            // If user has a specific framework, use that
            setAvailableFrameworks([data.preferences.framework]);
            setSettings(prev => ({
              ...prev,
              preferredFrameworks: [data.preferences.framework]
            }));
          } else {
            // Use all available frameworks
            setAvailableFrameworks(['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic', 'Buddhist', 'Confucian', 'Taoist', 'Indigenous', 'Martial', 'Sufi', 'Ubuntu', 'HighPerf']);
          }
        }
      } catch (error) {
        console.error('Error loading frameworks:', error);
        // Fall back to default frameworks
        setAvailableFrameworks(['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic', 'Buddhist', 'Confucian', 'Taoist', 'Indigenous', 'Martial', 'Sufi', 'Ubuntu', 'HighPerf']);
      }
    };

    loadSettingsAndFrameworks();
  }, []);

  // Save settings
  const saveSettings = async (newSettings: WisdomSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dailyWisdomSettings', JSON.stringify(newSettings));
    
    // Also save framework preference to user profile if it's different
    try {
      const response = await fetch('/api/prefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          framework: newSettings.preferredFrameworks[0] || null,
          preferences: newSettings 
        }),
      });
      
      if (response.ok) {
        console.log('Framework preferences saved to profile');
      }
    } catch (error) {
      console.error('Error saving framework preferences:', error);
    }
  };

  const loadDailyWisdom = async () => {
    setIsLoading(true);
    try {
      // Get user's framework preference from localStorage
      let userFramework = 'Stoic'; // Default fallback
      try {
        const userPrefs = localStorage.getItem('userPreferences');
        if (userPrefs) {
          const parsed = JSON.parse(userPrefs);
          userFramework = parsed.framework || 'Stoic';
          console.log(`🎯 Using user's framework preference: ${userFramework}`);
        } else {
          console.log('⚠️ No user preferences found, using default framework');
        }
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
      
      console.log(`🎯 Loading daily wisdom for user's framework: ${userFramework}`);
      
      const response = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          framework: userFramework,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        const newWisdom = await response.json();
        setWisdom(newWisdom);
        
        // Log new wisdom to journal
        const wisdomLogData = {
          type: 'daily_wisdom_refresh',
          content: `Refreshed daily wisdom: "${newWisdom.quote}" - ${newWisdom.author} (${newWisdom.framework})`,
          category: 'wisdom',
          metadata: {
            quote: newWisdom.quote,
            author: newWisdom.author,
            framework: newWisdom.framework,
            timestamp: new Date().toISOString(),
          },
          moduleId: 'daily_wisdom',
          widgetId: 'daily_wisdom_card',
        };
        await logToJournal(wisdomLogData);
      }
    } catch (error) {
      console.error('Error loading daily wisdom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load wisdom on mount and every 6 hours
  useEffect(() => {
    const loadWisdomIfNeeded = () => {
      if (typeof window === 'undefined') return;
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentTimeSlot = Math.floor(currentHour / 6); // 0-3 for 6-hour slots
      const lastLoadTime = localStorage.getItem('lastWisdomLoadTime');
      const lastTimeSlot = lastLoadTime ? Math.floor(new Date(lastLoadTime).getHours() / 6) : -1;
      
      // Load wisdom if it's a new 6-hour time slot or if never loaded
      if (lastTimeSlot !== currentTimeSlot) {
        loadDailyWisdom();
        localStorage.setItem('lastWisdomLoadTime', now.toISOString());
      }
    };

    loadWisdomIfNeeded();
    
    // Set up interval to check every hour
    const interval = setInterval(loadWisdomIfNeeded, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check if current quote is in favorites
  const isFavorite = () => {
    if (typeof window === 'undefined') return false;
    const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
    return favorites.some((fav: any) => fav.quote === wisdom.quote && fav.author === wisdom.author);
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (typeof window === 'undefined') return;
    
    const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
    const currentQuote = { quote: wisdom.quote, author: wisdom.author, framework: wisdom.framework, timestamp: new Date().toISOString() };
    
    if (isFavorite()) {
      // Remove from favorites
      const newFavorites = favorites.filter((fav: any) => !(fav.quote === wisdom.quote && fav.author === wisdom.author));
      localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
      
      // Log removal to journal
      const removeLogData = {
        type: 'quote_unfavorited',
        content: `Removed from favorites: "${wisdom.quote}" - ${wisdom.author}`,
        category: 'wisdom',
        metadata: {
          quote: wisdom.quote,
          author: wisdom.author,
          framework: wisdom.framework,
          timestamp: new Date().toISOString(),
        },
        moduleId: 'daily_wisdom',
        widgetId: 'daily_wisdom_card',
      };
      await logToJournal(removeLogData);
    } else {
      // Add to favorites
      favorites.push(currentQuote);
      localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
      
      // Log addition to journal
      const addLogData = {
        type: 'quote_favorited',
        content: `Added to favorites: "${wisdom.quote}" - ${wisdom.author}`,
        category: 'wisdom',
        metadata: {
          quote: wisdom.quote,
          author: wisdom.author,
          framework: wisdom.framework,
          timestamp: new Date().toISOString(),
        },
        moduleId: 'daily_wisdom',
        widgetId: 'daily_wisdom_card',
      };
      await logToJournal(addLogData);
    }
    
    // Force re-render
    setWisdom({ ...wisdom });
  };

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

  const getShortFrameworkName = (framework: string) => {
    const shortNames: { [key: string]: string } = {
      'Stoic': 'Stoicism',
      'Spartan': 'Spartan Agōgē',
      'Samurai': 'Samurai Bushidō',
      'Monastic': 'Monastic Rule',
      'Yogic': 'Yogic Path',
      'Buddhist': 'Buddhist',
      'Confucian': 'Confucian',
      'Taoist': 'Taoist',
      'Indigenous': 'Indigenous Wisdom',
      'Martial': 'Martial Arts Code',
      'Sufi': 'Sufi Practice',
      'Ubuntu': 'Ubuntu',
      'HighPerf': 'Modern High-Performance',
    };
    return shortNames[framework] || framework;
  };

  const getNextRefreshTime = () => {
    if (typeof window === 'undefined') return 'Loading...';
    
    const lastLoadTime = localStorage.getItem('lastWisdomLoadTime');
    if (!lastLoadTime) {
      return 'Never loaded';
    }
    const lastLoadDate = new Date(lastLoadTime);
    const now = new Date();

    // Calculate the next 6-hour slot
    const nextSlot = Math.ceil(now.getHours() / 6);
    const nextHour = nextSlot * 6;
    const nextDate = new Date(lastLoadDate);
    nextDate.setHours(nextHour, 0, 0, 0);

    if (nextDate <= now) {
      // If the next slot is in the past (e.g., if it was 5:30 AM and now is 6:00 AM)
      // The next refresh will be in the next 6-hour period.
      nextDate.setHours(nextHour + 6, 0, 0, 0);
    }

    return nextDate.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
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
                Preferred Frameworks
              </label>
              <div className="flex flex-wrap gap-2">
                {availableFrameworks.map((framework) => (
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
            <div className="flex items-start justify-between pl-6">
              <blockquote className="text-lg font-serif italic text-text leading-relaxed flex-1">
                "{wisdom.quote}"
              </blockquote>
              <button
                onClick={toggleFavorite}
                className={`ml-3 p-1.5 rounded-full transition-all duration-200 flex-shrink-0 ${
                  isFavorite()
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'text-muted hover:text-yellow-400 hover:bg-yellow-500/10'
                }`}
                title={isFavorite() ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite() ? (
                  <span className="text-lg">★</span>
                ) : (
                  <span className="text-lg">☆</span>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Author and Framework */}
        <div className="flex items-center justify-between">
          <cite className="text-purple-300 font-medium">— {wisdom.author}</cite>
          <div className="flex items-center gap-2">
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
              `bg-gradient-to-r ${getFrameworkColor(wisdom.framework)} text-white`
            )}>
              <span>{getFrameworkEmoji(wisdom.framework)}</span>
              <span>{getShortFrameworkName(wisdom.framework)}</span>
            </div>
            <div className="text-xs text-muted bg-surface/60 px-2 py-1 rounded-full">
              Next: {getNextRefreshTime()}
            </div>
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

        {/* Action Buttons - Compact Design */}
        <div className="flex items-center gap-2 pt-3">
          <button
            onClick={loadDailyWisdom}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-md hover:bg-purple-500/30 transition-colors disabled:opacity-50 text-sm"
            title="Get new wisdom"
          >
            {isLoading ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            New
          </button>
          
          <button
            onClick={() => {
              // Show favorites modal or navigate to favorites page
              const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
              if (favorites.length > 0) {
                alert(`You have ${favorites.length} favorite quotes. This feature will be expanded soon!`);
              } else {
                alert('No favorite quotes yet. Add some by clicking the star icon!');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/60 border border-border/50 text-muted hover:text-text hover:bg-surface transition-colors text-sm"
            title="View your favorite quotes"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Favorites
          </button>
          
          <Link 
            href={`/coach?quote=${encodeURIComponent(wisdom.quote)}&author=${encodeURIComponent(wisdom.author)}&framework=${encodeURIComponent(wisdom.framework)}`}
            onClick={() => {
              // Scroll to top when navigating to coach page
              if (typeof window !== 'undefined') {
                window.scrollTo(0, 0);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-courage text-white rounded-md hover:from-primary/90 hover:to-courage/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
            title="Ask AI to discuss this quote"
          >
            <MessageCircle className="w-3.5 h-5" />
            Ask AI
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 