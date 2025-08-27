'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, GraduationCap, Target, Users, Sparkles, Play, Clock, Star, ArrowRight, 
  Brain, Shield, Scale, Leaf, Activity, Heart, Zap, Mountain, Sun, Moon, 
  ChevronRight, Award, Globe, Compass, Lightbulb, Flame, Trees, Droplets, Wind
} from 'lucide-react';
import Link from 'next/link';
import { 
  enhancedVirtueDimensions, 
  wellnessDimensions, 
  practiceModules, 
  dailyRoutines,
  wisdomCircles,
  certificationPaths 
} from '@/lib/ancient-wisdom-data';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Brain, Shield, Scale, Leaf, Activity, Heart, Zap, Mountain, Sun, Moon,
  Globe, Compass, Lightbulb, Flame, Trees, Droplets, Wind
};

export default function AcademyPage() {
  const [selectedModule, setSelectedModule] = useState(practiceModules[0]);
  const [activeTab, setActiveTab] = useState<'virtues' | 'wellness' | 'practices' | 'community'>('virtues');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-amber-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Ancient Wisdom Wellness System
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            A comprehensive wellness ecosystem integrating the most compelling practices from throughout human history, 
            validated by modern science and adapted for contemporary life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Global Traditions
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              Scientific Validation
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Holistic Wellness
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Community Support
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'virtues', label: 'Virtue Framework', icon: Target },
            { id: 'wellness', label: 'Wellness Dimensions', icon: Heart },
            { id: 'practices', label: 'Practice Modules', icon: BookOpen },
            { id: 'community', label: 'Community', icon: Users }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
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
        {activeTab === 'virtues' && (
          <div className="space-y-8">
            {/* Enhanced Virtue Framework */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6 text-amber-600" />
                  Enhanced Virtue Framework
                </CardTitle>
                <CardDescription className="text-lg">
                  Ancient wisdom practices integrated with modern science for comprehensive character development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enhancedVirtueDimensions.map((virtue) => {
                    const IconComponent = iconMap[virtue.icon] || Brain;
                    return (
                      <Card key={virtue.id} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${virtue.color} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{virtue.name}</CardTitle>
                              <CardDescription>{virtue.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{virtue.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-gradient-to-r ${virtue.color} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${virtue.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Ancient Practices Preview */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">Ancient Practices:</h4>
                            <div className="flex flex-wrap gap-2">
                              {virtue.ancientPractices.slice(0, 3).map((practice) => (
                                <span key={practice.id} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                  {practice.name}
                                </span>
                              ))}
                              {virtue.ancientPractices.length > 3 && (
                                <span className="px-2 py-1 bg-amber-100 text-xs rounded-full">
                                  +{virtue.ancientPractices.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                            Explore {virtue.name}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'wellness' && (
          <div className="space-y-8">
            {/* Wellness Dimensions */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="w-6 h-6 text-amber-600" />
                  Wellness Dimensions
                </CardTitle>
                <CardDescription className="text-lg">
                  Holistic wellness practices integrating body, mind, emotions, and spirit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wellnessDimensions.map((dimension) => {
                    const IconComponent = iconMap[dimension.icon] || Heart;
                    return (
                      <Card key={dimension.id} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${dimension.color} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{dimension.name}</CardTitle>
                              <CardDescription>{dimension.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Daily Routines */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">Daily Routines:</h4>
                            <div className="space-y-1">
                              {dimension.dailyRoutines.map((routine, index) => (
                                <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                  <Sun className="w-3 h-3" />
                                  {routine}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Seasonal Alignments */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">Seasonal Focus:</h4>
                            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                                                             {dimension.seasonalAlignments.map((alignment, index) => (
                                 <div key={index} className="flex items-center gap-1">
                                   <Trees className="w-3 h-3" />
                                   {alignment.split(':')[0]}
                                 </div>
                               ))}
                            </div>
                          </div>

                          <Button variant="outline" className="w-full">
                            Explore Practices
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Daily Routines */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                  Daily Wisdom Routines
                </CardTitle>
                <CardDescription className="text-lg">
                  Structured daily practices to integrate ancient wisdom into modern life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dailyRoutines.map((routine) => (
                    <Card key={routine.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{routine.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {routine.duration}
                          </div>
                        </div>
                        <CardDescription>{routine.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Practices:</h4>
                          <div className="flex flex-wrap gap-2">
                            {routine.practices.map((practice, index) => (
                              <span key={index} className="px-2 py-1 bg-amber-100 text-xs rounded-full">
                                {practice}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Benefits:</h4>
                          <div className="text-sm text-gray-600">
                            {routine.benefits.join(', ')}
                          </div>
                        </div>
                        <Button className="w-full">
                          Start Routine
                          <Play className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'practices' && (
          <div className="space-y-8">
            {/* Practice Modules */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  Comprehensive Practice Modules
                </CardTitle>
                <CardDescription className="text-lg">
                  Structured learning paths combining ancient wisdom with modern application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {practiceModules.map((module) => (
                    <Card key={module.id} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                            <CardDescription className="text-base">{module.description}</CardDescription>
                          </div>
                          {module.certification && (
                            <Award className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration}
                          </span>
                          <span>{module.lessons} lessons</span>
                          <span>{module.difficulty}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {module.rating}
                          </span>
                          <span>{module.students} students</span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Key Practices:</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.practices.slice(0, 3).map((practice) => (
                              <span key={practice.id} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                {practice.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Outcomes:</h4>
                          <div className="text-sm text-gray-600">
                            {module.outcomes.join(', ')}
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Module
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certification Paths */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="w-6 h-6 text-amber-600" />
                  Certification Paths
                </CardTitle>
                <CardDescription className="text-lg">
                  Professional development and teaching opportunities in ancient wisdom practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificationPaths.map((path) => (
                    <Card key={path.id} className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{path.name}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Duration: {path.duration}</span>
                          <span className="font-semibold">{path.cost}</span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Benefits:</h4>
                          <div className="text-sm text-gray-600">
                            {path.benefits.join(', ')}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-8">
            {/* Wisdom Circles */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="w-6 h-6 text-amber-600" />
                  Wisdom Circles
                </CardTitle>
                <CardDescription className="text-lg">
                  Join communities of practice for support, mentorship, and collective wisdom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wisdomCircles.map((circle) => (
                    <Card key={circle.id} className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{circle.name}</CardTitle>
                        <CardDescription>{circle.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>{circle.meetingFrequency}</span>
                          <span>{circle.currentParticipants}/{circle.maxParticipants} members</span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Practices:</h4>
                          <div className="flex flex-wrap gap-2">
                            {circle.practices.map((practice, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-xs rounded-full">
                                {practice}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Mentors:</h4>
                          <div className="text-sm text-gray-600">
                            {circle.mentors.join(', ')}
                          </div>
                        </div>
                        <Button className="w-full">
                          Join Circle
                          <Users className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions Sidebar */}
        <div className="fixed bottom-6 right-6 space-y-3">
          <Link href="/coach">
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg">
              <Brain className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/community">
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
              <Users className="w-6 h-6" />
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