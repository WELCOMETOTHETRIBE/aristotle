'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  Play,
  Lightbulb,
  MessageCircle,
  X,
  ListChecks,
  BookOpen
} from 'lucide-react';
import AcademyWisdomJourney from './AcademyWisdomJourney';

interface AcademyLessonModalProps {
  lesson: any;
  path: any;
  userProgress: any;
  onComplete: (lessonId: string, data: any) => void;
  onClose: () => void;
}

export default function AcademyLessonModal({ lesson, path, userProgress, onComplete, onClose }: AcademyLessonModalProps) {
  const [currentStep, setCurrentStep] = useState<'preface' | 'lesson' | 'completion'>('preface');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLessonComplete = (lessonId: string, data: any) => {
    setIsCompleted(true);
    setCurrentStep('completion');
    onComplete(lessonId, data);
  };

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-text">{lesson.title}</h1>
            <p className="text-sm text-muted">{path.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'preface' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Modern Payoff */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-text mb-1">Why This Matters Today</h3>
                <p className="text-sm text-muted">
                  {lesson.modern_payoff || lesson.description || 'This lesson will help you connect ancient wisdom to your modern life through interactive dialogue and reflection.'}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Preface */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ListChecks className="w-5 h-5 text-text" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text mb-1">Learning Preface</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    In this lesson, you'll engage in a dialogue with ancient wisdom through interactive activities. 
                    Expect to reflect, respond, and connect timeless insights to your own experience. 
                    Each activity builds understanding through active participation.
                  </p>
                </div>
              </div>

              {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="bg-surface-2 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-text mb-2">You'll be able to:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
                    {lesson.objectives.slice(0, 4).map((obj: string, idx: number) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-surface-2 rounded-lg">
                  <div className="text-xs text-muted">Step 1</div>
                  <div className="text-sm font-medium text-text">Engage in dialogue</div>
                </div>
                <div className="p-3 bg-surface-2 rounded-lg">
                  <div className="text-xs text-muted">Step 2</div>
                  <div className="text-sm font-medium text-text">Reflect & respond</div>
                </div>
                <div className="p-3 bg-surface-2 rounded-lg">
                  <div className="text-xs text-muted">Step 3</div>
                  <div className="text-sm font-medium text-text">Create your artifact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Overview */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Lesson Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted">Duration</div>
                    <div className="font-medium text-text">{lesson.time_minutes || 15} minutes</div>
                  </div>
                  <div>
                    <div className="text-muted">Activities</div>
                    <div className="font-medium text-text">{lesson.activities?.length || 3}</div>
                  </div>
                  <div>
                    <div className="text-muted">Format</div>
                    <div className="font-medium text-text">Interactive</div>
                  </div>
                  <div>
                    <div className="text-muted">Difficulty</div>
                    <div className="font-medium text-text">{lesson.difficulty || 'Beginner'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted">Take your time - you can pause and return anytime.</div>
            <button
              onClick={() => setCurrentStep('lesson')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Lesson</span>
            </button>
          </div>
        </motion.div>
      )}

      {currentStep === 'lesson' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AcademyWisdomJourney
            lesson={lesson}
            path={path}
            userProgress={userProgress}
            onComplete={handleLessonComplete}
            onBack={() => setCurrentStep('preface')}
          />
        </motion.div>
      )}

      {currentStep === 'completion' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Completion Message */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Lesson Completed!</h3>
            <p className="text-green-600 mb-4">
              You've successfully engaged with this ancient wisdom and created meaningful connections to your modern life.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)} spent</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{lesson.activities?.length || 0} activities completed</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 text-muted hover:text-text transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
