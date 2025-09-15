'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Award,
  ArrowRight,
  X,
  Target,
  BookOpen,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface AcademyCompletionModalProps {
  onClose: () => void;
}

export default function AcademyCompletionModal({ onClose }: AcademyCompletionModalProps) {
  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Excellent Work!</h1>
          <p className="text-muted">You're building meaningful connections with ancient wisdom</p>
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
          You've successfully engaged with ancient wisdom and created meaningful connections to your modern life. 
          Each lesson builds your capacity for deeper understanding and practical application.
        </p>
      </motion.div>

      {/* What You've Gained */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-8"
      >
        <h3 className="text-lg font-semibold text-text">What You've Gained</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-500" />
              </div>
              <h4 className="font-semibold text-text">Deeper Dialogue</h4>
            </div>
            <p className="text-sm text-muted">Enhanced your ability to engage meaningfully with complex ideas</p>
          </div>
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="font-semibold text-text">Practical Wisdom</h4>
            </div>
            <p className="text-sm text-muted">Connected timeless insights to your daily life and decisions</p>
          </div>
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="font-semibold text-text">Expanded Perspective</h4>
            </div>
            <p className="text-sm text-muted">Broadened your understanding of human nature and wisdom</p>
          </div>
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              <h4 className="font-semibold text-text">Personal Growth</h4>
            </div>
            <p className="text-sm text-muted">Developed new habits of reflection and thoughtful engagement</p>
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
            <p className="text-sm text-muted">Explore more lessons to deepen your understanding</p>
          </div>
          <div className="p-4 bg-surface-2 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="font-semibold text-text">Apply Daily</h4>
            </div>
            <p className="text-sm text-muted">Use what you've learned in your daily reflections and decisions</p>
          </div>
        </div>
      </motion.div>

      {/* Certificate Progress */}
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
          <h3 className="text-lg font-semibold text-text">Academy Certificate Progress</h3>
        </div>
        <p className="text-sm text-muted mb-4">
          You're making great progress toward earning your Academy Dialogue Certificate! 
          Continue learning to unlock this achievement and showcase your journey with ancient wisdom.
        </p>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-surface-2 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: '25%' }}
            />
          </div>
          <span className="text-sm font-medium text-text">25%</span>
        </div>
      </motion.div>

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
