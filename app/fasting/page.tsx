'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, Clock, TrendingUp, Brain, Heart, Target, Zap, Activity, BarChart3, Timer, Sparkles, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FastingSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  type: string;
  status: string;
  notes?: string;
}

interface FastingBenefit {
  id: string;
  benefitType: string;
  intensity: number;
  notes?: string;
  recordedAt: string;
}

interface BenefitAnalysis {
  benefitType: string;
  averageIntensity: number;
  frequency: number;
  trend: string;
  description: string;
  scientificBackground: string;
}

const FASTING_TYPES = [
  { 
    value: '16:8', 
    label: '16:8 Intermittent Fasting', 
    description: '16 hours fasting, 8 hours eating window',
    icon: '⏰',
    color: 'from-blue-500 to-cyan-500',
    benefits: ['Weight management', 'Metabolic health', 'Easy to maintain']
  },
  { 
    value: '18:6', 
    label: '18:6 Intermittent Fasting', 
    description: '18 hours fasting, 6 hours eating window',
    icon: '🔥',
    color: 'from-purple-500 to-pink-500',
    benefits: ['Enhanced fat burning', 'Improved focus', 'Better insulin sensitivity']
  },
  { 
    value: '20:4', 
    label: '20:4 Warrior Diet', 
    description: '20 hours fasting, 4 hours eating window',
    icon: '⚔️',
    color: 'from-orange-500 to-red-500',
    benefits: ['Deep ketosis', 'Autophagy activation', 'Mental clarity']
  },
  { 
    value: '24h', 
    label: '24 Hour Fast', 
    description: 'Complete day of fasting',
    icon: '🌙',
    color: 'from-indigo-500 to-purple-500',
    benefits: ['Cellular repair', 'Immune boost', 'Mental reset']
  },
  { 
    value: '36h', 
    label: '36 Hour Fast', 
    description: 'Extended fasting period',
    icon: '🌟',
    color: 'from-green-500 to-emerald-500',
    benefits: ['Deep autophagy', 'Hormone optimization', 'Cellular renewal']
  },
  { 
    value: '48h', 
    label: '48 Hour Fast', 
    description: 'Two-day fasting protocol',
    icon: '💎',
    color: 'from-teal-500 to-blue-500',
    benefits: ['Maximum autophagy', 'Stem cell activation', 'Metabolic reset']
  },
  { 
    value: '72h', 
    label: '72 Hour Fast', 
    description: 'Three-day fasting protocol',
    icon: '🚀',
    color: 'from-violet-500 to-purple-500',
    benefits: ['Complete reset', 'Immune regeneration', 'Deep healing']
  },
];

const BENEFIT_TYPES = [
  { value: 'energy', label: 'Energy Levels', icon: Zap },
  { value: 'clarity', label: 'Mental Clarity', icon: Brain },
  { value: 'weight_loss', label: 'Weight Loss', icon: Target },
  { value: 'inflammation', label: 'Inflammation', icon: Heart },
  { value: 'autophagy', label: 'Autophagy', icon: Activity },
  { value: 'insulin_sensitivity', label: 'Insulin Sensitivity', icon: TrendingUp },
  { value: 'mental_focus', label: 'Mental Focus', icon: Brain },
  { value: 'digestive_health', label: 'Digestive Health', icon: Heart },
];

