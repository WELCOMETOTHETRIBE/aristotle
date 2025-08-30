'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Lock, Star } from 'lucide-react';
import { getVirtueEmoji, getVirtueColor } from '@/lib/virtue';
import { VirtueTotals } from '@/lib/virtue';

interface Milestone {
  id: string;
  title: string;
  description: string;
  virtue: 'wisdom' | 'courage' | 'justice' | 'temperance';
  requirement: number;
  achieved: boolean;
  achievedAt?: string;
}

interface MilestonesDropdownProps {
  virtueTotals: VirtueTotals;
  frameworkSlug?: string;
}

const generateMilestones = (virtueTotals: VirtueTotals, frameworkSlug?: string): Milestone[] => {
  const milestones: Milestone[] = [];
  
  // Wisdom milestones
  if (virtueTotals.wisdom >= 10) {
    milestones.push({
      id: 'wisdom-10',
      title: 'Seeker of Knowledge',
      description: 'Reach 10 Wisdom points',
      virtue: 'wisdom',
      requirement: 10,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'wisdom-10',
      title: 'Seeker of Knowledge',
      description: 'Reach 10 Wisdom points',
      virtue: 'wisdom',
      requirement: 10,
      achieved: false
    });
  }
  
  if (virtueTotals.wisdom >= 25) {
    milestones.push({
      id: 'wisdom-25',
      title: 'Student of Life',
      description: 'Reach 25 Wisdom points',
      virtue: 'wisdom',
      requirement: 25,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'wisdom-25',
      title: 'Student of Life',
      description: 'Reach 25 Wisdom points',
      virtue: 'wisdom',
      requirement: 25,
      achieved: false
    });
  }
  
  if (virtueTotals.wisdom >= 50) {
    milestones.push({
      id: 'wisdom-50',
      title: 'Wise One',
      description: 'Reach 50 Wisdom points',
      virtue: 'wisdom',
      requirement: 50,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'wisdom-50',
      title: 'Wise One',
      description: 'Reach 50 Wisdom points',
      virtue: 'wisdom',
      requirement: 50,
      achieved: false
    });
  }

  // Courage milestones
  if (virtueTotals.courage >= 10) {
    milestones.push({
      id: 'courage-10',
      title: 'Brave Heart',
      description: 'Reach 10 Courage points',
      virtue: 'courage',
      requirement: 10,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'courage-10',
      title: 'Brave Heart',
      description: 'Reach 10 Courage points',
      virtue: 'courage',
      requirement: 10,
      achieved: false
    });
  }
  
  if (virtueTotals.courage >= 25) {
    milestones.push({
      id: 'courage-25',
      title: 'Fearless Warrior',
      description: 'Reach 25 Courage points',
      virtue: 'courage',
      requirement: 25,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'courage-25',
      title: 'Fearless Warrior',
      description: 'Reach 25 Courage points',
      virtue: 'courage',
      requirement: 25,
      achieved: false
    });
  }
  
  if (virtueTotals.courage >= 50) {
    milestones.push({
      id: 'courage-50',
      title: 'Lion Heart',
      description: 'Reach 50 Courage points',
      virtue: 'courage',
      requirement: 50,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'courage-50',
      title: 'Lion Heart',
      description: 'Reach 50 Courage points',
      virtue: 'courage',
      requirement: 50,
      achieved: false
    });
  }

  // Justice milestones
  if (virtueTotals.justice >= 10) {
    milestones.push({
      id: 'justice-10',
      title: 'Fair Minded',
      description: 'Reach 10 Justice points',
      virtue: 'justice',
      requirement: 10,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'justice-10',
      title: 'Fair Minded',
      description: 'Reach 10 Justice points',
      virtue: 'justice',
      requirement: 10,
      achieved: false
    });
  }
  
  if (virtueTotals.justice >= 25) {
    milestones.push({
      id: 'justice-25',
      title: 'Guardian of Truth',
      description: 'Reach 25 Justice points',
      virtue: 'justice',
      requirement: 25,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'justice-25',
      title: 'Guardian of Truth',
      description: 'Reach 25 Justice points',
      virtue: 'justice',
      requirement: 25,
      achieved: false
    });
  }
  
  if (virtueTotals.justice >= 50) {
    milestones.push({
      id: 'justice-50',
      title: 'Just One',
      description: 'Reach 50 Justice points',
      virtue: 'justice',
      requirement: 50,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'justice-50',
      title: 'Just One',
      description: 'Reach 50 Justice points',
      virtue: 'justice',
      requirement: 50,
      achieved: false
    });
  }

  // Temperance milestones
  if (virtueTotals.temperance >= 10) {
    milestones.push({
      id: 'temperance-10',
      title: 'Balanced Soul',
      description: 'Reach 10 Temperance points',
      virtue: 'temperance',
      requirement: 10,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'temperance-10',
      title: 'Balanced Soul',
      description: 'Reach 10 Temperance points',
      virtue: 'temperance',
      requirement: 10,
      achieved: false
    });
  }
  
  if (virtueTotals.temperance >= 25) {
    milestones.push({
      id: 'temperance-25',
      title: 'Master of Self',
      description: 'Reach 25 Temperance points',
      virtue: 'temperance',
      requirement: 25,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'temperance-25',
      title: 'Master of Self',
      description: 'Reach 25 Temperance points',
      virtue: 'temperance',
      requirement: 25,
      achieved: false
    });
  }
  
  if (virtueTotals.temperance >= 50) {
    milestones.push({
      id: 'temperance-50',
      title: 'Sage of Balance',
      description: 'Reach 50 Temperance points',
      virtue: 'temperance',
      requirement: 50,
      achieved: true,
      achievedAt: new Date().toISOString()
    });
  } else {
    milestones.push({
      id: 'temperance-50',
      title: 'Sage of Balance',
      description: 'Reach 50 Temperance points',
      virtue: 'temperance',
      requirement: 50,
      achieved: false
    });
  }

  // Framework-specific milestones
  if (frameworkSlug) {
    const frameworkMilestones = getFrameworkMilestones(frameworkSlug, virtueTotals);
    milestones.push(...frameworkMilestones);
  }

  return milestones;
};

