'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  MessageCircle, 
  Send, 
  Loader2, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Quote,
  Lightbulb,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademyAIProps {
  mode: 'tutor' | 'evaluator' | 'coach';
  lesson: any;
  userResponse?: any;
  onResponse?: (response: string) => void;
}

export default function AcademyAI({ mode, lesson, userResponse, onResponse }: AcademyAIProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [showResponse, setShowResponse] = useState(false);

  const getSystemPrompt = () => {
    switch (mode) {
      case 'tutor':
        return "You are Plato, guiding by Socratic questioning. Invite brief answers, surface contradictions, and use vivid images. Keep each turn under 80 words. Encourage aporia as progress toward seeing the Forms.";
      case 'evaluator':
        return "You are a Platonic assessor. Score artifacts with the rubric; return JSON {scores:{}, notes:'', mastery_deltas:{}}. Point out one inconsistency and one improvement in plain language.";
      case 'coach':
        return "You are a Platonic life-coach. Connect the learner's stated Good to one tiny practice tomorrow. Keep under 25 words; be kind and concrete.";
      default:
        return "";
    }
  };

  const getModeInfo = () => {
    switch (mode) {
      case 'tutor':
        return {
          title: 'Plato\'s Guidance',
          description: 'Socratic questioning to deepen understanding',
          icon: Brain,
          color: 'from-blue-500/20 to-indigo-500/20',
          iconColor: 'text-blue-400'
        };
      case 'evaluator':
        return {
          title: 'Platonic Assessment',
          description: 'Evaluate your work with wisdom',
          icon: Target,
          color: 'from-purple-500/20 to-violet-500/20',
          iconColor: 'text-purple-400'
        };
      case 'coach':
        return {
          title: 'Life Coach',
          description: 'Connect learning to daily practice',
          icon: MessageCircle,
          color: 'from-green-500/20 to-emerald-500/20',
          iconColor: 'text-green-400'
        };
    }
  };

  const handleAIRequest = async () => {
    setIsLoading(true);
    setShowResponse(false);

    try {
      // Simulate AI response based on mode and lesson context
      const response = await simulateAIResponse();
      setAiResponse(response);
      setShowResponse(true);
      onResponse?.(response);
    } catch (error) {
      console.error('AI request failed:', error);
      setAiResponse('I apologize, but I cannot provide guidance at this moment. Please try again.');
      setShowResponse(true);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const responses = {
      tutor: [
        "Tell me, what do you think courage truly is? Not the absence of fear, but something deeper. Consider: can a person be courageous without wisdom?",
        "You speak of justice, but I wonder: is it the same in the soul as in the city? What happens when the parts are not in harmony?",
        "Ah, you mention the Forms. But how do we know they exist? Through the senses, or through reason? Think of the triangle you cannot see but can understand.",
        "Your definition has merit, yet I must ask: what of the exceptions? If courage is facing danger, what of the fool who rushes in without thought?",
        "You seek knowledge, but first we must acknowledge our ignorance. This aporia you feel is the beginning of wisdom, not its end."
      ],
      evaluator: [
        "Your reflection shows engagement with the material. I notice you've grasped the distinction between opinion and knowledge. Consider: how might you apply this to a current belief you hold?",
        "Well reasoned, though I see one area for growth: you've identified the contradiction but not yet found the synthesis. What would a higher truth look like here?",
        "Your understanding of the Forms is developing. The inconsistency I see is in how you apply this to concrete situations. Practice seeing the universal in the particular.",
        "Good work on the Socratic method. Your improvement opportunity: ask not just 'what is it?' but 'what is it not?' This will sharpen your definitions.",
        "You've made progress in dialectical thinking. One suggestion: when you encounter aporia, don't rush to resolve it. Sit with the tension; wisdom emerges from this discomfort."
      ],
      coach: [
        "Tomorrow, question one assumption you hold about success. Notice what arises when you let go of certainty.",
        "Practice seeing the Form behind one beautiful thing today. What makes it beautiful beyond its appearance?",
        "When you feel anger, pause and ask: which part of your soul is speaking? Let reason guide the response.",
        "Choose one 'shadow' in your life and seek its source. What would the truth look like?",
        "Before making a decision today, ask: does this serve the Good, or merely my appetites? Let wisdom guide your choice."
      ]
    };

    const modeResponses = responses[mode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const modeInfo = getModeInfo();
  const IconComponent = modeInfo.icon;

  return (
    <div className="space-y-4">
      {/* AI Mode Header */}
      <div className={cn(
        'p-6 rounded-2xl border',
        `bg-gradient-to-br ${modeInfo.color} border-border`
      )}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', modeInfo.color)}>
            <IconComponent className={cn('w-6 h-6', modeInfo.iconColor)} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">{modeInfo.title}</h3>
            <p className="text-sm text-muted">{modeInfo.description}</p>
          </div>
        </div>

        {/* Context */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Quote className="w-4 h-4 text-muted" />
            <span className="text-muted">Current Lesson:</span>
            <span className="text-text font-medium">{lesson.title}</span>
          </div>
          {userResponse && (
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-muted" />
              <span className="text-muted">Your Response:</span>
              <span className="text-text font-medium">
                {typeof userResponse === 'string' 
                  ? userResponse.substring(0, 50) + (userResponse.length > 50 ? '...' : '')
                  : 'Submitted'
                }
              </span>
            </div>
          )}
        </div>
      </div>

      {/* AI Interaction */}
      <div className="space-y-4">
        {!showResponse ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-muted" />
            </div>
            <h4 className="text-lg font-semibold text-text mb-2">
              {mode === 'tutor' && 'Seek Plato\'s Guidance'}
              {mode === 'evaluator' && 'Request Assessment'}
              {mode === 'coach' && 'Get Life Coaching'}
            </h4>
            <p className="text-muted mb-6">
              {mode === 'tutor' && 'Ask Plato to guide you deeper into this lesson through Socratic questioning.'}
              {mode === 'evaluator' && 'Get a Platonic assessment of your work with specific feedback.'}
              {mode === 'coach' && 'Receive practical guidance for applying this wisdom to your daily life.'}
            </p>
            
            <button
              onClick={handleAIRequest}
              disabled={isLoading}
              className={cn(
                'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors mx-auto',
                isLoading
                  ? 'bg-surface-2 text-muted cursor-not-allowed'
                  : `bg-gradient-to-r ${modeInfo.color.replace('/20', '/30')} text-white hover:opacity-90`
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Seeking Wisdom...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>
                    {mode === 'tutor' && 'Ask Plato'}
                    {mode === 'evaluator' && 'Get Assessment'}
                    {mode === 'coach' && 'Get Coaching'}
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* AI Response */}
            <div className="p-6 bg-surface border border-border rounded-xl">
              <div className="flex items-start space-x-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', modeInfo.color)}>
                  <IconComponent className={cn('w-4 h-4', modeInfo.iconColor)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-text">{modeInfo.title}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <Star className="w-3 h-3 text-yellow-500" />
                      <Star className="w-3 h-3 text-yellow-500" />
                    </div>
                  </div>
                  <p className="text-text leading-relaxed">{aiResponse}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowResponse(false)}
                className="px-4 py-2 text-muted hover:text-text transition-colors"
              >
                Ask Another Question
              </button>
              
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-surface-2 text-text rounded-lg hover:bg-surface-3 transition-colors">
                  Save Response
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Continue Learning
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mode-specific Tips */}
      <div className="p-4 bg-surface-2 rounded-lg">
        <div className="flex items-start space-x-3">
          <Compass className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-text mb-1">
              {mode === 'tutor' && 'Socratic Method Tips'}
              {mode === 'evaluator' && 'Assessment Guidelines'}
              {mode === 'coach' && 'Coaching Approach'}
            </h5>
            <p className="text-sm text-muted">
              {mode === 'tutor' && 'Plato will ask questions to help you discover truth through your own reasoning. Be open to uncertainty and contradiction.'}
              {mode === 'evaluator' && 'The assessment focuses on your engagement with Platonic concepts and your ability to apply them thoughtfully.'}
              {mode === 'coach' && 'Coaching connects philosophical insights to practical daily actions. Focus on small, concrete steps toward wisdom.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
