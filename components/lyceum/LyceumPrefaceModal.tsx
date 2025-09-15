'use client';

import { motion } from 'framer-motion';
import { useLyceum } from '@/lib/lyceum-context';
import { 
  GraduationCap,
  BookOpen,
  Target,
  Clock,
  ArrowRight,
  X,
  Lightbulb,
  Brain,
  Heart,
  Users
} from 'lucide-react';

interface LyceumPrefaceModalProps {
  onNext: () => void;
  onClose: () => void;
}

export default function LyceumPrefaceModal({ onNext, onClose }: LyceumPrefaceModalProps) {
  const { data } = useLyceum();

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Welcome to Aristotle's Lyceum</h1>
            <p className="text-muted">Your journey to practical wisdom begins here</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* Learning Preface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 mb-8"
      >
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Why We're Here</h3>
              <p className="text-muted leading-relaxed">
                Aristotle believed that wisdom comes not from memorizing facts, but from developing the habits of clear thinking, 
                ethical reasoning, and practical judgment. Each module here is designed to build these habits through focused practice.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
              <Brain className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="font-semibold text-text mb-1">Think Clearly</h4>
            <p className="text-sm text-muted">Learn to distinguish between what's essential and what's accidental</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
              <Heart className="w-4 h-4 text-green-500" />
            </div>
            <h4 className="font-semibold text-text mb-1">Act Wisely</h4>
            <p className="text-sm text-muted">Develop the practical wisdom to make good decisions</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <h4 className="font-semibold text-text mb-1">Live Well</h4>
            <p className="text-sm text-muted">Build habits that lead to human flourishing</p>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-8"
      >
        <h3 className="text-lg font-semibold text-text">How It Works</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Choose Your Path</h4>
              <p className="text-sm text-muted">Select from 12 learning paths, each focusing on a different aspect of wisdom</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Practice & Reflect</h4>
              <p className="text-sm text-muted">Engage with bite-sized activities designed to build specific skills</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Build Your Portfolio</h4>
              <p className="text-sm text-muted">Collect artifacts that demonstrate your growing wisdom</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-2 rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-text mb-4">What You'll Explore</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text mb-1">{data.paths.length}</div>
            <div className="text-sm text-muted">Learning Paths</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text mb-1">
              {data.paths.reduce((sum, path) => sum + path.lessons.length, 0)}
            </div>
            <div className="text-sm text-muted">Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text mb-1">
              {data.paths.reduce((sum, path) => sum + path.estimated_minutes_total, 0)}
            </div>
            <div className="text-sm text-muted">Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text mb-1">6</div>
            <div className="text-sm text-muted">Mastery Domains</div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onClose}
          className="px-6 py-3 text-muted hover:text-text transition-colors"
        >
          Maybe Later
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
