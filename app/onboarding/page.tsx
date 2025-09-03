'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  Globe, 
  User,
  Clock,
  Target,
  Heart,
  Brain,
  Shield,
  Scale,
  Leaf,
  Zap,
  Star,
  Users,
  Eye,
  Compass,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { getAllFrameworks, FrameworkConfig } from '@/lib/frameworks.config';

interface OnboardingData {
  name: string;
  timezone: string;
  question1: boolean; // Do you prefer structured learning or intuitive exploration?
  question2: boolean; // Are you more motivated by personal achievement or community connection?
  question3: boolean; // Do you tend to confront challenges directly or adapt around them?
  question4: boolean; // Do you prefer individual practice or group activities?
  question5: boolean; // Are you more focused on physical discipline or mental cultivation?
  selectedFrameworks: string[];
}

interface FrameworkDisplay {
  slug: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  virtuePrimary: string;
  virtueSecondary?: string;
}

// Human-readable timezone options with proper formatting
const timezones = [
  { value: 'UTC-12:00', label: 'Baker Island (UTC-12:00)' },
  { value: 'UTC-11:00', label: 'Samoa (UTC-11:00)' },
  { value: 'UTC-10:00', label: 'Hawaii (UTC-10:00)' },
  { value: 'UTC-09:00', label: 'Alaska (UTC-09:00)' },
  { value: 'UTC-08:00', label: 'Pacific Time (UTC-08:00)' },
  { value: 'UTC-07:00', label: 'Mountain Time (UTC-07:00)' },
  { value: 'UTC-06:00', label: 'Central Time (UTC-06:00)' },
  { value: 'UTC-05:00', label: 'Eastern Time (UTC-05:00)' },
  { value: 'UTC-04:00', label: 'Atlantic Time (UTC-04:00)' },
  { value: 'UTC-03:00', label: 'Brazil (UTC-03:00)' },
  { value: 'UTC-02:00', label: 'South Georgia (UTC-02:00)' },
  { value: 'UTC-01:00', label: 'Azores (UTC-01:00)' },
  { value: 'UTC+00:00', label: 'London (UTC+00:00)' },
  { value: 'UTC+01:00', label: 'Paris, Berlin (UTC+01:00)' },
  { value: 'UTC+02:00', label: 'Cairo, Helsinki (UTC+02:00)' },
  { value: 'UTC+03:00', label: 'Moscow, Istanbul (UTC+03:00)' },
  { value: 'UTC+04:00', label: 'Dubai, Baku (UTC+04:00)' },
  { value: 'UTC+05:00', label: 'Mumbai, Tashkent (UTC+05:00)' },
  { value: 'UTC+05:30', label: 'New Delhi (UTC+05:30)' },
  { value: 'UTC+06:00', label: 'Dhaka, Almaty (UTC+06:00)' },
  { value: 'UTC+07:00', label: 'Bangkok, Jakarta (UTC+07:00)' },
  { value: 'UTC+08:00', label: 'Beijing, Singapore (UTC+08:00)' },
  { value: 'UTC+09:00', label: 'Tokyo, Seoul (UTC+09:00)' },
  { value: 'UTC+10:00', label: 'Sydney, Melbourne (UTC+10:00)' },
  { value: 'UTC+11:00', label: 'Solomon Islands (UTC+11:00)' },
  { value: 'UTC+12:00', label: 'New Zealand (UTC+12:00)' }
];

