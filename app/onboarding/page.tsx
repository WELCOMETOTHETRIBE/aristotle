'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Shield, Scale, Heart, Target, Users, Zap, Moon, Sun, Flame, Leaf, Droplets, Wind, Sparkles, ArrowRight, Check } from 'lucide-react';

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
    color: 'from-fw-stoic to-blue-400',
    benefits: ['Emotional control', 'Mental resilience', 'Practical wisdom']
  },
  {
    id: 'spartan',
    name: 'Spartan Agōgē',
    description: 'Discipline and strength through adversity',
    icon: Target,
    color: 'from-fw-spartan to-orange-400',
    benefits: ['Physical discipline', 'Mental toughness', 'Leadership skills']
  },
  {
    id: 'samurai',
    name: 'Samurai Bushidō',
    description: 'Honor, loyalty, and martial excellence',
    icon: Scale,
    color: 'from-fw-bushido to-red-400',
    benefits: ['Honor and integrity', 'Loyalty and duty', 'Martial discipline']
  },
  {
    id: 'monastic',
    name: 'Monastic Rule',
    description: 'Contemplation and spiritual growth',
    icon: Moon,
    color: 'from-fw-monastic to-indigo-400',
    benefits: ['Spiritual growth', 'Inner peace', 'Mindful living']
  },
  {
    id: 'yogic',
    name: 'Yogic Path',
    description: 'Balance and harmony through practice',
    icon: Leaf,
    color: 'from-fw-yogic to-emerald-400',
    benefits: ['Physical health', 'Mental balance', 'Spiritual connection']
  },
  {
    id: 'indigenous',
    name: 'Indigenous Wisdom',
    description: 'Connection to nature and community',
    icon: Wind,
    color: 'from-fw-indigenous to-green-400',
    benefits: ['Nature connection', 'Community values', 'Traditional wisdom']
  },
  {
    id: 'martial',
    name: 'Martial Arts Code',
    description: 'Discipline through physical mastery',
    icon: Flame,
    color: 'from-fw-martial to-red-400',
    benefits: ['Physical mastery', 'Mental discipline', 'Self-defense']
  },
  {
    id: 'sufi',
    name: 'Sufi Practice',
    description: 'Mystical wisdom and inner transformation',
    icon: Sparkles,
    color: 'from-fw-sufi to-purple-400',
    benefits: ['Inner transformation', 'Mystical wisdom', 'Spiritual insight']
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu Philosophy',
    description: 'Humanity and community connection',
    icon: Users,
    color: 'from-fw-ubuntu to-blue-400',
    benefits: ['Community values', 'Human connection', 'Shared humanity']
  },
  {
    id: 'modern',
    name: 'Modern High-Performance',
    description: 'Evidence-based optimization',
    icon: Zap,
    color: 'from-fw-highperf to-pink-400',
    benefits: ['Performance optimization', 'Evidence-based methods', 'Modern tools']
  },
  {
    id: 'celtic',
    name: 'Celtic Druid',
    description: 'Nature wisdom and seasonal cycles',
    icon: Leaf,
    color: 'from-fw-indigenous to-green-400',
    benefits: ['Nature wisdom', 'Seasonal awareness', 'Ancient knowledge']
  },
  {
    id: 'tibetan',
    name: 'Tibetan Buddhist Monk',
    description: 'Inner peace and spiritual awakening',
    icon: Sun,
    color: 'from-fw-monastic to-yellow-400',
    benefits: ['Inner peace', 'Spiritual awakening', 'Compassion']
  },
  {
    id: 'viking',
    name: 'Viking Berserker',
    description: 'Courage and strength in battle',
    icon: Flame,
    color: 'from-fw-spartan to-red-400',
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

      // Step 2: Save user facts for AI personalization
      console.log('🧠 Step 2: Saving user facts...');
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

      if (!factsResponse.ok) {
        console.error('⚠️ Failed to save user facts, but continuing with onboarding');
      } else {
        console.log('✅ User facts saved successfully');
      }

      // Step 3: Mark onboarding task as completed
      console.log('✅ Step 3: Marking onboarding task as completed...');
      const taskResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete',
          tag: 'onboarding'
        }),
      });

      if (!taskResponse.ok) {
        console.error('⚠️ Failed to mark onboarding task as completed, but continuing');
      } else {
        console.log('✅ Onboarding task marked as completed');
      }

      // Step 4: Update onboarding status
      console.log('📊 Step 4: Updating onboarding status...');
      const onboardingStatusResponse = await fetch('/api/onboarding-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isComplete: true,
          completedAt: new Date().toISOString()
        }),
      });

      if (!onboardingStatusResponse.ok) {
        console.error('⚠️ Failed to update onboarding status, but continuing');
      } else {
        console.log('✅ Onboarding status updated successfully');
      }

      // Store in localStorage for immediate use
      const userPrefs = {
        displayName: data.name,
        name: data.name,
        timezone: data.timezone,
        framework: data.selectedFrameworks[0],
        secondaryFrameworks: data.selectedFrameworks.slice(1),
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('userPreferences', JSON.stringify(userPrefs));
      console.log('💾 User preferences saved to localStorage:', userPrefs);

      // Store personality profile for AI personalization
      localStorage.setItem('personalityProfile', JSON.stringify({
        structuredLearning: data.question1,
        achievementFocused: data.question2,
        directConfrontation: data.question3,
        individualPractice: data.question4,
        physicalDiscipline: data.question5
      }));

      // Success message
      console.log('🎉 Onboarding completed successfully!');
      alert('Onboarding completed successfully! Your preferences have been saved.');

      // Dispatch custom event to notify header to update task count
      window.dispatchEvent(new CustomEvent('taskCompleted'));

      // Redirect to today page
      router.push('/today');
    } catch (error: any) {
      console.error('❌ Error completing onboarding:', error);
      alert(`There was an error completing your setup: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="bg-gray-800/50 border border-gray-600 shadow-xl backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-lg font-semibold text-white">
                    What should I call you?
                  </label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    placeholder="Enter your name"
                    className="h-12 text-lg bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-fast"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="timezone" className="block text-lg font-semibold text-white">
                    What's your timezone?
                  </label>
                  <select
                    id="timezone"
                    value={data.timezone}
                    onChange={(e) => updateData('timezone', e.target.value)}
                    className="w-full h-12 px-4 border border-gray-600 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-fast"
                  >
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value} className="bg-gray-700 text-white py-2">
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
              <div key={question.id} className={`border border-gray-600 rounded-lg p-4 md:p-6 transition-all duration-fast hover:shadow-xl backdrop-blur-sm ${
                data[question.id as keyof OnboardingData] === null
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-blue-500/50'
              }`}>
                <div className="flex items-center space-x-3 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <question.icon className="w-4 h-4 md:w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-white leading-tight">{question.text}</h3>
                    {data[question.id as keyof OnboardingData] === null && (
                      <p className="text-sm text-yellow-400 mt-1">Please select an option</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => updateData(question.id as keyof OnboardingData, true)}
                    className={`h-10 md:h-12 text-sm md:text-base font-medium transition-all duration-fast ${
                      data[question.id as keyof OnboardingData] === true
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-blue-500 shadow-xl'
                        : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-blue-500/50'
                    }`}
                  >
                    {question.trueLabel}
                  </Button>
                  <Button
                    onClick={() => updateData(question.id as keyof OnboardingData, false)}
                    className={`h-10 md:h-12 text-sm md:text-base font-medium transition-all duration-fast ${
                      data[question.id as keyof OnboardingData] === false
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-blue-500 shadow-xl'
                        : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-blue-500/50'
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
              <h3 className="text-xl font-semibold text-white mb-2">Choose Your Primary Framework</h3>
              <p className="text-gray-300">Select the philosophical framework that resonates most with you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  onClick={() => toggleFramework(framework.id)}
                  className={`cursor-pointer border border-gray-600 rounded-lg p-4 transition-all duration-fast hover:shadow-xl backdrop-blur-sm ${
                    data.selectedFrameworks.includes(framework.id)
                      ? 'border-blue-500 bg-blue-500/10 shadow-xl'
                      : 'border-gray-600 bg-gray-800/50 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${framework.color} flex items-center justify-center`}>
                      <framework.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{framework.name}</h4>
                      <p className="text-sm text-gray-300">{framework.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {framework.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">{benefit}</span>
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
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-blue-400" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Begin Your Journey</h3>
              <p className="text-gray-300 text-lg">
                You've chosen the {data.selectedFrameworks[0]} framework. 
                Let's get you started with your personalized experience.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 backdrop-blur-sm">
              <h4 className="font-semibold text-white mb-2">Your Setup Summary</h4>
              <div className="text-sm text-gray-300 space-y-1">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Aristotle
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Let's personalize your journey through ancient wisdom and modern practice
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Step {currentStep + 1} of 4</span>
              <span className="text-sm text-gray-300">{Math.round(((currentStep + 1) / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-slow"
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
              className="px-6 py-3 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
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