const getFrameworkMilestones = (frameworkSlug: string, virtueTotals: VirtueTotals): Milestone[] => {
  const frameworkMilestones: Milestone[] = [];
  
  switch (frameworkSlug) {
    case 'spartan':
      if (virtueTotals.courage >= 30) {
        frameworkMilestones.push({
          id: 'spartan-warrior',
          title: 'Spartan Warrior',
          description: 'Complete 3 Spartan trials',
          virtue: 'courage',
          requirement: 30,
          achieved: true,
          achievedAt: new Date().toISOString()
        });
      } else {
        frameworkMilestones.push({
          id: 'spartan-warrior',
          title: 'Spartan Warrior',
          description: 'Complete 3 Spartan trials',
          virtue: 'courage',
          requirement: 30,
          achieved: false
        });
      }
      break;
      
    case 'samurai':
      if (virtueTotals.justice >= 30) {
        frameworkMilestones.push({
          id: 'samurai-honor',
          title: 'Honorable Samurai',
          description: 'Maintain honor in 5 decisions',
          virtue: 'justice',
          requirement: 30,
          achieved: true,
          achievedAt: new Date().toISOString()
        });
      } else {
        frameworkMilestones.push({
          id: 'samurai-honor',
          title: 'Honorable Samurai',
          description: 'Maintain honor in 5 decisions',
          virtue: 'justice',
          requirement: 30,
          achieved: false
        });
      }
      break;
      
    case 'stoic':
      if (virtueTotals.wisdom >= 30) {
        frameworkMilestones.push({
          id: 'stoic-philosopher',
          title: 'Stoic Philosopher',
          description: 'Practice negative visualization for 7 days',
          virtue: 'wisdom',
          requirement: 30,
          achieved: true,
          achievedAt: new Date().toISOString()
        });
      } else {
        frameworkMilestones.push({
          id: 'stoic-philosopher',
          title: 'Stoic Philosopher',
          description: 'Practice negative visualization for 7 days',
          virtue: 'wisdom',
          requirement: 30,
          achieved: false
        });
      }
      break;
  }
  
  return frameworkMilestones;
};

export default function MilestonesDropdown({ virtueTotals, frameworkSlug }: MilestonesDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const milestones = generateMilestones(virtueTotals, frameworkSlug);
  const achievedCount = milestones.filter(m => m.achieved).length;
  const totalCount = milestones.length;

  return (
    <div className="relative">
      {/* Milestones Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white transition-all duration-200"
      >
        <Trophy className="w-4 h-4 text-yellow-400" />
        <span className="font-medium">Milestones</span>
        <span className="text-sm text-gray-300">({achievedCount}/{totalCount})</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-300" />
        )}
      </button>

      {/* Dropdown Content */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Achievement Milestones</h3>
            
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.id} 
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    milestone.achieved 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-gray-500/10 border-gray-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {milestone.achieved ? (
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${
                          milestone.achieved ? 'text-green-300' : 'text-gray-300'
                        }`}>
                          {milestone.title}
                        </h4>
                        
                        {/* Virtue Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          milestone.achieved 
                            ? getVirtueColor(milestone.virtue as keyof VirtueTotals)
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          <span className="text-xs">{getVirtueEmoji(milestone.virtue as keyof VirtueTotals)}</span>
                          <span className="capitalize">{milestone.virtue}</span>
                        </span>
                      </div>
                      
                      <p className={`text-xs ${
                        milestone.achieved ? 'text-green-200' : 'text-gray-400'
                      }`}>
                        {milestone.description}
                      </p>
                      
                      {milestone.achieved && milestone.achievedAt && (
                        <p className="text-xs text-green-300/70 mt-1">
                          Achieved {new Date(milestone.achievedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Progress</span>
                <span className="text-sm font-medium text-green-400">
                  {Math.round((achievedCount / totalCount) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-300"
                  style={{ width: `${(achievedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 