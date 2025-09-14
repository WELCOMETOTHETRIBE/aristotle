'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Star
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
import LyceumFloatingActions from '@/components/lyceum/LyceumFloatingActions';

type ViewMode = 'overview' | 'paths' | 'progress' | 'lesson' | 'certificate' | 'daily-checkin' | 'glossary' | 'artifacts' | 'portfolio' | 'agora';

export default function LyceumPage() {
  const { data, progress, getOverallProgress, canEarnCertificate } = useLyceum();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const overallProgress = getOverallProgress();
  const canEarn = canEarnCertificate();

  const startJourney = () => {
    setViewMode('paths');
  };

  const selectPath = (pathId: string) => {
    setSelectedPath(pathId);
    setViewMode('lesson');
    // Start with first lesson
    const path = data.paths.find(p => p.id === pathId);
    if (path && path.lessons.length > 0) {
      setSelectedLesson(path.lessons[0].id);
    }
  };

  const selectLesson = (lessonId: string) => {
    setSelectedLesson(lessonId);
    setViewMode('lesson');
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
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue="wisdom" />
      
      <main className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-text mb-3">
              {data.meta.title}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {data.meta.philosophical_scope}
            </p>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-6 mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-text">{progress.completedPaths.size}</div>
                <div className="text-sm text-muted">Paths Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{progress.completedLessons.size}</div>
                <div className="text-sm text-muted">Lessons Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{progress.artifacts.size}</div>
                <div className="text-sm text-muted">Artifacts Collected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{overallProgress}%</div>
                <div className="text-sm text-muted">Overall Progress</div>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted mb-2">
                <span>Journey Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-3">
                <motion.div 
                  className="h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Certificate Status */}
          {canEarn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center justify-center space-x-2 text-yellow-300">
                <Award className="w-5 h-5" />
                <span className="font-medium">Certificate Available!</span>
                <button
                  onClick={() => setViewMode('certificate')}
                  className="text-sm bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1 rounded-lg transition-colors"
                >
                  View Certificate
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center space-x-1 bg-surface border border-border rounded-xl p-1 overflow-x-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
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
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
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
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'progress' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Progress
          </button>
          <button
            onClick={() => setViewMode('daily-checkin')}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'daily-checkin' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Check-in
          </button>
          <button
            onClick={() => setViewMode('glossary')}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'glossary' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Glossary
          </button>
          <button
            onClick={() => setViewMode('artifacts')}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'artifacts' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Artifacts
          </button>
          <button
            onClick={() => setViewMode('portfolio')}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'portfolio' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Portfolio
          </button>
          <button
            onClick={() => setViewMode('agora')}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              viewMode === 'agora' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text'
            )}
          >
            Agora
          </button>
        </div>

        {/* Content */}
        {viewMode === 'overview' && (
          <LyceumOverview onStartJourney={startJourney} />
        )}

        {viewMode === 'paths' && (
          <LyceumPaths 
            onSelectPath={selectPath}
            onSelectLesson={selectLesson}
          />
        )}

        {viewMode === 'progress' && (
          <LyceumProgress 
            onSelectPath={selectPath}
            onSelectLesson={selectLesson}
          />
        )}

        {viewMode === 'lesson' && selectedLesson && (
          <LyceumLesson 
            lessonId={selectedLesson}
            onBack={backToPaths}
            onComplete={() => {
              // Auto-advance logic can be added here
            }}
          />
        )}

        {viewMode === 'certificate' && (
          <LyceumCertificate onBack={backToOverview} />
        )}

        {viewMode === 'daily-checkin' && (
          <LyceumDailyCheckin />
        )}

        {viewMode === 'glossary' && (
          <LyceumGlossary />
        )}

        {viewMode === 'artifacts' && (
          <LyceumArtifacts pathId={selectedPath || undefined} lessonId={selectedLesson || undefined} />
        )}

        {viewMode === 'portfolio' && (
          <LyceumPortfolio />
        )}

        {viewMode === 'agora' && (
          <LyceumAgora pathId={selectedPath || undefined} lessonId={selectedLesson || undefined} />
        )}
      </main>

      <LyceumFloatingActions />
      <TabBar />
    </div>
  );
}
