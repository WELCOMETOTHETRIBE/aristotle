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
  TrendingUp,
  Calendar,
  Trophy,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LyceumProgressProps {
  onSelectPath: (pathId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export default function LyceumProgress({ onSelectPath, onSelectLesson }: LyceumProgressProps) {
  const { data, progress, getOverallProgress, getPathProgress } = useLyceum();
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

  const getMasteryScore = (domain: string) => {
    return Math.round((progress.masteryScores[domain] || 0) * 100);
  };

  const getTotalTimeSpent = () => {
    // Calculate estimated time spent based on completed lessons
    let totalMinutes = 0;
    data.paths.forEach(path => {
      path.lessons.forEach(lesson => {
        if (progress.completedLessons.has(lesson.id)) {
          totalMinutes += lesson.time_minutes;
        }
      });
    });
    return totalMinutes;
  };

  const getStreakDays = () => {
    // This would be calculated from daily check-ins
    return progress.dailyCheckins;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-text mb-4">Your Progress Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-text">{progress.completedPaths.size}</div>
            <div className="text-sm text-muted">Paths Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-text">{progress.completedLessons.size}</div>
            <div className="text-sm text-muted">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-text">{progress.artifacts.size}</div>
            <div className="text-sm text-muted">Artifacts Collected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-text">{overallProgress}%</div>
            <div className="text-sm text-muted">Overall Progress</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Journey Progress</span>
            <span className="font-medium text-text">{overallProgress}%</span>
          </div>
          <div className="w-full bg-surface-2 rounded-full h-3">
            <motion.div 
              className="h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Mastery Domains */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Mastery Domains</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(progress.masteryScores).map(([domain, score]) => {
            const percentage = Math.round(score * 100);
            return (
              <div key={domain} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted capitalize">{domain}</span>
                  <span className="font-medium text-text">{percentage}%</span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2">
                  <motion.div 
                    className={cn(
                      'h-2 rounded-full',
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 60 ? 'bg-yellow-500' :
                      percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Path Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-text">Path Progress</h3>
        
        <div className="space-y-4">
          {data.paths.map((path, index) => {
            const IconComponent = getPathIcon(path.id);
            const isCompleted = progress.completedPaths.has(path.id);
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  'p-4 bg-surface border rounded-xl transition-all duration-200',
                  isCompleted 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-border hover:border-primary/30 cursor-pointer'
                )}
                onClick={() => {
                  if (nextLesson) {
                    onSelectLesson(nextLesson.id);
                  } else {
                    onSelectPath(path.id);
                  }
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    getPathColor(path.id)
                  )}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-text">{path.title}</h4>
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-sm text-muted">{pathProgress}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{completedLessons}/{path.lessons.length} lessons completed</span>
                        <span>{getMasteryDomain(path.id)}</span>
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
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-300" />
          </div>
          <h4 className="font-semibold text-text mb-1">Time Invested</h4>
          <p className="text-2xl font-bold text-text">{getTotalTimeSpent()}</p>
          <p className="text-sm text-muted">minutes</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-300" />
          </div>
          <h4 className="font-semibold text-text mb-1">Learning Streak</h4>
          <p className="text-2xl font-bold text-text">{getStreakDays()}</p>
          <p className="text-sm text-muted">days</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-purple-300" />
          </div>
          <h4 className="font-semibold text-text mb-1">Achievements</h4>
          <p className="text-2xl font-bold text-text">{progress.artifacts.size}</p>
          <p className="text-sm text-muted">artifacts</p>
        </div>
      </motion.div>
    </div>
  );
}
