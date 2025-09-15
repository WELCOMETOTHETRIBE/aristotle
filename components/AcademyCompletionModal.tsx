'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle,
  ArrowRight,
  X,
  Star,
  Sparkle,
  Award,
  BookOpen,
  Clock,
  Share2,
  Home
} from 'lucide-react';

interface AcademyCompletionModalProps {
  onClose: () => void;
}

export default function AcademyCompletionModal({ onClose }: AcademyCompletionModalProps) {
  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-text mb-3">Lesson Complete!</h1>
        <p className="text-muted text-lg">You've taken another step on your journey through ancient wisdom</p>
      </motion.div>

      {/* Celebration Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 text-center border border-blue-500/20">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-text mb-1">12</div>
          <div className="text-sm text-muted">Minutes Spent</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-6 text-center border border-green-500/20">
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-text mb-1">3</div>
          <div className="text-sm text-muted">Activities Completed</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 text-center border border-purple-500/20">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-text mb-1">2</div>
          <div className="text-sm text-muted">Artifacts Earned</div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 mb-8 border border-yellow-500/20"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <Sparkle className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-text">New Achievements</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-text">First Steps</h4>
              <p className="text-sm text-muted">Completed your first lesson in this path</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-text">Knowledge Seeker</h4>
              <p className="text-sm text-muted">Engaged with ancient wisdom for the first time</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Artifacts Earned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Artifacts Earned</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-2 rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-text">Wisdom Fragment</h4>
              <p className="text-sm text-muted">A piece of ancient knowledge</p>
            </div>
          </div>
          
          <div className="bg-surface-2 rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-text">Learning Badge</h4>
              <p className="text-sm text-muted">Proof of your dedication</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-primary/20"
      >
        <h3 className="text-lg font-semibold text-text mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Continue Your Path</h4>
              <p className="text-sm text-muted">Explore the next lesson in this learning path</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Explore Other Paths</h4>
              <p className="text-sm text-muted">Discover new areas of ancient wisdom</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Share Your Journey</h4>
              <p className="text-sm text-muted">Connect with others on similar paths</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onClose}
          className="px-6 py-3 text-muted hover:text-text transition-colors font-medium"
        >
          Close
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-surface-2 text-text rounded-2xl font-medium hover:bg-surface-3 transition-colors flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Academy</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl group"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}