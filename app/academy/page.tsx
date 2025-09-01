'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { Sparkles, Brain, Shield, Scale, Leaf, ArrowRight, BookOpen, Target, Heart, Zap, Star, Clock, Lightbulb, MessageCircle, GraduationCap, Users, Eye, Compass, CheckCircle, Circle, Quote, Calendar, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import PhilosophersDialogueModal from '@/components/PhilosophersDialogueModal';
import { ACADEMY_CURRICULUM, type VirtueModule, type AcademyLesson } from '@/lib/academy-curriculum';
import AcademyOverview from '@/components/AcademyOverview';
import AcademyProgress from '@/components/AcademyProgress';
import InteractiveLessonInterface from '@/components/InteractiveLessonInterface';

export default function AcademyPage() {
  const { user, loading } = useAuth();
  const [selectedModule, setSelectedModule] = useState<VirtueModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<AcademyLesson | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [modules, setModules] = useState<VirtueModule[]>(ACADEMY_CURRICULUM);
  const [showPhilosophersDialogue, setShowPhilosophersDialogue] = useState(false);
  const [showOverview, setShowOverview] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'modules' | 'progress'>('overview');

  // Load saved progress
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (user) {
      // Authenticated user - load their personal progress
      const savedModules = localStorage.getItem(`academyModules_${user.id}`);
      if (savedModules) {
        setModules(JSON.parse(savedModules));
      } else {
        // New authenticated user - start with fresh progress
        setModules(ACADEMY_CURRICULUM);
      }
    } else {
      // Unauthenticated users start with fresh progress
      setModules(ACADEMY_CURRICULUM);
    }
  }, [user, loading]);

  // Save progress
  const saveProgress = (updatedModules: VirtueModule[]) => {
    setModules(updatedModules);
    if (user) {
      localStorage.setItem(`academyModules_${user.id}`, JSON.stringify(updatedModules));
    }
  };

  const startModuleJourney = (module: VirtueModule) => {
    setSelectedModule(module);
    const firstLesson = module.lessons.find(lesson => !lesson.completed) || module.lessons[0];
    setCurrentLesson(firstLesson);
  };

  const submitResponse = () => {
    if (!userResponse.trim() || !currentLesson || !selectedModule) return;

    // Update lesson with response
    const updatedModule = {
      ...selectedModule,
      lessons: selectedModule.lessons.map(lesson =>
        lesson.id === currentLesson.id
          ? { ...lesson, response: userResponse.trim(), completed: true }
          : lesson
      )
    };

    // Calculate progress
    const completedLessons = updatedModule.lessons.filter(lesson => lesson.completed).length;
    const progress = Math.round((completedLessons / updatedModule.lessons.length) * 100);
    updatedModule.progress = progress;
    updatedModule.completed = progress === 100;
    updatedModule.completedLessons = completedLessons;

    // Update modules
    const updatedModules = modules.map(module =>
      module.id === selectedModule.id ? updatedModule : module
    );
    saveProgress(updatedModules);

    // Store response for journal integration
    const journalEntry = {
      id: Date.now().toString(),
      title: `${selectedModule.name} Academy: ${currentLesson.title}`,
      content: `Teaching: ${currentLesson.teaching}\n\nQuestion: ${currentLesson.question}\n\nMy Response: ${userResponse.trim()}\n\nPractice: ${currentLesson.practice}`,
      timestamp: new Date(),
      tags: ['academy', selectedModule.id.toLowerCase(), 'virtue-learning', currentLesson.difficulty],
      virtue: selectedModule.id
    };

    if (user) {
      // Authenticated user - save to user-specific storage
      const existingEntries = localStorage.getItem(`journalEntries_${user.id}`) || '[]';
      const entries = JSON.parse(existingEntries);
      entries.unshift(journalEntry);
      localStorage.setItem(`journalEntries_${user.id}`, JSON.stringify(entries));
    }

    setUserResponse('');
    
    // Move to next lesson or complete module
    const nextLesson = updatedModule.lessons.find(lesson => !lesson.completed);
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    } else {
      setCurrentLesson(null);
      setSelectedModule(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-500/10';
      case 'intermediate': return 'text-yellow-500 bg-yellow-500/10';
      case 'advanced': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted bg-surface-2';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return Circle;
      case 'intermediate': return Star;
      case 'advanced': return Sparkles;
      default: return Circle;
    }
  };

  const startJourney = () => {
    setShowOverview(false);
    setViewMode('modules');
  };

  const viewModule = (module: VirtueModule) => {
    setSelectedModule(module);
    setCurrentLesson(null);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue="wisdom" />
      
      <main className="px-4 py-6 space-y-6">
        {showOverview ? (
          <AcademyOverview onStartJourney={startJourney} />
        ) : (
          <>
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-text mb-3">Aristotle's Academy</h1>
              <p className="text-muted text-lg">Master the four cardinal virtues through authentic philosophical study</p>
              <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-muted">
                <div className="flex items-center space-x-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>48 Lessons</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>12 Hours</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <BookMarked className="w-4 h-4" />
                  <span>4 Capstone Projects</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center space-x-1 bg-surface border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode('modules')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  viewMode === 'modules' 
                    ? 'bg-primary text-white' 
                    : 'text-muted hover:text-text'
                )}
              >
                Modules
              </button>
              <button
                onClick={() => setViewMode('progress')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  viewMode === 'progress' 
                    ? 'bg-primary text-white' 
                    : 'text-muted hover:text-text'
                )}
              >
                Progress
              </button>
            </div>

            {viewMode === 'modules' && !selectedModule && (
              /* Module Selection */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text">Choose Your Path</h2>
                  <button
                    onClick={() => setShowOverview(true)}
                    className="text-sm text-muted hover:text-text transition-colors"
                  >
                    View Overview
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modules.map((module) => {
                    const IconComponent = module.icon;
                    return (
                      <motion.button
                        key={module.id}
                        onClick={() => startModuleJourney(module)}
                        className="p-6 bg-surface border border-border rounded-2xl hover:bg-surface-2 transition-all duration-200 hover:scale-105 text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', module.color)}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-text mb-1">{module.name}</h3>
                            <p className="text-sm text-muted mb-2">{module.greekName}</p>
                            <p className="text-sm text-muted">{module.description}</p>
                          </div>
                          {module.completed && (
                            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-success" />
                            </div>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">Progress</span>
                            <span className="font-medium text-text">{module.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-2 rounded-full h-2">
                            <div 
                              className={cn(
                                'h-2 rounded-full transition-all duration-500',
                                module.id === 'wisdom' ? 'bg-primary' :
                                module.id === 'justice' ? 'bg-justice' :
                                module.id === 'courage' ? 'bg-courage' :
                                'bg-temperance'
                              )}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Module Stats */}
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted mb-4">
                          <div className="text-center">
                            <div className="font-medium text-text">{module.completedLessons}</div>
                            <div>Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-text">{module.totalLessons}</div>
                            <div>Total</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-text">{module.estimatedTotalTime}</div>
                            <div>Minutes</div>
                          </div>
                        </div>

                        {/* Lesson Preview */}
                        <div className="space-y-2">
                          {module.lessons.slice(0, 3).map((lesson, index) => {
                            const DifficultyIcon = getDifficultyIcon(lesson.difficulty);
                            return (
                              <div key={lesson.id} className="flex items-center space-x-2">
                                <div className={cn(
                                  'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                                  lesson.completed 
                                    ? 'bg-success/20 text-success' 
                                    : 'bg-surface-2 text-muted'
                                )}>
                                  {lesson.completed ? '✓' : index + 1}
                                </div>
                                <span className={cn(
                                  'text-sm flex-1',
                                  lesson.completed ? 'text-success' : 'text-muted'
                                )}>
                                  {lesson.title}
                                </span>
                                <div className={cn('px-2 py-1 rounded text-xs', getDifficultyColor(lesson.difficulty))}>
                                  <DifficultyIcon className="w-3 h-3" />
                                </div>
                              </div>
                            );
                          })}
                          {module.lessons.length > 3 && (
                            <div className="text-xs text-muted text-center">
                              +{module.lessons.length - 3} more lessons
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-muted">
                            {module.completedLessons} of {module.totalLessons} lessons
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'progress' && (
              <AcademyProgress modules={modules} onViewModule={viewModule} />
            )}

            {selectedModule && (
              <div className="space-y-6">
                {/* Module Header */}
                <div className="flex items-center justify-between p-6 bg-surface border border-border rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', selectedModule.color)}>
                      {(() => {
                        const IconComponent = selectedModule.icon;
                        return <IconComponent className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text">{selectedModule.name}</h2>
                      <p className="text-sm text-muted">{selectedModule.greekName}</p>
                      <p className="text-sm text-muted">{selectedModule.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedModule(null);
                      setCurrentLesson(null);
                    }}
                    className="text-sm text-muted hover:text-text transition-colors"
                  >
                    Back to Modules
                  </button>
                </div>

                {/* Lesson Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">Choose a Lesson</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedModule.lessons.map((lesson) => (
                      <motion.button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={cn(
                          'p-4 border rounded-xl text-left transition-all duration-200 hover:scale-105',
                          currentLesson?.id === lesson.id
                            ? 'border-primary bg-primary/5'
                            : lesson.completed
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-border bg-surface hover:bg-surface-2'
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted" />
                            )}
                            <span className="text-sm font-medium text-text">{lesson.title}</span>
                          </div>
                          <div className={cn('px-2 py-1 rounded text-xs', getDifficultyColor(lesson.difficulty))}>
                            {(() => {
                              const DifficultyIcon = getDifficultyIcon(lesson.difficulty);
                              return <DifficultyIcon className="w-3 h-3" />;
                            })()}
                          </div>
                        </div>
                        <p className="text-xs text-muted mb-2">{lesson.subtitle}</p>
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>{lesson.estimatedTotalTime || lesson.estimatedTime} min</span>
                          {lesson.completed && <span className="text-green-500">Completed</span>}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Interactive Lesson Interface */}
                {currentLesson && (
                  <InteractiveLessonInterface
                    lesson={currentLesson}
                    onComplete={(lessonId, milestones) => {
                      console.log('Lesson completed:', lessonId, milestones);
                      // Update lesson completion status
                      const updatedModules = modules.map(module => {
                        if (module.id === selectedModule.id) {
                          const updatedLessons = module.lessons.map(lesson => {
                            if (lesson.id === lessonId) {
                              return { ...lesson, completed: true };
                            }
                            return lesson;
                          });
                          return { ...module, lessons: updatedLessons };
                        }
                        return module;
                      });
                      setModules(updatedModules);
                    }}
                    onSaveProgress={(lessonId, data) => {
                      console.log('Progress saved for lesson:', lessonId, data);
                      // Save progress to localStorage
                      localStorage.setItem(`academyLesson_${lessonId}`, JSON.stringify(data));
                    }}
                  />
                )}
              </div>
            )}

            {/* Philosopher's Dialogue Button - Only show when no module is selected */}
            {!selectedModule && viewMode === 'modules' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-text mb-2">Ready for deeper dialogue?</h2>
                  <p className="text-sm text-muted">Chat directly with ancient philosophers</p>
                </div>
                
                <motion.button
                  onClick={() => setShowPhilosophersDialogue(true)}
                  className="w-full p-6 bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl hover:from-purple-500/15 hover:via-violet-500/15 hover:to-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-xl flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-6 h-6 text-purple-300" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-text group-hover:text-purple-300 transition-colors">
                          Philosopher's Dialogue
                        </h3>
                        <p className="text-sm text-muted group-hover:text-purple-200 transition-colors">
                          Engage in deep conversations with ancient wisdom
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                          <span className="text-xs text-blue-300">A</span>
                        </div>
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                          <span className="text-xs text-green-300">S</span>
                        </div>
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                          <span className="text-xs text-yellow-300">P</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>Choose from 8+ philosophers</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI-powered conversations
                    </span>
                  </div>
                </motion.button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Philosopher's Dialogue Modal */}
      <PhilosophersDialogueModal 
        isOpen={showPhilosophersDialogue}
        onClose={() => setShowPhilosophersDialogue(false)}
      />

      <TabBar />
    </div>
  );
} 