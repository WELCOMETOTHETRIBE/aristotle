'use client';

import { useState } from 'react';
import { Scale, Heart, Users, Target, Sparkles, ArrowRight, Play, Calendar, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageLayout, { 
  PageTitle, 
  PageSubtitle, 
  SectionTitle, 
  CardTitle, 
  CardDescription, 
  PageSection, 
  PageGrid 
} from '@/components/PageLayout';

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
    <PageLayout background="default">
      {/* Header */}
      <PageSection spacing="large">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <div>
              <PageTitle size="large" className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Justice
              </PageTitle>
              <PageSubtitle className="mt-2">
                The Virtue of Fairness & Right Relationships
              </PageSubtitle>
            </div>
          </div>
          <CardDescription className="max-w-2xl mx-auto">
            Build meaningful connections, serve others, and create harmony in your community.
          </CardDescription>
        </div>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Practice */}
          <PageSection>
            <div className="glass rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-green-400" />
                <CardTitle>Daily Practice</CardTitle>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {justicePractices.map((practice) => {
                  const IconComponent = practice.icon;
                  return (
                    <div
                      key={practice.title}
                      className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                        selectedPractice.title === practice.title
                          ? 'bg-gradient-to-r ' + practice.color + ' text-white border-transparent'
                          : 'bg-white/5 text-white hover:bg-white/10 border-white/20'
                      }`}
                      onClick={() => setSelectedPractice(practice)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <IconComponent className="w-6 h-6" />
                        <CardTitle className="text-lg">{practice.title}</CardTitle>
                      </div>
                      <CardDescription className="mb-4">
                        {practice.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm">
                        <span className="opacity-70">{practice.duration}</span>
                        <span className="px-2 py-1 rounded-full bg-white/20 text-xs">
                          {practice.difficulty}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <button className="btn-primary">
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice
                </button>
              </div>
            </div>
          </PageSection>

          {/* Relationship Areas */}
          <PageSection>
            <div className="glass rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-green-400" />
                <CardTitle>Relationship Areas</CardTitle>
              </div>
              
              <PageGrid cols={2}>
                {relationshipAreas.map((area) => (
                  <div key={area.title} className="p-6 rounded-xl bg-white/5 border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                      <div className="text-2xl font-bold text-green-400">{area.quality}%</div>
                    </div>
                    <CardDescription className="mb-4">
                      {area.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{area.actions} actions</span>
                      <button className="btn-secondary btn-small">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </PageGrid>
            </div>
          </PageSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Practice Details */}
          <div className="glass rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-green-400" />
              <CardTitle>Practice Details</CardTitle>
            </div>
            
            <div className="space-y-4">
              <div>
                <CardTitle className="text-lg mb-2">{selectedPractice.title}</CardTitle>
                <CardDescription>{selectedPractice.description}</CardDescription>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{selectedPractice.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-white">{selectedPractice.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Impact:</span>
                  <span className="text-white">{selectedPractice.impact}</span>
                </div>
              </div>
              
              <button className="btn-primary w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </button>
            </div>
          </div>

          {/* Justice Quote */}
          <div className="glass rounded-2xl border border-white/10 p-6 bg-gradient-to-r from-green-500/20 to-emerald-600/20">
            <blockquote className="text-lg italic text-white mb-4 leading-relaxed">
              "Justice is the constant and perpetual will to allot to every man his due."
            </blockquote>
            <cite className="text-sm text-green-300">— Justinian I</cite>
          </div>

          {/* Progress Stats */}
          <div className="glass rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-green-400" />
              <CardTitle>Your Progress</CardTitle>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">75%</div>
                <div className="text-sm text-gray-400">Overall Justice Score</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Practices Completed</span>
                  <span className="text-white">12/16</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Streak</span>
                  <span className="text-white">8 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Community Impact</span>
                  <span className="text-white">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 