'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Scale, Heart, 
  Star, Trophy, Target, TrendingUp,
  Zap, Crown, BookOpen, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import VirtueRadar from '@/components/VirtueRadar';

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

      {/* Overview Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Radar Chart */}
        <div className="md:col-span-3 bg-surface border border-border rounded-2xl p-4">
          <div className="text-sm font-medium text-text mb-2">Virtue Balance (7-day)</div>
          <div className="h-64">
            {/* Radar graph of the four virtues */}
            {/* @ts-ignore */}
            <VirtueRadar data={[
              { virtue: 'Wisdom', score: virtueScores.wisdom },
              { virtue: 'Courage', score: virtueScores.courage },
              { virtue: 'Justice', score: virtueScores.justice },
              { virtue: 'Temperance', score: virtueScores.temperance }
            ]} />
          </div>
        </div>
        
        {/* Compact per-virtue summary */}
        <div className="md:col-span-2 bg-surface border border-border rounded-2xl p-4 space-y-4">
          {(['wisdom','courage','justice','temperance'] as const).map((virtueKey) => {
            const score = virtueScores[virtueKey];
            const IconComponent = getVirtueIcon(virtueKey);
            const level = getCurrentLevel(virtueKey, score);
            return (
              <div key={virtueKey} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg text-white flex items-center justify-center bg-gradient-to-r', getVirtueGradient(virtueKey))}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium text-text capitalize">{virtueKey}</div>
                  </div>
                  <div className="text-xs text-muted">{score} XP</div>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2">
                  <div className={cn('h-2 rounded-full bg-gradient-to-r', getVirtueGradient(virtueKey))} style={{ width: `${Math.min(100, score)}%` }} />
                </div>
                <div className="text-[10px] text-muted">{level.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 