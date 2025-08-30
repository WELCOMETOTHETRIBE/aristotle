'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Timer, Target, BookOpen, Heart, Brain, Zap, 
  Users, Sun, Moon, Coffee, Droplets, Dumbbell, CheckCircle,
  Clock, TrendingUp, Activity, Sparkles, Flame, Wind, MessageSquare, Settings,
  Shield, Leaf
} from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ModuleWidget from '@/components/ModuleWidgets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WidgetInfo {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  status: 'active' | 'in-development' | 'planned';
  feedback?: string;
}

const WIDGETS: WidgetInfo[] = [
  {
    id: 'breathwork',
    name: 'Breathwork Widget',
    description: 'Interactive breathing patterns with visual feedback and haptic responses',
    icon: Wind,
    category: 'practice',
    status: 'active'
  },
  {
    id: 'focus_deepwork',
    name: 'Focus Timer',
    description: 'Deep work timer with Pomodoro technique and focus tracking',
    icon: Timer,
    category: 'productivity',
    status: 'active'
  },
  {
    id: 'gratitude_awe',
    name: 'Gratitude Journal',
    description: 'Daily gratitude practice with AI-powered reflection prompts',
    icon: Heart,
    category: 'wellness',
    status: 'active'
  },
  {
    id: 'movement_posture',
    name: 'Movement & Posture',
    description: 'Movement tracking and posture correction exercises',
    icon: Dumbbell,
    category: 'health',
    status: 'in-development'
  },
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Strength workout tracking and progression monitoring',
    icon: Shield,
    category: 'health',
    status: 'in-development'
  },
  {
    id: 'flexibility',
    name: 'Flexibility & Mobility',
    description: 'Stretching routines and flexibility tracking',
    icon: Leaf,
    category: 'health',
    status: 'planned'
  },
  {
    id: 'hydration',
    name: 'Hydration Tracker',
    description: 'Water intake tracking with visual progress and reminders',
    icon: Droplets,
    category: 'health',
    status: 'active'
  },
  {
    id: 'sleep_circadian',
    name: 'Sleep & Circadian',
    description: 'Sleep tracking and circadian rhythm optimization',
    icon: Moon,
    category: 'health',
    status: 'planned'
  }
];

const CATEGORIES = ['all', 'practice', 'productivity', 'wellness', 'health'];

export default function ModuleWidgetsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const filteredWidgets = WIDGETS.filter(widget => 
    selectedCategory === 'all' || widget.category === selectedCategory
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'in-development': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'planned': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'in-development': return <Settings className="w-4 h-4" />;
      case 'planned': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleFeedbackSubmit = (widgetId: string) => {
    const feedbackText = feedback[widgetId];
    if (feedbackText) {
      // Here you would typically send feedback to your backend
      console.log(`Feedback for ${widgetId}:`, feedbackText);
      
      // Add to developer feedback system
      const event = new CustomEvent('addDeveloperFeedback', {
        detail: {
          type: 'widget',
          targetId: widgetId,
          comment: feedbackText,
          priority: 'medium',
          category: 'widget_improvement'
        }
      });
      window.dispatchEvent(event);
      
      // Clear feedback
      setFeedback(prev => ({ ...prev, [widgetId]: '' }));
      setShowFeedbackModal(false);
    }
  };

  return (
    <PageLayout title="Module Widgets" description="Development testing and feedback for all interactive widgets">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Module Widgets</h1>
            <p className="text-gray-300">
              Test and provide feedback on all interactive widgets
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              General Feedback
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWidgets.map((widget) => (
            <motion.div
              key={widget.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <widget.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{widget.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {widget.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(widget.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(widget.status)}
                        <span className="capitalize">{widget.status}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Widget Preview */}
                  <div className="min-h-[200px] bg-black/20 rounded-lg border border-white/10 p-4">
                    <ModuleWidget 
                      moduleId={widget.id} 
                      moduleName={widget.name}
                      frameworkTone="stoic"
                    />
                  </div>

                  {/* Feedback Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Widget Feedback</h4>
                      <span className="text-xs text-gray-400 capitalize">{widget.category}</span>
                    </div>
                    
                    <textarea
                      placeholder="Share your feedback on this widget..."
                      value={feedback[widget.id] || ''}
                      onChange={(e) => setFeedback(prev => ({ 
                        ...prev, 
                        [widget.id]: e.target.value 
                      }))}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none"
                      rows={3}
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleFeedbackSubmit(widget.id)}
                        disabled={!feedback[widget.id]?.trim()}
                        className="flex-1"
                      >
                        Submit Feedback
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedWidget(selectedWidget === widget.id ? null : widget.id)}
                      >
                        {selectedWidget === widget.id ? 'Hide' : 'Test'} Widget
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Full Widget Test Modal */}
        {selectedWidget && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Testing: {WIDGETS.find(w => w.id === selectedWidget)?.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWidget(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <ModuleWidget 
                  moduleId={selectedWidget} 
                  moduleName={WIDGETS.find(w => w.id === selectedWidget)?.name || ''}
                  frameworkTone="stoic"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* General Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">General Widget Feedback</h3>
              
              <textarea
                placeholder="Share general feedback about the widget system..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none mb-4"
                rows={4}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFeedbackModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle general feedback submission
                    setShowFeedbackModal(false);
                  }}
                  className="flex-1"
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageLayout>
  );
} 