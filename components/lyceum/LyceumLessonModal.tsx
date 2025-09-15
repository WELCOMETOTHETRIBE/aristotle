'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLyceum } from '@/lib/lyceum-context';
import { 
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  Play,
  Lightbulb,
  MessageCircle,
  X,
  ListChecks
} from 'lucide-react';
import LyceumActivity from './LyceumActivity';
import LyceumAssessment from './LyceumAssessment';

interface LyceumLessonModalProps {
  lessonId: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function LyceumLessonModal({ lessonId, onComplete, onClose }: LyceumLessonModalProps) {
  const { data, progress, completeLesson, canAccessLesson } = useLyceum();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityResponses, setActivityResponses] = useState<{ [key: string]: any }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<'preface' | 'activities' | 'assessment' | 'completion'>('preface');

  const lesson = data.paths
    .flatMap(path => path.lessons)
    .find(l => l.id === lessonId);

  const path = data.paths.find(p => p.lessons.some(l => l.id === lessonId));

  useEffect(() => {
    if (!lesson) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [lesson]);

  if (!lesson || !path) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">Lesson not found</p>
        <button onClick={onClose} className="mt-4 text-primary hover:text-primary/80">
          Go Back
        </button>
      </div>
    );
  }

  const isAccessible = canAccessLesson(lessonId);
  const currentActivity = lesson.activities[currentActivityIndex];
  const allActivitiesCompleted = currentActivityIndex >= lesson.activities.length;

  const handleActivityComplete = (activityId: string, response: any) => {
    setActivityResponses(prev => ({
      ...prev,
      [activityId]: response
    }));

    if (currentActivityIndex < lesson.activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      setCurrentStep('assessment');
    }
  };

  const handleAssessmentComplete = () => {
    setIsCompleted(true);
    setCurrentStep('completion');
  };

  const handleLessonComplete = () => {
    if (!isCompleted) return;
    completeLesson(lessonId, lesson.artifacts, lesson.mastery_updates);
    onComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAccessible) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">Lesson Locked</h3>
        <p className="text-muted mb-4">Complete the prerequisites to access this lesson</p>
        <button onClick={onClose} className="text-primary hover:text-primary/80">
          Go Back
        </button>
      </div>
    );
  }

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
                <p className="text-sm text-muted">{lesson.modern_payoff}</p>
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
                    In this module, you'll practice a small set of concrete skills before we generalize. Expect bite-sized steps: observe, try, reflect. Finish in one sitting; mastery grows by doing.
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
                  <div className="text-sm font-medium text-text">Do the activity</div>
                </div>
                <div className="p-3 bg-surface-2 rounded-lg">
                  <div className="text-xs text-muted">Step 2</div>
                  <div className="text-sm font-medium text-text">Check understanding</div>
                </div>
                <div className="p-3 bg-surface-2 rounded-lg">
                  <div className="text-xs text-muted">Step 3</div>
                  <div className="text-sm font-medium text-text">Capture your artifact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Aristotle's Introduction */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Aristotle's Guidance</h3>
                <p className="text-muted italic">"{lesson.narrative.intro}"</p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted">No account risk: you can pause anytime.</div>
            <button
              onClick={() => setCurrentStep('activities')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Lesson</span>
            </button>
          </div>
        </motion.div>
      )}

      {currentStep === 'activities' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Progress Indicator */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text">Progress</span>
              <span className="text-sm text-muted">
                {Math.min(currentActivityIndex + 1, lesson.activities.length)} of {lesson.activities.length} activities
              </span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-2">
              <motion.div 
                className="h-2 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((Math.min(currentActivityIndex + 1, lesson.activities.length)) / lesson.activities.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Current Activity */}
          {!allActivitiesCompleted && currentActivity && (
            <LyceumActivity
              activity={currentActivity}
              onComplete={(response) => handleActivityComplete(currentActivity.id, response)}
              isLastActivity={currentActivityIndex === lesson.activities.length - 1}
            />
          )}
        </motion.div>
      )}

      {currentStep === 'assessment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LyceumAssessment
            assessment={lesson.assessment}
            activityResponses={activityResponses}
            onComplete={handleAssessmentComplete}
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
              {lesson.narrative.outro}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)} spent</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{lesson.artifacts.length} artifacts earned</span>
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
              onClick={handleLessonComplete}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Complete Lesson
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
