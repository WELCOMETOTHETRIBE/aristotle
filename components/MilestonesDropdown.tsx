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
  framework?: string;
}

interface MilestonesDropdownProps {
  virtueTotals: VirtueTotals;
  frameworkSlug?: string;
}

const generateMilestones = (virtueTotals: VirtueTotals, frameworkSlug?: string): Milestone[] => {
  const milestones: Milestone[] = [];
  
  // Universal milestones (all frameworks)
  const universalMilestones = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first practice session',
      virtue: 'wisdom' as const,
      requirement: 5,
      achieved: virtueTotals.wisdom >= 5
    },
    {
      id: 'consistency-beginner',
      title: 'Consistency Beginner',
      description: 'Practice for 3 consecutive days',
      virtue: 'temperance' as const,
      requirement: 10,
      achieved: virtueTotals.temperance >= 10
    },
    {
      id: 'courage-initiate',
      title: 'Courage Initiate',
      description: 'Face your first challenge with courage',
      virtue: 'courage' as const,
      requirement: 8,
      achieved: virtueTotals.courage >= 8
    },
    {
      id: 'justice-seeker',
      title: 'Justice Seeker',
      description: 'Make your first fair decision',
      virtue: 'justice' as const,
      requirement: 8,
      achieved: virtueTotals.justice >= 8
    },
    {
      id: 'wisdom-apprentice',
      title: 'Wisdom Apprentice',
      description: 'Learn your first lesson',
      virtue: 'wisdom' as const,
      requirement: 15,
      achieved: virtueTotals.wisdom >= 15
    },
    {
      id: 'temperance-student',
      title: 'Temperance Student',
      description: 'Master your first habit',
      virtue: 'temperance' as const,
      requirement: 20,
      achieved: virtueTotals.temperance >= 20
    },
    {
      id: 'courage-warrior',
      title: 'Courage Warrior',
      description: 'Overcome a significant fear',
      virtue: 'courage' as const,
      requirement: 25,
      achieved: virtueTotals.courage >= 25
    },
    {
      id: 'justice-guardian',
      title: 'Justice Guardian',
      description: 'Stand up for what is right',
      virtue: 'justice' as const,
      requirement: 25,
      achieved: virtueTotals.justice >= 25
    },
    {
      id: 'wisdom-sage',
      title: 'Wisdom Sage',
      description: 'Share wisdom with others',
      virtue: 'wisdom' as const,
      requirement: 35,
      achieved: virtueTotals.wisdom >= 35
    },
    {
      id: 'mastery-aspirant',
      title: 'Mastery Aspirant',
      description: 'Achieve balance across all virtues',
      virtue: 'temperance' as const,
      requirement: 40,
      achieved: virtueTotals.temperance >= 40
    }
  ];

  // Add universal milestones
  milestones.push(...universalMilestones.map(m => ({
    ...m,
    achievedAt: m.achieved ? new Date().toISOString() : undefined
  })));

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
      frameworkMilestones.push(
        {
          id: 'spartan-initiate',
          title: 'Spartan Initiate',
          description: 'Complete your first cold exposure session',
          virtue: 'courage',
          requirement: 15,
          achieved: virtueTotals.courage >= 15,
          framework: 'spartan'
        },
        {
          id: 'spartan-warrior',
          title: 'Spartan Warrior',
          description: 'Complete 5 physical trials',
          virtue: 'courage',
          requirement: 25,
          achieved: virtueTotals.courage >= 25,
          framework: 'spartan'
        },
        {
          id: 'spartan-disciplined',
          title: 'Spartan Disciplined',
          description: 'Maintain strict boundaries for 7 days',
          virtue: 'temperance',
          requirement: 20,
          achieved: virtueTotals.temperance >= 20,
          framework: 'spartan'
        },
        {
          id: 'spartan-endurance',
          title: 'Spartan Endurance',
          description: 'Complete a 30-minute endurance session',
          virtue: 'courage',
          requirement: 35,
          achieved: virtueTotals.courage >= 35,
          framework: 'spartan'
        },
        {
          id: 'spartan-master',
          title: 'Spartan Master',
          description: 'Lead others through a trial',
          virtue: 'courage',
          requirement: 45,
          achieved: virtueTotals.courage >= 45,
          framework: 'spartan'
        },
        {
          id: 'spartan-philosopher',
          title: 'Spartan Philosopher',
          description: 'Reflect on adversity for 10 days',
          virtue: 'wisdom',
          requirement: 30,
          achieved: virtueTotals.wisdom >= 30,
          framework: 'spartan'
        },
        {
          id: 'spartan-legend',
          title: 'Spartan Legend',
          description: 'Complete the ultimate trial',
          virtue: 'courage',
          requirement: 60,
          achieved: virtueTotals.courage >= 60,
          framework: 'spartan'
        },
        {
          id: 'spartan-mentor',
          title: 'Spartan Mentor',
          description: 'Train another in the Spartan way',
          virtue: 'wisdom',
          requirement: 40,
          achieved: virtueTotals.wisdom >= 40,
          framework: 'spartan'
        },
        {
          id: 'spartan-commander',
          title: 'Spartan Commander',
          description: 'Lead a group through challenges',
          virtue: 'justice',
          requirement: 35,
          achieved: virtueTotals.justice >= 35,
          framework: 'spartan'
        },
        {
          id: 'spartan-immortal',
          title: 'Spartan Immortal',
          description: 'Achieve legendary status',
          virtue: 'courage',
          requirement: 80,
          achieved: virtueTotals.courage >= 80,
          framework: 'spartan'
        }
      );
      break;
      
    case 'bushido':
      frameworkMilestones.push(
        {
          id: 'bushido-initiate',
          title: 'Bushido Initiate',
          description: 'Learn the code of honor',
          virtue: 'justice',
          requirement: 15,
          achieved: virtueTotals.justice >= 15,
          framework: 'bushido'
        },
        {
          id: 'bushido-warrior',
          title: 'Bushido Warrior',
          description: 'Maintain honor in 5 decisions',
          virtue: 'justice',
          requirement: 25,
          achieved: virtueTotals.justice >= 25,
          framework: 'bushido'
        },
        {
          id: 'bushido-disciplined',
          title: 'Bushido Disciplined',
          description: 'Practice daily meditation for 7 days',
          virtue: 'temperance',
          requirement: 20,
          achieved: virtueTotals.temperance >= 20,
          framework: 'bushido'
        },
        {
          id: 'bushido-courageous',
          title: 'Bushido Courageous',
          description: 'Face fear with honor',
          virtue: 'courage',
          requirement: 30,
          achieved: virtueTotals.courage >= 30,
          framework: 'bushido'
        },
        {
          id: 'bushido-wise',
          title: 'Bushido Wise',
          description: 'Study ancient wisdom texts',
          virtue: 'wisdom',
          requirement: 25,
          achieved: virtueTotals.wisdom >= 25,
          framework: 'bushido'
        },
        {
          id: 'bushido-master',
          title: 'Bushido Master',
          description: 'Master the way of the sword',
          virtue: 'courage',
          requirement: 45,
          achieved: virtueTotals.courage >= 45,
          framework: 'bushido'
        },
        {
          id: 'bushido-philosopher',
          title: 'Bushido Philosopher',
          description: 'Understand the deeper meaning',
          virtue: 'wisdom',
          requirement: 35,
          achieved: virtueTotals.wisdom >= 35,
          framework: 'bushido'
        },
        {
          id: 'bushido-just',
          title: 'Bushido Just',
          description: 'Uphold justice in all actions',
          virtue: 'justice',
          requirement: 40,
          achieved: virtueTotals.justice >= 40,
          framework: 'bushido'
        },
        {
          id: 'bushido-balanced',
          title: 'Bushido Balanced',
          description: 'Achieve perfect balance',
          virtue: 'temperance',
          requirement: 35,
          achieved: virtueTotals.temperance >= 35,
          framework: 'bushido'
        },
        {
          id: 'bushido-legend',
          title: 'Bushido Legend',
          description: 'Become a living legend',
          virtue: 'justice',
          requirement: 70,
          achieved: virtueTotals.justice >= 70,
          framework: 'bushido'
        }
      );
      break;
      
    case 'stoic':
      frameworkMilestones.push(
        {
          id: 'stoic-initiate',
          title: 'Stoic Initiate',
          description: 'Learn the basic principles',
          virtue: 'wisdom',
          requirement: 15,
          achieved: virtueTotals.wisdom >= 15,
          framework: 'stoic'
        },
        {
          id: 'stoic-practitioner',
          title: 'Stoic Practitioner',
          description: 'Practice negative visualization for 7 days',
          virtue: 'wisdom',
          requirement: 25,
          achieved: virtueTotals.wisdom >= 25,
          framework: 'stoic'
        },
        {
          id: 'stoic-disciplined',
          title: 'Stoic Disciplined',
          description: 'Control your emotions daily',
          virtue: 'temperance',
          requirement: 20,
          achieved: virtueTotals.temperance >= 20,
          framework: 'stoic'
        },
        {
          id: 'stoic-courageous',
          title: 'Stoic Courageous',
          description: 'Face adversity with equanimity',
          virtue: 'courage',
          requirement: 30,
          achieved: virtueTotals.courage >= 30,
          framework: 'stoic'
        },
        {
          id: 'stoic-just',
          title: 'Stoic Just',
          description: 'Act with justice in all situations',
          virtue: 'justice',
          requirement: 25,
          achieved: virtueTotals.justice >= 25,
          framework: 'stoic'
        },
        {
          id: 'stoic-philosopher',
          title: 'Stoic Philosopher',
          description: 'Study Stoic texts deeply',
          virtue: 'wisdom',
          requirement: 35,
          achieved: virtueTotals.wisdom >= 35,
          framework: 'stoic'
        },
        {
          id: 'stoic-master',
          title: 'Stoic Master',
          description: 'Live according to nature',
          virtue: 'temperance',
          requirement: 40,
          achieved: virtueTotals.temperance >= 40,
          framework: 'stoic'
        },
        {
          id: 'stoic-sage',
          title: 'Stoic Sage',
          description: 'Achieve perfect wisdom',
          virtue: 'wisdom',
          requirement: 50,
          achieved: virtueTotals.wisdom >= 50,
          framework: 'stoic'
        },
        {
          id: 'stoic-virtuous',
          title: 'Stoic Virtuous',
          description: 'Exemplify all four virtues',
          virtue: 'justice',
          requirement: 45,
          achieved: virtueTotals.justice >= 45,
          framework: 'stoic'
        },
        {
          id: 'stoic-legend',
          title: 'Stoic Legend',
          description: 'Become a modern sage',
          virtue: 'wisdom',
          requirement: 75,
          achieved: virtueTotals.wisdom >= 75,
          framework: 'stoic'
        }
      );
      break;
      
    case 'highperf':
      frameworkMilestones.push(
        {
          id: 'highperf-initiate',
          title: 'High Performance Initiate',
          description: 'Learn the fundamentals of peak performance',
          virtue: 'wisdom',
          requirement: 15,
          achieved: virtueTotals.wisdom >= 15,
          framework: 'highperf'
        },
        {
          id: 'highperf-focused',
          title: 'High Performance Focused',
          description: 'Complete 5 deep work sessions',
          virtue: 'temperance',
          requirement: 25,
          achieved: virtueTotals.temperance >= 25,
          framework: 'highperf'
        },
        {
          id: 'highperf-courageous',
          title: 'High Performance Courageous',
          description: 'Take calculated risks for growth',
          virtue: 'courage',
          requirement: 30,
          achieved: virtueTotals.courage >= 30,
          framework: 'highperf'
        },
        {
          id: 'highperf-just',
          title: 'High Performance Just',
          description: 'Make ethical decisions under pressure',
          virtue: 'justice',
          requirement: 25,
          achieved: virtueTotals.justice >= 25,
          framework: 'highperf'
        },
        {
          id: 'highperf-optimized',
          title: 'High Performance Optimized',
          description: 'Optimize your daily routine',
          virtue: 'wisdom',
          requirement: 35,
          achieved: virtueTotals.wisdom >= 35,
          framework: 'highperf'
        },
        {
          id: 'highperf-resilient',
          title: 'High Performance Resilient',
          description: 'Bounce back from setbacks',
          virtue: 'courage',
          requirement: 40,
          achieved: virtueTotals.courage >= 40,
          framework: 'highperf'
        },
        {
          id: 'highperf-master',
          title: 'High Performance Master',
          description: 'Achieve consistent peak performance',
          virtue: 'temperance',
          requirement: 45,
          achieved: virtueTotals.temperance >= 45,
          framework: 'highperf'
        },
        {
          id: 'highperf-leader',
          title: 'High Performance Leader',
          description: 'Lead others to peak performance',
          virtue: 'justice',
          requirement: 40,
          achieved: virtueTotals.justice >= 40,
          framework: 'highperf'
        },
        {
          id: 'highperf-innovator',
          title: 'High Performance Innovator',
          description: 'Create new performance systems',
          virtue: 'wisdom',
          requirement: 50,
          achieved: virtueTotals.wisdom >= 50,
          framework: 'highperf'
        },
        {
          id: 'highperf-legend',
          title: 'High Performance Legend',
          description: 'Become a performance legend',
          virtue: 'courage',
          requirement: 70,
          achieved: virtueTotals.courage >= 70,
          framework: 'highperf'
        }
      );
      break;
      
    default:
      // Generic framework milestones
      frameworkMilestones.push(
        {
          id: 'framework-initiate',
          title: 'Framework Initiate',
          description: 'Begin your journey in this tradition',
          virtue: 'wisdom',
          requirement: 10,
          achieved: virtueTotals.wisdom >= 10,
          framework: frameworkSlug
        },
        {
          id: 'framework-practitioner',
          title: 'Framework Practitioner',
          description: 'Practice the core principles',
          virtue: 'temperance',
          requirement: 20,
          achieved: virtueTotals.temperance >= 20,
          framework: frameworkSlug
        },
        {
          id: 'framework-courageous',
          title: 'Framework Courageous',
          description: 'Face challenges with courage',
          virtue: 'courage',
          requirement: 25,
          achieved: virtueTotals.courage >= 25,
          framework: frameworkSlug
        },
        {
          id: 'framework-just',
          title: 'Framework Just',
          description: 'Act with justice and fairness',
          virtue: 'justice',
          requirement: 25,
          achieved: virtueTotals.justice >= 25,
          framework: frameworkSlug
        },
        {
          id: 'framework-wise',
          title: 'Framework Wise',
          description: 'Gain deep understanding',
          virtue: 'wisdom',
          requirement: 30,
          achieved: virtueTotals.wisdom >= 30,
          framework: frameworkSlug
        },
        {
          id: 'framework-disciplined',
          title: 'Framework Disciplined',
          description: 'Master self-discipline',
          virtue: 'temperance',
          requirement: 35,
          achieved: virtueTotals.temperance >= 35,
          framework: frameworkSlug
        },
        {
          id: 'framework-brave',
          title: 'Framework Brave',
          description: 'Show exceptional courage',
          virtue: 'courage',
          requirement: 40,
          achieved: virtueTotals.courage >= 40,
          framework: frameworkSlug
        },
        {
          id: 'framework-fair',
          title: 'Framework Fair',
          description: 'Uphold justice consistently',
          virtue: 'justice',
          requirement: 35,
          achieved: virtueTotals.justice >= 35,
          framework: frameworkSlug
        },
        {
          id: 'framework-sage',
          title: 'Framework Sage',
          description: 'Achieve wisdom in this tradition',
          virtue: 'wisdom',
          requirement: 45,
          achieved: virtueTotals.wisdom >= 45,
          framework: frameworkSlug
        },
        {
          id: 'framework-master',
          title: 'Framework Master',
          description: 'Master this tradition',
          virtue: 'temperance',
          requirement: 50,
          achieved: virtueTotals.temperance >= 50,
          framework: frameworkSlug
        }
      );
  }
  
  return frameworkMilestones.map(m => ({
    ...m,
    achievedAt: m.achieved ? new Date().toISOString() : undefined
  }));
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

      {/* Dropdown Content - Fixed positioning with proper centering */}
      {isExpanded && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto" style={{ maxHeight: '400px' }}>
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