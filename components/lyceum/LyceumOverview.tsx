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
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyceumOverviewProps {
  onStartJourney: () => void;
}

export default function LyceumOverview({ onStartJourney }: LyceumOverviewProps) {
  const { data, progress, getOverallProgress } = useLyceum();
  const overallProgress = getOverallProgress();

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl flex items-center justify-center mx-auto">
          <GraduationCap className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-text">Welcome to Aristotle's Lyceum</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            {data.meta.philosophical_scope}
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-border rounded-2xl p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-text mb-1">{progress.completedPaths.size}</div>
            <div className="text-sm text-muted">Paths Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text mb-1">{progress.completedLessons.size}</div>
            <div className="text-sm text-muted">Lessons Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text mb-1">{progress.artifacts.size}</div>
            <div className="text-sm text-muted">Artifacts Collected</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text mb-1">{overallProgress}%</div>
            <div className="text-sm text-muted">Overall Progress</div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-semibold text-text text-center">What would you like to do?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={onStartJourney}
            className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl text-left hover:from-primary/20 hover:to-primary/10 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Explore Learning Paths</h4>
                <p className="text-sm text-muted">Choose from 12 paths of wisdom</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary ml-auto" />
            </div>
          </motion.button>

          <motion.button
            onClick={() => {/* Navigate to progress */}}
            className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl text-left hover:from-green-500/20 hover:to-green-500/10 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">View Progress</h4>
                <p className="text-sm text-muted">Track your learning journey</p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-500 ml-auto" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      {progress.completedLessons.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data.paths.slice(0, 3).map((path) => {
              const completedLessons = path.lessons.filter(lesson => 
                progress.completedLessons.has(lesson.id)
              );
              
              if (completedLessons.length === 0) return null;
              
              const IconComponent = getPathIcon(path.id);
              const progressPercent = Math.round((completedLessons.length / path.lessons.length) * 100);
              
              return (
                <div key={path.id} className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    getPathColor(path.id)
                  )}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text text-sm">{path.title}</h4>
                    <p className="text-xs text-muted">{completedLessons.length}/{path.lessons.length} lessons completed</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text">{progressPercent}%</div>
                    <div className="w-16 bg-surface rounded-full h-1.5 mt-1">
                      <div 
                        className="h-1.5 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
