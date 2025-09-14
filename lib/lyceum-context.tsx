'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LYCEUM_DATA, type Path, type Lesson, type LyceumData } from '@/lib/lyceum-data';

// User progress types
export interface UserProgress {
  completedLessons: Set<string>;
  completedPaths: Set<string>;
  artifacts: Set<string>;
  masteryScores: { [key: string]: number };
  currentPath?: string;
  currentLesson?: string;
  lastAccessed?: Date;
  totalTimeSpent: number;
  dailyCheckins: number;
  scholarModeCompleted: Set<string>;
  agoraShares: Set<string>;
}

export interface LyceumContextType {
  data: LyceumData;
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  completeLesson: (lessonId: string, artifacts: string[], masteryUpdates: { [key: string]: number }) => void;
  completePath: (pathId: string) => void;
  addArtifact: (artifact: string) => void;
  updateMastery: (domain: string, delta: number) => void;
  canAccessLesson: (lessonId: string) => boolean;
  canAccessPath: (pathId: string) => boolean;
  getPathProgress: (pathId: string) => number;
  getOverallProgress: () => number;
  canEarnCertificate: () => boolean;
  resetProgress: () => void;
  saveProgress: () => void;
  loadProgress: () => void;
}

const LyceumContext = createContext<LyceumContextType | undefined>(undefined);

const defaultProgress: UserProgress = {
  completedLessons: new Set(),
  completedPaths: new Set(),
  artifacts: new Set(),
  masteryScores: {
    logic: 0,
    science: 0,
    metaphysics: 0,
    ethics: 0,
    politics: 0,
    rhetoric_poetics: 0
  },
  totalTimeSpent: 0,
  dailyCheckins: 0,
  scholarModeCompleted: new Set(),
  agoraShares: new Set()
};

