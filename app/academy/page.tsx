'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Star, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Play, 
  Brain, 
  Target, 
  Users, 
  MessageCircle,
  Eye,
  Compass,
  Sparkles,
  Quote,
  Calendar,
  Award,
  Lightbulb,
  Mic,
  FileText,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import PhilosophersDialogueModal from '@/components/PhilosophersDialogueModal';
import AcademyWisdomJourney from '@/components/AcademyWisdomJourney';
import AcademyArtifacts from '@/components/AcademyArtifacts';
import AcademyPrefaceModal from '@/components/AcademyPrefaceModal';
import AcademyPathsModal from '@/components/AcademyPathsModal';
import AcademyLessonModal from '@/components/AcademyLessonModal';
import AcademyCompletionModal from '@/components/AcademyCompletionModal';

// Import the wisdom journey data
import academyData from '@/data/academy_wisdom_journey_v1_1.json';

type ViewMode = 'overview' | 'paths' | 'progress' | 'lesson' | 'certificate' | 'daily-checkin' | 'glossary' | 'artifacts' | 'portfolio' | 'agora';
type ModalStep = 'preface' | 'paths' | 'lesson' | 'completion' | null;

export default function AcademyPage() {
  const { user, loading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [showPhilosophersDialogue, setShowPhilosophersDialogue] = useState(false);
  const [userProgress, setUserProgress] = useState<any>({});
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  // Load user progress
  useEffect(() => {
    if (loading) return;

    if (user) {
      const savedProgress = localStorage.getItem(`academyProgress_${user.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
  }, [user, loading]);

  // Save progress
  const saveProgress = (progress: any) => {
    setUserProgress(progress);
    if (user) {
      localStorage.setItem(`academyProgress_${user.id}`, JSON.stringify(progress));
    }
  };

  const getPathProgress = (pathId: string) => {
    const path = academyData.paths.find(p => p.id === pathId);
    if (!path) return 0;
    
    const completedLessons = path.lessons.filter(lesson => 
      userProgress[lesson.id]?.completed
    ).length;
    
    return Math.round((completedLessons / path.lessons.length) * 100);
  };

  const getOverallProgress = () => {
    const totalLessons = academyData.paths.reduce((sum, path) => sum + path.lessons.length, 0);
    const completedLessons = academyData.paths.reduce((sum, path) => 
      sum + path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length, 0
    );
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getCompletedPaths = () => {
    return academyData.paths.filter(path => getPathProgress(path.id) === 100).length;
  };

  const startPath = (path: any) => {
    setSelectedPath(path);
    setModalStep('preface');
  };

  const startLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setModalStep('lesson');
  };

  const closeModal = () => {
    setModalStep(null);
    setSelectedPath(null);
    setCurrentLesson(null);
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

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue="wisdom" />
      
      <main className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text mb-3">{academyData.meta.title}</h1>
          <p className="text-muted text-lg mb-4">{academyData.meta.philosophical_scope}</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{academyData.paths.length} Paths</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{academyData.meta.session_length_minutes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>Certificate Available</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center space-x-1 bg-surface border border-border rounded-xl p-1 overflow-x-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'overview' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('paths')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'paths' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Paths
          </button>
          <button
            onClick={() => setViewMode('progress')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'progress' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Progress
          </button>
          <button
            onClick={() => setViewMode('certificate')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'certificate' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Certificate
          </button>
          <button
            onClick={() => setViewMode('daily-checkin')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'daily-checkin' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Daily Check-in
          </button>
          <button
            onClick={() => setViewMode('artifacts')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'artifacts' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Portfolio
          </button>
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Your Journey Progress</h2>
                <div className="text-2xl font-bold text-indigo-400">{getOverallProgress()}%</div>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-3 mb-4">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${getOverallProgress()}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-text">{getCompletedPaths()}</div>
                  <div className="text-sm text-muted">Paths Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{academyData.paths.length}</div>
                  <div className="text-sm text-muted">Total Paths</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{academyData.certificate.requirements.min_lessons_completed}</div>
                  <div className="text-sm text-muted">Lessons for Certificate</div>
                </div>
              </div>
            </div>

            {/* Quick Start */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text">Quick Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setViewMode('paths')}
                  className="p-6 bg-surface border border-border rounded-2xl hover:bg-surface-2 transition-all duration-200 text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <Compass className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text">Start Learning</h3>
                      <p className="text-sm text-muted">Begin your wisdom journey</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted group-hover:text-text transition-colors" />
                </motion.button>

                <motion.button
                  onClick={() => setViewMode('daily-checkin')}
                  className="p-6 bg-surface border border-border rounded-2xl hover:bg-surface-2 transition-all duration-200 text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text">Daily Check-in</h3>
                      <p className="text-sm text-muted">Sustain your ascent</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted group-hover:text-text transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Featured Paths */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text">Featured Paths</h2>
              <div className="space-y-3">
                {academyData.paths.slice(0, 3).map((path) => {
                  const progress = getPathProgress(path.id);
                  return (
                    <motion.button
                      key={path.id}
                      onClick={() => startPath(path)}
                      className="w-full p-4 bg-surface border border-border rounded-xl hover:bg-surface-2 transition-all duration-200 text-left group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-text">{path.title}</h3>
                            <p className="text-sm text-muted">{path.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-text">{progress}%</div>
                            <div className="text-xs text-muted">{path.estimated_minutes_total} min</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Paths Mode */}
        {viewMode === 'paths' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Learning Paths</h2>
              <div className="text-sm text-muted">
                {getCompletedPaths()} of {academyData.paths.length} completed
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academyData.paths.map((path) => {
                const progress = getPathProgress(path.id);
                const isCompleted = progress === 100;
                const completedLessons = path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length;
                
                return (
                  <motion.button
                    key={path.id}
                    onClick={() => startPath(path)}
                    className="p-6 bg-surface border border-border rounded-2xl hover:bg-surface-2 transition-all duration-200 text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-text mb-1">{path.title}</h3>
                        <p className="text-sm text-muted mb-2">{path.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted">
                          <Clock className="w-3 h-3" />
                          <span>{path.estimated_minutes_total} minutes</span>
                          <span>•</span>
                          <span>{path.lessons.length} lessons</span>
                        </div>
                      </div>
                      {isCompleted && (
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Progress</span>
                        <span className="font-medium text-text">{progress}%</span>
                      </div>
                      <div className="w-full bg-surface-2 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Lesson Preview */}
                    <div className="space-y-2">
                      {path.lessons.slice(0, 3).map((lesson, index) => {
                        const isCompleted = userProgress[lesson.id]?.completed;
                        return (
                          <div key={lesson.id} className="flex items-center space-x-2">
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                              isCompleted 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-surface-2 text-muted'
                            )}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <span className={cn(
                              'text-sm flex-1',
                              isCompleted ? 'text-green-500' : 'text-muted'
                            )}>
                              {lesson.title}
                            </span>
                            <div className="text-xs text-muted">
                              {lesson.time_minutes}min
                            </div>
                          </div>
                        );
                      })}
                      {path.lessons.length > 3 && (
                        <div className="text-xs text-muted text-center">
                          +{path.lessons.length - 3} more lessons
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {completedLessons} of {path.lessons.length} lessons
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress Mode */}
        {viewMode === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Your Progress</h2>
            
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-surface border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-text">{getOverallProgress()}%</div>
                <div className="text-sm text-muted">Overall Progress</div>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-text">{getCompletedPaths()}</div>
                <div className="text-sm text-muted">Paths Completed</div>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-text">
                  {academyData.paths.reduce((sum, path) => 
                    sum + path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length, 0
                  )}
                </div>
                <div className="text-sm text-muted">Lessons Completed</div>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-text">
                  {academyData.paths.reduce((sum, path) => 
                    sum + path.lessons.filter(lesson => userProgress[lesson.id]?.completed)
                      .reduce((lessonSum, lesson) => lessonSum + lesson.time_minutes, 0), 0
                  )}
                </div>
                <div className="text-sm text-muted">Minutes Learned</div>
              </div>
            </div>

            {/* Path Progress */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text">Path Progress</h3>
              <div className="space-y-3">
                {academyData.paths.map((path) => {
                  const progress = getPathProgress(path.id);
                  const completedLessons = path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length;
                  
                  return (
                    <div key={path.id} className="p-4 bg-surface border border-border rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-text">{path.title}</h4>
                          <p className="text-sm text-muted">{completedLessons} of {path.lessons.length} lessons</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-text">{progress}%</div>
                          <div className="text-xs text-muted">{path.estimated_minutes_total} min</div>
                        </div>
                      </div>
                      <div className="w-full bg-surface-2 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Certificate Mode */}
        {viewMode === 'certificate' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">Academy Certificate</h2>
              <p className="text-muted">Complete your journey to earn your Academy Dialogue certificate</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                  <span className="text-text">Complete {academyData.certificate.requirements.completed_paths} paths</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted">{getCompletedPaths()}/{academyData.certificate.requirements.completed_paths}</span>
                    {getCompletedPaths() >= academyData.certificate.requirements.completed_paths ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                  <span className="text-text">Complete {academyData.certificate.requirements.min_lessons_completed} lessons</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted">
                      {academyData.paths.reduce((sum, path) => 
                        sum + path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length, 0
                      )}/{academyData.certificate.requirements.min_lessons_completed}
                    </span>
                    {academyData.paths.reduce((sum, path) => 
                      sum + path.lessons.filter(lesson => userProgress[lesson.id]?.completed).length, 0
                    ) >= academyData.certificate.requirements.min_lessons_completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                  <span className="text-text">Maintain {academyData.certificate.scoring.rubric_average_threshold * 100}% average score</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted">In Progress</span>
                    <Circle className="w-5 h-5 text-muted" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-text mb-2">Certificate Features</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• PDF/HTML dialogue scroll with artifacts</li>
                <li>• Unlocked glossary of philosophical terms</li>
                <li>• Portfolio of your learning journey</li>
                <li>• Shareable Academy Dialogue certificate</li>
              </ul>
            </div>
          </div>
        )}

        {/* Artifacts Mode */}
        {viewMode === 'artifacts' && (
          <AcademyArtifacts userProgress={userProgress} academyData={academyData} />
        )}

        {/* Daily Check-in Mode */}
        {viewMode === 'daily-checkin' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">{academyData.daily_checkin.title}</h2>
              <p className="text-muted">{academyData.daily_checkin.purpose}</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Today's Reflection</h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface-2 rounded-lg">
                  <h4 className="font-medium text-text mb-2">Example Questions:</h4>
                  <ul className="space-y-2 text-sm text-muted">
                    {academyData.daily_checkin.examples.map((example, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Quote className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>"{example}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text">
                    Your reflection for today:
                  </label>
                  <textarea
                    className="w-full p-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted resize-none"
                    rows={4}
                    placeholder="Share a brief reflection on today's question..."
                  />
                  <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Submit Reflection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Mode */}
        {viewMode === 'lesson' && currentLesson && (
          <AcademyWisdomJourney
            lesson={currentLesson}
            path={selectedPath}
            userProgress={userProgress}
            onComplete={(lessonId, data) => {
              const newProgress = {
                ...userProgress,
                [lessonId]: {
                  completed: true,
                  completedAt: new Date().toISOString(),
                  data
                }
              };
              saveProgress(newProgress);
              
              // Move to next lesson or back to paths
              const currentIndex = selectedPath.lessons.findIndex((l: any) => l.id === lessonId);
              const nextLesson = selectedPath.lessons[currentIndex + 1];
              if (nextLesson) {
                setCurrentLesson(nextLesson);
              } else {
                setViewMode('paths');
                setCurrentLesson(null);
                setSelectedPath(null);
              }
            }}
            onBack={() => {
              setViewMode('paths');
              setCurrentLesson(null);
              setSelectedPath(null);
            }}
          />
        )}

        {/* Philosopher's Dialogue Button */}
        {viewMode !== 'lesson' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-text mb-2">Ready for deeper dialogue?</h2>
              <p className="text-sm text-muted">Chat directly with Plato and other ancient philosophers</p>
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
                      <span className="text-xs text-blue-300">P</span>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                      <span className="text-xs text-green-300">S</span>
                    </div>
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                      <span className="text-xs text-yellow-300">A</span>
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
      </main>

      {/* Philosopher's Dialogue Modal */}
      <PhilosophersDialogueModal 
        isOpen={showPhilosophersDialogue}
        onClose={() => setShowPhilosophersDialogue(false)}
      />

      <TabBar />

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {modalStep === 'preface' && selectedPath && (
                <AcademyPrefaceModal 
                  path={selectedPath}
                  onNext={() => setModalStep('paths')}
                  onClose={closeModal}
                />
              )}
              {modalStep === 'paths' && selectedPath && (
                <AcademyPathsModal 
                  path={selectedPath}
                  userProgress={userProgress}
                  onSelectLesson={startLesson}
                  onClose={closeModal}
                />
              )}
              {modalStep === 'lesson' && currentLesson && selectedPath && (
                <AcademyLessonModal 
                  lesson={currentLesson}
                  path={selectedPath}
                  userProgress={userProgress}
                  onComplete={(lessonId: string, data: any) => {
                    saveProgress({ ...userProgress, [lessonId]: data });
                    setModalStep('completion');
                  }}
                  onClose={closeModal}
                />
              )}
              {modalStep === 'completion' && (
                <AcademyCompletionModal 
                  onClose={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}