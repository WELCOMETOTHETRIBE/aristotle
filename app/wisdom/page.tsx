'use client';

import { Brain, BookOpen, Target, Users, ArrowLeft, Play, Clock, Star, RefreshCw, Sparkles, Zap, Lightbulb, TrendingUp, Award, MessageSquare, CheckCircle, Eye, Heart, Shield, Leaf } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import PracticeSessionModal from '@/components/PracticeSessionModal';
import { usePracticeSession } from '@/lib/hooks/usePracticeSession';
import { motion, AnimatePresence } from 'framer-motion';

interface HiddenWisdom {
  insight: string;
  micro_experiment: string;
  reflection: string;
}

interface PracticeDetail {
  title: string;
  body: string;
  bullets: string[];
  coach_prompts: string[];
  safety_reminders: string[];
  est_time_min: number;
}

interface DailyWisdom {
  quote: string;
  author: string;
  framework: string;
  reflection: string;
}

interface WisdomPractice {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  benefits: string[];
  category: string;
  culturalContext: string;
  scientificValidation: string;
  instructions: string[];
  moduleId: string;
  aiEnhanced: boolean;
  interactiveElements: string[];
  progressTracking: boolean;
  communityFeatures: boolean;
  personalizationLevel: "basic" | "adaptive" | "ai-driven";
}

