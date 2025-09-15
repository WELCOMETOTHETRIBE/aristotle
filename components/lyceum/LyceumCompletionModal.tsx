'use client';

import { motion } from 'framer-motion';
import { useLyceum } from '@/lib/lyceum-context';
import { 
  CheckCircle,
  Award,
  ArrowRight,
  X,
  Target,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface LyceumCompletionModalProps {
  onClose: () => void;
}

export default function LyceumCompletionModal({ onClose }: LyceumCompletionModalProps) {
  const { progress, getOverallProgress } = useLyceum();
  const overallProgress = getOverallProgress();

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Great Progress!</h1>
          <p className="text-muted">You're building wisdom step by step</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* Completion Celebration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8 text-center mb-8"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-text mb-3">Lesson Completed!</h2>
        <p className="text-muted text-lg max-w-md mx-auto">
          You've taken another step toward practical wisdom. Each lesson builds your capacity for clear thinking and wise action.
        </p>
      </motion.div>

      {/* Progress Update */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-border rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Your Journey Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted">Overall Progress</span>
            <span className="text-2xl font-bold text-text">{overallProgress}%</span>
          </div>
          <div className="w-full bg-surface-2 rounded-full h-3">
            <motion.div 
              className="h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-text">{progress.completedPaths.size}</div>
              <div className="text-sm text-muted">Paths Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-text">{progress.completedLessons.size}</div>
              <div className="text-sm text-muted">Lessons Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-text">{progress.artifacts.size}</div>
              <div className="text-sm text-muted">Artifacts Collected</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-8"
      >
        <h3 className="text-lg font-semibold text-text">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-text">Continue Learning</h4>
            </div>
            <p className="text-sm text-muted">Explore more paths to deepen your understanding</p>
          </div>
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="font-semibold text-text">Practice Daily</h4>
            </div>
            <p className="text-sm text-muted">Apply what you've learned in your daily life</p>
          </div>
        </div>
      </motion.div>

      {/* Certificate Progress */}
      {overallProgress > 50 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-text">Certificate Progress</h3>
          </div>
          <p className="text-sm text-muted mb-4">
            You're making great progress toward earning your Lyceum Certificate! Keep learning to unlock this achievement.
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-surface-2 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-text">{overallProgress}%</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onClose}
          className="px-6 py-3 text-muted hover:text-text transition-colors"
        >
          Close
        </button>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
