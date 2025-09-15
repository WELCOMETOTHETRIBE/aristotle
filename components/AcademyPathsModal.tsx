'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle,
  Circle,
  ArrowRight,
  X,
  Play,
  Star,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademyPathsModalProps {
  path: any;
  userProgress: any;
  onSelectLesson: (lesson: any) => void;
  onClose: () => void;
}

export default function AcademyPathsModal({ path, userProgress, onSelectLesson, onClose }: AcademyPathsModalProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-500/10';
      case 'intermediate': return 'text-yellow-500 bg-yellow-500/10';
      case 'advanced': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted bg-surface-2';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return Circle;
      case 'intermediate': return Star;
      case 'advanced': return Sparkles;
      default: return Circle;
    }
  };

  const getLessonProgress = (lessonId: string) => {
    return userProgress[lessonId]?.completed ? 100 : 0;
  };

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">{path.title}</h1>
          <p className="text-muted">Choose a lesson to begin your dialogue</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* Learning Preface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">Start Anywhere</h3>
            <p className="text-muted leading-relaxed">
              Each lesson is designed to be engaging and self-contained. You can begin with any lesson that interests you, 
              or follow the suggested order for a progressive learning experience.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <div className="space-y-4 mb-6">
        {path.lessons.map((lesson: any, index: number) => {
          const isCompleted = userProgress[lesson.id]?.completed;
          const progress = getLessonProgress(lesson.id);
          const DifficultyIcon = getDifficultyIcon(lesson.difficulty || 'beginner');
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 bg-surface border border-border rounded-xl hover:bg-surface-2 transition-all duration-200 group cursor-pointer"
              onClick={() => onSelectLesson(lesson)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-4">
                {/* Lesson Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>

                {/* Lesson Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-text">{lesson.title}</h3>
                    {isCompleted && (
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {lesson.description || lesson.modern_payoff || 'Engage in this interactive lesson to deepen your understanding.'}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-muted">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.time_minutes || 15} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DifficultyIcon className="w-3 h-3" />
                      <span className={cn('px-2 py-0.5 rounded-full text-xs', getDifficultyColor(lesson.difficulty || 'beginner'))}>
                        {lesson.difficulty || 'beginner'}
                      </span>
                    </div>
                    {lesson.activities && (
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>{lesson.activities.length} activities</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Arrow */}
                <div className="flex items-center space-x-2 text-primary group-hover:text-primary/80 transition-colors">
                  <span className="text-sm font-medium">
                    {isCompleted ? 'Review' : 'Start'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Progress Bar */}
              {progress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-1.5">
                    <div 
                      className="h-1.5 bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Path Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-2 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Path Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text">
              {path.lessons.filter((lesson: any) => userProgress[lesson.id]?.completed).length}
            </div>
            <div className="text-sm text-muted">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">{path.lessons.length}</div>
            <div className="text-sm text-muted">Total Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">
              {Math.round((path.lessons.filter((lesson: any) => userProgress[lesson.id]?.completed).length / path.lessons.length) * 100)}%
            </div>
            <div className="text-sm text-muted">Progress</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
