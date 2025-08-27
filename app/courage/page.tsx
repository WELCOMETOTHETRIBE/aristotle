'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, BookOpen, Play, Clock, Star, ChevronRight, Users, Target, 
  Flame, Zap, Globe, Compass, ArrowRight, CheckCircle, ExternalLink,
  Sword, Activity, Heart, Mountain
} from 'lucide-react';
import Link from 'next/link';
import { enhancedVirtueDimensions } from '@/lib/ancient-wisdom-data';

const courageData = enhancedVirtueDimensions.find(v => v.id === 'courage');

export default function CouragePage() {
  const [selectedPractice, setSelectedPractice] = useState(courageData?.ancientPractices[0]);
  const [activeTab, setActiveTab] = useState<'practices' | 'modern' | 'science' | 'resources'>('practices');

  if (!courageData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-red-600 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Warrior Traditions
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {courageData.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Sword className="w-4 h-4" />
              Mental Toughness
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              Resilience
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Discipline
            </span>
            <span className="flex items-center gap-1">
              <Mountain className="w-4 h-4" />
              Strength
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Warrior Journey</h2>
                <p className="text-gray-600">Progress through ancient warrior traditions</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">{courageData.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${courageData.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'practices', label: 'Warrior Practices', icon: Shield },
            { id: 'modern', label: 'Modern Applications', icon: Flame },
            { id: 'science', label: 'Scientific Basis', icon: Target },
            { id: 'resources', label: 'Resources', icon: Users }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        {activeTab === 'practices' && (
          <div className="space-y-8">
            {/* Warrior Practices Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courageData.ancientPractices.map((practice) => (
                <Card key={practice.id} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{practice.name}</CardTitle>
                        <CardDescription className="text-base">{practice.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {practice.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {practice.tradition}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {practice.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">Warrior Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {practice.benefits.map((benefit, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instructions Preview */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">Training Steps:</h4>
                      <div className="space-y-1">
                        {practice.instructions.slice(0, 3).map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{instruction}</span>
                          </div>
                        ))}
                        {practice.instructions.length > 3 && (
                          <div className="text-sm text-red-600 font-medium">
                            +{practice.instructions.length - 3} more steps
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scientific Validation */}
                    {practice.scientificValidation && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700">Scientific Validation:</h4>
                        <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                          {practice.scientificValidation}
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                      onClick={() => setSelectedPractice(practice)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Begin Training
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Warrior Code */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sword className="w-6 h-6 text-red-600" />
                  Warrior Code
                </CardTitle>
                <CardDescription className="text-lg">
                  The principles and values that guide warrior traditions across cultures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Honor', description: 'Living with integrity and moral courage', icon: Heart },
                    { title: 'Discipline', description: 'Consistent practice and self-control', icon: Activity },
                    { title: 'Resilience', description: 'Bouncing back from adversity', icon: Mountain },
                    { title: 'Mastery', description: 'Continuous improvement and excellence', icon: Target }
                  ].map((principle, index) => {
                    const IconComponent = principle.icon;
                    return (
                      <div key={index} className="text-center space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{principle.title}</h3>
                        <p className="text-sm text-gray-600">{principle.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'modern' && (
          <div className="space-y-8">
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Flame className="w-6 h-6 text-red-600" />
                  Modern Applications
                </CardTitle>
                <CardDescription className="text-lg">
                  How warrior traditions apply to contemporary challenges and personal development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courageData.modernApplications.map((application, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Flame className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{application}</h3>
                            <p className="text-sm text-gray-600">
                              Practical ways to apply warrior principles to modern life challenges and personal growth.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'science' && (
          <div className="space-y-8">
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6 text-red-600" />
                  Scientific Basis
                </CardTitle>
                <CardDescription className="text-lg">
                  Research and evidence supporting the effectiveness of warrior training methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courageData.scientificBasis.map((basis, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Target className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{basis}</h3>
                            <p className="text-sm text-gray-600">
                              Scientific research and psychological studies that validate these warrior practices.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8">
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="w-6 h-6 text-red-600" />
                  Training Resources
                </CardTitle>
                <CardDescription className="text-lg">
                  Books, videos, articles, and masters to guide your warrior journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courageData.ancientPractices.map((practice) => (
                    <Card key={practice.id} className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{practice.name} Resources</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Books */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Essential Books
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {practice.resources.books.map((book, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {book}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Videos */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Training Videos
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {practice.resources.videos.map((video, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <ExternalLink className="w-3 h-3 text-red-500" />
                                {video}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Teachers */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Recommended Masters
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {practice.resources.teachers.map((teacher, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                {teacher}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 space-y-3">
          <Link href="/coach">
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg">
              <Shield className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/academy">
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg">
              <BookOpen className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/progress">
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
              <Target className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 