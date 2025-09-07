'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Plus, Check, Sparkles, Wind, Heart, Droplets, Moon, 
  Target, Timer, Brain, Activity, BookOpen, Zap, Shield, Leaf,
  Settings, Palette, Grid3X3, Star, Eye, EyeOff, Camera, X
} from 'lucide-react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { useAuth } from '@/lib/auth-context';

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
    id: 'movement_tracker',
    name: 'Movement Tracker',
    description: 'Track physical activity and movement',
    icon: Activity,
    category: 'health',
    color: 'from-emerald-500 to-green-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'reading_tracker',
    name: 'Reading Tracker',
    description: 'Track your reading progress and goals',
    icon: BookOpen,
    category: 'learning',
    color: 'from-amber-500 to-orange-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'energy_tracker',
    name: 'Energy Tracker',
    description: 'Monitor your daily energy levels',
    icon: Zap,
    category: 'wellness',
    color: 'from-yellow-500 to-amber-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'boundary_tracker',
    name: 'Boundary Tracker',
    description: 'Track and maintain personal boundaries',
    icon: Shield,
    category: 'mindfulness',
    color: 'from-slate-500 to-gray-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'virtue_balance',
    name: 'Virtue Balance',
    description: 'Track your virtue development and balance',
    icon: Leaf,
    category: 'learning',
    color: 'from-teal-500 to-cyan-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'terminology',
    name: 'Terminology',
    description: 'Learn philosophical terms and concepts',
    icon: Brain,
    category: 'learning',
    color: 'from-violet-500 to-purple-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'fasting_tracker',
    name: 'Fasting Tracker',
    description: 'Track your fasting windows and progress',
    icon: Timer,
    category: 'health',
    color: 'from-red-500 to-pink-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'gratitude_journal',
    name: 'Gratitude Journal',
    description: 'Daily gratitude practice and reflection',
    icon: Heart,
    category: 'mindfulness',
    color: 'from-rose-500 to-pink-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'journal',
    name: 'Journal',
    description: 'Personal journal for daily thoughts and reflections',
    icon: BookOpen,
    category: 'mindfulness',
    color: 'from-blue-500 to-indigo-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'goal_tracker',
    name: 'Goal Tracker',
    description: 'Track and monitor your personal goals and progress',
    icon: Target,
    category: 'productivity',
    color: 'from-green-500 to-teal-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'balance_gyro',
    name: 'Balance Challenge',
    description: 'Test your balance and mindfulness with gyroscope challenges',
    icon: Activity,
    category: 'mindfulness',
    color: 'from-teal-500 to-cyan-500',
    isActive: true,
    isAdded: false,
  },
  {
    id: 'nature_photo_log',
    name: 'Nature Photo Log',
    description: 'Capture and reflect on moments in nature',
    icon: Camera,
    category: 'mindfulness',
    color: 'from-green-500 to-emerald-500',
    isActive: true,
    isAdded: false,
  }
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
  const { user, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets);
  const [showAddedOnly, setShowAddedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Load user's added widgets from localStorage
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (user) {
      // Authenticated user - load their personal widgets
      const savedWidgets = localStorage.getItem(`userWidgets_${user.id}`);
      if (savedWidgets) {
        const userWidgets = JSON.parse(savedWidgets);
        setWidgets(prev => 
          prev.map(widget => ({
            ...widget,
            isAdded: userWidgets.includes(widget.id)
          }))
        );
      } else {
        // New authenticated user - start with no widgets added
        setWidgets(prev => 
          prev.map(widget => ({
            ...widget,
            isAdded: false
          }))
        );
      }
    } else {
      // Unauthenticated users start with no widgets added
      setWidgets(prev => 
        prev.map(widget => ({
          ...widget,
          isAdded: false
        }))
      );
    }
  }, [user, loading]);

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => {
      const updatedWidgets = prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, isAdded: !widget.isAdded }
          : widget
      );
      
      // Save to user-specific localStorage
      const addedWidgetIds = updatedWidgets
        .filter(widget => widget.isAdded)
        .map(widget => widget.id);
      
      if (user) {
        // Authenticated user - save to user-specific storage
        localStorage.setItem(`userWidgets_${user.id}`, JSON.stringify(addedWidgetIds));
      }
      
      // Show feedback
      const widget = updatedWidgets.find(w => w.id === widgetId);
      if (widget) {
        const action = widget.isAdded ? 'added to' : 'removed from';
        const message = `${widget.name} ${action} your Today page`;
        setShowFeedback({ message, type: 'success' });
        
        // Auto-hide feedback after 2 seconds
        setTimeout(() => setShowFeedback(null), 2000);
        
        console.log(message);
      }
      
      return updatedWidgets;
    });
  };

  const openWidgetModal = (widget: Widget) => {
    setSelectedWidget(widget);
    setShowModal(true);
  };

  const closeWidgetModal = () => {
    setShowModal(false);
    setSelectedWidget(null);
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
                {addedWidgetsCount > 0 && (
                  <button
                    onClick={() => window.location.href = '/today'}
                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    View on Homepage
                  </button>
                )}
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

        {/* Widgets Gallery Grid */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredWidgets.map((widget) => (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-surface border border-border rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Widget Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${widget.color} rounded-2xl flex items-center justify-center shadow-sm mb-3 mx-auto group-hover:shadow-lg transition-shadow`}>
                    <widget.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Widget Info */}
                  <div className="text-center mb-3">
                    <h3 className="font-semibold text-text text-sm mb-1 line-clamp-2">{widget.name}</h3>
                    <p className="text-xs text-muted line-clamp-2">{widget.description}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {widget.isAdded ? (
                      <>
                        <motion.button
                          onClick={() => openWidgetModal(widget)}
                          className="flex-1 px-3 py-2 bg-surface-2 hover:bg-surface-3 text-text text-xs rounded-lg transition-colors border border-border"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWidget(widget.id);
                          }}
                          className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs rounded-lg transition-colors border border-red-500/30 flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-3 h-3" />
                          Remove
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWidget(widget.id);
                        }}
                        className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-3 h-3" />
                        Add to Today
                      </motion.button>
                    )}
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
                  Click "Add to Today" to instantly add widgets to your Today page, or "Remove" to take them off. 
                  Use "View" to see more details about added widgets. Each widget provides specific functionality to help you track, practice, and grow.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Feedback Notification */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border ${
              showFeedback.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
            }`}>
              <div className="flex items-center gap-2">
                {showFeedback.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{showFeedback.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Widget Modal */}
      <AnimatePresence>
        {showModal && selectedWidget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeWidgetModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-surface border border-border rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeWidgetModal}
                className="absolute top-4 right-4 w-8 h-8 bg-surface-2 hover:bg-surface-3 rounded-full flex items-center justify-center text-muted hover:text-text transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Widget Content */}
              <div className="p-6">
                {/* Widget Icon */}
                <div className={`w-20 h-20 bg-gradient-to-r ${selectedWidget.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto`}>
                  <selectedWidget.icon className="w-10 h-10 text-white" />
                </div>

                {/* Widget Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-text mb-2">{selectedWidget.name}</h2>
                  <p className="text-muted leading-relaxed">{selectedWidget.description}</p>
                </div>

                {/* Category */}
                <div className="text-center mb-6">
                  <span className="px-3 py-1 bg-surface-2 text-muted text-sm rounded-full">
                    {categories.find(c => c.id === selectedWidget.category)?.name}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedWidget.isAdded ? (
                    <motion.button
                      onClick={() => {
                        toggleWidget(selectedWidget.id);
                        closeWidgetModal();
                      }}
                      className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-semibold transition-all duration-200 border border-red-500/30 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                      Remove from Today
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => {
                        toggleWidget(selectedWidget.id);
                        closeWidgetModal();
                      }}
                      className="flex-1 py-3 bg-primary text-white hover:bg-primary/90 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      Add to Today
                    </motion.button>
                  )}
                  <motion.button
                    onClick={closeWidgetModal}
                    className="px-6 py-3 bg-surface-2 hover:bg-surface-3 text-text rounded-xl font-semibold transition-all duration-200 border border-border"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TabBar />
      <GuideFAB />
    </div>
  );
} 