'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Globe, 
  Heart, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Shield,
  Target,
  Users,
  Zap,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OnboardingData {
  name: string | null;
  timezone: string | null;
  selectedFrameworks: string[];
  question1: string | null;
  question2: string | null;
  question3: string | null;
  question4: string | null;
  question5: string | null;
}

const steps = [
  {
    id: 0,
    title: 'Personal Information',
    description: 'Tell us about yourself',
    icon: User
  },
  {
    id: 1,
    title: 'Philosophical Preferences',
    description: 'Choose your frameworks',
    icon: Heart
  },
  {
    id: 2,
    title: 'Learning Style',
    description: 'How do you prefer to learn?',
    icon: BookOpen
  },
  {
    id: 3,
    title: 'Complete Setup',
    description: 'Review and finish',
    icon: CheckCircle
  }
];

const questions = [
  {
    id: 'question1',
    text: 'How do you prefer to approach structured learning?',
    options: [
      { value: 'systematic', label: 'Systematic and methodical', icon: Target },
      { value: 'exploratory', label: 'Exploratory and flexible', icon: Sparkles }
    ],
    icon: BookOpen
  },
  {
    id: 'question2',
    text: 'What motivates you most in personal development?',
    options: [
      { value: 'achievement', label: 'Achievement and mastery', icon: Target },
      { value: 'growth', label: 'Personal growth and insight', icon: Heart }
    ],
    icon: Zap
  },
  {
    id: 'question3',
    text: 'How do you handle challenges and setbacks?',
    options: [
      { value: 'confront', label: 'Face them directly', icon: Shield },
      { value: 'adapt', label: 'Adapt and find alternatives', icon: Sparkles }
    ],
    icon: Shield
  },
  {
    id: 'question4',
    text: 'What type of practice resonates with you?',
    options: [
      { value: 'individual', label: 'Individual reflection and practice', icon: User },
      { value: 'community', label: 'Community and shared learning', icon: Users }
    ],
    icon: Users
  },
  {
    id: 'question5',
    text: 'How important is physical discipline to you?',
    options: [
      { value: 'essential', label: 'Essential for mental clarity', icon: Zap },
      { value: 'complementary', label: 'Complementary to mental practice', icon: Heart }
    ],
    icon: Heart
  }
];

