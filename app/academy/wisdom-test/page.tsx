'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, BookOpen, Clock, Star, CheckCircle, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACADEMY_CURRICULUM, type VirtueModule, type AcademyLesson } from '@/lib/academy-curriculum';
import InteractiveLessonInterface from '@/components/InteractiveLessonInterface';

export default function WisdomTestPage() {
  const [wisdomModule, setWisdomModule] = useState<VirtueModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<AcademyLesson | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  useEffect(() => {
    // Find the Wisdom module
    const module = ACADEMY_CURRICULUM.find(m => m.id === 'wisdom');
    if (module) {
      setWisdomModule(module);
      setCurrentLesson(module.lessons[0]);
    }
  }, []);

  const handleLessonSelect = (lesson: AcademyLesson, index: number) => {
    setCurrentLesson(lesson);
    setSelectedLessonIndex(index);
  };

  const handleLessonComplete = (lessonId: string, milestones: any) => {
    console.log('Lesson completed:', lessonId, milestones);
    // Here you would typically update the lesson completion status
  };

  const handleSaveProgress = (lessonId: string, data: any) => {
    console.log('Progress saved:', lessonId, data);
    // Here you would typically save progress to the database
  };

  if (!wisdomModule) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading Wisdom module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', wisdomModule.color)}>
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text">{wisdomModule.name}</h1>
                <p className="text-sm text-muted">{wisdomModule.greekName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted">Streamlined Module</div>
              <div className="text-lg font-semibold text-text">{wisdomModule.totalLessons} Lessons</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Lessons</h2>
              <div className="space-y-3">
                {wisdomModule.lessons.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson, index)}
                    className={cn(
                      'w-full p-4 rounded-xl border transition-all duration-200 text-left',
                      selectedLessonIndex === index
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-2 border-border hover:bg-surface-3 text-text'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                          selectedLessonIndex === index ? 'bg-primary text-white' : 'bg-surface text-muted'
                        )}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted" />
                        <span className="text-sm text-muted">{lesson.estimatedTime}m</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted">{lesson.subtitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {lesson.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        {Object.entries(lesson.virtueGrants).map(([virtue, points]) => (
                          <div key={virtue} className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-muted">{points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Module Stats */}
            <div className="bg-surface border border-border rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-text mb-4">Module Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Total Lessons:</span>
                  <span className="font-medium">{wisdomModule.totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Estimated Time:</span>
                  <span className="font-medium">{wisdomModule.estimatedTotalTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Interactive Elements:</span>
                  <span className="font-medium">{wisdomModule.totalLessons * 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Difficulty Progression:</span>
                  <span className="font-medium">Beginner → Advanced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div className="space-y-6">
                {/* Lesson Header */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-text">{currentLesson.title}</h2>
                      <p className="text-muted">{currentLesson.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted">Lesson {selectedLessonIndex + 1} of {wisdomModule.totalLessons}</div>
                      <div className="text-lg font-semibold text-text">{currentLesson.estimatedTime} minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={cn(
                      'text-sm px-3 py-1 rounded-full',
                      currentLesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      currentLesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    )}>
                      {currentLesson.difficulty}
                    </span>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-muted" />
                      <span className="text-sm text-muted">5 Interactive Elements</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Lesson Interface */}
                <InteractiveLessonInterface
                  lesson={currentLesson}
                  onComplete={handleLessonComplete}
                  onSaveProgress={handleSaveProgress}
                />
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Select a Lesson</h3>
                <p className="text-muted">Choose a lesson from the sidebar to begin your wisdom journey.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
