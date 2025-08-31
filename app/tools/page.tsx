'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Plus, Check, Sparkles, Wind, Heart, Droplets, Moon, 
  Target, Timer, Brain, Activity, BookOpen, Zap, Shield, Leaf,
  Settings, Palette, Grid3X3, Star, Eye, EyeOff
} from 'lucide-react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'wellness' | 'productivity' | 'mindfulness' | 'health' | 'learning';
  color: string;
  isActive: boolean;
  isAdded: boolean;
  preview?: React.ReactNode;
}

const availableWidgets: Widget[] = [
  {
    id: 'breathwork',
    name: 'Breathwork Timer',
    description: 'Guided breathing exercises with visual feedback',
    icon: Wind,
    category: 'mindfulness',
    color: 'from-blue-500 to-cyan-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'mood_tracker',
    name: 'Mood Tracker',
    description: 'Track your daily mood and emotional patterns',
    icon: Heart,
    category: 'wellness',
    color: 'from-pink-500 to-rose-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'hydration',
    name: 'Hydration Tracker',
    description: 'Monitor your daily water intake',
    icon: Droplets,
    category: 'health',
    color: 'from-cyan-500 to-blue-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'sleep_tracker',
    name: 'Sleep Tracker',
    description: 'Track your sleep patterns and quality',
    icon: Moon,
    category: 'health',
    color: 'from-indigo-500 to-purple-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'focus_timer',
    name: 'Focus Timer',
    description: 'Pomodoro timer for deep work sessions',
    icon: Timer,
    category: 'productivity',
    color: 'from-orange-500 to-red-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'habit_tracker',
    name: 'Habit Tracker',
    description: 'Build and track daily habits',
    icon: Target,
    category: 'productivity',
    color: 'from-green-500 to-emerald-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'wisdom_spotlight',
    name: 'Wisdom Spotlight',
    description: 'Daily philosophical insights and lessons',
    icon: Brain,
    category: 'learning',
    color: 'from-purple-500 to-violet-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'movement_tracker',
    name: 'Movement Tracker',
    description: 'Track your daily movement and exercise',
    icon: Activity,
    category: 'health',
    color: 'from-emerald-500 to-teal-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'gratitude_journal',
    name: 'Gratitude Journal',
    description: 'Daily gratitude practice and reflection',
    icon: BookOpen,
    category: 'wellness',
    color: 'from-yellow-500 to-orange-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'energy_tracker',
    name: 'Energy Tracker',
    description: 'Monitor your energy levels throughout the day',
    icon: Zap,
    category: 'wellness',
    color: 'from-amber-500 to-yellow-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'strength_tracker',
    name: 'Strength Tracker',
    description: 'Track your strength training progress',
    icon: Shield,
    category: 'health',
    color: 'from-red-500 to-pink-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'flexibility_tracker',
    name: 'Flexibility Tracker',
    description: 'Track your flexibility and mobility progress',
    icon: Leaf,
    category: 'health',
    color: 'from-green-500 to-lime-500',
    isActive: true,
    isAdded: false,
  },
];

const categories = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  { id: 'wellness', name: 'Wellness', icon: Heart },
  { id: 'productivity', name: 'Productivity', icon: Target },
  { id: 'mindfulness', name: 'Mindfulness', icon: Wind },
  { id: 'health', name: 'Health', icon: Activity },
  { id: 'learning', name: 'Learning', icon: Brain },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets);
  const [showAddedOnly, setShowAddedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load user's added widgets from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('userWidgets');
    if (savedWidgets) {
      const userWidgets = JSON.parse(savedWidgets);
      setWidgets(prev => 
        prev.map(widget => ({
          ...widget,
          isAdded: userWidgets.includes(widget.id)
        }))
      );
    }
  }, []);

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, isAdded: !widget.isAdded }
          : widget
      )
    );

    // Save to localStorage
    const updatedWidgets = widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isAdded: !widget.isAdded }
        : widget
    );
    
    const addedWidgetIds = updatedWidgets
      .filter(widget => widget.isAdded)
      .map(widget => widget.id);
    
    localStorage.setItem('userWidgets', JSON.stringify(addedWidgetIds));
  };

  const filteredWidgets = widgets.filter(widget => {
    if (showAddedOnly && !widget.isAdded) return false;
    if (selectedCategory !== 'all' && widget.category !== selectedCategory) return false;
    if (searchQuery && !widget.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const addedWidgetsCount = widgets.filter(w => w.isAdded).length;

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="pb-20 pt-4 px-4">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-text">Tools</h1>
              <p className="text-muted text-sm">Customize your daily experience</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Active Widgets</p>
                <p className="text-2xl font-bold text-text">{addedWidgetsCount}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddedOnly(!showAddedOnly)}
                  className={`p-2 rounded-lg transition-colors ${
                    showAddedOnly 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-surface-2 text-muted hover:text-text'
                  }`}
                >
                  {showAddedOnly ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
            />
            <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-border text-muted hover:text-text hover:border-primary/30'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="space-y-4">
          {filteredWidgets.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No widgets found</h3>
              <p className="text-muted">
                {showAddedOnly 
                  ? "You haven't added any widgets yet. Browse and add some to get started!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredWidgets.map((widget) => (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-xl p-4 hover:shadow-2 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Widget Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${widget.color} rounded-xl flex items-center justify-center shadow-sm`}>
                        <widget.icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Widget Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text">{widget.name}</h3>
                          {widget.isAdded && (
                            <div className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                              Added
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted mb-2">{widget.description}</p>
                        
                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-surface-2 text-muted text-xs rounded-full">
                            {categories.find(c => c.id === widget.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add/Remove Button */}
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`ml-4 p-2 rounded-lg transition-all duration-200 ${
                        widget.isAdded
                          ? 'bg-success/20 text-success hover:bg-success/30'
                          : 'bg-primary/20 text-primary hover:bg-primary/30'
                      }`}
                    >
                      {widget.isAdded ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        {!showAddedOnly && (
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">How to use widgets</h3>
                <p className="text-sm text-muted">
                  Add widgets to your Today page to customize your daily experience. 
                  Each widget provides specific functionality to help you track, practice, and grow.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <TabBar />
      <GuideFAB />
    </div>
  );
} 