const availableFrameworks = [
  { id: 'stoic', name: 'Stoicism', emoji: '🧱', description: 'Rational thinking and emotional control' },
  { id: 'spartan', name: 'Spartan Agōgē', emoji: '🛡️', description: 'Discipline and resilience' },
  { id: 'bushido', name: 'Samurai Bushidō', emoji: '🗡️', description: 'Honor and rectitude' },
  { id: 'monastic', name: 'Monastic Rule', emoji: '⛪', description: 'Contemplation and service' },
  { id: 'berserker', name: 'Viking Berserker', emoji: '⚔️', description: 'Courage and strength' },
  { id: 'druid', name: 'Celtic Druid', emoji: '🌿', description: 'Nature and wisdom' },
  { id: 'monk', name: 'Tibetan Monk', emoji: '🧘', description: 'Mindfulness and compassion' },
  { id: 'taoist', name: 'Taoist Sage', emoji: '☯️', description: 'Balance and flow' },
  { id: 'epicurean', name: 'Epicurean', emoji: '🍇', description: 'Pleasure and moderation' },
  { id: 'aristotelian', name: 'Aristotelian', emoji: '📚', description: 'Virtue and flourishing' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: null,
    timezone: null,
    selectedFrameworks: [],
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null
  });

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.name && data.timezone;
      case 1:
        return data.selectedFrameworks.length > 0;
      case 2:
        return data.question1 && data.question2 && data.question3 && data.question4 && data.question5;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    if (data.selectedFrameworks.length === 0) {
      alert('Please select at least one framework to continue.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🚀 Starting onboarding completion...');
      console.log('📝 Data to save:', data);

      // Step 1: Save user preferences to database
      console.log('💾 Step 1: Saving user preferences...');
      const prefsResponse = await fetch('/api/prefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isOnboarding: true,
          name: data.name,
          timezone: data.timezone,
          framework: data.selectedFrameworks[0],
          secondaryFrameworks: data.selectedFrameworks.slice(1)
        }),
      });

      if (!prefsResponse.ok) {
        const errorData = await prefsResponse.json();
        console.error('❌ Failed to save preferences:', errorData);
        throw new Error(`Failed to save preferences: ${errorData.error || 'Unknown error'}`);
      }

      const prefsData = await prefsResponse.json();
      console.log('✅ User preferences saved successfully:', prefsData);

      // Step 2: Save user facts for AI personalization (skip if fails)
      console.log('🧠 Step 2: Saving user facts...');
      try {
        const facts = [
          { kind: 'bio', content: `Name: ${data.name}` },
          { kind: 'preference', content: `Timezone: ${data.timezone}` },
          { kind: 'preference', content: `Structured learning: ${data.question1}` },
          { kind: 'preference', content: `Achievement focused: ${data.question2}` },
          { kind: 'preference', content: `Direct confrontation: ${data.question3}` },
          { kind: 'preference', content: `Individual practice: ${data.question4}` },
          { kind: 'preference', content: `Physical discipline: ${data.question5}` }
        ];

        const factsResponse = await fetch('/api/user-facts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ facts }),
        });

        if (factsResponse.ok) {
          const factsData = await factsResponse.json();
          console.log('✅ User facts saved successfully:', factsData);
        } else {
          console.log('⚠️ User facts save failed, continuing without them');
        }
      } catch (factsError) {
        console.log('⚠️ User facts save failed, continuing without them:', factsError);
      }

      // Step 3: Create initial tasks
      console.log('📋 Step 3: Creating initial tasks...');
      const tasks = [
        {
          title: 'Complete your first breathwork session',
          description: 'Try the enhanced breathwork app with perfect audio-visual sync',
          priority: 'H',
          tag: 'breathwork'
        },
        {
          title: 'Explore your selected frameworks',
          description: 'Visit the frameworks page to learn more about your chosen paths',
          priority: 'M',
          tag: 'learning'
        },
        {
          title: 'Set up your daily intention',
          description: 'Create your first daily intention to start your journey',
          priority: 'M',
          tag: 'intention'
        }
      ];

      for (const task of tasks) {
        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
          });
        } catch (error) {
          console.warn('Failed to create task:', task.title, error);
        }
      }

      console.log('✅ Initial tasks created successfully');

      // Step 4: Mark onboarding as complete
      console.log('🎯 Step 4: Marking onboarding as complete...');
      const onboardingResponse = await fetch('/api/onboarding-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!onboardingResponse.ok) {
        const errorData = await onboardingResponse.json();
        console.error('❌ Failed to mark onboarding complete:', errorData);
        throw new Error(`Failed to mark onboarding complete: ${errorData.error || 'Unknown error'}`);
      }

      console.log('✅ Onboarding marked as complete');

      // Step 5: Redirect directly to dashboard (no completion page)
      console.log('🏠 Step 5: Redirecting to dashboard...');
      router.push('/today');
      
    } catch (error) {
      console.error('❌ Onboarding completion failed:', error);
      alert(`Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="glass-effect border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95">
            <CardHeader>
              <CardTitle className="text-center">Personal Information</CardTitle>
              <CardDescription className="text-center">
                Let's start with the basics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What's your timezone?
                </label>
                <select
                  value={data.timezone || ''}
                  onChange={(e) => setData({ ...data, timezone: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select your timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Europe/Berlin">Berlin</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                  <option value="Australia/Sydney">Sydney</option>
                  <option value="Pacific/Auckland">Auckland</option>
                </select>
              </div>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="glass-effect border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95">
            <CardHeader>
              <CardTitle className="text-center">Choose Your Frameworks</CardTitle>
              <CardDescription className="text-center">
                Select the philosophical paths that resonate with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFrameworks.map((framework) => (
                  <motion.button
                    key={framework.id}
                    onClick={() => {
                      const newFrameworks = data.selectedFrameworks.includes(framework.id)
                        ? data.selectedFrameworks.filter(id => id !== framework.id)
                        : [...data.selectedFrameworks, framework.id];
                      setData({ ...data, selectedFrameworks: newFrameworks });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      data.selectedFrameworks.includes(framework.id)
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border bg-surface-2 hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{framework.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-text">{framework.name}</h3>
                        <p className="text-sm text-muted">{framework.description}</p>
                      </div>
                      {data.selectedFrameworks.includes(framework.id) && (
                        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="glass-effect border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95">
            <CardHeader>
              <CardTitle className="text-center">Learning Preferences</CardTitle>
              <CardDescription className="text-center">
                Help us personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <question.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-text">{question.text}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setData({ ...data, [question.id]: option.value })}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          data[question.id as keyof OnboardingData] === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-surface-2 hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="w-5 h-5 text-primary" />
                          <span className="text-text">{option.label}</span>
                          {data[question.id as keyof OnboardingData] === option.value && (
                            <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="glass-effect border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95">
            <CardHeader>
              <CardTitle className="text-center">Ready to Begin</CardTitle>
              <CardDescription className="text-center">
                Let's review your preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-text">Name</p>
                    <p className="text-sm text-muted">{data.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-text">Timezone</p>
                    <p className="text-sm text-muted">{data.timezone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <Heart className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-text">Selected Frameworks</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.selectedFrameworks.map((frameworkId) => {
                        const framework = availableFrameworks.find(f => f.id === frameworkId);
                        return (
                          <span key={frameworkId} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {framework?.emoji} {framework?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted mb-4">
                  Your personalized journey begins now. We'll use these preferences to tailor your experience.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with Close Button */}
        <div className="relative text-center mb-8">
          {/* Close Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="absolute top-0 right-0 p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors duration-150"
            title="Exit onboarding"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4 shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-3">
            Welcome to Aristotle
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto px-4">
            Let's personalize your journey toward wisdom and virtue
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto px-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-200 ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-white shadow-lg' 
                  : 'border-border text-muted bg-surface'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
                ) : (
                  <span className="text-xs md:text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 md:w-20 h-0.5 mx-2 md:mx-3 transition-all duration-200 ${
                  index < currentStep ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Title */}
        <div className="text-center mb-6 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-base md:text-lg text-muted">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="mx-4">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center px-4 mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="text-sm text-muted">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? 'Setting up...' : 'Complete Setup'}
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
