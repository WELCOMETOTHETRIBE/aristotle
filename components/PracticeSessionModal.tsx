'use client';

import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle, Clock, Star, Heart, Brain, Shield, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: string;
    benefits: string[];
    instructions: string[];
    moduleId?: string;
    frameworkId?: string;
  };
}

interface SessionState {
  isActive: boolean;
  isCompleted: boolean;
  timeElapsed: number;
  timeRemaining: number;
  currentStep: number;
  sessionId?: string;
  moodPre?: number;
  moodPost?: number;
  notes: string;
}

const virtueIcons = {
  wisdom: Brain,
  courage: Shield,
  justice: Scale,
  temperance: Heart,
};

export default function PracticeSessionModal({ isOpen, onClose, practice }: PracticeSessionModalProps) {
  const [session, setSession] = useState<SessionState>({
    isActive: false,
    isCompleted: false,
    timeElapsed: 0,
    timeRemaining: practice.duration * 60,
    currentStep: 0,
    notes: '',
  });

  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session.isActive && !session.isCompleted && session.timeRemaining > 0) {
      interval = setInterval(() => {
        setSession(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (session.timeRemaining <= 0 && session.isActive) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [session.isActive, session.isCompleted, session.timeRemaining]);

  const handleStartSession = async () => {
    try {
      // Start session in database
      const response = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: practice.moduleId,
          practiceId: practice.id,
          frameworkId: practice.frameworkId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSession(prev => ({
          ...prev,
          isActive: true,
          sessionId: data.sessionId,
        }));
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      // Still allow session to start locally even if API fails
      setSession(prev => ({ ...prev, isActive: true }));
    }
  };

  const handlePauseSession = () => {
    setSession(prev => ({ ...prev, isActive: false }));
  };

  const handleResumeSession = () => {
    setSession(prev => ({ ...prev, isActive: true }));
  };

  const handleSessionComplete = async () => {
    setSession(prev => ({ ...prev, isActive: false, isCompleted: true }));
    setShowCompletion(true);
  };

  const handleCompleteSession = async () => {
    try {
      if (session.sessionId) {
        // End session in database
        await fetch('/api/session/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.sessionId,
            metrics: {
              duration: session.timeElapsed,
              stepsCompleted: practice.instructions.length,
            },
            moodPre: session.moodPre,
            moodPost: session.moodPost,
            notes: session.notes,
          }),
        });
      }

      // Grant virtue XP (this would be calculated based on practice type)
      const virtueGrants = {
        wisdom: practice.moduleId === 'wisdom' ? 10 : 2,
        courage: practice.moduleId === 'courage' ? 10 : 2,
        justice: practice.moduleId === 'justice' ? 10 : 2,
        temperance: practice.moduleId === 'temperance' ? 10 : 2,
      };

      // Update virtue scores
      await fetch('/api/progress/virtues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          ...virtueGrants,
          note: `Completed: ${practice.title}`,
        }),
      });

      onClose();
    } catch (error) {
      console.error('Failed to complete session:', error);
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = session.timeElapsed / (practice.duration * 60);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">{practice.title}</h2>
              <p className="text-gray-400 mt-1">{practice.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Session Content */}
          <div className="p-6">
            {!session.isCompleted ? (
              <div className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {formatTime(session.timeRemaining)}
                        </div>
                        <div className="text-sm text-gray-400">remaining</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Instructions</h3>
                  <div className="space-y-2">
                    {practice.instructions.map((instruction, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          index <= session.currentStep
                            ? 'bg-blue-500/20 border-blue-500/30 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index < session.currentStep
                              ? 'bg-green-500 text-white'
                              : index === session.currentStep
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-600 text-gray-400'
                          }`}>
                            {index < session.currentStep ? <CheckCircle size={12} /> : index + 1}
                          </div>
                          <span>{instruction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {practice.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  {!session.isActive ? (
                    <button
                      onClick={handleStartSession}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg"
                    >
                      <Play size={20} />
                      Start Practice
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePauseSession}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
                      >
                        <Pause size={20} />
                        Pause
                      </button>
                      <button
                        onClick={handleResumeSession}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
                      >
                        <Play size={20} />
                        Resume
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Completion Screen */
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Practice Complete!</h3>
                  <p className="text-gray-400">
                    You've completed {practice.title} in {formatTime(session.timeElapsed)}
                  </p>
                </div>

                {/* Virtue XP Earned */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Virtue XP Earned</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries({
                      wisdom: practice.moduleId === 'wisdom' ? 10 : 2,
                      courage: practice.moduleId === 'courage' ? 10 : 2,
                      justice: practice.moduleId === 'justice' ? 10 : 2,
                      temperance: practice.moduleId === 'temperance' ? 10 : 2,
                    }).map(([virtue, xp]) => {
                      const Icon = virtueIcons[virtue as keyof typeof virtueIcons];
                      return (
                        <div key={virtue} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                          <Icon size={16} className="text-blue-400" />
                          <span className="text-white capitalize">{virtue}</span>
                          <span className="text-green-400 font-semibold">+{xp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">Session Notes (Optional)</label>
                  <textarea
                    value={session.notes}
                    onChange={(e) => setSession(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="How did this practice go? Any insights or reflections?"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleCompleteSession}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Complete Session
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 