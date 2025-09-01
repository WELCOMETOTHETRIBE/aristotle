import { motion } from 'framer-motion';
import { Brain, Shield, Scale, Leaf, GraduationCap, Clock, BookOpen, Star, CheckCircle, Target, TrendingUp, Award, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type VirtueModule } from '@/lib/academy-curriculum';

interface AcademyProgressProps {
  modules: VirtueModule[];
  onViewModule: (module: VirtueModule) => void;
}

export default function AcademyProgress({ modules, onViewModule }: AcademyProgressProps) {
  const totalLessons = modules.reduce((sum, module) => sum + module.totalLessons, 0);
  const completedLessons = modules.reduce((sum, module) => sum + module.completedLessons, 0);
  const totalTime = modules.reduce((sum, module) => sum + module.estimatedTotalTime, 0);
  const completedTime = modules.reduce((sum, module) => {
    return sum + (module.estimatedTotalTime * module.completedLessons / module.totalLessons);
  }, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);
  const completedModules = modules.filter(module => module.completed).length;

  const getVirtueIcon = (virtueId: string) => {
    switch (virtueId) {
      case 'wisdom': return Brain;
      case 'justice': return Scale;
      case 'courage': return Shield;
      case 'temperance': return Leaf;
      default: return Star;
    }
  };

  const getVirtueColor = (virtueId: string) => {
    switch (virtueId) {
      case 'wisdom': return 'bg-primary';
      case 'justice': return 'bg-justice';
      case 'courage': return 'bg-courage';
      case 'temperance': return 'bg-temperance';
      default: return 'bg-muted';
    }
  };

  const achievements = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: Target,
      earned: completedLessons >= 1,
      progress: Math.min(completedLessons, 1)
    },
    {
      id: 'wisdom-master',
      title: 'Wisdom Seeker',
      description: 'Complete the Wisdom module',
      icon: Brain,
      earned: modules.find(m => m.id === 'wisdom')?.completed || false,
      progress: modules.find(m => m.id === 'wisdom')?.completedLessons || 0
    },
    {
      id: 'justice-master',
      title: 'Justice Advocate',
      description: 'Complete the Justice module',
      icon: Scale,
      earned: modules.find(m => m.id === 'justice')?.completed || false,
      progress: modules.find(m => m.id === 'justice')?.completedLessons || 0
    },
    {
      id: 'courage-master',
      title: 'Courageous Heart',
      description: 'Complete the Courage module',
      icon: Shield,
      earned: modules.find(m => m.id === 'courage')?.completed || false,
      progress: modules.find(m => m.id === 'courage')?.completedLessons || 0
    },
    {
      id: 'temperance-master',
      title: 'Temperate Soul',
      description: 'Complete the Temperance module',
      icon: Leaf,
      earned: modules.find(m => m.id === 'temperance')?.completed || false,
      progress: modules.find(m => m.id === 'temperance')?.completedLessons || 0
    },
    {
      id: 'philosopher',
      title: 'Philosopher',
      description: 'Complete all four virtue modules',
      icon: GraduationCap,
      earned: completedModules === 4,
      progress: completedModules
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Your Progress</h2>
          <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
        </div>
        
        <div className="space-y-4">
          <div className="w-full bg-surface-2 rounded-full h-3">
            <motion.div 
              className="h-3 rounded-full bg-gradient-to-r from-primary via-justice to-courage"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-text">{completedLessons}</div>
              <div className="text-sm text-muted">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">{totalLessons}</div>
              <div className="text-sm text-muted">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">{Math.round(completedTime)}</div>
              <div className="text-sm text-muted">Minutes Studied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">{completedModules}</div>
              <div className="text-sm text-muted">Modules Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Module Progress</h3>
        <div className="grid gap-4">
          {modules.map((module) => {
            const IconComponent = getVirtueIcon(module.id);
            return (
              <motion.div
                key={module.id}
                className="p-4 bg-surface border border-border rounded-xl hover:bg-surface-2 transition-all duration-200 cursor-pointer"
                onClick={() => onViewModule(module)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', module.color)}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{module.name}</h4>
                      <p className="text-sm text-muted">{module.greekName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-text">{module.progress}%</div>
                    <div className="text-sm text-muted">{module.completedLessons}/{module.totalLessons}</div>
                  </div>
                </div>
                
                <div className="mt-3 w-full bg-surface-2 rounded-full h-2">
                  <div 
                    className={cn('h-2 rounded-full transition-all duration-500', getVirtueColor(module.id))}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                
                {module.completed && (
                  <div className="mt-2 flex items-center justify-center text-success text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Module Completed
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200',
                  achievement.earned 
                    ? 'bg-success/10 border-success/20 text-success' 
                    : 'bg-surface border-border text-muted'
                )}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    achievement.earned ? 'bg-success/20' : 'bg-surface-2'
                  )}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm opacity-80">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Award className="w-5 h-5" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Learning Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="text-lg font-bold text-text">{Math.ceil(completedTime / 60)}</div>
            <div className="text-sm text-muted">Hours Studied</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-justice/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-justice" />
            </div>
            <div className="text-lg font-bold text-text">{Math.round(completedTime / totalTime * 100)}%</div>
            <div className="text-sm text-muted">Curriculum Progress</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-courage/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-courage" />
            </div>
            <div className="text-lg font-bold text-text">{achievements.filter(a => a.earned).length}</div>
            <div className="text-sm text-muted">Achievements</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-temperance/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-temperance" />
            </div>
            <div className="text-lg font-bold text-text">{completedModules}</div>
            <div className="text-sm text-muted">Virtues Mastered</div>
          </div>
        </div>
      </div>
    </div>
  );
} 