export default function FastingPage() {
  const [isStarting, setIsStarting] = useState(false);
  const [selectedType, setSelectedType] = useState('16:8');
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState('');
  const [benefitIntensity, setBenefitIntensity] = useState(5);
  const [benefitNotes, setBenefitNotes] = useState('');

  const queryClient = useQueryClient();

  // Fetch fasting sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['fasting-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/fasting');
      return response.json();
    }
  });

  // Fetch benefits and analysis
  const { data: benefitsData } = useQuery({
    queryKey: ['fasting-benefits'],
    queryFn: async () => {
      const response = await fetch('/api/fasting/benefits');
      return response.json();
    }
  });

  const sessions: FastingSession[] = sessionsData?.sessions || [];
  const benefits: FastingBenefit[] = benefitsData?.benefits || [];
  const analysis: BenefitAnalysis[] = benefitsData?.analysis || [];

  // Find current active session
  useEffect(() => {
    const active = sessions.find(s => s.status === 'active');
    setCurrentSession(active || null);
  }, [sessions]);

  // Update elapsed time for active session
  useEffect(() => {
    if (!currentSession) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(currentSession.startTime).getTime();
      const now = new Date().getTime();
      setElapsedTime(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  // Start fasting session
  const startFastingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/fasting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: new Date().toISOString(),
          type: selectedType
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasting-sessions'] });
      setIsStarting(false);
    }
  });

  // End fasting session
  const endFastingMutation = useMutation({
    mutationFn: async () => {
      if (!currentSession) return;
      
      const response = await fetch('/api/fasting', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fastingSessionId: currentSession.id,
          endTime: new Date().toISOString()
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasting-sessions'] });
      setCurrentSession(null);
    }
  });

  // Record benefit
  const recordBenefitMutation = useMutation({
    mutationFn: async () => {
      if (!currentSession) return;
      
      const response = await fetch('/api/fasting/benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fastingSessionId: currentSession.id,
          benefitType: selectedBenefit,
          intensity: benefitIntensity,
          notes: benefitNotes
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasting-benefits'] });
      setShowBenefitModal(false);
      setSelectedBenefit('');
      setBenefitIntensity(5);
      setBenefitNotes('');
    }
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFastingStage = (hours: number) => {
    if (hours < 12) return { stage: 'Early Fasting', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' };
    if (hours < 18) return { stage: 'Ketosis', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' };
    if (hours < 24) return { stage: 'Autophagy Initiation', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' };
    if (hours < 48) return { stage: 'Deep Autophagy', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' };
    return { stage: 'Extended Fasting', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' };
  };

  const stage = getFastingStage(Math.floor(elapsedTime / 3600));
  const selectedFastingType = FASTING_TYPES.find(type => type.value === selectedType) || FASTING_TYPES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Timer className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fasting Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your fasting journey with real-time benefit analysis and insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Timer Widget */}
            <div>
              <Card className="glass-effect border-0 shadow-2xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">{selectedFastingType.icon}</span>
                    <CardTitle className="text-2xl">{selectedFastingType.label}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{selectedFastingType.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center pb-8">
                  {/* Timer Display */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Timer Circle */}
                      <div className="w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800 mb-2">
                            {currentSession ? formatTime(elapsedTime) : '00:00:00'}
                          </div>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${stage.bgColor} ${stage.color} ${stage.borderColor} border`}>
                            <Activity className="h-3 w-3" />
                            {currentSession ? stage.stage : 'Ready to Start'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress ring */}
                      <div className="absolute inset-0 w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-200"
                          />
                          {currentSession && (
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              className="text-blue-500 transition-all duration-1000 ease-in-out"
                              strokeDasharray={`${2 * Math.PI * 45}`}
                              strokeDashoffset={`${2 * Math.PI * 45 * (1 - (elapsedTime / (24 * 3600)))}`}
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-3 mb-6">
                    {!currentSession ? (
                      <Button 
                        onClick={() => {
                          setIsStarting(true);
                          startFastingMutation.mutate();
                        }}
                        disabled={startFastingMutation.isPending}
                        size="lg" 
                        className="px-8 py-4 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Fast
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => setShowBenefitModal(true)}
                          size="lg"
                          className="px-6 py-4 text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                        >
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Record Benefit
                        </Button>
                        <Button
                          onClick={() => endFastingMutation.mutate()}
                          variant="destructive"
                          size="lg"
                          disabled={endFastingMutation.isPending}
                          className="px-6 py-4 text-base"
                        >
                          <Square className="h-5 w-5 mr-2" />
                          End Fast
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Session Info */}
                  {currentSession && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Started: {new Date(currentSession.startTime).toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Getting Started & Benefits Panel */}
            <div>
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Choose your fasting type</h4>
                        <p className="text-muted-foreground">Select a protocol that fits your lifestyle</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Start your fast</h4>
                        <p className="text-muted-foreground">Begin tracking your fasting journey</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Track benefits</h4>
                        <p className="text-muted-foreground">Record how you feel during your fast</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Stay hydrated</h4>
                        <p className="text-muted-foreground">Drink plenty of water and electrolytes</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Benefits Section */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Key Benefits
                    </h3>
                    <div className="space-y-2">
                      {selectedFastingType.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fasting Stages */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Fasting Stages
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="font-medium">0-12h</span>
                        <span className="text-blue-600">Early Fasting</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="font-medium">12-18h</span>
                        <span className="text-green-600">Ketosis</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <span className="font-medium">18-24h</span>
                        <span className="text-purple-600">Autophagy</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="font-medium">24h+</span>
                        <span className="text-orange-600">Deep Healing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Choose Fasting Type Panel */}
            <div>
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Choose Protocol
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {FASTING_TYPES.map((type) => (
                      <div
                        key={type.value}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedType === type.value
                            ? `border-primary bg-gradient-to-r ${type.color} bg-opacity-10 shadow-lg`
                            : 'border-gray-200 hover:border-primary/50 bg-white/50'
                        }`}
                        onClick={() => setSelectedType(type.value)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{type.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{type.label}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {type.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {type.benefits.slice(0, 2).map((benefit, index) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Sessions - Below the main grid */}
          {sessions.length > 0 && (
            <div className="mt-8">
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.slice(0, 6).map((session) => (
                      <div key={session.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{session.type}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            session.status === 'completed' ? 'bg-green-100 text-green-700' :
                            session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-medium mt-1">
                          {session.duration ? `${Math.floor(session.duration / 60)}h ${session.duration % 60}m` : 'Active'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Benefit Analysis - Below the main grid */}
          {analysis.length > 0 && (
            <div className="mt-8">
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Benefit Analysis
                  </CardTitle>
                  <CardDescription>
                    Your fasting benefits over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.map((benefit) => {
                      const IconComponent = BENEFIT_TYPES.find(b => b.value === benefit.benefitType)?.icon || Activity;
                      return (
                        <div key={benefit.benefitType} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                            <span className="font-semibold capitalize text-sm">
                              {benefit.benefitType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {benefit.description}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Avg: {benefit.averageIntensity}/10</span>
                            <span className={`px-2 py-1 rounded ${
                              benefit.trend === 'improving' ? 'bg-green-100 text-green-700' :
                              benefit.trend === 'declining' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {benefit.trend}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Benefit Recording Modal */}
          {showBenefitModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4 glass-effect border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Record Benefit</CardTitle>
                  <CardDescription>
                    Track how you're feeling during your fast
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Benefit Type</label>
                    <select
                      value={selectedBenefit}
                      onChange={(e) => setSelectedBenefit(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white/50 backdrop-blur-sm"
                    >
                      <option value="">Select a benefit...</option>
                      {BENEFIT_TYPES.map((benefit) => (
                        <option key={benefit.value} value={benefit.value}>
                          {benefit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Intensity (1-10): {benefitIntensity}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={benefitIntensity}
                      onChange={(e) => setBenefitIntensity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                    <textarea
                      value={benefitNotes}
                      onChange={(e) => setBenefitNotes(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white/50 backdrop-blur-sm"
                      rows={3}
                      placeholder="How are you feeling?"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowBenefitModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => recordBenefitMutation.mutate()}
                      disabled={!selectedBenefit || recordBenefitMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 