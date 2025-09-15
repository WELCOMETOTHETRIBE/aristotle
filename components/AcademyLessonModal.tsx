'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen,
  Clock,
  CheckCircle,
  ArrowRight,
  X,
  Play,
  Star,
  Target,
  Lightbulb,
  Sparkle,
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LyceumActivity from '@/components/lyceum/LyceumActivity';

interface AcademyLessonModalProps {
  lesson: any;
  path: any;
  userProgress: any;
  onComplete: (lessonId: string, data: any) => void;
  onClose: () => void;
}

export default function AcademyLessonModal({ lesson, path, userProgress, onComplete, onClose }: AcademyLessonModalProps) {
  const isCompleted = userProgress[lesson.id]?.completed;
  const isStarted = userProgress[lesson.id]?.started;

  const handleComplete = (data: any) => {
    onComplete(lesson.id, {
      ...data,
      completed: true,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">{lesson.title}</h1>
            <p className="text-muted">{path.title}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-4 mb-8 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text">Lesson Progress</span>
          </div>
          <div className="text-sm text-muted">
            {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
          </div>
        </div>
        
        <div className="w-full bg-surface-2 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isCompleted ? '100%' : isStarted ? '50%' : '0%' }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Lesson Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-surface-2 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-text">{lesson.time_minutes || 10}</div>
          <div className="text-sm text-muted">Minutes</div>
        </div>
        
        <div className="bg-surface-2 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-lg font-bold text-text">{lesson.activities?.length || 0}</div>
          <div className="text-sm text-muted">Activities</div>
        </div>
        
        <div className="bg-surface-2 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-text capitalize">{lesson.difficulty || 'Mixed'}</div>
          <div className="text-sm text-muted">Difficulty</div>
        </div>
      </motion.div>

      {/* Modern Payoff */}
      {lesson.modern_payoff && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 mb-8 border border-green-500/20"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Modern Payoff</h3>
              <p className="text-muted leading-relaxed">{lesson.modern_payoff}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Aristotle's Introduction */}
      {lesson.aristotle_intro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 mb-8 border border-blue-500/20"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Quote className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Aristotle's Introduction</h3>
              <p className="text-muted leading-relaxed italic">"{lesson.aristotle_intro}"</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-text mb-4">Learning Objectives</h3>
          <div className="space-y-3">
            {lesson.objectives.map((objective: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-surface-2 rounded-xl">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <p className="text-muted">{objective}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Interactive Activities</h3>
        <div className="space-y-4">
          {lesson.activities?.map((activity: any, index: number) => (
            <div key={index} className="bg-surface-2 rounded-2xl p-6">
              <LyceumActivity
                activity={activity}
                onComplete={(data) => {
                  // Handle activity completion
                  console.log('Activity completed:', data);
                }}
              />
            </div>
          )) || (
            <div className="text-center py-8 text-muted">
              <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No activities available for this lesson yet.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between pt-6 border-t border-border"
      >
        <button
          onClick={onClose}
          className="px-6 py-3 text-muted hover:text-text transition-colors font-medium"
        >
          Close
        </button>
        
        {!isCompleted && (
          <button
            onClick={() => handleComplete({ started: true })}
            className="px-8 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl group"
          >
            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{isStarted ? 'Mark Complete' : 'Start Lesson'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
        
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Lesson Completed</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}