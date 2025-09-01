'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Scale, Heart, 
  Star, Trophy, Target, TrendingUp,
  Zap, Crown, BookOpen, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtueScores {
  wisdom: number;
  courage: number;
  justice: number;
  temperance: number;
}

interface VirtueLevel {
  name: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  minXP: number;
  achievements: string[];
}

const VIRTUE_LEVELS: Record<string, VirtueLevel[]> = {
  wisdom: [
    { name: 'Novice', title: 'Seeker of Knowledge', description: 'Beginning the journey of understanding', icon: BookOpen, color: 'text-blue-400', gradient: 'from-blue-400 to-blue-500', minXP: 0, achievements: ['First Question Asked', 'Read First Book'] },
    { name: 'Apprentice', title: 'Student of Wisdom', description: 'Building foundational knowledge', icon: Lightbulb, color: 'text-blue-500', gradient: 'from-blue-500 to-blue-600', minXP: 25, achievements: ['Completed 5 Practices', 'Asked 10 Questions'] },
    { name: 'Practitioner', title: 'Knowledge Seeker', description: 'Applying wisdom in daily life', icon: Brain, color: 'text-blue-600', gradient: 'from-blue-600 to-indigo-500', minXP: 50, achievements: ['30 Days of Practice', 'Mentored Others'] },
    { name: 'Guide', title: 'Wisdom Teacher', description: 'Sharing knowledge with others', icon: Star, color: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500', minXP: 75, achievements: ['100 Days of Practice', 'Created Learning Content'] },
    { name: 'Master', title: 'Sage of Wisdom', description: 'Embodiment of philosophical wisdom', icon: Crown, color: 'text-purple-400', gradient: 'from-purple-500 to-purple-600', minXP: 100, achievements: ['Mastered All Practices', 'Legacy of Wisdom'] }
  ],
  courage: [
    { name: 'Novice', title: 'Brave Beginner', description: 'Taking first steps into the unknown', icon: Shield, color: 'text-red-400', gradient: 'from-red-400 to-red-500', minXP: 0, achievements: ['Faced First Fear', 'Tried New Activity'] },
    { name: 'Apprentice', title: 'Courage Builder', description: 'Developing inner strength', icon: Target, color: 'text-red-500', gradient: 'from-red-500 to-red-600', minXP: 25, achievements: ['Completed 5 Challenges', 'Overcame 3 Fears'] },
    { name: 'Practitioner', title: 'Fearless Warrior', description: 'Acting with courage consistently', icon: Zap, color: 'text-red-600', gradient: 'from-red-600 to-orange-500', minXP: 50, achievements: ['30 Days of Courage', 'Led Others'] },
    { name: 'Guide', title: 'Courage Mentor', description: 'Inspiring others to be brave', icon: Star, color: 'text-orange-400', gradient: 'from-orange-500 to-red-500', minXP: 75, achievements: ['100 Days of Courage', 'Coached Others'] },
    { name: 'Master', title: 'Lion Heart', description: 'Unwavering courage in all situations', icon: Crown, color: 'text-red-300', gradient: 'from-red-500 to-red-600', minXP: 100, achievements: ['Mastered All Challenges', 'Legend of Courage'] }
  ],
  justice: [
    { name: 'Novice', title: 'Fair Observer', description: 'Learning to see all perspectives', icon: Scale, color: 'text-green-400', gradient: 'from-green-400 to-green-500', minXP: 0, achievements: ['First Fair Decision', 'Helped Someone'] },
    { name: 'Apprentice', title: 'Justice Seeker', description: 'Understanding fairness and balance', icon: Target, color: 'text-green-500', gradient: 'from-green-500 to-green-600', minXP: 25, achievements: ['5 Fair Actions', 'Resolved 3 Conflicts'] },
    { name: 'Practitioner', title: 'Fair Judge', description: 'Making balanced decisions daily', icon: Scale, color: 'text-green-600', gradient: 'from-green-600 to-emerald-500', minXP: 50, achievements: ['30 Days of Justice', 'Mediated Disputes'] },
    { name: 'Guide', title: 'Justice Teacher', description: 'Teaching others about fairness', icon: Star, color: 'text-emerald-400', gradient: 'from-emerald-500 to-green-500', minXP: 75, achievements: ['100 Days of Justice', 'Created Fair Systems'] },
    { name: 'Master', title: 'Just Sage', description: 'Perfect balance and fairness', icon: Crown, color: 'text-green-300', gradient: 'from-green-500 to-green-600', minXP: 100, achievements: ['Mastered All Justice', 'Legacy of Fairness'] }
  ],
  temperance: [
    { name: 'Novice', title: 'Balance Seeker', description: 'Learning self-control basics', icon: Heart, color: 'text-purple-400', gradient: 'from-purple-400 to-purple-500', minXP: 0, achievements: ['First Moderation', 'Controlled Impulse'] },
    { name: 'Apprentice', title: 'Self-Controller', description: 'Building moderation skills', icon: Target, color: 'text-purple-500', gradient: 'from-purple-500 to-purple-600', minXP: 25, achievements: ['5 Moderation Acts', 'Avoided 3 Excesses'] },
    { name: 'Practitioner', title: 'Balanced Being', description: 'Living with consistent moderation', icon: Heart, color: 'text-purple-600', gradient: 'from-purple-600 to-pink-500', minXP: 50, achievements: ['30 Days of Balance', 'Helped Others Balance'] },
    { name: 'Guide', title: 'Balance Teacher', description: 'Guiding others to moderation', icon: Star, color: 'text-pink-400', gradient: 'from-pink-500 to-purple-500', minXP: 75, achievements: ['100 Days of Balance', 'Created Balance Systems'] },
    { name: 'Master', title: 'Harmony Master', description: 'Perfect balance in all things', icon: Crown, color: 'text-purple-300', gradient: 'from-purple-500 to-purple-600', minXP: 100, achievements: ['Mastered All Balance', 'Legacy of Harmony'] }
  ]
};

const getVirtueIcon = (virtue: string) => {
  const icons = {
    wisdom: Brain,
    courage: Shield,
    justice: Scale,
    temperance: Heart
  };
  return icons[virtue as keyof typeof icons] || Brain;
};

const getVirtueEmoji = (virtue: string) => {
  const emojis = {
    wisdom: '🧠',
    courage: '🛡️',
    justice: '⚖️',
    temperance: '🌊'
  };
  return emojis[virtue as keyof typeof emojis] || '🧠';
};

const getVirtueColor = (virtue: string) => {
  const colors = {
    wisdom: 'text-blue-400',
    courage: 'text-red-400',
    justice: 'text-green-400',
    temperance: 'text-purple-400'
  };
  return colors[virtue as keyof typeof colors] || 'text-blue-400';
};

const getVirtueGradient = (virtue: string) => {
  const gradients = {
    wisdom: 'from-blue-500 to-indigo-600',
    courage: 'from-red-500 to-orange-600',
    justice: 'from-green-500 to-emerald-600',
    temperance: 'from-purple-500 to-pink-600'
  };
  return gradients[virtue as keyof typeof gradients] || 'from-blue-500 to-indigo-600';
};

export default function EnhancedVirtueProgress() {
  const [virtueScores, setVirtueScores] = useState<VirtueScores>({ wisdom: 0, courage: 0, justice: 0, temperance: 0 });
  const [selectedVirtue, setSelectedVirtue] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchVirtueScores();
  }, []);

  const fetchVirtueScores = async () => {
    try {
      const response = await fetch('/api/progress/virtues');
      if (response.ok) {
        const data = await response.json();
        setVirtueScores(data.scores || { wisdom: 0, courage: 0, justice: 0, temperance: 0 });
      }
    } catch (error) {
      console.error('Error fetching virtue scores:', error);
    }
  };

  const handleVirtueUpdate = async (virtue: keyof VirtueScores, value: number) => {
    setIsUpdating(virtue);
    try {
      const updatedScores = { ...virtueScores, [virtue]: value };
      const response = await fetch('/api/progress/virtues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedScores)
      });

      if (response.ok) {
        setVirtueScores(updatedScores);
      }
    } catch (error) {
      console.error('Error updating virtue scores:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getCurrentLevel = (virtue: string, score: number) => {
    const levels = VIRTUE_LEVELS[virtue] || [];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (score >= levels[i].minXP) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const getNextLevel = (virtue: string, score: number) => {
    const levels = VIRTUE_LEVELS[virtue] || [];
    for (let i = 0; i < levels.length; i++) {
      if (score < levels[i].minXP) {
        return levels[i];
      }
    }
    return null;
  };

  const getProgressToNext = (virtue: string, score: number) => {
    const currentLevel = getCurrentLevel(virtue, score);
    const nextLevel = getNextLevel(virtue, score);
    
    if (!nextLevel) return 100;
    
    const currentMin = currentLevel.minXP;
    const nextMin = nextLevel.minXP;
    const range = nextMin - currentMin;
    const progress = score - currentMin;
    
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  const getTotalLevel = () => {
    const totalXP = Object.values(virtueScores).reduce((sum, score) => sum + score, 0);
    const averageXP = totalXP / 4;
    
    if (averageXP >= 80) return { name: 'Master', color: 'text-purple-400', icon: Crown };
    if (averageXP >= 60) return { name: 'Advanced', color: 'text-blue-400', icon: Star };
    if (averageXP >= 40) return { name: 'Intermediate', color: 'text-green-400', icon: Target };
    if (averageXP >= 20) return { name: 'Beginner', color: 'text-yellow-400', icon: BookOpen };
    return { name: 'Novice', color: 'text-gray-400', icon: BookOpen };
  };

  const totalLevel = getTotalLevel();

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <totalLevel.icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Virtue Progress</h2>
            <p className="text-sm text-muted">Your journey to wisdom and excellence</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Overall Level: <span className={`font-semibold ${totalLevel.color}`}>{totalLevel.name}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Total XP: {Object.values(virtueScores).reduce((sum, score) => sum + score, 0)}</span>
          </div>
        </div>
      </motion.div>

      {/* Individual Virtue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(virtueScores).map(([virtue, score], index) => {
          const currentLevel = getCurrentLevel(virtue, score);
          const nextLevel = getNextLevel(virtue, score);
          const progressToNext = getProgressToNext(virtue, score);
          const IconComponent = getVirtueIcon(virtue);
          
          return (
            <motion.div
              key={virtue}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-surface border border-border rounded-2xl p-6 hover:bg-surface-2 transition-all duration-200 cursor-pointer",
                selectedVirtue === virtue && "ring-2 ring-primary/50 bg-surface-2"
              )}
              onClick={() => setSelectedVirtue(selectedVirtue === virtue ? null : virtue)}
            >
              {/* Virtue Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-white',
                  `bg-gradient-to-r ${getVirtueGradient(virtue)}`
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text capitalize">{virtue}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getVirtueEmoji(virtue)}</span>
                    <span className={`text-sm font-medium ${currentLevel.color}`}>
                      {currentLevel.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Level Info */}
              <div className="mb-4">
                <p className="text-sm text-muted mb-2">{currentLevel.description}</p>
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>Level {VIRTUE_LEVELS[virtue]?.findIndex(l => l.name === currentLevel.name) + 1}/5</span>
                  <span>{score} XP</span>
                </div>
              </div>

              {/* Progress to Next Level */}
              {nextLevel && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span>Progress to {nextLevel.name}</span>
                    <span>{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-2">
                    <motion.div 
                      className={cn('h-2 rounded-full bg-gradient-to-r', getVirtueGradient(virtue))}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {nextLevel.minXP - score} XP needed for {nextLevel.name}
                  </p>
                </div>
              )}

              {/* Quick Update Buttons */}
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVirtueUpdate(virtue as keyof VirtueScores, value);
                    }}
                    disabled={isUpdating === virtue}
                    className={cn(
                      "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                      score >= value
                        ? "bg-primary text-white"
                        : "bg-surface-2 text-muted hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {isUpdating === virtue ? "..." : value}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed View for Selected Virtue */}
      <AnimatePresence>
        {selectedVirtue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text capitalize">
                {selectedVirtue} Journey Details
              </h3>
              <button
                onClick={() => setSelectedVirtue(null)}
                className="text-muted hover:text-text transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Level Progression */}
              <div>
                <h4 className="font-medium text-text mb-3">Your Journey</h4>
                <div className="space-y-3">
                  {VIRTUE_LEVELS[selectedVirtue]?.map((level, index) => {
                    const isCurrent = getCurrentLevel(selectedVirtue, virtueScores[selectedVirtue as keyof VirtueScores]).name === level.name;
                    const isCompleted = virtueScores[selectedVirtue as keyof VirtueScores] >= level.minXP;
                    const IconComponent = level.icon;
                    
                    return (
                      <div
                        key={level.name}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                          isCurrent
                            ? "bg-primary/10 border-primary/20"
                            : isCompleted
                            ? "bg-success/10 border-success/20"
                            : "bg-surface-2 border-border"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isCurrent
                            ? "bg-primary text-white"
                            : isCompleted
                            ? "bg-success text-white"
                            : "bg-surface-3 text-muted"
                        )}>
                          {isCompleted ? (
                            <Trophy className="w-4 h-4" />
                          ) : (
                            <IconComponent className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              isCurrent ? "text-primary" : isCompleted ? "text-success" : "text-muted"
                            )}>
                              {level.name}
                            </span>
                            {isCurrent && <span className="text-xs text-primary">Current</span>}
                          </div>
                          <p className="text-sm text-muted">{level.title}</p>
                          <p className="text-xs text-muted">{level.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-muted">{level.minXP} XP</div>
                          {isCompleted && <div className="text-xs text-success">✓ Complete</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="font-medium text-text mb-3">Recent Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCurrentLevel(selectedVirtue, virtueScores[selectedVirtue as keyof VirtueScores]).achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded-lg">
                      <Star className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 