'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  X,
  Lightbulb,
  Brain,
  Heart,
  Users,
  MessageCircle,
  Star
} from 'lucide-react';

interface AcademyPrefaceModalProps {
  path: any;
  onNext: () => void;
  onClose: () => void;
}

export default function AcademyPrefaceModal({ path, onNext, onClose }: AcademyPrefaceModalProps) {
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
      'path1': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'path2': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'path3': 'bg-green-500/20 text-green-300 border-green-500/30',
      'path4': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'path5': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'path6': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'path7': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'path8': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colorMap[pathId] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const IconComponent = getPathIcon(path.id);

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getPathColor(path.id)}`}>
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{path.title}</h1>
            <p className="text-muted">Your dialogue with ancient wisdom begins here</p>
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
              <h3 className="text-lg font-semibold text-text mb-2">Why This Path Matters</h3>
              <p className="text-muted leading-relaxed">
                {path.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
              <Brain className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="font-semibold text-text mb-1">Engage in Dialogue</h4>
            <p className="text-sm text-muted">Have conversations with the greatest minds in history</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
              <Heart className="w-4 h-4 text-green-500" />
            </div>
            <h4 className="font-semibold text-text mb-1">Apply Ancient Wisdom</h4>
            <p className="text-sm text-muted">Connect timeless insights to your modern life</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <h4 className="font-semibold text-text mb-1">Build Understanding</h4>
            <p className="text-sm text-muted">Develop deeper insights through guided exploration</p>
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
        <h3 className="text-lg font-semibold text-text">How This Path Works</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Choose Your Lesson</h4>
              <p className="text-sm text-muted">Select from {path.lessons.length} carefully crafted lessons</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Engage & Reflect</h4>
              <p className="text-sm text-muted">Participate in activities that bring ancient wisdom to life</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <div>
              <h4 className="font-medium text-text">Build Your Portfolio</h4>
              <p className="text-sm text-muted">Create artifacts that demonstrate your growing understanding</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Path Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-2 rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Path Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text mb-1">{path.lessons.length}</div>
            <div className="text-sm text-muted">Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text mb-1">{path.estimated_minutes_total}</div>
            <div className="text-sm text-muted">Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text mb-1">{path.difficulty || 'Mixed'}</div>
            <div className="text-sm text-muted">Difficulty</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text mb-1">Interactive</div>
            <div className="text-sm text-muted">Format</div>
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
          <span>Explore Lessons</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
