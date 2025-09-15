'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { useLyceum } from '@/lib/lyceum-context';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Award, 
  Users, 
  Brain, 
  Compass,
  CheckCircle,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Scroll,
  Lightbulb,
  Heart,
  Star,
  ArrowLeft,
  Menu,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LyceumOverview from '@/components/lyceum/LyceumOverview';
import LyceumPaths from '@/components/lyceum/LyceumPaths';
import LyceumProgress from '@/components/lyceum/LyceumProgress';
import LyceumLesson from '@/components/lyceum/LyceumLesson';
import LyceumCertificate from '@/components/lyceum/LyceumCertificate';
import LyceumDailyCheckin from '@/components/lyceum/LyceumDailyCheckin';
import LyceumGlossary from '@/components/lyceum/LyceumGlossary';
import LyceumArtifacts from '@/components/lyceum/LyceumArtifacts';
import LyceumPortfolio from '@/components/lyceum/LyceumPortfolio';
import LyceumAgora from '@/components/lyceum/LyceumAgora';
import LyceumPrefaceModal from '@/components/lyceum/LyceumPrefaceModal';
import LyceumPathsModal from '@/components/lyceum/LyceumPathsModal';
import LyceumLessonModal from '@/components/lyceum/LyceumLessonModal';
import LyceumCompletionModal from '@/components/lyceum/LyceumCompletionModal';

type ViewMode = 'overview' | 'paths' | 'progress' | 'lesson' | 'certificate' | 'daily-checkin' | 'glossary' | 'artifacts' | 'portfolio' | 'agora';
type ModalStep = 'preface' | 'paths' | 'lesson' | 'completion' | null;

