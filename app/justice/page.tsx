'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Heart, Users, Target, Sparkles, ArrowRight, Play, Calendar, Award } from 'lucide-react';
import Link from 'next/link';

const justicePractices = [
  {
    title: 'Active Listening',
    description: 'Practice truly hearing and understanding others',
    icon: Heart,
    color: 'from-green-500 to-emerald-600',
    duration: '10 min',
    difficulty: 'Beginner',
    impact: 'Improves relationships'
  },
  {
    title: 'Fair Decision Making',
    description: 'Consider all perspectives before making choices',
    icon: Scale,
    color: 'from-emerald-500 to-teal-600',
    duration: '15 min',
    difficulty: 'Intermediate',
    impact: 'Builds trust'
  },
  {
    title: 'Community Service',
    description: 'Contribute to the well-being of others',
    icon: Users,
    color: 'from-teal-500 to-cyan-600',
    duration: '1 hour',
    difficulty: 'Advanced',
    impact: 'Strengthens community'
  },
  {
    title: 'Conflict Resolution',
    description: 'Help others find common ground',
    icon: Scale,
    color: 'from-cyan-500 to-blue-600',
    duration: '30 min',
    difficulty: 'Expert',
    impact: 'Promotes harmony'
  }
];

const relationshipAreas = [
  {
    title: 'Family',
    description: 'Nurturing close relationships',
    quality: 85,
    actions: 3
  },
  {
    title: 'Friends',
    description: 'Building meaningful friendships',
    quality: 70,
    actions: 2
  },
  {
    title: 'Work',
    description: 'Professional relationships',
    quality: 60,
    actions: 4
  },
  {
    title: 'Community',
    description: 'Contributing to society',
    quality: 45,
    actions: 1
  }
];

export default function JusticePage() {
  const [selectedPractice, setSelectedPractice] = useState(justicePractices[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Justice
            </h1>
          </div>
          <p className="text-xl text-medium-contrast max-w-2xl mx-auto">
            The virtue of fairness and right relationships. Build meaningful connections, serve others, and create harmony in your community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Practice */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Today's Justice Practice
                </CardTitle>
                <CardDescription>
                  Choose a practice to cultivate justice and fairness today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {justicePractices.map((practice) => {
                    const IconComponent = practice.icon;
                    return (
                      <Card
                        key={practice.title}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPractice.title === practice.title
                            ? 'ring-2 ring-green-500 bg-green-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPractice(practice)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${practice.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-high-contrast mb-1">{practice.title}</h3>
                              <p className="text-sm text-medium-contrast mb-2">{practice.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-low-contrast">
                                  <span>{practice.duration}</span>
                                  <span>•</span>
                                  <span>{practice.difficulty}</span>
                                </div>
                                <span className="text-xs font-medium text-green-600">{practice.impact}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <Button className="w-full btn-success">
                    <Play className="w-4 h-4 mr-2" />
                    Practice {selectedPractice.title}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Relationship Health */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  Relationship Health
                </CardTitle>
                <CardDescription>
                  Assess and improve your relationships across different areas of life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relationshipAreas.map((area) => (
                    <div key={area.title} className="p-4 border border-gray-200 rounded-lg bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-high-contrast">{area.title}</h3>
                        <span className="text-sm text-low-contrast">{area.actions} actions needed</span>
                      </div>
                      <p className="text-sm text-medium-contrast mb-3">{area.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${area.quality}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-high-contrast">{area.quality}%</span>
                      </div>
                      <div className="mt-2 text-xs text-low-contrast">
                        {area.quality >= 80 ? '🌟 Excellent' : area.quality >= 60 ? '👍 Good' : '⚠️ Needs attention'}
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
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start btn-high-contrast">
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
                <Link href="/coach">
                  <Button variant="outline" className="w-full justify-start btn-high-contrast">
                    <Scale className="w-4 h-4 mr-2" />
                    Get Relationship Advice
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" className="w-full justify-start btn-high-contrast">
                    <Target className="w-4 h-4 mr-2" />
                    View Impact
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Justice Benefits */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Justice Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm text-high-contrast">Stronger Relationships</h4>
                      <p className="text-xs text-medium-contrast">Build trust and connection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm text-high-contrast">Community Impact</h4>
                      <p className="text-xs text-medium-contrast">Contribute to collective good</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm text-high-contrast">Inner Peace</h4>
                      <p className="text-xs text-medium-contrast">Find harmony through fairness</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm text-high-contrast">Leadership</h4>
                      <p className="text-xs text-medium-contrast">Inspire others through example</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "Justice is the bond of men in states, for the administration of justice, which is the determination of what is just, is the principle of order in political society."
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