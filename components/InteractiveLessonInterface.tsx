import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Scale, Leaf, BookOpen, Target, Heart, Zap, Star, 
  Clock, Lightbulb, MessageCircle, GraduationCap, Users, Eye, 
  Compass, ArrowRight, CheckCircle, Circle, Sparkles, 
  PenTool, Palette, FileText, Map, Camera, Mic, Video, 
  Send, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type AcademyLesson } from '@/lib/academy-curriculum';

interface InteractiveLessonInterfaceProps {
  lesson: AcademyLesson;
  onComplete: (lessonId: string, milestones: any) => void;
  onSaveProgress: (lessonId: string, data: any) => void;
}

export default function InteractiveLessonInterface({ 
  lesson, 
  onComplete, 
  onSaveProgress 
}: InteractiveLessonInterfaceProps) {
  const [currentSection, setCurrentSection] = useState<'teaching' | 'question' | 'practice' | 'reading' | 'quote'>('teaching');
  const [userInputs, setUserInputs] = useState({
    teaching: '',
    question: '',
    practice: '',
    reading: '',
    quote: ''
  });
  const [aiResponses, setAiResponses] = useState({
    teaching: '',
    question: '',
    practice: '',
    reading: '',
    quote: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    teaching: true,
    question: false,
    practice: false,
    reading: false,
    quote: false
  });

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(`lesson_${lesson.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserInputs(data.userInputs || userInputs);
        setAiResponses(data.aiResponses || aiResponses);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [lesson.id]);

  // Save progress whenever inputs change
  useEffect(() => {
    const progress = { userInputs, aiResponses };
    localStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(progress));
    onSaveProgress(lesson.id, progress);
  }, [userInputs, aiResponses, lesson.id, onSaveProgress]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (section: keyof typeof userInputs, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const getAIGuidance = async (section: keyof typeof userInputs, prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          context: {
            page: 'academy_lesson',
            focusVirtue: lesson.id.split('-')[0],
            lessonTitle: lesson.title,
            section: section,
            userInput: userInputs[section]
          }
        })
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let content = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    content += parsed.content;
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
          
          setAiResponses(prev => ({
            ...prev,
            [section]: content
          }));
        }
      }
    } catch (error) {
      console.error('Error getting AI guidance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markSectionComplete = (section: keyof typeof lesson.interactiveElements) => {
    const updatedLesson = {
      ...lesson,
      interactiveElements: {
        ...lesson.interactiveElements,
        [section]: {
          ...lesson.interactiveElements[section],
          completed: true
        }
      },
      milestones: {
        ...lesson.milestones,
        [`${section}Completed`]: true
      }
    };

    // Check if all sections are complete
    const allCompleted = Object.values(updatedLesson.interactiveElements).every(el => el.completed);
    if (allCompleted) {
      updatedLesson.milestones.allCompleted = true;
      
      // Log milestone to journal
      logMilestoneToJournal();
      
      onComplete(lesson.id, updatedLesson.milestones);
    }

    onSaveProgress(lesson.id, { lesson: updatedLesson, userInputs, aiResponses });
  };

  const logMilestoneToJournal = async () => {
    try {
      const response = await fetch('/api/academy/milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          moduleName: lesson.id.split('-')[0].charAt(0).toUpperCase() + lesson.id.split('-')[0].slice(1),
          milestones: lesson.milestones,
          userInputs,
          aiResponses
        })
      });

      if (response.ok) {
        console.log('Milestone logged to journal successfully');
      } else {
        console.error('Failed to log milestone to journal');
      }
    } catch (error) {
      console.error('Error logging milestone to journal:', error);
    }
  };

  const renderSection = (section: keyof typeof lesson.interactiveElements) => {
    const element = lesson.interactiveElements[section];
    const isExpanded = expandedSections[section];
    const userInput = userInputs[section];
    const aiResponse = aiResponses[section];
    const isCompleted = element.completed;

    const sectionIcons = {
      teaching: Brain,
      question: Target,
      practice: Zap,
      reading: BookOpen,
      quote: MessageCircle
    };

    const sectionColors = {
      teaching: 'primary',
      question: 'courage',
      practice: 'courage',
      reading: 'justice',
      quote: 'temperance'
    };

    const IconComponent = sectionIcons[section];
    const colorClass = sectionColors[section];

    return (
      <motion.div
        key={section}
        className={cn(
          'border rounded-xl overflow-hidden transition-all duration-200',
          isCompleted 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-border bg-surface'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Object.keys(lesson.interactiveElements).indexOf(section) * 0.1 }}
      >
        {/* Section Header */}
        <button
          onClick={() => toggleSection(section)}
          className={cn(
            'w-full p-4 flex items-center justify-between text-left transition-colors',
            isCompleted 
              ? 'bg-green-500/10 text-green-600' 
              : `bg-${colorClass}/10 text-${colorClass}`
          )}
        >
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isCompleted 
                ? 'bg-green-500/20 text-green-600' 
                : `bg-${colorClass}/20 text-${colorClass}`
            )}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <IconComponent className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold capitalize">
                {section === 'teaching' && 'Teaching & Understanding'}
                {section === 'question' && 'Reflection Question'}
                {section === 'practice' && 'Practice Exercise'}
                {section === 'reading' && 'Reading Analysis'}
                {section === 'quote' && 'Wisdom Quote'}
              </h3>
              <p className="text-sm opacity-80">
                {isCompleted ? 'Completed' : element.required ? 'Required' : 'Optional'}
              </p>
            </div>
          </div>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {/* Section Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 space-y-4"
            >
              {/* Original Content */}
              <div className="space-y-3">
                {section === 'teaching' && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Teaching
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.teaching}</p>
                  </div>
                )}

                {section === 'question' && (
                  <div className="bg-courage/5 border border-courage/20 rounded-lg p-4">
                    <h4 className="font-medium text-courage mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Reflection Question
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.question}</p>
                  </div>
                )}

                {section === 'practice' && (
                  <div className="bg-courage/5 border border-courage/20 rounded-lg p-4">
                    <h4 className="font-medium text-courage mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Practice Exercise
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.practice}</p>
                    {element.outsideRequirements && (element as any).outsideRequirements.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-courage mb-2">Outside Requirements:</h5>
                        <ul className="space-y-1">
                          {(element as any).outsideRequirements.map((req: string, idx: number) => (
                            <li key={idx} className="text-sm text-text flex items-center gap-2">
                              <Circle className="w-3 h-3 text-courage" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {section === 'reading' && (
                  <div className="bg-justice/5 border border-justice/20 rounded-lg p-4">
                    <h4 className="font-medium text-justice mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Recommended Reading
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.reading}</p>
                    {(element as any).analysisQuestions && (element as any).analysisQuestions.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-justice mb-2">Analysis Questions:</h5>
                        <ul className="space-y-1">
                          {(element as any).analysisQuestions.map((q: string, idx: number) => (
                            <li key={idx} className="text-sm text-text flex items-center gap-2">
                              <Target className="w-3 h-3 text-justice" />
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {section === 'quote' && (
                  <div className="bg-temperance/5 border border-temperance/20 rounded-lg p-4">
                    <h4 className="font-medium text-temperance mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Wisdom Quote
                    </h4>
                    <p className="text-sm text-text leading-relaxed italic">"{lesson.quote}"</p>
                    <p className="text-xs text-muted mt-1">— {lesson.author}</p>
                  </div>
                )}
              </div>

              {/* Interactive Elements */}
              <div className="space-y-4">
                {/* AI Guidance Button */}
                <button
                  onClick={() => getAIGuidance(section, element.aiPrompt || `Help me with the ${section} section of this lesson`)}
                  disabled={isLoading}
                  className={cn(
                    'w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-colors',
                    `bg-${colorClass}/10 border border-${colorClass}/20 text-${colorClass} hover:bg-${colorClass}/20`,
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Get AI Guidance</span>
                </button>

                {/* AI Response Display */}
                {aiResponse && (
                  <div className={cn(
                    'p-4 rounded-lg border',
                    `bg-${colorClass}/5 border-${colorClass}/20`
                  )}>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Guidance
                    </h5>
                    <p className="text-sm text-text leading-relaxed">{aiResponse}</p>
                  </div>
                )}

                {/* User Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">
                    Your Response ({element.minWords || 0} words minimum)
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => handleInputChange(section, e.target.value)}
                    placeholder={`Share your thoughts on the ${section} section...`}
                    className="w-full p-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    rows={4}
                  />
                  <div className="text-xs text-muted">
                    {userInput.split(/\s+/).filter(word => word.length > 0).length} words
                  </div>
                </div>

                {/* Completion Button */}
                <button
                  onClick={() => markSectionComplete(section)}
                  disabled={!userInput.trim() || userInput.split(/\s+/).filter(word => word.length > 0).length < (element.minWords || 0)}
                  className={cn(
                    'w-full p-3 rounded-lg font-medium transition-colors',
                    userInput.trim() && userInput.split(/\s+/).filter(word => word.length > 0).length >= (element.minWords || 0)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-surface-2 text-muted cursor-not-allowed'
                  )}
                >
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-text">{lesson.title}</h2>
        <p className="text-muted">{lesson.subtitle}</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{lesson.estimatedTotalTime} minutes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span className="capitalize">{lesson.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text">Lesson Progress</span>
          <span className="text-sm text-muted">
            {Object.values(lesson.interactiveElements).filter(el => el.completed).length} of {Object.keys(lesson.interactiveElements).length} sections
          </span>
        </div>
        <div className="w-full bg-surface-2 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(Object.values(lesson.interactiveElements).filter(el => el.completed).length / Object.keys(lesson.interactiveElements).length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Interactive Sections */}
      <div className="space-y-4">
        {Object.keys(lesson.interactiveElements).map((section) => 
          renderSection(section as keyof typeof lesson.interactiveElements)
        )}
      </div>

      {/* Lesson Completion */}
      {lesson.milestones.allCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">Lesson Completed!</h3>
          <p className="text-green-600 mb-4">
            You've successfully completed all sections of this lesson. Your wisdom grows!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>+{Object.values(lesson.virtueGrants).reduce((sum, val) => sum + (val || 0), 0)} virtue points earned</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 