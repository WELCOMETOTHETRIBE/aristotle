'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Target, Zap, TrendingUp, Award, Sparkles, ArrowRight, Play, Users, Calendar, Flame } from 'lucide-react';
import Link from 'next/link';

const courageChallenges = [
  {
    title: 'Face Your Fears',
    description: 'Identify and confront one fear each day',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    duration: '5 min',
    difficulty: 'Beginner',
    reward: '+10 Courage Points'
  },
  {
    title: 'Take Action',
    description: 'Complete one challenging task you\'ve been avoiding',
    icon: Zap,
    color: 'from-orange-500 to-yellow-600',
    duration: '30 min',
    difficulty: 'Intermediate',
    reward: '+25 Courage Points'
  },
  {
    title: 'Growth Challenge',
    description: 'Learn a new skill outside your comfort zone',
    icon: TrendingUp,
    color: 'from-yellow-500 to-red-600',
    duration: '1 hour',
    difficulty: 'Advanced',
    reward: '+50 Courage Points'
  },
  {
    title: 'Leadership',
    description: 'Take initiative in a group or community setting',
    icon: Award,
    color: 'from-red-600 to-pink-600',
    duration: '2 hours',
    difficulty: 'Expert',
    reward: '+100 Courage Points'
  }
];

const courageProgress = [
  {
    title: 'Daily Challenges',
    description: 'Facing fears and taking action',
    completed: 12,
    total: 30,
    streak: 5
  },
  {
    title: 'Growth Goals',
    description: 'Learning new skills and abilities',
    completed: 3,
    total: 10,
    streak: 2
  },
  {
    title: 'Leadership Moments',
    description: 'Taking initiative and leading others',
    completed: 1,
    total: 5,
    streak: 1
  }
];

export default function CouragePage() {
  const [selectedChallenge, setSelectedChallenge] = useState(courageChallenges[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Courage
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The virtue of facing challenges with strength. Build resilience, take action, and grow through adversity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Challenge */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  Today's Courage Challenge
                </CardTitle>
                <CardDescription>
                  Choose a challenge to build your courage today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courageChallenges.map((challenge) => {
                    const IconComponent = challenge.icon;
                    return (
                      <Card
                        key={challenge.title}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedChallenge.title === challenge.title
                            ? 'ring-2 ring-red-500 bg-red-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedChallenge(challenge)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${challenge.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{challenge.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{challenge.duration}</span>
                                  <span>•</span>
                                  <span>{challenge.difficulty}</span>
                                </div>
                                <span className="text-xs font-medium text-green-600">{challenge.reward}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                    <Play className="w-4 h-4 mr-2" />
                    Accept {selectedChallenge.title}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Your Courage Journey
                </CardTitle>
                <CardDescription>
                  Track your progress in building courage and resilience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courageProgress.map((progress) => (
                    <div key={progress.title} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{progress.title}</h3>
                        <span className="text-sm text-gray-500">{progress.completed}/{progress.total}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{progress.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{Math.round((progress.completed / progress.total) * 100)}%</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        🔥 {progress.streak} day streak
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/coach">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Get Courage Coaching
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Join Courage Circle
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Courage Benefits */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  Courage Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Resilience</h4>
                      <p className="text-xs text-gray-600">Bounce back from setbacks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Confidence</h4>
                      <p className="text-xs text-gray-600">Trust in your abilities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Growth</h4>
                      <p className="text-xs text-gray-600">Embrace challenges as opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Leadership</h4>
                      <p className="text-xs text-gray-600">Take initiative and inspire others</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-red-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "Courage is the first of human qualities because it is the quality which guarantees the others."
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