const frameworks: FrameworkDisplay[] = [
  {
    slug: 'spartan',
    name: 'Spartan Agōgē',
    description: 'Discipline through hardship, physical excellence, mental toughness',
    icon: Shield,
    color: 'from-[#FFAD44] to-[#E24C43]',
    virtuePrimary: 'Courage',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'bushido',
    name: 'Samurai Bushidō',
    description: 'Honor, etiquette, precision, and the way of the warrior',
    icon: Target,
    color: 'from-[#E24C43] to-[#9DCA52]',
    virtuePrimary: 'Justice',
    virtueSecondary: 'Courage'
  },
  {
    slug: 'stoic',
    name: 'Stoicism',
    description: 'Rational thinking, emotional control, focus on what you can control',
    icon: Brain,
    color: 'from-[#6784AD] to-[#78D2BE]',
    virtuePrimary: 'Wisdom',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'monastic',
    name: 'Monastic Rule',
    description: 'Rhythm, order, service, and contemplative living',
    icon: BookOpen,
    color: 'from-[#C4AC88] to-[#B4A0FF]',
    virtuePrimary: 'Temperance',
    virtueSecondary: 'Wisdom'
  },
  {
    slug: 'yogic',
    name: 'Yogic Path',
    description: 'Union of body, mind, and spirit through ancient practices',
    icon: Heart,
    color: 'from-[#78D2BE] to-[#9DCA52]',
    virtuePrimary: 'Wisdom',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'indigenous',
    name: 'Indigenous Wisdom',
    description: 'Connection to nature, community, and ancestral knowledge',
    icon: Leaf,
    color: 'from-[#9DCA52] to-[#78D2BE]',
    virtuePrimary: 'Justice',
    virtueSecondary: 'Wisdom'
  },
  {
    slug: 'martial',
    name: 'Martial Arts Code',
    description: 'Discipline, respect, and the development of inner strength',
    icon: Zap,
    color: 'from-[#777777] to-[#FF915C]',
    virtuePrimary: 'Courage',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'sufi',
    name: 'Sufi Practice',
    description: 'Love, devotion, and the path to divine union',
    icon: Star,
    color: 'from-[#FFC46E] to-[#B4A0FF]',
    virtuePrimary: 'Wisdom',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'ubuntu',
    name: 'Ubuntu',
    description: 'Community, interconnectedness, and human dignity',
    icon: Users,
    color: 'from-[#66BAFF] to-[#9DCA52]',
    virtuePrimary: 'Justice',
    virtueSecondary: 'Wisdom'
  },
  {
    slug: 'highperf',
    name: 'Modern High-Performance',
    description: 'Systematic approaches to excellence and peak performance',
    icon: GraduationCap,
    color: 'from-[#FF73B3] to-[#7EB4FF]',
    virtuePrimary: 'Wisdom',
    virtueSecondary: 'Courage'
  },
  {
    slug: 'celtic_druid',
    name: 'Celtic Druid',
    description: 'Natural wisdom, seasonal cycles, and oral tradition',
    icon: Eye,
    color: 'from-[#9DCA52] to-[#78D2BE]',
    virtuePrimary: 'Wisdom',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'tibetan_monk',
    name: 'Tibetan Buddhist Monk',
    description: 'Inner transformation, philosophical debate, and compassion',
    icon: Compass,
    color: 'from-[#F2B34C] to-[#B4A0FF]',
    virtuePrimary: 'Wisdom',
    virtueSecondary: 'Temperance'
  },
  {
    slug: 'viking_berserker',
    name: 'Viking Berserker',
    description: 'Controlled aggression, battle preparation, and rage mastery',
    icon: Shield,
    color: 'from-[#E24C43] to-[#777777]',
    virtuePrimary: 'Courage',
    virtueSecondary: 'Temperance'
  }
];

