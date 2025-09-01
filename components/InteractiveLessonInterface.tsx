import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Scale, Leaf, BookOpen, Target, Heart, Zap, Star, 
  Clock, Lightbulb, MessageCircle, GraduationCap, Users, Eye, 
  Compass, ArrowRight, CheckCircle, Circle, Sparkles, 
  PenTool, Palette, FileText, Map, Camera, Mic, Video, 
  Send, Loader2, ChevronDown, ChevronUp, Plus, Minus, 
  CheckSquare, Square, List, Grid3X3, TrendingUp,
  Award, Trophy, Flame, HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type AcademyLesson } from '@/lib/academy-curriculum';

interface InteractiveLessonInterfaceProps {
  lesson: AcademyLesson;
  onComplete: (lessonId: string, milestones: any) => void;
  onSaveProgress: (lessonId: string, data: any) => void;
}

// Enhanced interactive elements with unique interaction types
interface EnhancedInteractiveElement {
  type: string;
  required: boolean;
  completed: boolean;
  interactionData: any;
  aiPrompt?: string;
  minWords?: number;
  outsideRequirements?: string[];
  verificationMethod?: string;
  analysisQuestions?: string[];
  creativeResponse?: string;
  interpretationPrompt?: string;
  applicationExercise?: string;
}

