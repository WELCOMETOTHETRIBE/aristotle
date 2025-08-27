'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Calendar, Award, Sparkles, Brain, Shield, Scale, Leaf, BarChart3, Trophy, Clock } from 'lucide-react';

const virtueData = [
  {
    name: 'Wisdom',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    currentLevel: 75,
    targetLevel: 90,
    weeklyProgress: 5,
    practices: 12,
    streak: 8
  },
  {
    name: 'Courage',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    currentLevel: 60,
    targetLevel: 85,
    weeklyProgress: 8,
    practices: 8,
    streak: 5
  },
  {
    name: 'Justice',
    icon: Scale,
    color: 'from-green-500 to-emerald-600',
    currentLevel: 45,
    targetLevel: 80,
    weeklyProgress: 3,
    practices: 6,
    streak: 3
  },
  {
    name: 'Temperance',
    icon: Leaf,
    color: 'from-purple-500 to-pink-600',
    currentLevel: 80,
    targetLevel: 95,
    weeklyProgress: 2,
    practices: 15,
    streak: 12
  }
];

const achievements = [
  {
    title: 'First Steps',
    description: 'Complete your first week of practice',
    icon: Trophy,
    achieved: true,
    date: '2024-01-15'
  },
  {
    title: 'Consistency',
    description: 'Maintain a 7-day streak',
    icon: Award,
    achieved: true,
    date: '2024-01-22'
  },
  {
    title: 'Wisdom Seeker',
    description: 'Complete 10 wisdom practices',
    icon: Brain,
    achieved: true,
    date: '2024-01-25'
  },
  {
    title: 'Courage Builder',
    description: 'Face 5 challenging situations',
    icon: Shield,
    achieved: false,
    progress: 3
  },
  {
    title: 'Community Helper',
    description: 'Complete 10 acts of service',
    icon: Scale,
    achieved: false,
    progress: 7
  }
];

const weeklyStats = [
  { label: 'Practices Completed', value: 41, change: '+12%', positive: true },
  { label: 'Streak Days', value: 12, change: '+3', positive: true },
  { label: 'Hours Studied', value: 8.5, change: '+2.1', positive: true },
  { label: 'Challenges Faced', value: 5, change: '+2', positive: true }
];

export default function ProgressPage() {
  const [selectedVirtue, setSelectedVirtue] = useState(virtueData[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-teal-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Progress
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your journey toward eudaimonia. Monitor your growth in wisdom, courage, justice, and temperance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Overview */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  This Week's Progress
                </CardTitle>
                <CardDescription>
                  Your activity and growth over the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {weeklyStats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                      <div className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Virtue Progress */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Virtue Development
                </CardTitle>
                <CardDescription>
                  Your progress in cultivating the four cardinal virtues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {virtueData.map((virtue) => {
                    const IconComponent = virtue.icon;
                    const progressPercentage = (virtue.currentLevel / virtue.targetLevel) * 100;
                    return (
                      <div key={virtue.name} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${virtue.color} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{virtue.name}</h3>
                              <p className="text-sm text-gray-500">Level {virtue.currentLevel} / {virtue.targetLevel}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{virtue.currentLevel}%</div>
                            <div className="text-xs text-green-600">+{virtue.weeklyProgress} this week</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${virtue.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{virtue.practices} practices completed</span>
                          <span>🔥 {virtue.streak} day streak</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Milestones on your path to virtue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.title}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.achieved
                            ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            achievement.achieved
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-600'
                              : 'bg-gray-300'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              achievement.achieved ? 'text-white' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${
                              achievement.achieved ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {achievement.title}
                            </h3>
                            <p className={`text-sm mb-2 ${
                              achievement.achieved ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {achievement.description}
                            </p>
                            {achievement.achieved ? (
                                                              <div className="text-xs text-teal-600">
                                  Achieved on {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'Unknown'}
                                </div>
                            ) : (
                              <div className="text-xs text-gray-500">
                                Progress: {achievement.progress}/10
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Streak */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-600 mb-2">12</div>
                  <div className="text-sm text-gray-600">Days of consistent practice</div>
                  <div className="text-xs text-green-600 mt-1">🔥 Keep it up!</div>
                </div>
              </CardContent>
            </Card>

            {/* Next Milestone */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Courage Builder</h3>
                  <p className="text-sm text-gray-600 mb-3">Face 5 challenging situations</p>
                  <div className="text-xs text-gray-500">Progress: 3/5</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                </blockquote>
                <cite className="text-sm opacity-90">— Aristotle</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 