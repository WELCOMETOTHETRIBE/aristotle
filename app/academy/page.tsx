'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Target, Users, Sparkles, Play, Clock, Star, ArrowRight, Brain, Shield, Scale, Leaf } from 'lucide-react';
import Link from 'next/link';

const courses = [
  {
    title: 'Introduction to Aristotle',
    description: 'Learn the fundamentals of Aristotelian philosophy',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    duration: '2 hours',
    lessons: 8,
    difficulty: 'Beginner',
    rating: 4.8,
    students: 1247
  },
  {
    title: 'The Four Cardinal Virtues',
    description: 'Deep dive into wisdom, courage, justice, and temperance',
    icon: Target,
    color: 'from-purple-500 to-pink-600',
    duration: '4 hours',
    lessons: 12,
    difficulty: 'Intermediate',
    rating: 4.9,
    students: 892
  },
  {
    title: 'Eudaimonia: The Good Life',
    description: 'Understanding human flourishing and happiness',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-600',
    duration: '3 hours',
    lessons: 10,
    difficulty: 'Intermediate',
    rating: 4.7,
    students: 654
  },
  {
    title: 'Practical Ethics',
    description: 'Applying ancient wisdom to modern dilemmas',
    icon: Scale,
    color: 'from-orange-500 to-red-600',
    duration: '5 hours',
    lessons: 15,
    difficulty: 'Advanced',
    rating: 4.6,
    students: 423
  }
];

const readingList = [
  {
    title: 'Nicomachean Ethics',
    author: 'Aristotle',
    description: 'The foundational text on virtue ethics',
    pages: 320,
    difficulty: 'Advanced'
  },
  {
    title: 'Politics',
    author: 'Aristotle',
    description: 'Understanding the good society',
    pages: 280,
    difficulty: 'Intermediate'
  },
  {
    title: 'Metaphysics',
    author: 'Aristotle',
    description: 'The nature of reality and being',
    pages: 400,
    difficulty: 'Expert'
  }
];

const virtues = [
  { name: 'Wisdom', icon: Brain, color: 'from-blue-500 to-indigo-600', progress: 75 },
  { name: 'Courage', icon: Shield, color: 'from-red-500 to-orange-600', progress: 60 },
  { name: 'Justice', icon: Scale, color: 'from-green-500 to-emerald-600', progress: 45 },
  { name: 'Temperance', icon: Leaf, color: 'from-purple-500 to-pink-600', progress: 80 }
];

export default function AcademyPage() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-amber-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Academy
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey into Aristotelian philosophy. Learn, grow, and cultivate wisdom through structured courses and guided study.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Course */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  Featured Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${selectedCourse.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <selectedCourse.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                      <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedCourse.duration}
                        </span>
                        <span>{selectedCourse.lessons} lessons</span>
                        <span>{selectedCourse.difficulty}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {selectedCourse.rating}
                        </span>
                        <span>{selectedCourse.students} students</span>
                      </div>
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Courses */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  Available Courses
                </CardTitle>
                <CardDescription>
                  Choose your path to wisdom and virtue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => {
                    const IconComponent = course.icon;
                    return (
                      <Card
                        key={course.title}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedCourse.title === course.title
                            ? 'ring-2 ring-amber-500 bg-amber-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{course.duration}</span>
                                <span>•</span>
                                <span>{course.difficulty}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  {course.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reading List */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  Reading List
                </CardTitle>
                <CardDescription>
                  Essential texts for your philosophical journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {readingList.map((book) => (
                    <div key={book.title} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{book.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                          <p className="text-sm text-gray-500">{book.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">{book.pages} pages</span>
                          <div className="text-xs text-gray-400 mt-1">{book.difficulty}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {virtues.map((virtue) => {
                    const IconComponent = virtue.icon;
                    return (
                      <div key={virtue.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">{virtue.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{virtue.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${virtue.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${virtue.progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/coach">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Ask Aristotle
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Join Study Group
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

            {/* Quote */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "The roots of education are bitter, but the fruit is sweet."
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