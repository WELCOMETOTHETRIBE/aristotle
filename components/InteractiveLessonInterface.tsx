import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Scale, Leaf, BookOpen, Target, Heart, Zap, Star, 
  Clock, Lightbulb, MessageCircle, GraduationCap, Users, Eye, 
  Compass, ArrowRight, CheckCircle, Circle, Sparkles, 
  PenTool, Palette, FileText, Map, Camera, Mic, Video, 
  Send, Loader2, ChevronDown, ChevronUp, Plus, Minus, 
  CheckSquare, Square, List, Grid3X3, TrendingUp,
  Award, Trophy, Flame, HeartHandshake, BookMarked, Quote,
  Search, Filter, Download, Upload, Share, Copy, Edit,
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Calendar, Timer, Flag, Check, X, AlertTriangle, Info,
  ThumbsUp, ThumbsDown, Bookmark, Star as StarIcon,
  ArrowUp, ArrowDown, RotateCcw, RefreshCw, Settings,
  User, Users2, Globe, Home, Briefcase, School, Heart as HeartIcon
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
  const [completedSections, setCompletedSections] = useState({
    teaching: false,
    question: false,
    practice: false,
    reading: false,
    quote: false
  });
  const [teachingProgress, setTeachingProgress] = useState({
    conceptsUnderstood: 0,
    questionsGenerated: 0,
    connectionsMade: 0,
    applicationsIdentified: 0
  });
  const [activeTeachingStep, setActiveTeachingStep] = useState(0);
  const [interactiveData, setInteractiveData] = useState({
    conceptMap: [] as string[],
    questions: [] as string[],
    connections: [] as { from: string; to: string; type: string }[],
    actionPlan: [] as { action: string; timeline: string; priority: 'high' | 'medium' | 'low' }[],
    challenges: [] as { challenge: string; solution: string; confidence: number }[],
    examples: [] as { context: string; example: string; relevance: number }[]
  });

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(`lesson_${lesson.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserInputs(data.userInputs || userInputs);
        setAiResponses(data.aiResponses || aiResponses);
        setCompletedSections(data.completedSections || completedSections);
        setTeachingProgress(data.teachingProgress || teachingProgress);
        setInteractiveData(data.interactiveData || interactiveData);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [lesson.id]);

  // Save progress whenever inputs change
  useEffect(() => {
    const progress = { userInputs, aiResponses, completedSections, teachingProgress, interactiveData };
    localStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(progress));
    onSaveProgress(lesson.id, progress);
  }, [userInputs, aiResponses, completedSections, teachingProgress, interactiveData, lesson.id, onSaveProgress]);

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
            userInput: userInputs[section],
            interactiveData: interactiveData
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
    setCompletedSections(prev => ({
      ...prev,
      [section]: true
    }));
    
    // Check if all sections are complete
    const allComplete = Object.values({...completedSections, [section]: true}).every(Boolean);
    if (allComplete) {
      onComplete(lesson.id, { userInputs, aiResponses, completedSections: {...completedSections, [section]: true}, interactiveData });
    }
  };

  const updateTeachingProgress = (type: keyof typeof teachingProgress) => {
    setTeachingProgress(prev => ({
      ...prev,
      [type]: Math.min(100, prev[type] + 25)
    }));
  };

  const addConcept = (concept: string) => {
    if (concept.trim() && !interactiveData.conceptMap.includes(concept.trim())) {
      setInteractiveData(prev => ({
        ...prev,
        conceptMap: [...prev.conceptMap, concept.trim()]
      }));
      updateTeachingProgress('conceptsUnderstood');
    }
  };

  const addQuestion = (question: string) => {
    if (question.trim() && !interactiveData.questions.includes(question.trim())) {
      setInteractiveData(prev => ({
        ...prev,
        questions: [...prev.questions, question.trim()]
      }));
      updateTeachingProgress('questionsGenerated');
    }
  };

  const addConnection = (from: string, to: string, type: string) => {
    const connection = { from, to, type };
    setInteractiveData(prev => ({
      ...prev,
      connections: [...prev.connections, connection]
    }));
    updateTeachingProgress('connectionsMade');
  };

  const addActionPlan = (action: string, timeline: string, priority: 'high' | 'medium' | 'low') => {
    setInteractiveData(prev => ({
      ...prev,
      actionPlan: [...prev.actionPlan, { action, timeline, priority }]
    }));
    updateTeachingProgress('applicationsIdentified');
  };

  const addChallenge = (challenge: string, solution: string, confidence: number) => {
    setInteractiveData(prev => ({
      ...prev,
      challenges: [...prev.challenges, { challenge, solution, confidence }]
    }));
  };

  const addExample = (context: string, example: string, relevance: number) => {
    setInteractiveData(prev => ({
      ...prev,
      examples: [...prev.examples, { context, example, relevance }]
    }));
  };

  const teachingSteps = [
    {
      id: 'concept-exploration',
      title: 'Concept Mapping',
      description: 'Build your understanding through interactive concept mapping',
      icon: Search,
      color: 'blue',
      component: () => (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Interactive Concept Builder
            </h4>
            <p className="text-blue-700 text-sm mb-4">
              Break down "{lesson.title}" into its core components. Add concepts as you discover them.
            </p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a key concept..."
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addConcept(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addConcept(input.value);
                  input.value = '';
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {interactiveData.conceptMap.map((concept, index) => (
                <div key={index} className="bg-white border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">{concept}</span>
                  <button
                    onClick={() => setInteractiveData(prev => ({
                      ...prev,
                      conceptMap: prev.conceptMap.filter((_, i) => i !== index)
                    }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-3">Concept Relationships</h5>
            <p className="text-sm text-blue-700 mb-4">
              How do these concepts connect to each other? Draw connections between related ideas.
            </p>
            <div className="space-y-2">
              {interactiveData.conceptMap.length >= 2 && (
                <div className="flex gap-2 items-center">
                  <select className="px-3 py-2 border border-blue-300 rounded-lg text-sm">
                    {interactiveData.conceptMap.map((concept, i) => (
                      <option key={i} value={concept}>{concept}</option>
                    ))}
                  </select>
                  <span className="text-blue-600">connects to</span>
                  <select className="px-3 py-2 border border-blue-300 rounded-lg text-sm">
                    {interactiveData.conceptMap.map((concept, i) => (
                      <option key={i} value={concept}>{concept}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-blue-300 rounded-lg text-sm">
                    <option value="causes">causes</option>
                    <option value="enables">enables</option>
                    <option value="requires">requires</option>
                    <option value="influences">influences</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'question-generation',
      title: 'Question Garden',
      description: 'Cultivate critical thinking through guided questioning',
      icon: Target,
      color: 'green',
      component: () => (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Question Generator
            </h4>
            <p className="text-green-700 text-sm mb-4">
              Generate thoughtful questions about "{lesson.title}". Use the prompts below or create your own.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                "What if this principle was applied in...",
                "How might this change if...",
                "What are the underlying assumptions in...",
                "What would happen if we removed...",
                "How does this relate to my experience with...",
                "What would an expert say about..."
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const question = prompt + " " + lesson.title.toLowerCase();
                    addQuestion(question);
                  }}
                  className="p-3 bg-white border border-green-200 rounded-lg text-left text-sm hover:bg-green-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Write your own question..."
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addQuestion(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addQuestion(input.value);
                  input.value = '';
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {interactiveData.questions.map((question, index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-3 flex items-start justify-between">
                  <span className="text-sm text-green-800 flex-1">{question}</span>
                  <button
                    onClick={() => setInteractiveData(prev => ({
                      ...prev,
                      questions: prev.questions.filter((_, i) => i !== index)
                    }))}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'connection-making',
      title: 'Life Connections',
      description: 'Connect wisdom to your real-world experiences',
      icon: Compass,
      color: 'purple',
      component: () => (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Experience Mapper
            </h4>
            <p className="text-purple-700 text-sm mb-4">
              Connect "{lesson.title}" to your personal experiences and real-world examples.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { icon: Home, label: "Personal Life", color: "purple" },
                { icon: Briefcase, label: "Work/Career", color: "blue" },
                { icon: School, label: "Learning", color: "green" }
              ].map((context, index) => (
                <div key={index} className="bg-white border border-purple-200 rounded-lg p-4 text-center">
                  <context.icon className={`w-8 h-8 mx-auto mb-2 text-${context.color}-500`} />
                  <h5 className="font-medium text-purple-800 mb-2">{context.label}</h5>
                  <button
                    onClick={() => {
                      const example = prompt(`Share an example from your ${context.label.toLowerCase()}:`);
                      if (example) {
                        addExample(context.label, example, 5);
                      }
                    }}
                    className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                  >
                    Add Example
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {interactiveData.examples.map((example, index) => (
                <div key={index} className="bg-white border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">{example.context}</span>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${star <= example.relevance ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-purple-700">{example.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'application-planning',
      title: 'Action Planner',
      description: 'Create a concrete plan for applying this wisdom',
      icon: Zap,
      color: 'amber',
      component: () => (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Action Plan Builder
            </h4>
            <p className="text-amber-700 text-sm mb-4">
              Create specific, actionable steps to apply "{lesson.title}" in your life.
            </p>
            
            <div className="bg-white border border-amber-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-amber-800 mb-3">Add New Action</h5>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What specific action will you take?"
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex gap-3">
                  <select className="px-3 py-2 border border-amber-300 rounded-lg text-sm">
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="next-3-months">Next 3 Months</option>
                  </select>
                  <select className="px-3 py-2 border border-amber-300 rounded-lg text-sm">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {interactiveData.actionPlan.map((action, index) => (
                <div key={index} className="bg-white border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-amber-800">{action.action}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        action.priority === 'high' ? 'bg-red-100 text-red-800' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {action.priority}
                      </span>
                      <span className="text-xs text-amber-600">{action.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Challenge Anticipation
            </h4>
            <p className="text-red-700 text-sm mb-4">
              Anticipate potential obstacles and plan solutions in advance.
            </p>
            
            <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-red-800 mb-3">Add Challenge & Solution</h5>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What challenge might you face?"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="How will you overcome this challenge?"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-700">Confidence in solution:</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((level) => (
                      <button
                        key={level}
                        className="w-6 h-6 rounded-full border-2 border-red-300 hover:bg-red-100 transition-colors"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {interactiveData.challenges.map((challenge, index) => (
                <div key={index} className="bg-white border border-red-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-red-800">Challenge: {challenge.challenge}</span>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((level) => (
                        <div
                          key={level}
                          className={`w-4 h-4 rounded-full ${
                            level <= challenge.confidence ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-red-700">Solution: {challenge.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const renderEnhancedTeachingSection = () => {
    const currentStep = teachingSteps[activeTeachingStep];
    const progress = teachingProgress;
    const totalProgress = Object.values(progress).reduce((sum, val) => sum + val, 0) / 4;

    return (
      <motion.div
        className="bg-surface border border-border rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Enhanced Teaching Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">Interactive Learning Lab</h3>
                <p className="text-sm text-muted">Hands-on exploration of {lesson.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round(totalProgress)}%</div>
              <div className="text-sm text-muted">Engagement Level</div>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className="grid grid-cols-4 gap-4">
            {teachingSteps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div className={cn(
                  'w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center',
                  progress[Object.keys(progress)[index] as keyof typeof progress] > 0
                    ? 'bg-blue-500 text-white'
                    : 'bg-surface-2 text-muted'
                )}>
                  {progress[Object.keys(progress)[index] as keyof typeof progress] > 0 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="text-xs text-muted">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Content */}
        <div className="p-6 space-y-6">
          {/* Current Step Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {teachingSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveTeachingStep(index)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeTeachingStep === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-surface-2 text-muted hover:bg-surface-3'
                  )}
                >
                  {step.title}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTeachingStep(Math.max(0, activeTeachingStep - 1))}
                disabled={activeTeachingStep === 0}
                className="p-2 rounded-lg bg-surface-2 text-muted hover:bg-surface-3 disabled:opacity-50"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTeachingStep(Math.min(teachingSteps.length - 1, activeTeachingStep + 1))}
                disabled={activeTeachingStep === teachingSteps.length - 1}
                className="p-2 rounded-lg bg-surface-2 text-muted hover:bg-surface-3 disabled:opacity-50"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Step Content */}
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', `bg-${currentStep.color}-500/20`)}>
                <currentStep.icon className={cn('w-5 h-5', `text-${currentStep.color}-600`)} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-text">{currentStep.title}</h4>
                <p className="text-sm text-muted">{currentStep.description}</p>
              </div>
            </div>

            {/* Core Teaching Content */}
            <div className="mb-6">
              <h5 className="font-medium text-text mb-3">Core Teaching</h5>
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-text leading-relaxed">{lesson.teaching}</p>
              </div>
            </div>

            {/* Interactive Component */}
            <div className="mb-6">
              {currentStep.component()}
            </div>

            {/* User Response Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Your {currentStep.title.toLowerCase()} reflection:
              </label>
              <textarea
                value={userInputs.teaching}
                onChange={(e) => setUserInputs(prev => ({ ...prev, teaching: e.target.value }))}
                placeholder={`Reflect on your ${currentStep.title.toLowerCase()} experience and share your insights...`}
                className="w-full p-4 border border-border rounded-lg bg-surface text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  updateTeachingProgress(Object.keys(teachingProgress)[activeTeachingStep] as keyof typeof teachingProgress);
                  getAIGuidance('teaching', `Help me with ${currentStep.title.toLowerCase()} for the lesson: ${lesson.title}`);
                }}
                disabled={isLoading}
                className={cn(
                  'flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-colors',
                  'bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20',
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
              
              <button
                onClick={() => updateTeachingProgress(Object.keys(teachingProgress)[activeTeachingStep] as keyof typeof teachingProgress)}
                className="px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Response Display */}
          {aiResponses.teaching && (
            <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-xl p-6">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Learning Guide
              </h5>
              <div className="prose prose-sm max-w-none">
                <p className="text-text leading-relaxed whitespace-pre-wrap">{aiResponses.teaching}</p>
              </div>
            </div>
          )}

          {/* Completion Button */}
          <button
            onClick={() => markSectionComplete('teaching')}
            disabled={completedSections.teaching}
            className={cn(
              'w-full p-4 rounded-lg font-medium transition-all hover:scale-105',
              completedSections.teaching 
                ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'
            )}
          >
            {completedSections.teaching ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Teaching Section Completed</span>
              </div>
            ) : (
              'Complete Teaching Section'
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  const sections = [
    { key: 'teaching', title: 'Teaching', icon: Brain, color: 'blue' },
    { key: 'question', title: 'Reflection', icon: Target, color: 'green' },
    { key: 'practice', title: 'Practice', icon: Zap, color: 'purple' },
    { key: 'reading', title: 'Reading', icon: BookOpen, color: 'indigo' },
    { key: 'quote', title: 'Wisdom', icon: MessageCircle, color: 'amber' }
  ] as const;

  const renderSection = (sectionKey: keyof typeof userInputs, sectionData: any) => {
    const section = sections.find(s => s.key === sectionKey);
    if (!section) return null;

    const isCompleted = completedSections[sectionKey];
    const userInput = userInputs[sectionKey];
    const aiResponse = aiResponses[sectionKey];
    const colorClass = section.color;

    // Special handling for teaching section
    if (sectionKey === 'teaching') {
      return renderEnhancedTeachingSection();
    }

    return (
      <motion.div
        key={sectionKey}
        className="bg-surface border border-border rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Section Header */}
        <div 
          className={cn(
            'p-4 cursor-pointer transition-all duration-200',
            isCompleted ? `bg-${colorClass}-500/10 border-l-4 border-l-${colorClass}-500` : 'hover:bg-surface-2'
          )}
          onClick={() => setCurrentSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                isCompleted ? `bg-${colorClass}-500 text-white` : `bg-${colorClass}-500/20 text-${colorClass}-600`
              )}>
                <section.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-text">{section.title}</h3>
                <p className="text-sm text-muted">
                  {sectionKey === 'question' && 'Personal reflection and insights'}
                  {sectionKey === 'practice' && 'Real-world application'}
                  {sectionKey === 'reading' && 'Text analysis and comprehension'}
                  {sectionKey === 'quote' && 'Wisdom interpretation and application'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
              <ChevronDown className={cn(
                'w-4 h-4 text-muted transition-transform',
                currentSection === sectionKey && 'rotate-180'
              )} />
            </div>
          </div>
        </div>

        {/* Section Content */}
        <AnimatePresence>
          {currentSection === sectionKey && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border"
            >
              <div className="p-6 space-y-6">
                {/* Lesson Content */}
                <div className={cn(
                  'p-4 rounded-lg border',
                  `bg-${colorClass}-500/5 border-${colorClass}-500/20`
                )}>
                  <h4 className={cn('font-medium mb-3 flex items-center gap-2', `text-${colorClass}-600`)}>
                    <section.icon className="w-4 h-4" />
                    {section.title} Content
                  </h4>
                  <p className="text-sm text-text leading-relaxed">
                    {lesson[sectionKey]}
                  </p>
                </div>

                {/* Interactive Elements */}
                <div className="space-y-4">
                  {/* User Input Area */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Your {section.title.toLowerCase()} response:
                    </label>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInputs(prev => ({ ...prev, [sectionKey]: e.target.value }))}
                      placeholder={
                        sectionKey === 'question' ? 'Reflect on the question and share your thoughts...'
                        : sectionKey === 'practice' ? 'Describe how you will apply this practice...'
                        : sectionKey === 'reading' ? 'Analyze the reading and share your understanding...'
                        : 'What does this quote mean to you and how will you apply it?'
                      }
                      className="w-full p-3 border border-border rounded-lg bg-surface text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* AI Guidance Button */}
                  <button
                    onClick={() => {
                      const prompt = sectionData?.aiPrompt || `Help me with the ${section.title.toLowerCase()} section of this lesson`;
                      getAIGuidance(sectionKey, prompt);
                    }}
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
                    onClick={() => markSectionComplete(sectionKey)}
                    disabled={isCompleted}
                    className={cn(
                      'w-full p-3 rounded-lg font-medium transition-all hover:scale-105',
                      isCompleted 
                        ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'
                    )}
                  >
                    {isCompleted ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      'Mark Complete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const totalCompleted = Object.values(completedSections).filter(Boolean).length;
  const progressPercentage = (totalCompleted / 5) * 100;

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
            <span className="text-sm font-medium text-amber-600">
              {totalCompleted}/5 sections completed
            </span>
          </div>
        </div>
        <div className="w-full bg-surface-2 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary to-courage h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {sections.map((section) => (
            <div key={section.key} className="text-center">
              <div className={cn(
                'w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center',
                completedSections[section.key] 
                  ? `bg-${section.color}-500 text-white` 
                  : `bg-${section.color}-500/20 text-${section.color}-600`
              )}>
                {completedSections[section.key] ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <section.icon className="w-4 h-4" />
                )}
              </div>
              <div className="text-xs text-muted capitalize">{section.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sections */}
      <div className="space-y-4">
        {sections.map((section) => 
          renderSection(section.key, lesson.interactiveElements?.[section.key])
        )}
      </div>
    </div>
  );
}
