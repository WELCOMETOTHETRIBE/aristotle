import { motion } from 'framer-motion';
import { Brain, Shield, Scale, Leaf, GraduationCap, Clock, BookOpen, Users, Star, ArrowRight, Quote, Target, Lightbulb, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademyOverviewProps {
  onStartJourney: () => void;
}

export default function AcademyOverview({ onStartJourney }: AcademyOverviewProps) {
  const virtues = [
    {
      id: 'wisdom',
      name: 'Wisdom',
      greekName: 'Σοφία (Sophia)',
      description: 'The virtue of knowledge, understanding, and sound judgment',
      icon: Brain,
      color: 'bg-primary/20 text-primary border-primary/30',
      lessons: 12,
      time: 180,
      focus: 'Intellectual development and practical wisdom'
    },
    {
      id: 'justice',
      name: 'Justice',
      greekName: 'Δικαιοσύνη (Dikaiosyne)',
      description: 'The virtue of fairness, right relationships, and social harmony',
      icon: Scale,
      color: 'bg-justice/20 text-justice border-justice/30',
      lessons: 12,
      time: 180,
      focus: 'Social responsibility and ethical relationships'
    },
    {
      id: 'courage',
      name: 'Courage',
      greekName: 'Ανδρεία (Andreia)',
      description: 'The virtue of facing challenges with strength and determination',
      icon: Shield,
      color: 'bg-courage/20 text-courage border-courage/30',
      lessons: 12,
      time: 180,
      focus: 'Moral and physical courage in daily life'
    },
    {
      id: 'temperance',
      name: 'Temperance',
      greekName: 'Σωφροσύνη (Sophrosyne)',
      description: 'The virtue of self-control, moderation, and inner harmony',
      icon: Leaf,
      color: 'bg-temperance/20 text-temperance border-temperance/30',
      lessons: 12,
      time: 180,
      focus: 'Balance and self-mastery in all things'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Aristotle's Academy
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Welcome to the modern revival of the ancient Lyceum, where you'll study under the guidance of history's greatest philosopher
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center space-x-6 text-sm text-muted"
        >
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>48 Lessons</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>12 Hours</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>4 Capstone Projects</span>
          </div>
        </motion.div>
      </div>

      {/* About Aristotle's Academy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-8"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text">The Original Academy</h2>
            <p className="text-muted leading-relaxed">
              In 335 BCE, Aristotle founded the Lyceum in Athens, creating one of the world's first institutions of higher learning. 
              His students walked with him through the gardens as they discussed philosophy, ethics, and the nature of human flourishing.
            </p>
            <p className="text-muted leading-relaxed">
              Today, we revive that tradition through a comprehensive curriculum that brings Aristotle's timeless wisdom to modern life. 
              You'll study the four cardinal virtues that form the foundation of ethical character and human excellence.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted">
              <Quote className="w-4 h-4" />
              <span>"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">What You'll Learn</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted">Practical wisdom for daily decision-making</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-justice/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-justice" />
                </div>
                <span className="text-sm text-muted">Ethical relationships and social responsibility</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-courage/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-courage" />
                </div>
                <span className="text-sm text-muted">Courage to face life's challenges</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-temperance/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-temperance" />
                </div>
                <span className="text-sm text-muted">Balance and self-mastery</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Virtue Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-2">The Four Cardinal Virtues</h2>
          <p className="text-muted">The foundation of ethical character and human flourishing</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {virtues.map((virtue, index) => {
            const IconComponent = virtue.icon;
            return (
              <motion.div
                key={virtue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="p-6 bg-surface border border-border rounded-2xl hover:bg-surface-2 transition-all duration-200"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', virtue.color)}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text mb-1">{virtue.name}</h3>
                    <p className="text-sm text-muted mb-2">{virtue.greekName}</p>
                    <p className="text-sm text-muted">{virtue.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Focus:</span>
                    <span className="text-text font-medium">{virtue.focus}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Lessons:</span>
                    <span className="text-text font-medium">{virtue.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Time:</span>
                    <span className="text-text font-medium">{virtue.time} minutes</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Learning Approach */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text mb-2">The Aristotelian Method</h2>
          <p className="text-muted">How you'll learn and grow through this curriculum</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text">Theoretical Understanding</h3>
            <p className="text-sm text-muted">Learn the philosophical foundations and principles behind each virtue</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-courage/20 rounded-xl flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-courage" />
            </div>
            <h3 className="font-semibold text-text">Practical Application</h3>
            <p className="text-sm text-muted">Apply virtue principles to real-life situations through guided exercises</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-temperance/20 rounded-xl flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-temperance" />
            </div>
            <h3 className="font-semibold text-text">Character Formation</h3>
            <p className="text-sm text-muted">Develop virtuous habits through consistent practice and reflection</p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">Begin Your Philosophical Journey</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Join the ranks of those who have studied under Aristotle's guidance. 
            Choose your path and begin the journey toward wisdom, justice, courage, and temperance.
          </p>
        </div>

        <motion.button
          onClick={onStartJourney}
          className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium text-lg flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GraduationCap className="w-5 h-5" />
          <span>Enter the Academy</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center justify-center space-x-6 text-sm text-muted">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Self-paced learning</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Authentic sources</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Community support</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 