export default function LyceumPage() {
  const { data, progress, getOverallProgress, canEarnCertificate } = useLyceum();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const overallProgress = getOverallProgress();
  const canEarn = canEarnCertificate();

  const startJourney = () => {
    setModalStep('preface');
  };

  const selectPath = (pathId: string) => {
    setSelectedPath(pathId);
    setModalStep('paths');
  };

  const selectLesson = (lessonId: string) => {
    setSelectedLesson(lessonId);
    setModalStep('lesson');
  };

  const closeModal = () => {
    setModalStep(null);
    setSelectedPath(null);
    setSelectedLesson(null);
  };

  const backToPaths = () => {
    setSelectedPath(null);
    setSelectedLesson(null);
    setViewMode('paths');
  };

  const backToOverview = () => {
    setSelectedPath(null);
    setSelectedLesson(null);
    setViewMode('overview');
  };

  const getCurrentPathTitle = () => {
    if (selectedPath) {
      const path = data.paths.find(p => p.id === selectedPath);
      return path?.title || 'Unknown Path';
    }
    return null;
  };

  const getCurrentLessonTitle = () => {
    if (selectedLesson && selectedPath) {
      const path = data.paths.find(p => p.id === selectedPath);
      const lesson = path?.lessons.find(l => l.id === selectedLesson);
      return lesson?.title || 'Unknown Lesson';
    }
    return null;
  };

  const getPathIcon = (pathId: string) => {
    const iconMap: { [key: string]: any } = {
      'path1': Brain,
      'path2': Lightbulb,
      'path3': Target,
      'path4': Heart,
      'path5': Star,
      'path6': Compass,
      'path7': Award,
      'path8': Users,
      'path9': Users,
      'path10': Users,
      'path11': BookOpen,
      'path12': Scroll
    };
    return iconMap[pathId] || BookOpen;
  };

  const getPathColor = (pathId: string) => {
    const colorMap: { [key: string]: string } = {
      'path1': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'path2': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'path3': 'bg-green-500/20 text-green-300 border-green-500/30',
      'path4': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'path5': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'path6': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'path7': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'path8': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'path9': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      'path10': 'bg-red-500/20 text-red-300 border-red-500/30',
      'path11': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      'path12': 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    };
    return colorMap[pathId] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header focusVirtue="wisdom" />
      
      {/* Clean Header with Progress */}
      <div className="bg-surface border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              {viewMode !== 'overview' && (
                <button
                  onClick={viewMode === 'lesson' ? backToPaths : backToOverview}
                  className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted" />
                </button>
              )}
              
              {/* Title */}
              <div>
                <h1 className="text-xl font-bold text-text">
                  {viewMode === 'lesson' && getCurrentLessonTitle() 
                    ? getCurrentLessonTitle()
                    : viewMode === 'paths' && getCurrentPathTitle()
                    ? getCurrentPathTitle()
                    : data.meta.title}
                </h1>
                {viewMode === 'lesson' && getCurrentPathTitle() && (
                  <p className="text-sm text-muted">{getCurrentPathTitle()}</p>
                )}
              </div>
            </div>

            {/* Progress & Menu */}
            <div className="flex items-center space-x-3">
              {/* Compact Progress */}
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <span className="text-muted">{overallProgress}%</span>
                <div className="w-16 bg-surface-2 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Certificate Badge */}
              {canEarn && (
                <button
                  onClick={() => setViewMode('certificate')}
                  className="flex items-center space-x-1 bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1 rounded-lg transition-colors"
                >
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm text-yellow-300 font-medium">Certificate</span>
                </button>
              )}

              {/* Menu Button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-muted" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface border-b border-border shadow-lg"
          >
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => { setViewMode('overview'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'overview' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Overview</span>
                </button>
                <button
                  onClick={() => { setViewMode('paths'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'paths' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Paths</span>
                </button>
                <button
                  onClick={() => { setViewMode('progress'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'progress' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Progress</span>
                </button>
                <button
                  onClick={() => { setViewMode('daily-checkin'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'daily-checkin' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Check-in</span>
                </button>
                <button
                  onClick={() => { setViewMode('glossary'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'glossary' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <Scroll className="w-4 h-4" />
                  <span className="text-sm font-medium">Glossary</span>
                </button>
                <button
                  onClick={() => { setViewMode('artifacts'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'artifacts' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Artifacts</span>
                </button>
                <button
                  onClick={() => { setViewMode('portfolio'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'portfolio' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">Portfolio</span>
                </button>
                <button
                  onClick={() => { setViewMode('agora'); setShowMenu(false); }}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg text-left transition-colors',
                    viewMode === 'agora' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-surface-2 text-muted hover:text-text'
                  )}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Agora</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Clean and Focused */}
      <main className="px-4 py-6 pb-20">
        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumOverview onStartJourney={startJourney} />
            </motion.div>
          )}

          {viewMode === 'paths' && (
            <motion.div
              key="paths"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumPaths 
                onSelectPath={selectPath}
                onSelectLesson={selectLesson}
              />
            </motion.div>
          )}

          {viewMode === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumProgress 
                onSelectPath={selectPath}
                onSelectLesson={selectLesson}
              />
            </motion.div>
          )}

          {viewMode === 'lesson' && selectedLesson && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumLesson 
                lessonId={selectedLesson}
                onBack={backToPaths}
                onComplete={() => {
                  // Auto-advance logic can be added here
                }}
              />
            </motion.div>
          )}

          {viewMode === 'certificate' && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumCertificate onBack={backToOverview} />
            </motion.div>
          )}

          {viewMode === 'daily-checkin' && (
            <motion.div
              key="daily-checkin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumDailyCheckin />
            </motion.div>
          )}

          {viewMode === 'glossary' && (
            <motion.div
              key="glossary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumGlossary />
            </motion.div>
          )}

          {viewMode === 'artifacts' && (
            <motion.div
              key="artifacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumArtifacts pathId={selectedPath || undefined} lessonId={selectedLesson || undefined} />
            </motion.div>
          )}

          {viewMode === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumPortfolio />
            </motion.div>
          )}

          {viewMode === 'agora' && (
            <motion.div
              key="agora"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LyceumAgora pathId={selectedPath || undefined} lessonId={selectedLesson || undefined} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
              {modalStep === 'preface' && (
                <LyceumPrefaceModal 
                  onNext={() => setModalStep('paths')}
                  onClose={closeModal}
                />
              )}
              {modalStep === 'paths' && (
                <LyceumPathsModal 
                  onSelectPath={selectPath}
                  onClose={closeModal}
                />
              )}
              {modalStep === 'lesson' && selectedLesson && (
                <LyceumLessonModal 
                  lessonId={selectedLesson}
                  onComplete={() => setModalStep('completion')}
                  onClose={closeModal}
                />
              )}
              {modalStep === 'completion' && (
                <LyceumCompletionModal 
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
