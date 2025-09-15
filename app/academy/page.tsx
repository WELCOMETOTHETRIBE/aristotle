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
  Zap,
  ChevronRight,
  X,
  Sparkle,
  Heart
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

  const getPathIcon = (pathId: string) => {
    const iconMap: { [key: string]: any } = {
      'path1': Brain,
      'path2': Lightbulb,
      'path3': Target,
      'path4': Heart,
      'path5': Star,
      'path6': Users,
      'path7': MessageCircle,
      'path8': BookOpen
    };
    return iconMap[pathId] || BookOpen;
  };

  const getPathColor = (pathId: string) => {
    const colorMap: { [key: string]: string } = {
      'path1': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'path2': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      'path3': 'from-green-500/20 to-green-600/20 border-green-500/30',
      'path4': 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
      'path5': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      'path6': 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
      'path7': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      'path8': 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
    };
    return colorMap[pathId] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  };

  const getPathIconColor = (pathId: string) => {
    const colorMap: { [key: string]: string } = {
      'path1': 'text-blue-400',
      'path2': 'text-yellow-400',
      'path3': 'text-green-400',
      'path4': 'text-emerald-400',
      'path5': 'text-purple-400',
      'path6': 'text-indigo-400',
      'path7': 'text-pink-400',
      'path8': 'text-orange-400'
    };
    return colorMap[pathId] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue="wisdom" />
      
      <main className="px-4 py-6 space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <GraduationCap className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-text tracking-tight">
              {academyData.meta.title}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              {academyData.meta.philosophical_scope}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 text-muted">
              <BookOpen className="w-4 h-4" />
              <span>{academyData.paths.length} Learning Paths</span>
            </div>
            <div className="flex items-center space-x-2 text-muted">
              <Clock className="w-4 h-4" />
              <span>{academyData.meta.session_length_minutes}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted">
              <Award className="w-4 h-4" />
              <span>Certificate</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl p-6 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text">Your Progress</h2>
            <div className="flex items-center space-x-2 text-primary">
              <Sparkle className="w-4 h-4" />
              <span className="text-sm font-medium">{getOverallProgress()}% Complete</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Overall Progress</span>
              <span className="text-text font-medium">{getOverallProgress()}%</span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getOverallProgress()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{getCompletedPaths()} of {academyData.paths.length} paths completed</span>
              <span>{academyData.paths.reduce((sum, path) => sum + path.lessons.length, 0)} total lessons</span>
            </div>
          </div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text">Learning Paths</h2>
            <div className="text-sm text-muted">
              Choose your journey through ancient wisdom
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academyData.paths.map((path, index) => {
              const IconComponent = getPathIcon(path.id);
              const progress = getPathProgress(path.id);
              const isCompleted = progress === 100;
              
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group cursor-pointer"
                  onClick={() => startPath(path)}
                >
                  <div className={cn(
                    "relative p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                    "bg-gradient-to-br backdrop-blur-sm",
                    getPathColor(path.id),
                    isCompleted && "ring-2 ring-green-500/50"
                  )}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                          "bg-white/10 backdrop-blur-sm"
                        )}>
                          <IconComponent className={cn("w-6 h-6", getPathIconColor(path.id))} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text mb-1">{path.title}</h3>
                          <p className="text-sm text-muted line-clamp-2">{path.description}</p>
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Progress</span>
                        <span className="text-text font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <motion.div 
                          className="bg-gradient-to-r from-white/30 to-white/50 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 * index }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-4 text-sm text-muted">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{path.lessons.length} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{path.estimated_minutes_total} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                        <span>{isCompleted ? 'Review' : 'Continue'}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => setShowPhilosophersDialogue(true)}
            className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl text-left hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Philosopher Dialogue</h4>
                <p className="text-sm text-muted">Chat with ancient wisdom</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setViewMode('artifacts')}
            className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl text-left hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Your Artifacts</h4>
                <p className="text-sm text-muted">View your collection</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setViewMode('progress')}
            className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl text-left hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Progress Details</h4>
                <p className="text-sm text-muted">Track your journey</p>
              </div>
            </div>
          </button>
        </motion.div>
      </main>

      {/* Modal System */}
      <AnimatePresence>
        {modalStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface border border-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
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

      {/* Philosophers Dialogue Modal */}
      <PhilosophersDialogueModal
        isOpen={showPhilosophersDialogue}
        onClose={() => setShowPhilosophersDialogue(false)}
      />

      <TabBar />
    </div>
  );
}