'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Shield, Scale, Heart, Target, Users, Zap, Moon, Sun, Flame, Leaf, Droplets, Wind, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface OnboardingData {
  name: string;
  timezone: string;
  selectedFrameworks: string[];
  question1: boolean | null; // Structured learning
  question2: boolean | null; // Achievement focused
  question3: boolean | null; // Direct confrontation
  question4: boolean | null; // Individual practice
  question5: boolean | null; // Physical discipline
}

const frameworks = [
  {
    id: 'stoic',
    name: 'Stoicism',
    description: 'Ancient wisdom for modern resilience',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    benefits: ['Emotional control', 'Mental resilience', 'Practical wisdom']
  },
  {
    id: 'spartan',
    name: 'Spartan Agōgē',
    description: 'Discipline and strength through adversity',
    icon: Target,
    color: 'from-red-500 to-orange-500',
    benefits: ['Physical discipline', 'Mental toughness', 'Leadership skills']
  },
  {
    id: 'samurai',
    name: 'Samurai Bushidō',
    description: 'Honor, loyalty, and martial excellence',
    icon: Scale,
    color: 'from-purple-500 to-pink-500',
    benefits: ['Honor and integrity', 'Loyalty and duty', 'Martial discipline']
  },
  {
    id: 'monastic',
    name: 'Monastic Rule',
    description: 'Contemplation and spiritual growth',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    benefits: ['Spiritual growth', 'Inner peace', 'Mindful living']
  },
  {
    id: 'yogic',
    name: 'Yogic Path',
    description: 'Balance and harmony through practice',
    icon: Leaf,
    color: 'from-green-500 to-emerald-500',
    benefits: ['Physical health', 'Mental balance', 'Spiritual connection']
  },
  {
    id: 'indigenous',
    name: 'Indigenous Wisdom',
    description: 'Connection to nature and community',
    icon: Wind,
    color: 'from-amber-500 to-yellow-500',
    benefits: ['Nature connection', 'Community values', 'Traditional wisdom']
  },
  {
    id: 'martial',
    name: 'Martial Arts Code',
    description: 'Discipline through physical mastery',
    icon: Flame,
    color: 'from-red-500 to-pink-500',
    benefits: ['Physical mastery', 'Mental discipline', 'Self-defense']
  },
  {
    id: 'sufi',
    name: 'Sufi Practice',
    description: 'Mystical wisdom and inner transformation',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
    benefits: ['Inner transformation', 'Mystical wisdom', 'Spiritual insight']
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu Philosophy',
    description: 'Humanity and community connection',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    benefits: ['Community values', 'Human connection', 'Shared humanity']
  },
  {
    id: 'modern',
    name: 'Modern High-Performance',
    description: 'Evidence-based optimization',
    icon: Zap,
    color: 'from-blue-500 to-indigo-500',
    benefits: ['Performance optimization', 'Evidence-based methods', 'Modern tools']
  },
  {
    id: 'celtic',
    name: 'Celtic Druid',
    description: 'Nature wisdom and seasonal cycles',
    icon: Leaf,
    color: 'from-green-500 to-blue-500',
    benefits: ['Nature wisdom', 'Seasonal awareness', 'Ancient knowledge']
  },
  {
    id: 'tibetan',
    name: 'Tibetan Buddhist Monk',
    description: 'Inner peace and spiritual awakening',
    icon: Sun,
    color: 'from-yellow-500 to-orange-500',
    benefits: ['Inner peace', 'Spiritual awakening', 'Compassion']
  },
  {
    id: 'viking',
    name: 'Viking Berserker',
    description: 'Courage and strength in battle',
    icon: Flame,
    color: 'from-red-500 to-yellow-500',
    benefits: ['Courage and bravery', 'Physical strength', 'Battle wisdom']
  }
];

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' }
];

