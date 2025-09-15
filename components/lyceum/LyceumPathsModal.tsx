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
  Scroll,
  Lightbulb,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Lock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyceumPathsModalProps {
  onSelectPath: (pathId: string) => void;
  onClose: () => void;
}

export default function LyceumPathsModal({ onSelectPath, onClose }: LyceumPathsModalProps) {
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
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Choose Your Learning Path</h1>
          <p className="text-muted">Each path represents a different aspect of Aristotle's wisdom</p>
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
              You can begin with any available path. Each builds specific skills while contributing to your overall understanding of wisdom. 
              Complete paths in any order that interests you most.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                'relative p-4 bg-surface border rounded-xl transition-all duration-200 group cursor-pointer',
                isCompleted 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : isAccessible
                  ? 'border-border hover:border-primary/30 hover:bg-surface-2'
                  : 'border-border/50 bg-surface-2 opacity-60 cursor-not-allowed'
              )}
              onClick={() => {
                console.log('Path clicked:', path.id, 'isAccessible:', isAccessible);
                if (isAccessible) {
                  onSelectPath(path.id);
                } else {
                  console.log('Path not accessible:', path.id);
                }
              }}
              whileHover={isAccessible ? { scale: 1.02 } : {}}
              whileTap={isAccessible ? { scale: 0.98 } : {}}
            >
              {/* Path Header */}
              <div className="flex items-start space-x-3 mb-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0',
                  getPathColor(path.id)
                )}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-text mb-1">{path.title}</h3>
                  <p className="text-xs text-muted line-clamp-2 mb-2">{path.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {getMasteryDomain(path.id)}
                    </span>
                    <span className="text-xs text-muted">
                      {path.lessons.length} lessons • {path.estimated_minutes_total} min
                    </span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                )}
                {!isAccessible && !isCompleted && (
                  <div className="w-6 h-6 bg-surface-2 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-3 h-3 text-muted" />
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Progress</span>
                  <span className="font-medium text-text">{pathProgress}%</span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-1.5">
                  <div 
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500',
                      isCompleted ? 'bg-green-500' : 'bg-primary'
                    )}
                    style={{ width: `${pathProgress}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {completedLessons} of {path.lessons.length} completed
                </span>
                {isAccessible && (
                  <div className="flex items-center space-x-1 text-primary group-hover:text-primary/80 transition-colors">
                    <span className="text-xs font-medium">
                      {isCompleted ? 'Review' : nextLesson ? 'Continue' : 'Start'}
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </div>

              {/* Locked Overlay */}
              {!isAccessible && !isCompleted && (
                <div className="absolute inset-0 bg-surface-2/80 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-muted mx-auto mb-1" />
                    <p className="text-xs text-muted">Complete previous paths</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm text-muted">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-surface-2 rounded-full opacity-60" />
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
}
