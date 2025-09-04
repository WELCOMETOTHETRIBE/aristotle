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
  question1: boolean | null; // Do you prefer structured learning or intuitive exploration?
  question2: boolean | null; // Are you more motivated by personal achievement or community connection?
  question3: boolean | null; // Do you tend to confront challenges directly or adapt around them?
  question4: boolean | null; // Do you prefer individual practice or group activities?
  question5: boolean | null; // Are you more focused on physical discipline or mental cultivation?
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

// Clean, professional timezone options
const timezones = [
  { value: 'UTC-08:00', label: 'Pacific Time' },
  { value: 'UTC-07:00', label: 'Mountain Time' },
  { value: 'UTC-06:00', label: 'Central Time' },
  { value: 'UTC-05:00', label: 'Eastern Time' },
  { value: 'UTC-04:00', label: 'Atlantic Time' },
  { value: 'UTC+00:00', label: 'London' },
  { value: 'UTC+01:00', label: 'Central Europe' },
  { value: 'UTC+02:00', label: 'Eastern Europe' },
  { value: 'UTC+03:00', label: 'Moscow' },
  { value: 'UTC+05:30', label: 'India' },
  { value: 'UTC+08:00', label: 'China' },
  { value: 'UTC+09:00', label: 'Japan' },
  { value: 'UTC+10:00', label: 'Australia' }
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
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
    selectedFrameworks: []
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Debug: Monitor selectedFrameworks changes
  useEffect(() => {
    console.log('selectedFrameworks state changed:', data.selectedFrameworks);
  }, [data.selectedFrameworks]);

  const steps = [
    { title: 'Personal Details', description: 'Tell us about yourself' },
    { title: 'Learning Preferences', description: 'Answer 5 quick questions' },
    { title: 'Choose Your Path', description: 'Select frameworks that resonate' },
    { title: 'Complete Setup', description: 'Finalize your journey' }
  ];

  const updateData = (field: keyof OnboardingData, value: any) => {
    console.log('Updating data:', field, 'to:', value, 'current data:', data);
    setData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New data:', newData);
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Check if all questions are answered
      const unansweredQuestions = ['question1', 'question2', 'question3', 'question4', 'question5'].filter(
        q => data[q as keyof OnboardingData] === null
      );
      
      if (unansweredQuestions.length > 0) {
        alert(`Please answer all questions before continuing.`);
        return;
      }
    }
    
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
    console.log('Toggling framework:', slug, 'Current selection:', data.selectedFrameworks);
    setData(prev => {
      const newSelection = prev.selectedFrameworks.includes(slug)
        ? prev.selectedFrameworks.filter(f => f !== slug)
        : [...prev.selectedFrameworks, slug];
      console.log('New selection:', newSelection);
      return {
        ...prev,
        selectedFrameworks: newSelection
      };
    });
  };

  const handleComplete = async () => {
    if (data.selectedFrameworks.length === 0) {
      alert('Please select at least one framework');
      return;
    }

    setIsProcessing(true);
    try {
      // Get auth token from cookies
      const getAuthHeaders = () => {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        
        // Try to get auth token from cookies
        if (typeof document !== 'undefined') {
          const cookies = document.cookie;
          if (cookies.includes('auth-token=')) {
            // Extract the token from cookies
            const tokenMatch = cookies.match(/auth-token=([^;]+)/);
            if (tokenMatch) {
              headers['Authorization'] = `Bearer ${tokenMatch[1]}`;
            }
          }
        }
        
        return headers;
      };

      const authHeaders = getAuthHeaders();

      // First, save user preferences to database
      const prefsResponse = await fetch('/api/prefs', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ 
          framework: data.selectedFrameworks[0], // Primary framework
          name: data.name,
          timezone: data.timezone,
          secondaryFrameworks: data.selectedFrameworks.slice(1),
          isOnboarding: true
        }),
      });

      if (!prefsResponse.ok) {
        const errorData = await prefsResponse.json();
        throw new Error(`Failed to save preferences: ${errorData.error || 'Unknown error'}`);
      }

      // Save user facts for AI personalization
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
      }

      // Save onboarding completion status
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

      // Redirect to dashboard
      router.push('/dashboard');
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
                    <question.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
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
                        ? 'bg-primary hover:bg-primary/90 text-white border-primary shadow-sm'
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
                        ? 'bg-primary hover:bg-primary/90 text-white border-primary shadow-sm'
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
            <div className="text-center mb-6">
              <div className="text-sm text-primary font-medium">
                Selected: {data.selectedFrameworks.length} framework{data.selectedFrameworks.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {frameworks.map((framework) => {
                const isSelected = data.selectedFrameworks.includes(framework.slug);
                console.log(`Framework ${framework.slug}: isSelected=${isSelected}, current selection:`, data.selectedFrameworks);
                return (
                  <Card
                    key={`${framework.slug}-${isSelected}`}
                    className={`cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] ${
                      isSelected
                        ? 'border-primary shadow-xl bg-surface-2 ring-2 ring-primary/20'
                        : 'border-border bg-surface hover:border-primary/30 hover:shadow-lg'
                    }`}
                    onClick={() => toggleFramework(framework.slug)}
                  >
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-start space-x-3 mb-3 md:mb-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${framework.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <framework.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-text mb-1 leading-tight">{framework.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                              {framework.virtuePrimary}
                            </span>
                            {framework.virtueSecondary && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                                {framework.virtueSecondary}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{framework.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <Card className="bg-surface border-2 border-border shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-text mb-3">Ready to Begin Your Journey?</h2>
                    <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
                      You've selected {data.selectedFrameworks.length} framework{data.selectedFrameworks.length !== 1 ? 's' : ''} that will shape your personalized experience.
                    </p>
                  </div>
                </div>
                
                <div className="bg-surface-2 rounded-xl p-6 border border-border max-w-2xl mx-auto">
                  <h3 className="font-semibold text-lg mb-4 text-text">Selected Frameworks</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {data.selectedFrameworks.map(slug => {
                      const framework = frameworks.find(f => f.slug === slug);
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/30 shadow-sm"
                        >
                          {framework?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
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
        <div className="flex justify-between items-center px-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 md:px-8 py-2 md:py-3 h-10 md:h-12 bg-surface-2 hover:bg-surface text-text border-2 border-border hover:border-primary/50 font-medium transition-all duration-200 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !data.name) ||
                (currentStep === 2 && data.selectedFrameworks.length === 0)
              }
              className="px-6 md:px-8 py-2 md:py-3 h-10 md:h-12 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
            >
              Next
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isProcessing || data.selectedFrameworks.length === 0}
              className="px-6 md:px-8 py-2 md:py-3 h-10 md:h-12 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 