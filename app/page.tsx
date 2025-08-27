'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Shield, Scale, Leaf, BookOpen, Target, Users, Sparkles, ArrowRight, Play, Star } from 'lucide-react';

const virtues = [
  {
    name: 'Wisdom',
    description: 'The virtue of knowledge and understanding',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    practices: ['Learning', 'Reflection', 'Study', 'Philosophy'],
    path: '/wisdom'
  },
  {
    name: 'Courage',
    description: 'The virtue of facing challenges with strength',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    practices: ['Action', 'Challenge', 'Growth', 'Resilience'],
    path: '/courage'
  },
  {
    name: 'Justice',
    description: 'The virtue of fairness and right relationships',
    icon: Scale,
    color: 'from-green-500 to-emerald-600',
    practices: ['Relationships', 'Community', 'Service', 'Balance'],
    path: '/justice'
  },
  {
    name: 'Temperance',
    description: 'The virtue of self-control and moderation',
    icon: Leaf,
    color: 'from-purple-500 to-pink-600',
    practices: ['Mindfulness', 'Discipline', 'Balance', 'Harmony'],
    path: '/temperance'
  }
];

const features = [
  {
    title: 'Philosophy-Driven Coaching',
    description: 'AI guidance based on Aristotle\'s complete works, not generic advice',
    icon: Sparkles
  },
  {
    title: 'Virtue Development Tracking',
    description: 'Measure your progress in cultivating the four cardinal virtues',
    icon: Target
  },
  {
    title: 'Daily Practices',
    description: 'Transform ancient wisdom into actionable daily habits',
    icon: BookOpen
  },
  {
    title: 'Community Learning',
    description: 'Connect with fellow seekers on the path to eudaimonia',
    icon: Users
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aristotle's Academy
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform Aristotle's teachings into daily practices for modern flourishing. 
              Cultivate wisdom, courage, justice, and temperance in your life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/temperance">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/academy">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Academy
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200/30 rounded-full blur-xl"></div>
      </section>

      {/* Virtues Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Four Cardinal Virtues
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aristotle identified these four virtues as essential for achieving eudaimonia - human flourishing and happiness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              return (
                <Link key={virtue.name} href={virtue.path}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-xl">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${virtue.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">{virtue.name}</CardTitle>
                      <CardDescription className="text-gray-600">{virtue.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-500">
                          <strong>Practices:</strong>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {virtue.practices.map((practice) => (
                            <span
                              key={practice}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {practice}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-center pt-4">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Aristotle's Academy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlike generic wellness apps, we're built on 2,400 years of philosophical wisdom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="border-0 bg-white/80 backdrop-blur-xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Begin Your Philosophical Journey
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of seekers cultivating wisdom, courage, justice, and temperance in their daily lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/temperance">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start with Temperance
                </Button>
              </Link>
              <Link href="/coach">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Meet Aristotle AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl font-medium text-gray-900 mb-6">
            "Aristotle's Academy has transformed how I approach daily challenges. The virtue-based framework makes ancient wisdom practical and actionable."
          </blockquote>
          <cite className="text-gray-600">— Sarah M., Philosophy Student</cite>
        </div>
      </section>
    </div>
  );
} 