const questions = [
  {
    id: 'question1',
    text: 'Do you prefer structured learning or intuitive exploration?',
    trueLabel: 'Structured learning',
    falseLabel: 'Intuitive exploration',
    icon: BookOpen
  },
  {
    id: 'question2',
    text: 'Are you more motivated by personal achievement or community connection?',
    trueLabel: 'Personal achievement',
    falseLabel: 'Community connection',
    icon: Target
  },
  {
    id: 'question3',
    text: 'Do you tend to confront challenges directly or adapt around them?',
    trueLabel: 'Confront directly',
    falseLabel: 'Adapt around',
    icon: Shield
  },
  {
    id: 'question4',
    text: 'Do you prefer individual practice or group activities?',
    trueLabel: 'Individual practice',
    falseLabel: 'Group activities',
    icon: Users
  },
  {
    id: 'question5',
    text: 'Are you more focused on physical discipline or mental cultivation?',
    trueLabel: 'Physical discipline',
    falseLabel: 'Mental cultivation',
    icon: Brain
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC+00:00',
    question1: true,
    question2: true,
    question3: true,
    question4: true,
    question5: true,
    selectedFrameworks: []
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { title: 'Personal Details', description: 'Tell us about yourself' },
    { title: 'Learning Preferences', description: 'Answer 5 quick questions' },
    { title: 'Choose Your Path', description: 'Select frameworks that resonate' },
    { title: 'Complete Setup', description: 'Finalize your journey' }
  ];

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleFramework = (slug: string) => {
    setData(prev => ({
      ...prev,
      selectedFrameworks: prev.selectedFrameworks.includes(slug)
        ? prev.selectedFrameworks.filter(f => f !== slug)
        : [...prev.selectedFrameworks, slug]
    }));
  };

  const handleComplete = async () => {
    if (data.selectedFrameworks.length === 0) {
      alert('Please select at least one framework');
      return;
    }

    setIsProcessing(true);
    try {
      // Save user preferences
      const prefsResponse = await fetch('/api/prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          framework: data.selectedFrameworks[0], // Primary framework
          name: data.name,
          timezone: data.timezone,
          secondaryFrameworks: data.selectedFrameworks.slice(1)
        }),
      });

      if (!prefsResponse.ok) {
        throw new Error('Failed to save preferences');
      }

      // Save user facts
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facts }),
      });

      if (!factsResponse.ok) {
        console.error('Failed to save user facts');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error completing your setup. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-lg font-medium text-text">
                  What should I call you?
                </label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                  placeholder="Enter your name"
                  className="text-lg py-3 bg-surface-2 border-border text-text placeholder:text-muted focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-lg font-medium text-text">
                  What's your timezone?
                </label>
                <select
                  id="timezone"
                  value={data.timezone}
                  onChange={(e) => updateData('timezone', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value} className="bg-surface-2 text-text">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-2 border-border bg-surface hover:border-primary/30 transition-colors duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <question.icon className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-medium text-text">{question.text}</h3>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant={data[question.id as keyof OnboardingData] === true ? "default" : "outline"}
                        onClick={() => updateData(question.id as keyof OnboardingData, true)}
                        className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white border-primary"
                      >
                        {question.trueLabel}
                      </Button>
                      <Button
                        variant={data[question.id as keyof OnboardingData] === false ? "default" : "outline"}
                        onClick={() => updateData(question.id as keyof OnboardingData, false)}
                        className="flex-1 h-12 bg-surface-2 hover:bg-surface text-text border-border hover:border-primary/50"
                      >
                        {question.falseLabel}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-muted">
                Choose the frameworks that resonate with you. You can select multiple frameworks to create a personalized experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks.map((framework) => (
                <Card
                  key={framework.slug}
                  className={`cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${
                    data.selectedFrameworks.includes(framework.slug)
                      ? 'border-primary shadow-lg bg-surface-2'
                      : 'border-border bg-surface hover:border-primary/30'
                  }`}
                  onClick={() => toggleFramework(framework.slug)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${framework.color} flex items-center justify-center`}>
                        <framework.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-text">{framework.name}</h3>
                        <p className="text-xs text-muted">
                          {framework.virtuePrimary} + {framework.virtueSecondary || 'None'}
                        </p>
                      </div>
                      {data.selectedFrameworks.includes(framework.slug) && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted">{framework.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text">Ready to Begin Your Journey?</h2>
              <p className="text-muted">
                You've selected {data.selectedFrameworks.length} framework{data.selectedFrameworks.length !== 1 ? 's' : ''} that will shape your personalized experience.
              </p>
            </div>
            
            <div className="bg-surface-2 rounded-lg p-4 border border-border">
              <h3 className="font-medium mb-2 text-text">Selected Frameworks:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {data.selectedFrameworks.map(slug => {
                  const framework = frameworks.find(f => f.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30"
                    >
                      {framework?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-text mb-4">
              Welcome to Aristotle
            </h1>
            <p className="text-xl text-muted">
              Let's personalize your journey toward wisdom and virtue
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-border text-muted bg-surface'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Content */}
          <Card className="bg-surface border-border mb-8">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-surface-2 hover:bg-surface text-text border-border hover:border-primary/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !data.name) ||
                  (currentStep === 2 && data.selectedFrameworks.length === 0)
                }
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isProcessing || data.selectedFrameworks.length === 0}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 