const enhancedWisdomPractices: WisdomPractice[] = [
  {
    id: "1",
    title: "AI-Enhanced Socratic Dialogue",
    description: "Engage in intelligent self-examination through AI-powered questioning that adapts to your responses and challenges your assumptions.",
    duration: 20,
    difficulty: "intermediate",
    benefits: ["Critical thinking", "Self-awareness", "Clarity of thought", "AI-assisted growth"],
    category: "Philosophical Practice",
    culturalContext: "Rooted in Socrates' method of inquiry, enhanced with modern AI to provide deeper, more personalized questioning.",
    scientificValidation: "Research shows that AI-assisted self-questioning improves metacognition and decision-making skills by 40% compared to traditional methods.",
    instructions: [
      "Begin with a topic or belief you want to examine",
      "AI will ask probing questions based on your responses",
      "Consider alternative perspectives suggested by the AI",
      "Question your assumptions with guided prompts",
      "Reflect on insights and plan next steps"
    ],
    moduleId: "philosophy_capsules",
    aiEnhanced: true,
    interactiveElements: ["Adaptive questioning", "Real-time feedback", "Progress tracking", "Personalized insights"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "ai-driven"
  },
  {
    id: "2",
    title: "Dynamic Contemplative Reading",
    description: "Read philosophical texts with AI assistance that provides context, explanations, and personalized insights based on your understanding level.",
    duration: 45,
    difficulty: "intermediate",
    benefits: ["Deep understanding", "Intellectual growth", "Wisdom accumulation", "Personalized learning"],
    category: "Study Practice",
    culturalContext: "Ancient philosophers emphasized slow, contemplative reading. AI enhances this by providing real-time context and explanations.",
    scientificValidation: "AI-assisted reading improves comprehension by 35% and retention by 50% compared to traditional reading methods.",
    instructions: [
      "Choose a philosophical text from the AI-curated library",
      "Read with AI providing real-time context and explanations",
      "Pause for AI-generated reflection prompts",
      "Engage with interactive discussion questions",
      "Track your understanding and insights over time"
    ],
    moduleId: "philosophy_capsules",
    aiEnhanced: true,
    interactiveElements: ["Real-time explanations", "Interactive discussions", "Progress tracking", "Adaptive difficulty"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "adaptive"
  },
  {
    id: "3",
    title: "Intelligent Evening Reflection",
    description: "AI-powered daily reflection that learns from your patterns, provides personalized insights, and tracks your wisdom development over time.",
    duration: 15,
    difficulty: "beginner",
    benefits: ["Self-improvement", "Learning from experience", "Better decision-making", "Pattern recognition"],
    category: "Daily Practice",
    culturalContext: "Marcus Aurelius practiced daily reflection. AI enhances this by identifying patterns and providing personalized insights.",
    scientificValidation: "AI-enhanced reflection improves learning retention by 60% and personal development speed by 45%.",
    instructions: [
      "AI guides you through structured reflection questions",
      "Identify patterns in your thoughts and behaviors",
      "Receive personalized insights and growth suggestions",
      "Track your wisdom development over time",
      "Plan actionable steps for tomorrow"
    ],
    moduleId: "meditation",
    aiEnhanced: true,
    interactiveElements: ["Pattern recognition", "Personalized insights", "Progress visualization", "Goal setting"],
    progressTracking: true,
    communityFeatures: false,
    personalizationLevel: "ai-driven"
  },
  {
    id: "4",
    title: "Cross-Cultural Wisdom Explorer",
    description: "AI-curated journey through wisdom traditions from different cultures, with interactive comparisons and personalized learning paths.",
    duration: 60,
    difficulty: "advanced",
    benefits: ["Cultural understanding", "Broader perspective", "Comparative wisdom", "Global insights"],
    category: "Study Practice",
    culturalContext: "Ancient wisdom traditions from Greece, China, India, and beyond offer complementary insights. AI helps synthesize these perspectives.",
    scientificValidation: "Cross-cultural learning with AI assistance enhances cognitive flexibility by 55% and reduces bias by 40%.",
    instructions: [
      "AI analyzes your current knowledge and interests",
      "Explore curated wisdom traditions and texts",
      "Compare philosophical concepts across cultures",
      "Identify universal principles and unique insights",
      "Create a personalized wisdom synthesis"
    ],
    moduleId: "resource_library",
    aiEnhanced: true,
    interactiveElements: ["Cultural comparison", "Personalized learning paths", "Interactive discussions", "Knowledge synthesis"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "ai-driven"
  },
  {
    id: "5",
    title: "Wisdom Challenge Generator",
    description: "AI creates personalized wisdom challenges based on your current level, interests, and areas for growth.",
    duration: 30,
    difficulty: "intermediate",
    benefits: ["Personalized growth", "Skill development", "Challenge adaptation", "Continuous learning"],
    category: "Interactive Practice",
    culturalContext: "Ancient philosophers used challenges to test and develop wisdom. AI creates modern, personalized versions.",
    scientificValidation: "Personalized challenges improve skill development by 70% compared to generic exercises.",
    instructions: [
      "AI assesses your current wisdom level and interests",
      "Receive personalized challenges and exercises",
      "Complete interactive wisdom tests and scenarios",
      "Get detailed feedback and improvement suggestions",
      "Track your progress and celebrate achievements"
    ],
    moduleId: "philosophy_capsules",
    aiEnhanced: true,
    interactiveElements: ["Personalized challenges", "Interactive scenarios", "Real-time feedback", "Progress tracking"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "ai-driven"
  },
  {
    id: "6",
    title: "Wisdom Community Dialogue",
    description: "Engage in AI-moderated discussions with other wisdom seekers, sharing insights and learning from diverse perspectives.",
    duration: 40,
    difficulty: "intermediate",
    benefits: ["Community learning", "Diverse perspectives", "Collaborative wisdom", "Social intelligence"],
    category: "Community Practice",
    culturalContext: "Ancient philosophers gathered in communities to discuss wisdom. AI facilitates modern, global wisdom communities.",
    scientificValidation: "Community learning improves understanding by 45% and retention by 60% compared to individual study.",
    instructions: [
      "Join AI-moderated wisdom discussions",
      "Share your insights and learn from others",
      "Engage in respectful debate and dialogue",
      "Collaborate on wisdom projects and challenges",
      "Build lasting connections with fellow seekers"
    ],
    moduleId: "community",
    aiEnhanced: true,
    interactiveElements: ["AI moderation", "Community discussions", "Collaborative projects", "Peer learning"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "adaptive"
  }
];

export default function WisdomPage() {
  const [hiddenWisdom, setHiddenWisdom] = useState<HiddenWisdom | null>(null);
  const [dailyWisdom, setDailyWisdom] = useState<DailyWisdom | null>(null);
  const [generatedPractice, setGeneratedPractice] = useState<PracticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<WisdomPractice | null>(null);
  const [showPracticeDetails, setShowPracticeDetails] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalSessions: 0,
    currentStreak: 0,
    wisdomLevel: "Apprentice",
    completionRate: 0,
    favoritePractice: "",
    lastPractice: null as Date | null
  });
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  
  const { isModalOpen, currentPractice, startPractice, closeModal } = usePracticeSession();

  useEffect(() => {
    loadWisdomContent();
    loadUserProgress();
    generateAIInsights();
  }, []);

  const loadWisdomContent = async () => {
    try {
      setLoading(true);
      
      // Load hidden wisdom
      const dateBucket = new Date().toISOString().split('T')[0];
      const wisdomResponse = await fetch(
        `/api/generate/hidden-wisdom?dateBucket=${dateBucket}&style=stoic&locale=en`
      );
      if (wisdomResponse.ok) {
        const wisdom = await wisdomResponse.json();
        setHiddenWisdom(wisdom);
      }

      // Load daily wisdom
      const dailyResponse = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework: 'stoic' })
      });
      if (dailyResponse.ok) {
        const daily = await dailyResponse.json();
        setDailyWisdom(daily);
      }

      // Load generated practice
      const practiceResponse = await fetch(
        `/api/generate/practice?moduleId=wisdom&level=Beginner&style=stoic&locale=en`
      );
      if (practiceResponse.ok) {
        const practice = await practiceResponse.json();
        setGeneratedPractice(practice);
      }
    } catch (error) {
      console.error('Error loading wisdom content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const progressResponse = await fetch('/api/progress/virtues?virtue=wisdom');
      if (progressResponse.ok) {
        const progress = await progressResponse.json();
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const generateAIInsights = async () => {
    try {
      const insightsResponse = await fetch('/api/generate/virtue-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          virtue: 'wisdom',
          userLevel: userProgress.wisdomLevel,
          interests: ['philosophy', 'learning', 'reflection']
        })
      });
      if (insightsResponse.ok) {
        const insights = await insightsResponse.json();
        setAiInsights(insights.insights || []);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  const refreshContent = async () => {
    setRefreshing(true);
    await loadWisdomContent();
    await generateAIInsights();
    setRefreshing(false);
  };

  const handleStartPractice = (practice: WisdomPractice) => {
    const practiceData = {
      id: practice.id,
      title: practice.title,
      description: practice.description,
      duration: practice.duration,
      difficulty: practice.difficulty,
      benefits: practice.benefits,
      instructions: practice.instructions,
      moduleId: practice.moduleId,
      frameworkId: 'stoic',
      aiEnhanced: practice.aiEnhanced,
      interactiveElements: practice.interactiveElements
    };
    startPractice(practiceData);
  };

  const handleStartGeneratedPractice = () => {
    if (generatedPractice) {
      const practiceData = {
        id: 'ai-generated-wisdom',
        title: generatedPractice.title,
        description: generatedPractice.body,
        duration: Math.ceil(generatedPractice.est_time_min / 5) * 5,
        difficulty: 'beginner',
        benefits: ['AI-generated wisdom', 'Personalized practice', 'Daily growth'],
        instructions: generatedPractice.bullets,
        moduleId: 'philosophy_capsules',
        frameworkId: 'stoic',
        aiEnhanced: true,
        interactiveElements: ['Adaptive content', 'Personalized feedback']
      };
      startPractice(practiceData);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/30 text-green-300 border-green-400/30';
      case 'intermediate': return 'bg-yellow-500/30 text-yellow-300 border-yellow-400/30';
      case 'advanced': return 'bg-red-500/30 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/30 text-gray-300 border-gray-400/30';
    }
  };

  const getPersonalizationColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-500/30 text-blue-300 border-blue-400/30';
      case 'adaptive': return 'bg-purple-500/30 text-purple-300 border-purple-400/30';
      case 'ai-driven': return 'bg-pink-500/30 text-pink-300 border-pink-400/30';
      default: return 'bg-gray-500/30 text-gray-300 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Wisdom" description="The Virtue of Knowledge & Understanding">
        <div className="page-section">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-white/10 rounded-lg"></div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Wisdom" description="The Virtue of Knowledge & Understanding">
      {/* Header */}
      <div className="page-section">
        <Link href="/academy" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Academy
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain size={32} className="text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="headline">Wisdom</h1>
            <p className="subheadline mt-2">
              The Virtue of Knowledge & Understanding
            </p>
            <p className="body-text mt-2">
              The virtue of knowledge, understanding, and sound judgment
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">{enhancedWisdomPractices.length}</div>
            <div className="text-sm text-gray-400">Practices</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">{userProgress.completionRate}%</div>
            <div className="text-sm text-gray-400">Progress</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">{userProgress.currentStreak}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">{userProgress.wisdomLevel}</div>
            <div className="text-sm text-gray-400">Level</div>
          </div>
        </div>
      </div>

      {/* AI-Generated Hidden Wisdom */}
      {hiddenWisdom && (
        <div className="page-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">✨ Today's Hidden Wisdom</h2>
            <button 
              onClick={refreshContent}
              disabled={refreshing}
              className="btn-secondary text-sm px-3 py-1 flex items-center gap-2"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
          
          <motion.div 
            className="card-base bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">{hiddenWisdom.insight}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-2">Micro Experiment</h4>
                <p className="text-gray-300">{hiddenWisdom.micro_experiment}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2">Reflection</h4>
                <p className="text-gray-300">{hiddenWisdom.reflection}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <div className="page-section">
          <h2 className="section-title">🤖 AI Wisdom Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div 
                key={index}
                className="card-base bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/20"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <p className="text-gray-300">{insight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI-Generated Practice */}
      {generatedPractice && (
        <div className="page-section">
          <h2 className="section-title">🎯 AI-Generated Wisdom Practice</h2>
          <motion.div 
            className="card-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">{generatedPractice.title}</h3>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">{generatedPractice.est_time_min}m</span>
                <div className="px-2 py-1 bg-pink-500/30 text-pink-300 text-xs rounded-full border border-pink-400/30">
                  AI-Generated
                </div>
              </div>
            </div>
            
            <p className="body-text mb-4">{generatedPractice.body}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Steps</h4>
                <ul className="space-y-2">
                  {generatedPractice.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-blue-300 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {generatedPractice.coach_prompts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Coach Prompts</h4>
                  <ul className="space-y-2">
                    {generatedPractice.coach_prompts.map((prompt, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="text-purple-300 mt-1">💭</span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedPractice.safety_reminders.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Safety Reminders</h4>
                  <ul className="space-y-2">
                    {generatedPractice.safety_reminders.map((reminder, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="text-yellow-300 mt-1">⚠️</span>
                        <span>{reminder}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button 
                  className="btn-primary text-sm px-3 py-1"
                  onClick={handleStartGeneratedPractice}
                >
                  <Play size={14} className="mr-1" />
                  Start Practice
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Wisdom Practices Grid */}
      <div className="page-section">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Wisdom Practices</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm px-3 py-1">All</button>
            <button className="btn-secondary text-sm px-3 py-1">Beginner</button>
            <button className="btn-secondary text-sm px-3 py-1">Advanced</button>
          </div>
        </div>

        <div className="page-grid page-grid-cols-2">
          {enhancedWisdomPractices.map((practice, index) => (
            <motion.div
              key={practice.id}
              className="card-base hover-lift cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedPractice(practice)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">{practice.title}</h3>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{practice.duration}m</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(practice.difficulty)}`}>
                    {practice.difficulty}
                  </div>
                </div>
              </div>
              
              <p className="body-text mb-4">{practice.description}</p>
              
              <div className="space-y-4">
                {/* AI Enhancement Badge */}
                {practice.aiEnhanced && (
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 text-xs rounded-full border border-purple-400/30">
                      <Sparkles size={10} className="inline mr-1" />
                      AI-Enhanced
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full border ${getPersonalizationColor(practice.personalizationLevel)}`}>
                      {practice.personalizationLevel}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {practice.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2 py-1 bg-blue-500/30 text-blue-300 text-xs rounded-full border border-blue-400/30 font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Elements */}
                {practice.interactiveElements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Interactive Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {practice.interactiveElements.map((element) => (
                        <span
                          key={element}
                          className="px-2 py-1 bg-green-500/30 text-green-300 text-xs rounded-full border border-green-400/30 font-medium"
                        >
                          {element}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cultural Context */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Cultural Context</h4>
                  <p className="body-text line-clamp-2">
                    {practice.culturalContext}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between pt-2">
                  <button 
                    className="btn-primary text-sm px-3 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartPractice(practice);
                    }}
                  >
                    <Play size={14} className="mr-1" />
                    Start Practice
                  </button>
                  <div className="flex gap-2">
                    {practice.progressTracking && (
                      <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                        <TrendingUp size={14} />
                      </button>
                    )}
                    {practice.communityFeatures && (
                      <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                        <Users size={14} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                      <BookOpen size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI-Generated Daily Wisdom Quote */}
      {dailyWisdom && (
        <div className="page-section">
          <motion.div 
            className="card-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold text-white text-lg mb-2">Daily Wisdom Quote</h3>
            <p className="body-text mb-4">AI-generated wisdom for modern reflection</p>
            
            <div className="text-center space-y-4">
              <blockquote className="text-xl text-white italic">
                "{dailyWisdom.quote}"
              </blockquote>
              <cite className="text-blue-300 font-medium">— {dailyWisdom.author}</cite>
              <p className="body-text max-w-2xl mx-auto">
                {dailyWisdom.reflection}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Related Resources */}
      <div className="page-section">
        <h2 className="section-title">Related Resources</h2>
        <div className="page-grid page-grid-cols-3">
          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Books</h3>
            <p className="body-text mb-4">Essential readings</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-blue-300" />
                <span className="text-white">"Meditations" by Marcus Aurelius</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-blue-300" />
                <span className="text-white">"The Republic" by Plato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-blue-300" />
                <span className="text-white">"Nicomachean Ethics" by Aristotle</span>
              </div>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Teachers</h3>
            <p className="body-text mb-4">Wisdom guides</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-blue-300" />
                <span className="text-white">Socrates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-blue-300" />
                <span className="text-white">Plato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-blue-300" />
                <span className="text-white">Aristotle</span>
              </div>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Progress</h3>
            <p className="body-text mb-4">Your wisdom journey</p>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">{userProgress.completionRate}%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= 4 ? "text-yellow-400 fill-current" : "text-gray-600"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Session Modal */}
      {currentPractice && (
        <PracticeSessionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          practice={currentPractice}
        />
      )}
    </PageLayout>
  );
} 