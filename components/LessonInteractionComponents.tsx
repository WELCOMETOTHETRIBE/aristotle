import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Zap, BookOpen, MessageCircle, CheckCircle, 
  Plus, Minus, Star, Heart, Lightbulb, Sparkles, Trophy,
  TrendingUp, Award, Fire, HeartHandshake, Palette, PenTool, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== BELIEF IDENTIFICATION INTERACTION =====
// For lessons about examining personal beliefs
export function BeliefIdentificationInteraction({ 
  onComplete, 
  onProgress 
}: { 
  onComplete: (beliefs: string[]) => void;
  onProgress: (progress: number) => void;
}) {
  const [beliefs, setBeliefs] = useState<string[]>(['', '', '', '', '']);
  const [currentFocus, setCurrentFocus] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  const handleBeliefChange = (index: number, value: string) => {
    const newBeliefs = [...beliefs];
    newBeliefs[index] = value;
    setBeliefs(newBeliefs);
    
    // Calculate progress
    const filledCount = newBeliefs.filter(b => b.trim().length > 0).length;
    const progress = (filledCount / 5) * 100;
    onProgress(progress);
    
    // Dopamine reward: visual feedback
    if (value.trim().length > 0 && beliefs[index] === '') {
      setSatisfaction(prev => Math.min(100, prev + 20));
    }
  };

  const handleComplete = () => {
    const validBeliefs = beliefs.filter(b => b.trim().length > 0);
    if (validBeliefs.length >= 3) {
      onComplete(validBeliefs);
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-purple-700 mb-2">Identify Your Core Beliefs</h3>
        <p className="text-sm text-purple-600">Write down 5 beliefs you hold strongly. These will be referenced throughout your learning journey.</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-700">Beliefs Identified</span>
          <span className="text-sm text-purple-600">{beliefs.filter(b => b.trim().length > 0).length}/5</span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${(beliefs.filter(b => b.trim().length > 0).length / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Belief input fields */}
      <div className="space-y-4 mb-6">
        {beliefs.map((belief, index) => (
          <motion.div
            key={index}
            className={cn(
              'relative transition-all duration-200',
              currentFocus === index ? 'scale-105' : 'scale-100'
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                belief.trim().length > 0
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-purple-200 text-purple-600'
              )}>
                {belief.trim().length > 0 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <input
                type="text"
                value={belief}
                onChange={(e) => handleBeliefChange(index, e.target.value)}
                onFocus={() => setCurrentFocus(index)}
                placeholder={`Belief ${index + 1}: What do you strongly believe about...`}
                className={cn(
                  'flex-1 p-3 border rounded-lg transition-all duration-200',
                  'bg-white/80 backdrop-blur-sm',
                  currentFocus === index
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : belief.trim().length > 0
                    ? 'border-green-500 bg-green-50'
                    : 'border-purple-200'
                )}
              />
            </div>
            
            {/* Satisfaction indicator */}
            {belief.trim().length > 0 && (
              <motion.div 
                className="absolute -right-2 -top-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion button */}
      <motion.button
        onClick={handleComplete}
        disabled={beliefs.filter(b => b.trim().length > 0).length < 3}
        className={cn(
          'w-full p-4 rounded-xl font-semibold transition-all duration-200',
          beliefs.filter(b => b.trim().length > 0).length >= 3
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        )}
        whileHover={beliefs.filter(b => b.trim().length > 0).length >= 3 ? { scale: 1.02 } : {}}
        whileTap={beliefs.filter(b => b.trim().length > 0).length >= 3 ? { scale: 0.98 } : {}}
      >
        {beliefs.filter(b => b.trim().length > 0).length >= 3 ? (
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>Complete Belief Identification</span>
          </div>
        ) : (
          <span>Complete at least 3 beliefs to continue</span>
        )}
      </motion.button>
    </motion.div>
  );
}

// ===== DAILY HABIT TRACKER INTERACTION =====
// For lessons about building consistent practices
export function DailyHabitTrackerInteraction({ 
  onComplete, 
  onProgress 
}: { 
  onComplete: (habits: any[]) => void;
  onProgress: (progress: number) => void;
}) {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Reflection', completed: false, streak: 0 },
    { id: 2, name: 'Mindful Breathing', completed: false, streak: 0 },
    { id: 3, name: 'Gratitude Practice', completed: false, streak: 0 },
    { id: 4, name: 'Evening Review', completed: false, streak: 0 },
    { id: 5, name: 'Learning Integration', completed: false, streak: 0 }
  ]);
  const [currentDay, setCurrentDay] = useState(1);
  const [totalProgress, setTotalProgress] = useState(0);

  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newStreak = habit.completed ? Math.max(0, habit.streak - 1) : habit.streak + 1;
        return { ...habit, completed: !habit.completed, streak: newStreak };
      }
      return habit;
    }));
    
    // Calculate progress
    const completedCount = habits.filter(h => h.completed).length;
    const progress = (completedCount / habits.length) * 100;
    setTotalProgress(progress);
    onProgress(progress);
  };

  const handleComplete = () => {
    onComplete(habits);
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-700 mb-2">Daily Habit Tracker</h3>
        <p className="text-sm text-green-600">Build consistent practices through daily tracking and streak building</p>
      </div>

      {/* Progress overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-700">Today's Progress</span>
          <span className="text-sm text-green-600">{Math.round(totalProgress)}%</span>
        </div>
        <div className="w-full bg-green-200 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* Habit list */}
      <div className="space-y-3 mb-6">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            className="bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                    habit.completed
                      ? 'bg-green-500 border-green-500 text-white scale-110'
                      : 'border-green-300 hover:border-green-500'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {habit.completed && <CheckCircle className="w-4 h-4" />}
                </button>
                <div>
                  <div className="font-medium text-green-800">{habit.name}</div>
                  <div className="text-sm text-green-600">Streak: {habit.streak} days</div>
                </div>
              </div>
              
              {/* Streak indicator */}
              {habit.streak > 0 && (
                <motion.div 
                  className="flex items-center gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Fire className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600">{habit.streak}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion button */}
      <motion.button
        onClick={handleComplete}
        disabled={totalProgress < 80}
        className={cn(
          'w-full p-4 rounded-xl font-semibold transition-all duration-200',
          totalProgress >= 80
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        )}
        whileHover={totalProgress >= 80 ? { scale: 1.02 } : {}}
        whileTap={totalProgress >= 80 ? { scale: 0.98 } : {}}
      >
        {totalProgress >= 80 ? (
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5" />
            <span>Complete Daily Practice</span>
          </div>
        ) : (
          <span>Complete at least 80% to continue</span>
        )}
      </motion.button>
    </motion.div>
  );
}

// ===== WISDOM QUOTE INTERPRETATION INTERACTION =====
// For lessons about interpreting philosophical quotes
export function WisdomQuoteInteraction({ 
  quote, 
  author, 
  onComplete, 
  onProgress 
}: { 
  quote: string;
  author: string;
  onComplete: (interpretation: any) => void;
  onProgress: (progress: number) => void;
}) {
  const [interpretation, setInterpretation] = useState('');
  const [lifeExamples, setLifeExamples] = useState<string[]>(['']);
  const [currentStep, setCurrentStep] = useState(0);
  const [insight, setInsight] = useState(0);

  const handleInterpretationChange = (value: string) => {
    setInterpretation(value);
    const progress = Math.min(100, (value.length / 50) * 100);
    onProgress(progress);
    
    // Dopamine reward: insight building
    if (value.length > 0 && interpretation === '') {
      setInsight(prev => Math.min(100, prev + 30));
    }
  };

  const addLifeExample = () => {
    setLifeExamples(prev => [...prev, '']);
  };

  const updateLifeExample = (index: number, value: string) => {
    const newExamples = [...lifeExamples];
    newExamples[index] = value;
    setLifeExamples(newExamples);
    
    // Progress based on examples
    const validExamples = newExamples.filter(e => e.trim().length > 0).length;
    const progress = Math.min(100, (validExamples / 3) * 100);
    onProgress(progress);
  };

  const handleComplete = () => {
    onComplete({
      interpretation,
      lifeExamples: lifeExamples.filter(e => e.trim().length > 0),
      insight
    });
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-amber-700 mb-2">Wisdom Interpretation</h3>
        <div className="bg-white/60 backdrop-blur-sm border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-lg italic text-amber-800 mb-2">"{quote}"</p>
          <p className="text-sm text-amber-600">— {author}</p>
        </div>
      </div>

      {/* Insight tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-amber-700">Insight Level</span>
          <span className="text-sm text-amber-600">{insight}%</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${insight}%` }}
          />
        </div>
      </div>

      {/* Interpretation input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-amber-700 mb-2">
          What does this quote mean to you personally?
        </label>
        <textarea
          value={interpretation}
          onChange={(e) => handleInterpretationChange(e.target.value)}
          placeholder="Share your personal interpretation of this wisdom..."
          className="w-full p-4 border border-amber-200 rounded-lg bg-white/80 backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
          rows={4}
        />
        <div className="text-xs text-amber-600 mt-1">
          {interpretation.length}/50+ characters recommended
        </div>
      </div>

      {/* Life examples */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-amber-700">
            How can you apply this wisdom in your life?
          </label>
          <button
            onClick={addLifeExample}
            className="p-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-600 hover:bg-amber-500/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {lifeExamples.map((example, index) => (
            <input
              key={index}
              type="text"
              value={example}
              onChange={(e) => updateLifeExample(index, e.target.value)}
              placeholder={`Life example ${index + 1}...`}
              className="w-full p-3 border border-amber-200 rounded-lg bg-white/60 backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
            />
          ))}
        </div>
      </div>

      {/* Completion button */}
      <motion.button
        onClick={handleComplete}
        disabled={interpretation.trim().length < 30 || lifeExamples.filter(e => e.trim().length > 0).length < 1}
        className={cn(
          'w-full p-4 rounded-xl font-semibold transition-all duration-200',
          interpretation.trim().length >= 30 && lifeExamples.filter(e => e.trim().length > 0).length >= 1
            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        )}
        whileHover={interpretation.trim().length >= 30 && lifeExamples.filter(e => e.trim().length > 0).length >= 1 ? { scale: 1.02 } : {}}
        whileTap={interpretation.trim().length >= 30 && lifeExamples.filter(e => e.trim().length > 0).length >= 1 ? { scale: 0.98 } : {}}
      >
        {interpretation.trim().length >= 30 && lifeExamples.filter(e => e.trim().length > 0).length >= 1 ? (
          <div className="flex items-center justify-center gap-2">
            <HeartHandshake className="w-5 h-5" />
            <span>Complete Wisdom Interpretation</span>
          </div>
        ) : (
          <span>Complete interpretation and at least one life example</span>
        )}
      </motion.button>
    </motion.div>
  );
}

