'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, BookOpen, Play, Clock, Star, ChevronRight, Users, Target, 
  Lightbulb, Zap, Globe, Compass, ArrowRight, CheckCircle, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { enhancedVirtueDimensions } from '@/lib/ancient-wisdom-data';

const wisdomData = enhancedVirtueDimensions.find(v => v.id === 'wisdom');

export default function WisdomPage() {
  const [selectedPractice, setSelectedPractice] = useState(wisdomData?.ancientPractices[0]);
  const [activeTab, setActiveTab] = useState<'practices' | 'modern' | 'science' | 'resources'>('practices');

  if (!wisdomData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ancient Knowledge Practices
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {wisdomData.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Global Traditions
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              Critical Thinking
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Self-Knowledge
            </span>
            <span className="flex items-center gap-1">
              <Compass className="w-4 h-4" />
              Inner Guidance
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Wisdom Journey</h2>
                <p className="text-gray-600">Progress through ancient knowledge practices</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{wisdomData.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${wisdomData.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'practices', label: 'Ancient Practices', icon: BookOpen },
            { id: 'modern', label: 'Modern Applications', icon: Lightbulb },
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
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
            {/* Ancient Practices Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {wisdomData.ancientPractices.map((practice) => (
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
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
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
                      <h4 className="font-semibold text-sm text-gray-700">Key Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {practice.benefits.map((benefit, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instructions Preview */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">Practice Steps:</h4>
                      <div className="space-y-1">
                        {practice.instructions.slice(0, 3).map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{instruction}</span>
                          </div>
                        ))}
                        {practice.instructions.length > 3 && (
                          <div className="text-sm text-blue-600 font-medium">
                            +{practice.instructions.length - 3} more steps
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scientific Validation */}
                    {practice.scientificValidation && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700">Scientific Validation:</h4>
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          {practice.scientificValidation}
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      onClick={() => setSelectedPractice(practice)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cultural Context */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Cultural Heritage
                </CardTitle>
                <CardDescription className="text-lg">
                  Understanding the historical and cultural context of these wisdom traditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wisdomData.ancientPractices.map((practice) => (
                    <div key={practice.id} className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900">{practice.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {practice.culturalContext}
                      </p>
                    </div>
                  ))}
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
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  Modern Applications
                </CardTitle>
                <CardDescription className="text-lg">
                  How ancient wisdom practices apply to contemporary life and challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wisdomData.modernApplications.map((application, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{application}</h3>
                            <p className="text-sm text-gray-600">
                              Practical ways to integrate this wisdom into your daily life and decision-making process.
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
                  <Target className="w-6 h-6 text-blue-600" />
                  Scientific Basis
                </CardTitle>
                <CardDescription className="text-lg">
                  Research and evidence supporting the effectiveness of ancient wisdom practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wisdomData.scientificBasis.map((basis, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{basis}</h3>
                            <p className="text-sm text-gray-600">
                              Scientific research and psychological studies that validate these ancient practices.
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
                  <Users className="w-6 h-6 text-blue-600" />
                  Learning Resources
                </CardTitle>
                <CardDescription className="text-lg">
                  Books, videos, articles, and teachers to deepen your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {wisdomData.ancientPractices.map((practice) => (
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
                            Video Resources
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {practice.resources.videos.map((video, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <ExternalLink className="w-3 h-3 text-blue-500" />
                                {video}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Teachers */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Recommended Teachers
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {practice.resources.teachers.map((teacher, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
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
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
              <Brain className="w-6 h-6" />
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