export function LyceumProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Load progress when user changes
  useEffect(() => {
    if (loading) return;
    loadProgress();
  }, [user, loading]);

  // Save progress when it changes
  useEffect(() => {
    if (!loading && user) {
      saveProgress();
    }
  }, [progress, user, loading]);

  const loadProgress = () => {
    if (!user) {
      setProgress(defaultProgress);
      return;
    }

    try {
      const saved = localStorage.getItem(`lyceum_progress_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert arrays back to Sets
        setProgress({
          ...parsed,
          completedLessons: new Set(parsed.completedLessons || []),
          completedPaths: new Set(parsed.completedPaths || []),
          artifacts: new Set(parsed.artifacts || []),
          scholarModeCompleted: new Set(parsed.scholarModeCompleted || []),
          agoraShares: new Set(parsed.agoraShares || []),
          lastAccessed: parsed.lastAccessed ? new Date(parsed.lastAccessed) : undefined
        });
      } else {
        setProgress(defaultProgress);
      }
    } catch (error) {
      console.error('Error loading Lyceum progress:', error);
      setProgress(defaultProgress);
    }
  };

  const saveProgress = () => {
    if (!user) return;

    try {
      // Convert Sets to arrays for JSON serialization
      const toSave = {
        ...progress,
        completedLessons: Array.from(progress.completedLessons),
        completedPaths: Array.from(progress.completedPaths),
        artifacts: Array.from(progress.artifacts),
        scholarModeCompleted: Array.from(progress.scholarModeCompleted),
        agoraShares: Array.from(progress.agoraShares),
        lastAccessed: new Date().toISOString()
      };
      
      localStorage.setItem(`lyceum_progress_${user.id}`, JSON.stringify(toSave));
    } catch (error) {
      console.error('Error saving Lyceum progress:', error);
    }
  };

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const completeLesson = (lessonId: string, artifacts: string[], masteryUpdates: { [key: string]: number }) => {
    setProgress(prev => {
      const newCompletedLessons = new Set(prev.completedLessons);
      newCompletedLessons.add(lessonId);

      const newArtifacts = new Set(prev.artifacts);
      artifacts.forEach(artifact => newArtifacts.add(artifact));

      const newMasteryScores = { ...prev.masteryScores };
      Object.entries(masteryUpdates).forEach(([domain, delta]) => {
        newMasteryScores[domain] = Math.min(1, (newMasteryScores[domain] || 0) + delta);
      });

      // Check if path is completed
      const path = LYCEUM_DATA.paths.find(p => p.lessons.some(l => l.id === lessonId));
      let newCompletedPaths = new Set(prev.completedPaths);
      if (path && path.lessons.every(lesson => newCompletedLessons.has(lesson.id))) {
        newCompletedPaths.add(path.id);
      }

      return {
        ...prev,
        completedLessons: newCompletedLessons,
        completedPaths: newCompletedPaths,
        artifacts: newArtifacts,
        masteryScores: newMasteryScores
      };
    });
  };

  const completePath = (pathId: string) => {
    setProgress(prev => {
      const newCompletedPaths = new Set(prev.completedPaths);
      newCompletedPaths.add(pathId);
      return { ...prev, completedPaths: newCompletedPaths };
    });
  };

  const addArtifact = (artifact: string) => {
    setProgress(prev => {
      const newArtifacts = new Set(prev.artifacts);
      newArtifacts.add(artifact);
      return { ...prev, artifacts: newArtifacts };
    });
  };

  const updateMastery = (domain: string, delta: number) => {
    setProgress(prev => ({
      ...prev,
      masteryScores: {
        ...prev.masteryScores,
        [domain]: Math.min(1, (prev.masteryScores[domain] || 0) + delta)
      }
    }));
  };

  const canAccessLesson = (lessonId: string): boolean => {
    const lesson = LYCEUM_DATA.paths
      .flatMap(path => path.lessons)
      .find(l => l.id === lessonId);
    
    if (!lesson) return false;
    if (lesson.optional) return true;
    
    // Check dependencies
    return lesson.dependencies.every(depId => progress.completedLessons.has(depId));
  };

  const canAccessPath = (pathId: string): boolean => {
    const path = LYCEUM_DATA.paths.find(p => p.id === pathId);
    if (!path) return false;
    
    // First lesson should be accessible
    return canAccessLesson(path.lessons[0]?.id || '');
  };

  const getPathProgress = (pathId: string): number => {
    const path = LYCEUM_DATA.paths.find(p => p.id === pathId);
    if (!path) return 0;
    
    const completedInPath = path.lessons.filter(lesson => 
      progress.completedLessons.has(lesson.id)
    ).length;
    
    return Math.round((completedInPath / path.lessons.length) * 100);
  };

  const getOverallProgress = (): number => {
    const totalLessons = LYCEUM_DATA.paths.reduce((sum, path) => sum + path.lessons.length, 0);
    return Math.round((progress.completedLessons.size / totalLessons) * 100);
  };

  const canEarnCertificate = (): boolean => {
    const completedPaths = progress.completedPaths.size;
    const completedLessons = progress.completedLessons.size;
    
    return completedPaths >= LYCEUM_DATA.certificate.requirements.completed_paths &&
           completedLessons >= LYCEUM_DATA.certificate.requirements.min_lessons_completed;
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    if (user) {
      localStorage.removeItem(`lyceum_progress_${user.id}`);
    }
  };

  const contextValue: LyceumContextType = {
    data: LYCEUM_DATA,
    progress,
    updateProgress,
    completeLesson,
    completePath,
    addArtifact,
    updateMastery,
    canAccessLesson,
    canAccessPath,
    getPathProgress,
    getOverallProgress,
    canEarnCertificate,
    resetProgress,
    saveProgress,
    loadProgress
  };

  return (
    <LyceumContext.Provider value={contextValue}>
      {children}
    </LyceumContext.Provider>
  );
}

export function useLyceum() {
  const context = useContext(LyceumContext);
  if (context === undefined) {
    throw new Error('useLyceum must be used within a LyceumProvider');
  }
  return context;
}
