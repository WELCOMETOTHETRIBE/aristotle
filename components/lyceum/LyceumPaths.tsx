'use client';

import { motion } from 'framer-motion';
import { useLyceum } from '@/lib/lyceum-context';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Award, 
  Users, 
  Brain, 
  Compass,
  Sparkles,
  GraduationCap,
  Scroll,
  Lightbulb,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Lock,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyceumPathsProps {
  onSelectPath: (pathId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export default function LyceumPaths({ onSelectPath, onSelectLesson }: LyceumPathsProps) {
  const { data, progress, canAccessPath, getPathProgress } = useLyceum();

  const getPathIcon = (pathId: string) => {
    const iconMap: { [key: string]: any } = {
      'path1': Brain,
      'path2': Lightbulb,
      'path3': Target,
      'path4': Heart,
      'path5': Star,
      'path6': Compass,
      'path7': Award,
      'path8': Users,
      'path9': Users,
      'path10': Users,
      'path11': BookOpen,
      'path12': Scroll
    };
    return iconMap[pathId] || BookOpen;
  };

  const getPathColor = (pathId: string) => {
    const colorMap: { [key: string]: string } = {
      'path1': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'path2': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'path3': 'bg-green-500/20 text-green-300 border-green-500/30',
      'path4': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'path5': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'path6': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'path7': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'path8': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'path9': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      'path10': 'bg-red-500/20 text-red-300 border-red-500/30',
      'path11': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      'path12': 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    };
    return colorMap[pathId] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getMasteryDomain = (pathId: string) => {
    const domainMap: { [key: string]: string } = {
      'path1': 'Logic',
      'path2': 'Logic', 
      'path3': 'Science',
      'path4': 'Science',
      'path5': 'Science',
      'path6': 'Metaphysics',
      'path7': 'Ethics',
      'path8': 'Ethics',
      'path9': 'Politics',
      'path10': 'Politics',
      'path11': 'Rhetoric & Poetics',
      'path12': 'Rhetoric & Poetics'
    };
    return domainMap[pathId] || 'General';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">Choose Your Path</h2>
        <p className="text-muted">Select a path to begin your journey through Aristotle's wisdom</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.paths.map((path, index) => {
          const IconComponent = getPathIcon(path.id);
          const isCompleted = progress.completedPaths.has(path.id);
          const isAccessible = canAccessPath(path.id);
          const pathProgress = getPathProgress(path.id);
          const completedLessons = path.lessons.filter(lesson => 
            progress.completedLessons.has(lesson.id)
          ).length;
          const nextLesson = path.lessons.find(lesson => 
            !progress.completedLessons.has(lesson.id)
          );
          
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                'relative p-6 bg-surface border rounded-2xl transition-all duration-200 group',
                isCompleted 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : isAccessible
                  ? 'border-border hover:border-primary/30 hover:bg-surface-2 cursor-pointer'
                  : 'border-border/50 bg-surface-2 opacity-60 cursor-not-allowed'
              )}
              onClick={() => {
                if (isAccessible) {
                  onSelectPath(path.id);
                }
              }}
              whileHover={isAccessible ? { scale: 1.02 } : {}}
              whileTap={isAccessible ? { scale: 0.98 } : {}}
            >
              {/* Path Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0',
                  getPathColor(path.id)
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text mb-1">{path.title}</h3>
                  <p className="text-sm text-muted mb-2">{path.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {getMasteryDomain(path.id)}
                    </span>
                    <span className="text-xs text-muted">
                      {path.estimated_minutes_total} min
                    </span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
                {!isAccessible && !isCompleted && (
                  <div className="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-muted" />
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Progress</span>
                  <span className="font-medium text-text">{pathProgress}%</span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all duration-500',
                      isCompleted ? 'bg-green-500' : 'bg-primary'
                    )}
                    style={{ width: `${pathProgress}%` }}
                  />
                </div>
              </div>

              {/* Path Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs text-muted mb-4">
                <div className="text-center">
                  <div className="font-medium text-text">{completedLessons}</div>
                  <div>Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-text">{path.lessons.length}</div>
                  <div>Total</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-text">{path.estimated_minutes_total}</div>
                  <div>Minutes</div>
                </div>
              </div>

              {/* Lesson Preview */}
              <div className="space-y-2 mb-4">
                {path.lessons.slice(0, 3).map((lesson, lessonIndex) => {
                  const isLessonCompleted = progress.completedLessons.has(lesson.id);
                  return (
                    <div key={lesson.id} className="flex items-center space-x-2">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                        isLessonCompleted 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-surface-2 text-muted'
                      )}>
                        {isLessonCompleted ? '✓' : lessonIndex + 1}
                      </div>
                      <span className={cn(
                        'text-sm flex-1 truncate',
                        isLessonCompleted ? 'text-green-500' : 'text-muted'
                      )}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted">{lesson.time_minutes}m</span>
                    </div>
                  );
                })}
                {path.lessons.length > 3 && (
                  <div className="text-xs text-muted text-center">
                    +{path.lessons.length - 3} more lessons
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {completedLessons} of {path.lessons.length} lessons
                </span>
                {isAccessible && (
                  <div className="flex items-center space-x-1 text-primary group-hover:text-primary/80 transition-colors">
                    <span className="text-sm font-medium">
                      {isCompleted ? 'Review' : nextLesson ? 'Continue' : 'Start'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>

              {/* Locked Overlay */}
              {!isAccessible && !isCompleted && (
                <div className="absolute inset-0 bg-surface-2/80 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted">Complete previous paths to unlock</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Path Legend */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text mb-3">Path Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-muted">Completed Path</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted">Available Path</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-surface-2 rounded-full opacity-60" />
              <span className="text-muted">Locked Path</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary/20 rounded-full" />
              <span className="text-muted">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
