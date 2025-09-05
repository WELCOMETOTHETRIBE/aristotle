'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings, Heart, Timer, Target, Sparkles, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import { EnhancedBreathworkWidget } from '@/components/EnhancedBreathworkWidget';

interface BreathPattern {
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    hold2: number;
    cycles: number;
  };
  benefits: string[];
  color: string;
  icon: string;
}

const breathPatterns: BreathPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Equal duration for each phase to calm the nervous system',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 4, cycles: 10 },
    benefits: ['Reduces stress', 'Improves focus', 'Calms anxiety'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🧘',
  },
  {
    name: '4-7-8 Breathing',
    description: 'Extended exhale to activate the parasympathetic nervous system',
    pattern: { inhale: 4, hold: 7, exhale: 8, hold2: 0, cycles: 8 },
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Manages cravings'],
    color: 'from-purple-500 to-pink-500',
    icon: '🌙',
  },
  {
    name: 'Wim Hof Method',
    description: 'Deep breathing followed by breath retention',
    pattern: { inhale: 2, hold: 0, exhale: 2, hold2: 15, cycles: 6 },
    benefits: ['Boosts energy', 'Strengthens immune system', 'Increases focus'],
    color: 'from-orange-500 to-red-500',
    icon: '🔥',
  },
  {
    name: 'Coherent Breathing',
    description: 'Slow, rhythmic breathing at 5-6 breaths per minute',
    pattern: { inhale: 5, hold: 0, exhale: 5, hold2: 0, cycles: 12 },
    benefits: ['Balances nervous system', 'Reduces blood pressure', 'Improves mood'],
    color: 'from-green-500 to-emerald-500',
    icon: '🌿',
  },
  {
    name: 'Triangle Breathing',
    description: 'Equal inhale and exhale with no holds for simplicity',
    pattern: { inhale: 6, hold: 0, exhale: 6, hold2: 0, cycles: 10 },
    benefits: ['Simple and accessible', 'Reduces heart rate', 'Promotes relaxation'],
    color: 'from-indigo-500 to-blue-500',
    icon: '🔺',
  },
  {
    name: 'Ocean Breath',
    description: 'Gentle breathing with soft sound to calm the mind',
    pattern: { inhale: 4, hold: 2, exhale: 6, hold2: 0, cycles: 8 },
    benefits: ['Soothes nervous system', 'Improves concentration', 'Reduces tension'],
    color: 'from-teal-500 to-cyan-500',
    icon: '🌊',
  },
];

export default function BreathPage() {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(breathPatterns[0]);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const [showEnhancedWidget, setShowEnhancedWidget] = useState(true);

  const togglePatternExpansion = (patternName: string) => {
    setExpandedPattern(expandedPattern === patternName ? null : patternName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enhanced Breathwork
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Perfectly synchronized visual and audio cues for an optimal breathwork experience
            </p>
            
            {/* Enhanced Features Notice */}
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg inline-block">
              <p className="text-sm text-green-600 font-medium">
                ✨ Enhanced with perfect audio-visual synchronization, haptic feedback, and preloaded audio
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Enhanced Breathwork Widget */}
            <div className="xl:col-span-2">
              <Card className="glass-effect border-0 shadow-2xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">{selectedPattern.icon}</span>
                    <CardTitle className="text-2xl">{selectedPattern.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{selectedPattern.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center pb-8">
                  {/* Enhanced Widget Toggle */}
                  <div className="flex justify-center gap-2 mb-6">
                    <Button
                      variant={showEnhancedWidget ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowEnhancedWidget(true)}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Enhanced Widget
                    </Button>
                    <Button
                      variant={!showEnhancedWidget ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowEnhancedWidget(false)}
                      className="flex items-center gap-2"
                    >
                      <Timer className="h-4 w-4" />
                      Classic Timer
                    </Button>
                  </div>

                  {/* Enhanced Breathwork Widget */}
                  {showEnhancedWidget && (
                    <EnhancedBreathworkWidget frameworkTone="stoic" />
                  )}

                  {/* Classic Timer (placeholder for now) */}
                  {!showEnhancedWidget && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🧘</div>
                      <h3 className="text-xl font-semibold mb-2">Classic Timer</h3>
                      <p className="text-muted-foreground">
                        Classic timer interface will be available soon.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Getting Started Panel */}
            <div>
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Enhanced Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ✨
                      </div>
                      <div>
                        <h4 className="font-medium">Perfect Audio Sync</h4>
                        <p className="text-muted-foreground">Audio cues play exactly when phases change</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        📳
                      </div>
                      <div>
                        <h4 className="font-medium">Haptic Feedback</h4>
                        <p className="text-muted-foreground">Vibrations for phase transitions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        🎵
                      </div>
                      <div>
                        <h4 className="font-medium">Preloaded Audio</h4>
                        <p className="text-muted-foreground">No delays, instant audio playback</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ⏱️
                      </div>
                      <div>
                        <h4 className="font-medium">Smart Countdown</h4>
                        <p className="text-muted-foreground">Audio countdown at perfect intervals</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Benefits Section */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Benefits
                    </h3>
                    <div className="space-y-2">
                      {selectedPattern.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Choose Pattern Panel */}
            <div className="xl:col-span-1">
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Choose Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {breathPatterns.map((pattern) => (
                      <div
                        key={pattern.name}
                        className={`rounded-xl border-2 transition-all duration-300 ${
                          selectedPattern.name === pattern.name
                            ? `border-primary bg-gradient-to-r ${pattern.color} bg-opacity-10 shadow-lg`
                            : 'border-gray-200 bg-white/50'
                        }`}
                      >
                        {/* Pattern Header - Always Visible */}
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => {
                            setSelectedPattern(pattern);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{pattern.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-1 truncate">{pattern.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {pattern.description}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePatternExpansion(pattern.name);
                              }}
                              className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                            >
                              {expandedPattern === pattern.name ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedPattern === pattern.name && (
                          <div className="px-3 pb-3 border-t border-gray-100">
                            <div className="pt-3 space-y-3">
                              {/* Pattern Details */}
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Breathing Pattern</h5>
                                <div className="flex flex-wrap gap-1">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {pattern.pattern.inhale}s inhale
                                  </span>
                                  {pattern.pattern.hold > 0 && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                      {pattern.pattern.hold}s hold
                                    </span>
                                  )}
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {pattern.pattern.exhale}s exhale
                                  </span>
                                  {pattern.pattern.hold2 > 0 && (
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                      {pattern.pattern.hold2}s hold
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Benefits */}
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Benefits</h5>
                                <div className="space-y-1">
                                  {pattern.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0" />
                                      <span className="text-xs text-gray-600">{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cycles Info */}
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 mb-1">Total Cycles</h5>
                                <span className="text-xs text-gray-600">{pattern.pattern.cycles} cycles</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 