const questions = [
  {
    id: 'question1',
    text: 'Do you prefer structured learning with clear steps and milestones?',
    trueLabel: 'Yes, I like clear structure',
    falseLabel: 'No, I prefer flexibility',
    icon: Brain
  },
  {
    id: 'question2',
    text: 'Are you more focused on achieving specific goals or enjoying the journey?',
    trueLabel: 'Goal-focused achiever',
    falseLabel: 'Journey enjoyer',
    icon: Target
  },
  {
    id: 'question3',
    text: 'Do you prefer to confront challenges directly or work around them?',
    trueLabel: 'Direct confrontation',
    falseLabel: 'Work around challenges',
    icon: Shield
  },
  {
    id: 'question4',
    text: 'Do you prefer to practice individually or with others?',
    trueLabel: 'Individual practice',
    falseLabel: 'Group practice',
    icon: Users
  },
  {
    id: 'question5',
    text: 'Do you value physical discipline and fitness in your practice?',
    trueLabel: 'Physical discipline',
    falseLabel: 'Mental focus only',
    icon: Heart
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    timezone: 'UTC',
    selectedFrameworks: [],
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null
  });

  const toggleFramework = (frameworkId: string) => {
    setData(prev => ({
      ...prev,
      selectedFrameworks: prev.selectedFrameworks.includes(frameworkId)
        ? prev.selectedFrameworks.filter(id => id !== frameworkId)
        : [...prev.selectedFrameworks, frameworkId]
    }));
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.name.trim() !== '' && data.timezone !== '';
      case 1:
        return data.question1 !== null && data.question2 !== null && 
               data.question3 !== null && data.question4 !== null && data.question5 !== null;
      case 2:
        return data.selectedFrameworks.length > 0;
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
      // Get auth headers
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      const authHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      // Step 1: Save user preferences to database
      const prefsResponse = await fetch('/api/prefs', {
        method: 'POST',
        headers: authHeaders,
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
        throw new Error(`Failed to save preferences: ${errorData.error || 'Unknown error'}`);
      }

      console.log('✅ User preferences saved successfully');

      // Step 2: Save user facts for AI personalization
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
        headers: authHeaders,
        body: JSON.stringify({ facts }),
      });

      if (!factsResponse.ok) {
        console.error('Failed to save user facts, but continuing with onboarding');
      } else {
        console.log('✅ User facts saved successfully');
      }

      // Step 3: Mark onboarding task as completed
      const taskResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          action: 'complete',
          tag: 'onboarding'
        }),
      });

      if (!taskResponse.ok) {
        console.error('Failed to mark onboarding task as completed, but continuing');
      } else {
        console.log('✅ Onboarding task marked as completed');
      }

      // Step 4: Update onboarding status
      const onboardingStatusResponse = await fetch('/api/onboarding-status', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ 
          isComplete: true,
          completedAt: new Date().toISOString()
        }),
      });

      if (!onboardingStatusResponse.ok) {
        console.error('Failed to update onboarding status, but continuing');
      } else {
        console.log('✅ Onboarding status updated successfully');
      }

      // Store in localStorage for immediate use
      localStorage.setItem('userPreferences', JSON.stringify({
        name: data.name,
        timezone: data.timezone,
        framework: data.selectedFrameworks[0],
        secondaryFrameworks: data.selectedFrameworks.slice(1),
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      }));

      // Store personality profile for AI personalization
      localStorage.setItem('personalityProfile', JSON.stringify({
        structuredLearning: data.question1,
        achievementFocused: data.question2,
        directConfrontation: data.question3,
        individualPractice: data.question4,
        physicalDiscipline: data.question5
      }));

      // Success message
      alert('Onboarding completed successfully! Your preferences have been saved.');

      // Redirect to today page
      router.push('/today');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      alert(`There was an error completing your setup: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="bg-surface border-2 border-border shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-lg font-semibold text-text">
                    What should I call you?
                  </label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    placeholder="Enter your name"
                    className="h-12 text-lg bg-white text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-medium"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="timezone" className="block text-lg font-semibold text-text">
                    What's your timezone?
                  </label>
                  <select
                    id="timezone"
                    value={data.timezone}
                    onChange={(e) => updateData('timezone', e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg bg-white text-gray-900 text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-medium"
                  >
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value} className="bg-white text-gray-900 py-2">
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <div className="space-y-4 md:space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className={`border-2 rounded-lg p-4 md:p-6 transition-all duration-200 hover:shadow-lg ${
                data[question.id as keyof OnboardingData] === null
                  ? 'border-orange-400 bg-orange-50/10 hover:border-orange-300'
                  : 'border-border bg-surface hover:border-primary/30'
              }`}>
                <div className="flex items-center space-x-3 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <question.icon className="w-4 h-4 md:w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-text leading-tight">{question.text}</h3>
                    {data[question.id as keyof OnboardingData] === null && (
                      <p className="text-sm text-orange-400 mt-1">Please select an option</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      console.log('Clicking true for question:', question.id, 'current value:', data[question.id as keyof OnboardingData]);
                      updateData(question.id as keyof OnboardingData, true);
                    }}
                    className={`h-10 md:h-12 text-sm md:text-base font-medium transition-all duration-200 ${
                      data[question.id as keyof OnboardingData] === true
                        ? 'bg-surface-2 hover:bg-surface text-text border-2 border-border hover:border-primary/50 shadow-sm'
                        : 'bg-surface-2 hover:bg-surface text-text border-2 border-border hover:border-primary/50 shadow-sm'
                    }`}
                  >
                    {question.trueLabel}
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('Clicking false for question:', question.id, 'current value:', data[question.id as keyof OnboardingData]);
                      updateData(question.id as keyof OnboardingData, false);
                    }}
                    className={`h-10 md:h-12 text-sm md:text-base font-medium transition-all duration-200 ${
                      data[question.id as keyof OnboardingData] === false
                        ? 'bg-surface-2 hover:bg-surface text-text border-2 border-border hover:border-primary/50 shadow-sm'
                        : 'bg-surface-2 hover:bg-surface text-text border-2 border-border hover:border-primary/50 shadow-sm'
                    }`}
                  >
                    {question.falseLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-text mb-2">Choose Your Primary Framework</h3>
              <p className="text-muted">Select the philosophical framework that resonates most with you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  onClick={() => toggleFramework(framework.id)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${
                    data.selectedFrameworks.includes(framework.id)
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border bg-surface hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${framework.color} flex items-center justify-center`}>
                      <framework.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{framework.name}</h4>
                      <p className="text-sm text-muted">{framework.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {framework.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm text-text">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-text mb-2">Ready to Begin Your Journey</h3>
              <p className="text-muted text-lg">
                You've chosen the {data.selectedFrameworks[0]} framework. 
                Let's get you started with your personalized experience.
              </p>
            </div>

            <div className="bg-surface-2 rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-text mb-2">Your Setup Summary</h4>
              <div className="text-sm text-muted space-y-1">
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Timezone:</strong> {data.timezone}</p>
                <p><strong>Primary Framework:</strong> {frameworks.find(f => f.id === data.selectedFrameworks[0])?.name}</p>
                {data.selectedFrameworks.length > 1 && (
                  <p><strong>Secondary:</strong> {data.selectedFrameworks.slice(1).map(id => frameworks.find(f => f.id === id)?.name).join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Welcome to Aristotle
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Let's personalize your journey through ancient wisdom and modern practice
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">Step {currentStep + 1} of 4</span>
              <span className="text-sm text-muted">{Math.round(((currentStep + 1) / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="px-6 py-3"
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-6 py-3 bg-primary hover:bg-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isProcessing}
                className="px-6 py-3 bg-primary hover:bg-primary/90"
              >
                {isProcessing ? 'Setting up...' : 'Complete Setup'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
