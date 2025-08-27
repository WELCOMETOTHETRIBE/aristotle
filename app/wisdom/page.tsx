'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BookOpen, Lightbulb, Target, Sparkles, ArrowRight, Play, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

const wisdomPractices = [
  {
    title: 'Philosophical Reading',
    description: 'Daily readings from Aristotle and other great thinkers',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    duration: '15 min',
    difficulty: 'Beginner'
  },
  {
    title: 'Reflection Journal',
    description: 'Contemplative writing to deepen understanding',
    icon: Lightbulb,
    color: 'from-indigo-500 to-purple-600',
    duration: '10 min',
    difficulty: 'Beginner'
  },
  {
    title: 'Socratic Dialogue',
    description: 'Question-based learning with Aristotle AI',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    duration: '20 min',
    difficulty: 'Intermediate'
  },
  {
    title: 'Study Group',
    description: 'Learn with fellow wisdom seekers',
    icon: Users,
    color: 'from-pink-500 to-red-600',
    duration: '45 min',
    difficulty: 'Advanced'
  }
];

const wisdomTopics = [
  {
    title: 'Ethics & Virtue',
    description: 'Understanding Aristotle\'s moral philosophy',
    progress: 75,
    lessons: 12
  },
  {
    title: 'Logic & Reasoning',
    description: 'Master the art of clear thinking',
    progress: 45,
    lessons: 8
  },
  {
    title: 'Politics & Society',
    description: 'The good life in community',
    progress: 30,
    lessons: 10
  },
  {
    title: 'Metaphysics',
    description: 'The nature of reality and being',
    progress: 15,
    lessons: 15
  }
];

export default function WisdomPage() {
  const [selectedPractice, setSelectedPractice] = useState(wisdomPractices[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Wisdom
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The virtue of knowledge and understanding. Cultivate intellectual excellence through study, reflection, and philosophical inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Practice */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Today's Wisdom Practice
                </CardTitle>
                <CardDescription>
                  Choose a practice to cultivate wisdom today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wisdomPractices.map((practice) => {
                    const IconComponent = practice.icon;
                    return (
                      <Card
                        key={practice.title}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPractice.title === practice.title
                            ? 'ring-2 ring-blue-500 bg-blue-50'
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
                              <h3 className="font-semibold text-gray-900 mb-1">{practice.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{practice.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{practice.duration}</span>
                                <span>•</span>
                                <span>{practice.difficulty}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start {selectedPractice.title}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Your Learning Journey
                </CardTitle>
                <CardDescription>
                  Track your progress through Aristotle's teachings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wisdomTopics.map((topic) => (
                    <div key={topic.title} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                        <span className="text-sm text-gray-500">{topic.lessons} lessons</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{topic.progress}%</span>
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
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/coach">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Ask Aristotle AI
                  </Button>
                </Link>
                <Link href="/academy">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Library
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Join Study Group
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Wisdom Benefits */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Wisdom Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Clear Thinking</h4>
                      <p className="text-xs text-gray-600">Develop logical reasoning skills</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Deep Understanding</h4>
                      <p className="text-xs text-gray-600">Grasp complex concepts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Better Decisions</h4>
                      <p className="text-xs text-gray-600">Make wiser choices in life</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Intellectual Growth</h4>
                      <p className="text-xs text-gray-600">Continuous learning and development</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "The more you know, the more you realize you don't know."
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