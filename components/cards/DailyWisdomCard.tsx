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
    enableNotifications: true,
  });

  // Load saved settings and user's selected frameworks, then load wisdom
  useEffect(() => {
    const loadSettingsAndFrameworks = async () => {
      // Load saved settings
      const savedSettings = localStorage.getItem('dailyWisdomSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Load user's selected frameworks from preferences
      try {
        const userPrefs = localStorage.getItem('userPreferences');
        if (userPrefs) {
          const parsed = JSON.parse(userPrefs);
          if (parsed.selectedFrameworks && parsed.selectedFrameworks.length > 0) {
            // Use user's selected frameworks
            setSettings(prev => ({
              ...prev,
              preferredFrameworks: parsed.selectedFrameworks
            }));
            console.log('🎯 Using user\'s selected frameworks:', parsed.selectedFrameworks);
          } else if (parsed.framework) {
            // Fallback to single framework
            setSettings(prev => ({
              ...prev,
              preferredFrameworks: [parsed.framework]
            }));
            console.log('🎯 Using user\'s primary framework:', parsed.framework);
          }
        }
      } catch (error) {
        console.error('Error loading user frameworks:', error);
      }
      
      // Load wisdom immediately after settings are loaded
      await loadDailyWisdom();
    };

    loadSettingsAndFrameworks();
  }, []);

  // Save settings
  const saveSettings = async (newSettings: WisdomSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dailyWisdomSettings', JSON.stringify(newSettings));
    
    // Also save framework preference to user profile
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/prefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ 
          preferences: {
            selectedFrameworks: newSettings.preferredFrameworks,
            framework: newSettings.preferredFrameworks[0] || null
          }
        }),
      });
      
      if (!response.ok) {
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
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }      if (response.ok) {
        console.log('Framework preferences saved to profile');
      }
    } catch (error) {
      console.error('Error saving framework preferences:', error);
    }
  };

  const loadDailyWisdom = async () => {
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
      console.log('📱 Mobile Debug - Request body:', {
        frameworks: frameworksToUse,
        date: new Date().toISOString().split('T')[0],
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      });      const response = await fetch('/api/generate/daily-wisdom', {
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
        
        // Log new wisdom to journal
        const wisdomLogData = {
          type: 'daily_wisdom_refresh',
          content: `Refreshed daily wisdom: "${newWisdom.quote}" - ${newWisdom.author} (${newWisdom.framework})`,
          category: 'wisdom',
          metadata: {
            quote: newWisdom.quote,
            author: newWisdom.author,
            framework: newWisdom.framework,
            frameworks: frameworksToUse,
            timestamp: new Date().toISOString(),
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
  }, [settings.preferredFrameworks]); // Re-run when frameworks change

  // Check if current quote is in favorites
  const isFavorite = () => {
    if (typeof window === 'undefined' || !wisdom) return false;
    const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
    return favorites.some((fav: any) => fav.quote === wisdom.quote && fav.author === wisdom.author);
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (typeof window === 'undefined' || !wisdom) return;
    
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
      console.log("📝 Attempting to log quote unfavorited to journal:", removeLogData);
      const logResult = await logToJournal(removeLogData);
      console.log("📝 Journal log result:", logResult);
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
      console.log("📝 Attempting to log quote favorited to journal:", addLogData);
      const logResult = await logToJournal(addLogData);
      console.log("📝 Journal log result:", logResult);
    }
    
    // Force re-render
    setWisdom({ ...wisdom });
  };

  const getFrameworkColor = (frameworkId: string) => {
    const colors: { [key: string]: string } = {
      'stoic': 'from-blue-500 to-indigo-500',
      'spartan': 'from-red-500 to-orange-500',
      'bushido': 'from-gray-700 to-gray-900',
      'monastic': 'from-purple-500 to-violet-500',
      'berserker': 'from-orange-600 to-red-600',
      'druid': 'from-green-500 to-emerald-500',
      'monk': 'from-yellow-500 to-orange-500',
      'taoist': 'from-green-600 to-green-800',
      'epicurean': 'from-pink-500 to-purple-500',
      'aristotelian': 'from-indigo-600 to-blue-600',
    };
    return colors[frameworkId] || 'from-purple-500 to-violet-500';
  };

  const getFrameworkEmoji = (frameworkId: string) => {
    const framework = availableFrameworks.find(f => f.id === frameworkId);
    return framework?.emoji || '🧠';
  };

  const getFrameworkName = (frameworkId: string) => {
    const framework = availableFrameworks.find(f => f.id === frameworkId);
    return framework?.name || frameworkId;
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
              Each day brings a new piece of wisdom from your selected philosophical traditions. 
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
                Select Frameworks for Wisdom
              </label>
              <p className="text-xs text-muted mb-3">
                Choose which philosophical traditions you'd like to receive wisdom from
              </p>
              <div className="grid grid-cols-2 gap-2">
                {availableFrameworks.map((framework) => (
                  <button
                    key={framework.id}
                    onClick={() => {
                      const newFrameworks = settings.preferredFrameworks.includes(framework.id)
                        ? settings.preferredFrameworks.filter(f => f !== framework.id)
                        : [...settings.preferredFrameworks, framework.id];
                      saveSettings({ ...settings, preferredFrameworks: newFrameworks });
                    }}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors text-left",
                      settings.preferredFrameworks.includes(framework.id)
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-surface/50 text-muted border border-border/50 hover:bg-surface"
                    )}
                  >
                    <span className="text-sm">{framework.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{framework.name}</div>
                      <div className="text-xs opacity-75 truncate">{framework.description}</div>
                    </div>
                    {settings.preferredFrameworks.includes(framework.id) && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    )}
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-purple-300">Loading wisdom...</span>
            </div>
          </div>
        ) : wisdom ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-purple-300 mb-2">Failed to load wisdom</div>
              <button
                onClick={loadDailyWisdom}
                className="text-sm text-purple-400 hover:text-purple-300 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {wisdom && (
          <>
            {/* Author and Framework */}
        <div className="flex items-center justify-between">
          <cite className="text-purple-300 font-medium">— {wisdom.author}</cite>
          <div className="flex items-center gap-2">
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
              `bg-gradient-to-r ${getFrameworkColor(wisdom.framework.toLowerCase())} text-white`
            )}>
              <span>{getFrameworkEmoji(wisdom.framework.toLowerCase())}</span>
              <span>{getFrameworkName(wisdom.framework.toLowerCase())}</span>
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
              const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
              if (favorites.length > 0) {
                // Show a simple modal with favorites
                const favoritesList = favorites.map((fav: any, index: number) => 
                  `${index + 1}. "${fav.quote}" - ${fav.author}`
                ).join('\n\n');
                
                // Create a more user-friendly display
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
                modal.innerHTML = `
                  <div class="bg-surface border border-border rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-semibold text-text">Your Favorite Quotes</h3>
                      <button onclick="this.closest('.fixed').remove()" class="text-muted hover:text-text">✕</button>
                    </div>
                    <div class="space-y-3">
                      ${favorites.map((fav: any, index: number) => `
                        <div class="p-3 bg-surface/50 rounded-lg border border-border/50">
                          <blockquote class="text-sm italic text-text mb-2">"${fav.quote}"</blockquote>
                          <div class="flex items-center justify-between">
                            <cite class="text-xs text-purple-300">— ${fav.author}</cite>
                            <span class="text-xs text-muted">${fav.framework}</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                    <div class="mt-4 text-center">
                      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Close
                      </button>
                    </div>
                  </div>
                `;
                document.body.appendChild(modal);
                
                // Close on backdrop click
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) modal.remove();
                });
              } else {
                alert('No favorite quotes yet. Add some by clicking the star icon!');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/60 border border-border/50 text-muted hover:text-text hover:bg-surface transition-colors text-sm"
            title="View your favorite quotes"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Favorites ({JSON.parse(localStorage.getItem('favoriteQuotes') || '[]').length})
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
          </>
        )}
      </div>
    </motion.div>
  );
}
