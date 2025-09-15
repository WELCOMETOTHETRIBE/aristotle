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
  Pause,
  RotateCcw,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Camera,
  Mic,
  Sliders,
  Brain,
  Award,
  Users,
  Share2,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LyceumActivity from './LyceumActivity';
import LyceumAssessment from './LyceumAssessment';
import LyceumScholarMode from './LyceumScholarMode';
import LyceumAgora from './LyceumAgora';

interface LyceumLessonProps {
  lessonId: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function LyceumLesson({ lessonId, onBack, onComplete }: LyceumLessonProps) {
  const { data, progress, completeLesson, canAccessLesson } = useLyceum();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityResponses, setActivityResponses] = useState<{ [key: string]: any }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showScholarMode, setShowScholarMode] = useState(false);
  const [showAgora, setShowAgora] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

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
      <div className="text-center py-8">
        <p className="text-muted">Lesson not found</p>
        <button onClick={onBack} className="mt-4 text-primary hover:text-primary/80">
          Go Back
        </button>
      </div>
    );
  }

  const isAccessible = canAccessLesson(lessonId);
  const isAlreadyCompleted = progress.completedLessons.has(lessonId);
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
      setIsCompleted(true);
    }
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
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">Lesson Locked</h3>
        <p className="text-muted mb-4">Complete the prerequisites to access this lesson</p>
        <button onClick={onBack} className="text-primary hover:text-primary/80">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Header - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Paths</span>
          </button>
          
          <div className="flex items-center space-x-4 text-sm text-muted">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{lesson.time_minutes} min</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-text mb-2">{lesson.title}</h1>
            <p className="text-muted">{path.title}</p>
          </div>

          {/* Modern Payoff - Key Focus */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-text mb-1">Why This Matters Today</h4>
                <p className="text-sm text-muted">{lesson.modern_payoff}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Learning Preface */}
      {!hasStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
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

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">No account risk: you can pause anytime.</div>
              <button
                onClick={() => setHasStarted(true)}
                className="px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Lesson</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Aristotle's Introduction - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text mb-2">Aristotle's Guidance</h3>
            <p className="text-muted italic">"{lesson.narrative.intro}"</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-border rounded-xl p-4"
      >
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
      </motion.div>

      {/* Activities */}
      {hasStarted && !allActivitiesCompleted && currentActivity && (
        <motion.div
          key={currentActivity.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <LyceumActivity
            activity={currentActivity}
            onComplete={(response) => handleActivityComplete(currentActivity.id, response)}
            isLastActivity={currentActivityIndex === lesson.activities.length - 1}
          />
        </motion.div>
      )}

      {/* Assessment */}
      {hasStarted && allActivitiesCompleted && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LyceumAssessment
            assessment={lesson.assessment}
            activityResponses={activityResponses}
            onComplete={() => setIsCompleted(true)}
          />
        </motion.div>
      )}

      {/* Completion - Simplified */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
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
                <Award className="w-4 h-4" />
                <span>{lesson.artifacts.length} artifacts earned</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLessonComplete}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Complete Lesson
            </button>
            
            {lesson.scholar_mode && (
              <button
                onClick={() => setShowScholarMode(true)}
                className="px-6 py-3 bg-surface border border-border text-text rounded-xl font-semibold hover:bg-surface-2 transition-colors"
              >
                Deep Dive
              </button>
            )}
            
            {lesson.agora && (
              <button
                onClick={() => setShowAgora(true)}
                className="px-6 py-3 bg-surface border border-border text-text rounded-xl font-semibold hover:bg-surface-2 transition-colors"
              >
                Share
              </button>
            )}
          </div>
        </motion.div>
      )}

      {showScholarMode && lesson.scholar_mode && (
        <LyceumScholarMode
          scholarMode={lesson.scholar_mode}
          onClose={() => setShowScholarMode(false)}
        />
      )}

      {showAgora && lesson.agora && (
        <LyceumAgora
          agora={lesson.agora}
          lessonTitle={lesson.title}
          onClose={() => setShowAgora(false)}
        />
      )}
    </div>
  );
}
