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
  Star,
  Sparkle,
  CheckCircle,
  Play
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

  const IconComponent = getPathIcon(path.id);

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br ${getPathColor(path.id)} shadow-lg`}>
            <IconComponent className={`w-8 h-8 ${getPathIconColor(path.id)}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{path.title}</h1>
            <p className="text-muted">Your journey through ancient wisdom</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-br ${getPathColor(path.id)} rounded-3xl p-8 mb-8 border`}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
            <Sparkle className={`w-8 h-8 ${getPathIconColor(path.id)}`} />
          </div>
          <h2 className="text-xl font-semibold text-text">Why This Path Matters</h2>
          <p className="text-muted leading-relaxed max-w-2xl mx-auto">
            {path.description}
          </p>
        </div>
      </motion.div>

      {/* Learning Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-surface-2 rounded-2xl p-6 text-center group hover:bg-surface-3 transition-colors">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-semibold text-text mb-2">Engage in Dialogue</h4>
          <p className="text-sm text-muted">Have conversations with the greatest minds in history</p>
        </div>
        
        <div className="bg-surface-2 rounded-2xl p-6 text-center group hover:bg-surface-3 transition-colors">
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
            <Heart className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-semibold text-text mb-2">Apply Ancient Wisdom</h4>
          <p className="text-sm text-muted">Connect timeless insights to your modern life</p>
        </div>
        
        <div className="bg-surface-2 rounded-2xl p-6 text-center group hover:bg-surface-3 transition-colors">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="font-semibold text-text mb-2">Build Understanding</h4>
          <p className="text-sm text-muted">Develop deeper insights through guided exploration</p>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 mb-8"
      >
        <h3 className="text-xl font-semibold text-text text-center">How This Path Works</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-surface-2 rounded-2xl group hover:bg-surface-3 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-1">Choose Your Lesson</h4>
              <p className="text-sm text-muted">Select from {path.lessons.length} carefully crafted lessons</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-surface-2 rounded-2xl group hover:bg-surface-3 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-1">Engage & Reflect</h4>
              <p className="text-sm text-muted">Participate in activities that bring ancient wisdom to life</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-surface-2 rounded-2xl group hover:bg-surface-3 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-1">Build Your Portfolio</h4>
              <p className="text-sm text-muted">Create artifacts that demonstrate your growing understanding</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Path Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`bg-gradient-to-br ${getPathColor(path.id)} rounded-3xl p-6 mb-8 border`}
      >
        <h3 className="text-lg font-semibold text-text mb-6 text-center">Path Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-text">{path.lessons.length}</div>
            <div className="text-sm text-muted">Lessons</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-text">{path.estimated_minutes_total}</div>
            <div className="text-sm text-muted">Minutes</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-text">{path.difficulty || 'Mixed'}</div>
            <div className="text-sm text-muted">Difficulty</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-text">Interactive</div>
            <div className="text-sm text-muted">Format</div>
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
          Maybe Later
        </button>
        
        <button
          onClick={onNext}
          className="px-8 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl group"
        >
          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Start Learning</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}