// ===== CREATIVE RESPONSE INTERACTION =====
// For lessons requiring creative expression
export function CreativeResponseInteraction({ 
  prompt, 
  type, 
  onComplete, 
  onProgress 
}: { 
  prompt: string;
  type: 'poem' | 'art' | 'story' | 'mind_map';
  onComplete: (response: any) => void;
  onProgress: (progress: number) => void;
}) {
  const [response, setResponse] = useState('');
  const [creativity, setCreativity] = useState(0);
  const [inspiration, setInspiration] = useState(0);

  const handleResponseChange = (value: string) => {
    setResponse(value);
    const progress = Math.min(100, (value.length / 100) * 100);
    onProgress(progress);
    
    // Dopamine reward: creativity building
    if (value.length > 0 && response === '') {
      setCreativity(prev => Math.min(100, prev + 25));
      setInspiration(prev => Math.min(100, prev + 20));
    }
  };

  const handleComplete = () => {
    onComplete({
      response,
      type,
      creativity,
      inspiration
    });
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'poem': return <PenTool className="w-8 h-8" />;
      case 'art': return <Palette className="w-8 h-8" />;
      case 'story': return <FileText className="w-8 h-8" />;
      case 'mind_map': return <Brain className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'poem': return 'from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-600';
      case 'art': return 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-600';
      case 'story': return 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600';
      case 'mind_map': return 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600';
      default: return 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600';
    }
  };

  return (
    <motion.div 
      className={cn(
        'bg-gradient-to-r border rounded-xl p-6',
        getTypeColor()
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3',
          getTypeColor().replace('/10', '/20').replace('border-', 'bg-')
        )}>
          {getTypeIcon()}
        </div>
        <h3 className="text-lg font-bold mb-2 capitalize">Creative {type} Response</h3>
        <p className="text-sm opacity-80">{prompt}</p>
      </div>

      {/* Creativity and inspiration trackers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Creativity</span>
            <span className="text-sm">{creativity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${creativity}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Inspiration</span>
            <span className="text-sm">{inspiration}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${inspiration}%` }}
            />
          </div>
        </div>
      </div>

      {/* Creative input */}
      <div className="mb-6">
        <textarea
          value={response}
          onChange={(e) => handleResponseChange(e.target.value)}
          placeholder={`Express your ${type} response here...`}
          className="w-full p-4 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          rows={6}
        />
        <div className="text-xs text-gray-600 mt-1">
          {response.length}/100+ characters recommended
        </div>
      </div>

      {/* Completion button */}
      <motion.button
        onClick={handleComplete}
        disabled={response.trim().length < 50}
        className={cn(
          'w-full p-4 rounded-xl font-semibold transition-all duration-200',
          response.trim().length >= 50
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        )}
        whileHover={response.trim().length >= 50 ? { scale: 1.02 } : {}}
        whileTap={response.trim().length >= 50 ? { scale: 0.98 } : {}}
      >
        {response.trim().length >= 50 ? (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Complete Creative Response</span>
          </div>
        ) : (
          <span>Complete at least 50 characters to continue</span>
        )}
      </motion.button>
    </motion.div>
  );
} 