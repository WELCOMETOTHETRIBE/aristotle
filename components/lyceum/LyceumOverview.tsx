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
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text">Welcome to Aristotle's Lyceum</h2>
        <p className="text-muted max-w-2xl mx-auto">
          Embark on a transformative journey through 12 paths of wisdom, 
          each designed to cultivate virtue and practical wisdom in your daily life.
        </p>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-blue-300" />
          </div>
          <h3 className="font-semibold text-text mb-2">36 Interactive Lessons</h3>
          <p className="text-sm text-muted">Hands-on activities, reflections, and assessments</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-green-300" />
          </div>
          <h3 className="font-semibold text-text mb-2">AI-Powered Guidance</h3>
          <p className="text-sm text-muted">Personalized tutoring, evaluation, and coaching</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="font-semibold text-text mb-2">Certificate of Mastery</h3>
          <p className="text-sm text-muted">Earn your Lyceum Scroll upon completion</p>
        </div>
      </motion.div>

      {/* Paths Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-text text-center">The 12 Paths of Wisdom</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.paths.map((path, index) => {
            const IconComponent = getPathIcon(path.id);
            const isCompleted = progress.completedPaths.has(path.id);
            const completedLessons = path.lessons.filter(lesson => 
              progress.completedLessons.has(lesson.id)
            ).length;
            const progressPercent = Math.round((completedLessons / path.lessons.length) * 100);
            
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  'p-4 bg-surface border rounded-xl transition-all duration-200',
                  isCompleted 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    getPathColor(path.id)
                  )}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text text-sm mb-1">{path.title}</h4>
                    <p className="text-xs text-muted line-clamp-2">{path.description}</p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{completedLessons}/{path.lessons.length} lessons</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-1.5">
                    <div 
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-500',
                        isCompleted ? 'bg-green-500' : 'bg-primary'
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4 text-center">Your Journey Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text">{progress.completedPaths.size}</div>
            <div className="text-sm text-muted">Paths Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">{progress.completedLessons.size}</div>
            <div className="text-sm text-muted">Lessons Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">{progress.artifacts.size}</div>
            <div className="text-sm text-muted">Artifacts Collected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text">{overallProgress}%</div>
            <div className="text-sm text-muted">Overall Progress</div>
          </div>
        </div>
      </motion.div>

      {/* Start Journey Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <motion.button
          onClick={onStartJourney}
          className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-2">
            <span>Begin Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.button>
        <p className="text-sm text-muted mt-3">
          {data.meta.session_length_minutes} per lesson • {data.paths.length} paths • {data.paths.reduce((sum, path) => sum + path.lessons.length, 0)} lessons total
        </p>
      </motion.div>
    </div>
  );
}
