'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  X,
  Play,
  Lock,
  Star,
  Sparkle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademyPathsModalProps {
  path: any;
  userProgress: any;
  onSelectLesson: (lesson: any) => void;
  onClose: () => void;
}

export default function AcademyPathsModal({ path, userProgress, onSelectLesson, onClose }: AcademyPathsModalProps) {
  const getLessonStatus = (lessonId: string) => {
    const progress = userProgress[lessonId];
    if (progress?.completed) return 'completed';
    if (progress?.started) return 'started';
    return 'not-started';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'started':
        return <Circle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/30 bg-green-500/5';
      case 'started':
        return 'border-yellow-500/30 bg-yellow-500/5';
      default:
        return 'border-border hover:border-primary/30 hover:bg-surface-2';
    }
  };

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">{path.title}</h1>
          <p className="text-muted">Choose a lesson to begin your journey</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Your Progress</h2>
          <div className="flex items-center space-x-2 text-primary">
            <Sparkle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length} of {path.lessons.length} completed
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Path Progress</span>
            <span className="text-text font-medium">
              {Math.round((path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length / path.lessons.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-surface-2 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length / path.lessons.length) * 100}%` 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Lessons List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Available Lessons</h3>
        
        <div className="space-y-3">
          {path.lessons.map((lesson: any, index: number) => {
            const status = getLessonStatus(lesson.id);
            const isCompleted = status === 'completed';
            const isStarted = status === 'started';
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  "group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                  getStatusColor(status)
                )}
                onClick={() => onSelectLesson(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-text group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h4>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Star className="w-4 h-4" />
                            <span className="text-xs font-medium">Completed</span>
                          </div>
                        )}
                        {isStarted && !isCompleted && (
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Play className="w-4 h-4" />
                            <span className="text-xs font-medium">In Progress</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted line-clamp-2 mb-3">
                        {lesson.description || lesson.objectives?.[0] || 'Explore this lesson to deepen your understanding.'}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.time_minutes || 10} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{lesson.activities?.length || 0} activities</span>
                        </div>
                        {lesson.difficulty && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span className="capitalize">{lesson.difficulty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm font-medium text-muted group-hover:text-primary transition-colors">
                    <span>{isCompleted ? 'Review' : isStarted ? 'Continue' : 'Start'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mt-8 pt-6 border-t border-border"
      >
        <div className="text-sm text-muted">
          {path.lessons.length} lessons • {path.estimated_minutes_total} minutes total
        </div>
        
        <button
          onClick={onClose}
          className="px-6 py-3 text-muted hover:text-text transition-colors font-medium"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}