export default function InteractiveLessonInterface({ 
  lesson, 
  onComplete, 
  onSaveProgress 
}: InteractiveLessonInterfaceProps) {
  const [currentSection, setCurrentSection] = useState<'teaching' | 'question' | 'practice' | 'reading' | 'quote'>('teaching');
  const [userInputs, setUserInputs] = useState({
    teaching: { type: 'ai_dialogue', responses: [], insights: [] },
    question: { type: 'personal_reflection', reflections: [], aiInsights: [] },
    practice: { type: 'real_world_exercise', exercises: [], evidence: [], progress: 0 },
    reading: { type: 'text_analysis', analysis: [], creativeResponse: null, questions: [] },
    quote: { type: 'personal_interpretation', interpretation: '', application: '', lifeExamples: [] }
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
  const [interactionStates, setInteractionStates] = useState({
    teaching: { currentStep: 0, satisfaction: 0 },
    question: { reflectionDepth: 0, clarity: 0 },
    practice: { engagement: 0, completion: 0 },
    reading: { comprehension: 0, creativity: 0 },
    quote: { insight: 0, application: 0 }
  });

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(`lesson_${lesson.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserInputs(data.userInputs || userInputs);
        setAiResponses(data.aiResponses || aiResponses);
        setInteractionStates(data.interactionStates || interactionStates);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [lesson.id]);

  // Save progress whenever inputs change
  useEffect(() => {
    const progress = { userInputs, aiResponses, interactionStates };
    localStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(progress));
    onSaveProgress(lesson.id, progress);
  }, [userInputs, aiResponses, interactionStates, lesson.id, onSaveProgress]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced interaction handlers with dopamine mechanics
  const handleTeachingInteraction = (type: string, data: any) => {
    setUserInputs(prev => ({
      ...prev,
      teaching: {
        ...prev.teaching,
        responses: [...prev.teaching.responses, { type, data, timestamp: Date.now() }]
      }
    }));
    
    // Dopamine reward: visual feedback and progress
    setInteractionStates(prev => ({
      ...prev,
      teaching: { 
        ...prev.teaching, 
        currentStep: prev.teaching.currentStep + 1,
        satisfaction: Math.min(100, prev.teaching.satisfaction + 25)
      }
    }));
  };

  const handleQuestionReflection = (reflection: string, depth: number) => {
    setUserInputs(prev => ({
      ...prev,
      question: {
        ...prev.question,
        reflections: [...prev.question.reflections, { text: reflection, depth, timestamp: Date.now() }]
      }
    }));
    
    // Dopamine reward: reflection depth tracking
    setInteractionStates(prev => ({
      ...prev,
      question: { 
        ...prev.question, 
        reflectionDepth: Math.max(prev.question.reflectionDepth, depth),
        clarity: Math.min(100, prev.question.clarity + 20)
      }
    }));
  };

  const handlePracticeExercise = (exercise: any, type: string) => {
    setUserInputs(prev => ({
      ...prev,
      practice: {
        ...prev.practice,
        exercises: [...prev.practice.exercises, { ...exercise, type, timestamp: Date.now() }],
        progress: Math.min(100, prev.practice.progress + 20)
      }
    }));
    
    // Dopamine reward: progress visualization
    setInteractionStates(prev => ({
      ...prev,
      practice: { 
        ...prev.practice, 
        engagement: Math.min(100, prev.practice.engagement + 30),
        completion: Math.min(100, prev.practice.completion + 25)
      }
    }));
  };

  const handleReadingAnalysis = (analysis: any, type: string) => {
    setUserInputs(prev => ({
      ...prev,
      reading: {
        ...prev.reading,
        analysis: [...prev.reading.analysis, { ...analysis, type, timestamp: Date.now() }]
      }
    }));
    
    // Dopamine reward: comprehension tracking
    setInteractionStates(prev => ({
      ...prev,
      reading: { 
        ...prev.reading, 
        comprehension: Math.min(100, prev.reading.comprehension + 25),
        creativity: Math.min(100, prev.reading.creativity + 20)
      }
    }));
  };

  const handleQuoteInterpretation = (interpretation: string, application: string) => {
    setUserInputs(prev => ({
      ...prev,
      quote: {
        ...prev.quote,
        interpretation,
        application,
        lifeExamples: [...prev.quote.lifeExamples, { interpretation, application, timestamp: Date.now() }]
      }
    }));
    
    // Dopamine reward: insight tracking
    setInteractionStates(prev => ({
      ...prev,
      quote: { 
        ...prev.quote, 
        insight: Math.min(100, prev.quote.insight + 40),
        application: Math.min(100, prev.quote.application + 30)
      }
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
        const data = await response.json();
        setAiResponses(prev => ({
          ...prev,
          [section]: data.response
        }));
      }
    } catch (error) {
      console.error('Error getting AI guidance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markSectionComplete = (section: keyof typeof userInputs) => {
    // Mark section as complete with dopamine reward
    const progress = { userInputs, aiResponses, interactionStates };
    onComplete(lesson.id, progress);
  };

  // Unique interaction components for each lesson type
  const renderTeachingInteraction = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="font-medium text-blue-600 mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Interactive Learning Journey
        </h4>
        
        {/* Step-by-step learning path */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {interactionStates.teaching.currentStep + 1}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Concept Understanding</div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${interactionStates.teaching.satisfaction}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Interactive elements */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTeachingInteraction('concept_map', { type: 'mind_map' })}
              className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-600 hover:bg-blue-500/30 transition-all hover:scale-105"
            >
              <Brain className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Mind Map</span>
            </button>
            <button
              onClick={() => handleTeachingInteraction('question_generation', { type: 'curiosity' })}
              className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 hover:bg-purple-500/30 transition-all hover:scale-105"
            >
              <Target className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Ask Questions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionInteraction = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Deep Reflection Journey
        </h4>
        
        {/* Reflection depth tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reflection Depth</span>
            <span className="text-sm text-green-600">{interactionStates.question.reflectionDepth}/5</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(interactionStates.question.reflectionDepth / 5) * 100}%` }}
            ></div>
          </div>
          
          {/* Reflection prompts */}
          <div className="space-y-2">
            {['Surface Level', 'Personal Connection', 'Life Application', 'Future Impact', 'Deep Wisdom'].map((level, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionReflection(`Reflection at ${level}`, idx + 1)}
                disabled={idx > interactionStates.question.reflectionDepth}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-all',
                  idx <= interactionStates.question.reflectionDepth
                    ? 'bg-green-500/20 border border-green-500/30 text-green-600 hover:bg-green-500/30'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{level}</span>
                  {idx <= interactionStates.question.reflectionDepth && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeInteraction = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
        <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Practice Progress Tracker
        </h4>
        
        {/* Progress visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Practice Completion</span>
            <span className="text-sm text-orange-600">{interactionStates.practice.completion}%</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${interactionStates.practice.completion}%` }}
            ></div>
          </div>
          
          {/* Practice exercises */}
          <div className="grid grid-cols-1 gap-2">
            {['Morning Reflection', 'Daily Practice', 'Evening Review', 'Weekly Assessment', 'Monthly Integration'].map((exercise, idx) => (
              <button
                key={idx}
                onClick={() => handlePracticeExercise({ name: exercise, completed: true }, 'daily_practice')}
                className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-600 hover:bg-orange-500/30 transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{exercise}</span>
                  <CheckSquare className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReadingInteraction = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-lg p-4">
        <h4 className="font-medium text-indigo-600 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Reading Comprehension & Creativity
        </h4>
        
        {/* Comprehension tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Understanding Level</span>
            <span className="text-sm text-indigo-600">{interactionStates.reading.comprehension}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${interactionStates.reading.comprehension}%` }}
            ></div>
          </div>
          
          {/* Interactive analysis tools */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleReadingAnalysis({ type: 'key_insights', insights: [] }, 'analysis')}
              className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-600 hover:bg-indigo-500/30 transition-all hover:scale-105"
            >
              <Lightbulb className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Key Insights</span>
            </button>
            <button
              onClick={() => handleReadingAnalysis({ type: 'creative_response', response: null }, 'creativity')}
              className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-600 hover:bg-blue-500/30 transition-all hover:scale-105"
            >
              <Palette className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Creative Response</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuoteInteraction = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4">
        <h4 className="font-medium text-amber-600 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Wisdom Application
        </h4>
        
        {/* Insight tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Insight Level</span>
            <span className="text-sm text-amber-600">{interactionStates.quote.insight}%</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${interactionStates.quote.insight}%` }}
            ></div>
          </div>
          
          {/* Life application examples */}
          <div className="space-y-2">
            <button
              onClick={() => handleQuoteInterpretation('Personal interpretation', 'Daily application')}
              className="w-full p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-600 hover:bg-amber-500/30 transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Share Life Example</span>
                <Heart className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = (section: keyof typeof userInputs, element: EnhancedInteractiveElement) => {
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
      teaching: 'blue',
      question: 'green',
      practice: 'orange',
      reading: 'indigo',
      quote: 'amber'
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
              : `bg-${colorClass}-500/10 text-${colorClass}-600`
          )}
        >
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isCompleted 
                ? 'bg-green-500/20 text-green-600' 
                : `bg-${colorClass}-500/20 text-${colorClass}-600`
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
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Teaching
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.teaching}</p>
                  </div>
                )}

                {section === 'question' && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Reflection Question
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.question}</p>
                  </div>
                )}

                {section === 'practice' && (
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Practice Exercise
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.practice}</p>
                    {element.outsideRequirements && element.outsideRequirements.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-orange-600 mb-2">Outside Requirements:</h5>
                        <ul className="space-y-1">
                          {element.outsideRequirements.map((req: string, idx: number) => (
                            <li key={idx} className="text-sm text-text flex items-center gap-2">
                              <Circle className="w-3 h-3 text-orange-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {section === 'reading' && (
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-indigo-600 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Recommended Reading
                    </h4>
                    <p className="text-sm text-text leading-relaxed">{lesson.reading}</p>
                    {element.analysisQuestions && element.analysisQuestions.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-indigo-600 mb-2">Analysis Questions:</h5>
                        <ul className="space-y-1">
                          {element.analysisQuestions.map((q: string, idx: number) => (
                            <li key={idx} className="text-sm text-text flex items-center gap-2">
                              <Target className="w-3 h-3 text-indigo-500" />
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {section === 'quote' && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-amber-600 mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Wisdom Quote
                    </h4>
                    <p className="text-sm text-text leading-relaxed italic">"{lesson.quote}"</p>
                    <p className="text-xs text-muted mt-1">— {lesson.author}</p>
                  </div>
                )}
              </div>

              {/* Unique Interactive Elements */}
              <div className="space-y-4">
                {section === 'teaching' && renderTeachingInteraction()}
                {section === 'question' && renderQuestionInteraction()}
                {section === 'practice' && renderPracticeInteraction()}
                {section === 'reading' && renderReadingInteraction()}
                {section === 'quote' && renderQuoteInteraction()}

                {/* AI Guidance Button */}
                <button
                  onClick={() => getAIGuidance(section, element.aiPrompt || `Help me with the ${section} section of this lesson`)}
                  disabled={isLoading}
                  className={cn(
                    'w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-colors',
                    `bg-${colorClass}-500/10 border border-${colorClass}-500/20 text-${colorClass}-600 hover:bg-${colorClass}-500/20`,
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
                    `bg-${colorClass}-500/5 border-${colorClass}-500/20`
                  )}>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Guidance
                    </h5>
                    <p className="text-sm text-text leading-relaxed">{aiResponse}</p>
                  </div>
                )}

                {/* Completion Button */}
                <button
                  onClick={() => markSectionComplete(section)}
                  disabled={false}
                  className={cn(
                    'w-full p-3 rounded-lg font-medium transition-all hover:scale-105',
                    'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'
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
            <span>{lesson.estimatedTime} minutes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span className="capitalize">{lesson.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-courage/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text">Your Progress</h3>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600">Achievement Unlocked!</span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(interactionStates).map(([section, state]) => (
            <div key={section} className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {Math.round(Object.values(state)[0] || 0)}
                </span>
              </div>
              <div className="text-xs text-muted capitalize">{section}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sections */}
      <div className="space-y-4">
        {Object.entries(lesson.interactiveElements || {}).map(([section, element]) =>
          renderSection(section as keyof typeof userInputs, element as EnhancedInteractiveElement)
        )}
      </div>
    </div>
  );
} 