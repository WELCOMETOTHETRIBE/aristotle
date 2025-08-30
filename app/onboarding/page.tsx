'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, ArrowRight, Brain, Heart, Target, Shield, Scale, Leaf, Sparkles, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { getAllFrameworks, FrameworkConfig } from '@/lib/frameworks.config';

interface PersonalityProfile {
  primaryVirtue: 'WISDOM' | 'COURAGE' | 'JUSTICE' | 'TEMPERANCE';
  secondaryVirtue?: 'WISDOM' | 'COURAGE' | 'JUSTICE' | 'TEMPERANCE';
  learningStyle: 'structured' | 'intuitive' | 'experiential' | 'contemplative';
  motivationType: 'achievement' | 'connection' | 'mastery' | 'contribution';
  challengeResponse: 'confront' | 'adapt' | 'analyze' | 'accept';
  energyLevel: 'high' | 'moderate' | 'low';
  socialPreference: 'individual' | 'community' | 'balanced';
  timeAvailability: 'minimal' | 'moderate' | 'extensive';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  stressTriggers: string[];
  strengths: string[];
  weaknesses: string[];
  aspirations: string[];
  knowledgeGaps: string[];
}

interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  type: 'voice' | 'choice' | 'slider' | 'multiSelect';
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
  analysisKey: keyof PersonalityProfile;
}

const assessmentSteps: AssessmentStep[] = [
  {
    id: 'name',
    title: 'What should I call you?',
    description: 'Tell me your name so I can personalize our journey together.',
    type: 'voice',
    placeholder: 'My name is...',
    analysisKey: 'primaryVirtue' // Will be analyzed for tone and personality indicators
  },
  {
    id: 'aspirations',
    title: 'What are your deepest aspirations?',
    description: 'What would you like to achieve or become in your life?',
    type: 'voice',
    placeholder: 'I aspire to...',
    analysisKey: 'aspirations'
  },
  {
    id: 'learning_style',
    title: 'How do you prefer to learn and grow?',
    description: 'Choose the approach that resonates most with you.',
    type: 'choice',
    options: [
      'Through structured practice and discipline',
      'By following my intuition and inner wisdom',
      'Through direct experience and experimentation',
      'Through deep reflection and contemplation'
    ],
    analysisKey: 'learningStyle'
  },
  {
    id: 'motivation',
    title: 'What drives you most?',
    description: 'What gives you the most energy and purpose?',
    type: 'choice',
    options: [
      'Achieving goals and building skills',
      'Connecting with others and building community',
      'Mastering knowledge and understanding',
      'Contributing to something larger than myself'
    ],
    analysisKey: 'motivationType'
  },
      {
      id: 'challenges',
      title: 'How do you typically respond to challenges?',
      description: 'When faced with difficulties, what\'s your natural approach?',
      type: 'choice',
      options: [
        'I confront them directly and push through',
        'I adapt and find creative solutions',
        'I analyze and understand the problem first',
        'I accept what I can\'t change and work with what I can'
      ],
      analysisKey: 'challengeResponse'
    },
  {
    id: 'energy',
    title: 'What\'s your typical energy level?',
    description: 'How would you describe your natural energy and pace?',
    type: 'choice',
    options: [
      'High energy - I thrive on intensity and action',
      'Moderate energy - I prefer steady, balanced activity',
      'Lower energy - I value calm and thoughtful approaches'
    ],
    analysisKey: 'energyLevel'
  },
  {
    id: 'social',
    title: 'How do you prefer to practice?',
    description: 'What social context works best for your growth?',
    type: 'choice',
    options: [
      'Individually - I prefer personal practice and reflection',
      'In community - I thrive with others and shared experiences',
      'Balanced - I value both personal practice and community connection'
    ],
    analysisKey: 'socialPreference'
  },
  {
    id: 'time',
    title: 'How much time can you dedicate daily?',
    description: 'What\'s realistic for your current lifestyle?',
    type: 'choice',
    options: [
      'Minimal (5-15 minutes)',
      'Moderate (15-45 minutes)',
      'Extensive (45+ minutes)'
    ],
    analysisKey: 'timeAvailability'
  },
  {
    id: 'experience',
    title: 'What\'s your experience with personal development?',
    description: 'How familiar are you with practices like meditation, philosophy, or wellness?',
    type: 'choice',
    options: [
      'Beginner - I\'m just starting this journey',
      'Intermediate - I have some experience and want to deepen',
      'Advanced - I\'m experienced and looking for new challenges'
    ],
    analysisKey: 'experienceLevel'
  },
  {
    id: 'strengths',
    title: 'What are your greatest strengths?',
    description: 'What qualities or abilities do you naturally excel at?',
    type: 'voice',
    placeholder: 'My strengths include...',
    analysisKey: 'strengths'
  },
  {
    id: 'weaknesses',
    title: 'What areas would you like to improve?',
    description: 'What challenges or limitations do you want to work on?',
    type: 'voice',
    placeholder: 'I struggle with...',
    analysisKey: 'weaknesses'
  },
  {
    id: 'stress',
    title: 'What typically causes you stress or difficulty?',
    description: 'What situations or patterns tend to challenge you?',
    type: 'voice',
    placeholder: 'I find it difficult when...',
    analysisKey: 'stressTriggers'
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [recommendedFramework, setRecommendedFramework] = useState<FrameworkConfig | null>(null);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const currentStepData = assessmentSteps[currentStep];

  // Initialize media recorder
  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          } 
        });
        
        let mimeType = 'audio/webm;codecs=opus';
        
        if (MediaRecorder.isTypeSupported('audio/mp3')) {
          mimeType = 'audio/mp3';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=vorbis')) {
          mimeType = 'audio/webm;codecs=vorbis';
        }
        
        const recorder = new MediaRecorder(stream, {
          mimeType,
          audioBitsPerSecond: 128000,
        });
        
        let chunks: Blob[] = [];
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
            setAudioChunks(prev => [...prev, event.data]);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: mimeType });
          
          if (audioBlob.size > 0) {
            await transcribeAudio(audioBlob);
          } else {
            setTranscript('No audio detected. Please try recording again.');
          }
          chunks = [];
          setAudioChunks([]);
        };

        recorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setTranscript('Recording error. Please try again.');
        };

        setMediaRecorder(recorder);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setTranscript('Microphone access denied. Please allow microphone access and try again.');
      }
    };

    initMediaRecorder();
  }, []);

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setTranscript('Processing your audio...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      console.log('Sending audio for transcription, size:', audioBlob.size);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Transcription API error:', data);
        throw new Error(data.error || data.details || 'Transcription failed');
      }

      if (!data.text || data.text.trim() === '') {
        throw new Error('No text was transcribed. Please try speaking more clearly.');
      }

      console.log('Transcription successful:', data.text);
      setTranscript(data.text);
    } catch (error: any) {
      console.error('Transcription error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Error transcribing audio. ';
      
      if (error.message.includes('OpenAI API key')) {
        errorMessage += 'Service configuration error. Please contact support.';
      } else if (error.message.includes('Network error')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('Rate limit')) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('file too large')) {
        errorMessage += 'Recording too long. Please keep it under 25MB.';
      } else if (error.message.includes('file too small')) {
        errorMessage += 'Recording too short. Please speak for at least a few seconds.';
      } else if (error.message.includes('No text was transcribed')) {
        errorMessage += 'Please try speaking more clearly or check your microphone.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setTranscript(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceRecord = async () => {
    if (!mediaRecorder) return;

    if (!isRecording) {
      setIsRecording(true);
      setAudioChunks([]);
      setTranscript('');
      mediaRecorder.start(1000);
    } else {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  const handleChoiceSelect = (choice: string) => {
    setResponses(prev => ({
      ...prev,
      [currentStepData.id]: choice,
    }));
    
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleNext = async () => {
    if (transcript.trim()) {
      setResponses(prev => ({
        ...prev,
        [currentStepData.id]: transcript,
      }));
      setTranscript('');
      
      if (currentStep < assessmentSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleComplete();
      }
    }
  };

  const analyzePersonality = (responses: Record<string, string>): PersonalityProfile => {
    // Analyze responses to determine personality profile
    const profile: PersonalityProfile = {
      primaryVirtue: 'WISDOM',
      learningStyle: 'structured',
      motivationType: 'achievement',
      challengeResponse: 'confront',
      energyLevel: 'moderate',
      socialPreference: 'individual',
      timeAvailability: 'moderate',
      experienceLevel: 'beginner',
      stressTriggers: [],
      strengths: [],
      weaknesses: [],
      aspirations: [],
      knowledgeGaps: []
    };

    // Analyze learning style
    if (responses.learning_style) {
      const learningMap: Record<string, 'structured' | 'intuitive' | 'experiential' | 'contemplative'> = {
        'Through structured practice and discipline': 'structured',
        'By following my intuition and inner wisdom': 'intuitive',
        'Through direct experience and experimentation': 'experiential',
        'Through deep reflection and contemplation': 'contemplative'
      };
      profile.learningStyle = learningMap[responses.learning_style] || 'structured';
    }

    // Analyze motivation
    if (responses.motivation) {
      const motivationMap: Record<string, 'achievement' | 'connection' | 'mastery' | 'contribution'> = {
        'Achieving goals and building skills': 'achievement',
        'Connecting with others and building community': 'connection',
        'Mastering knowledge and understanding': 'mastery',
        'Contributing to something larger than myself': 'contribution'
      };
      profile.motivationType = motivationMap[responses.motivation] || 'achievement';
    }

    // Analyze challenge response
    if (responses.challenges) {
      const challengeMap: Record<string, 'confront' | 'adapt' | 'analyze' | 'accept'> = {
        'I confront them directly and push through': 'confront',
        'I adapt and find creative solutions': 'adapt',
        'I analyze and understand the problem first': 'analyze',
        'I accept what I can\'t change and work with what I can': 'accept'
      };
      profile.challengeResponse = challengeMap[responses.challenges] || 'confront';
    }

    // Analyze energy level
    if (responses.energy) {
      const energyMap: Record<string, 'high' | 'moderate' | 'low'> = {
        'High energy - I thrive on intensity and action': 'high',
        'Moderate energy - I prefer steady, balanced activity': 'moderate',
        'Lower energy - I value calm and thoughtful approaches': 'low'
      };
      profile.energyLevel = energyMap[responses.energy] || 'moderate';
    }

    // Analyze social preference
    if (responses.social) {
      const socialMap: Record<string, 'individual' | 'community' | 'balanced'> = {
        'Individually - I prefer personal practice and reflection': 'individual',
        'In community - I thrive with others and shared experiences': 'community',
        'Balanced - I value both personal practice and community connection': 'balanced'
      };
      profile.socialPreference = socialMap[responses.social] || 'individual';
    }

    // Analyze time availability
    if (responses.time) {
      const timeMap: Record<string, 'minimal' | 'moderate' | 'extensive'> = {
        'Minimal (5-15 minutes)': 'minimal',
        'Moderate (15-45 minutes)': 'moderate',
        'Extensive (45+ minutes)': 'extensive'
      };
      profile.timeAvailability = timeMap[responses.time] || 'moderate';
    }

    // Analyze experience level
    if (responses.experience) {
      const experienceMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
        'Beginner - I\'m just starting this journey': 'beginner',
        'Intermediate - I have some experience and want to deepen': 'intermediate',
        'Advanced - I\'m experienced and looking for new challenges': 'advanced'
      };
      profile.experienceLevel = experienceMap[responses.experience] || 'beginner';
    }

    // Determine primary virtue based on responses
    if (profile.challengeResponse === 'confront' && profile.energyLevel === 'high') {
      profile.primaryVirtue = 'COURAGE';
    } else if (profile.motivationType === 'connection' || profile.socialPreference === 'community') {
      profile.primaryVirtue = 'JUSTICE';
    } else if (profile.learningStyle === 'contemplative' || profile.motivationType === 'mastery') {
      profile.primaryVirtue = 'WISDOM';
    } else {
      profile.primaryVirtue = 'TEMPERANCE';
    }

    // Extract text-based responses
    if (responses.strengths) profile.strengths = [responses.strengths];
    if (responses.weaknesses) profile.weaknesses = [responses.weaknesses];
    if (responses.stress) profile.stressTriggers = [responses.stress];
    if (responses.aspirations) profile.aspirations = [responses.aspirations];

    return profile;
  };

  const recommendFramework = (profile: PersonalityProfile): FrameworkConfig => {
    const frameworks = getAllFrameworks();
    
    // Scoring system for framework matching
    const scores = frameworks.map(framework => {
      let score = 0;
      
      // Primary virtue alignment
      if (framework.virtuePrimary === profile.primaryVirtue) score += 10;
      if (framework.virtueSecondary === profile.primaryVirtue) score += 5;
      
      // Energy level matching
      if (profile.energyLevel === 'high' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) score += 8;
      if (profile.energyLevel === 'moderate' && ['bushido', 'stoic', 'yogic'].includes(framework.slug)) score += 8;
      if (profile.energyLevel === 'low' && ['monastic', 'sufi', 'indigenous'].includes(framework.slug)) score += 8;
      
      // Social preference matching
      if (profile.socialPreference === 'community' && ['ubuntu', 'indigenous'].includes(framework.slug)) score += 7;
      if (profile.socialPreference === 'individual' && ['stoic', 'monastic', 'sufi'].includes(framework.slug)) score += 7;
      if (profile.socialPreference === 'balanced' && ['bushido', 'yogic'].includes(framework.slug)) score += 7;
      
      // Learning style matching
      if (profile.learningStyle === 'structured' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) score += 6;
      if (profile.learningStyle === 'intuitive' && ['yogic', 'sufi'].includes(framework.slug)) score += 6;
      if (profile.learningStyle === 'experiential' && ['indigenous', 'martial'].includes(framework.slug)) score += 6;
      if (profile.learningStyle === 'contemplative' && ['stoic', 'monastic'].includes(framework.slug)) score += 6;
      
      // Challenge response matching
      if (profile.challengeResponse === 'confront' && ['spartan', 'martial'].includes(framework.slug)) score += 5;
      if (profile.challengeResponse === 'adapt' && ['bushido', 'yogic'].includes(framework.slug)) score += 5;
      if (profile.challengeResponse === 'analyze' && ['stoic', 'highperf'].includes(framework.slug)) score += 5;
      if (profile.challengeResponse === 'accept' && ['monastic', 'sufi'].includes(framework.slug)) score += 5;
      
      // Experience level matching
      if (profile.experienceLevel === 'beginner' && ['stoic', 'yogic'].includes(framework.slug)) score += 4;
      if (profile.experienceLevel === 'intermediate' && ['bushido', 'indigenous'].includes(framework.slug)) score += 4;
      if (profile.experienceLevel === 'advanced' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) score += 4;
      
      return { framework, score };
    });
    
    // Return the highest scoring framework
    scores.sort((a, b) => b.score - a.score);
    return scores[0].framework;
  };

  const handleComplete = async () => {
    try {
      setIsProcessing(true);
      
      // Analyze personality profile
      const profile = analyzePersonality(responses);
      setPersonalityProfile(profile);
      
      // Recommend framework
      const framework = recommendFramework(profile);
      setRecommendedFramework(framework);
      
      // Save user facts with embeddings
      const facts = Object.entries(responses).map(([key, value]) => ({
        kind: key === 'name' ? 'bio' : 
              key === 'aspirations' ? 'goal' : 
              key === 'strengths' ? 'insight' : 
              key === 'weaknesses' ? 'constraint' : 'preference',
        content: value,
      }));

      // Create user facts via API
      const response = await fetch('/api/user-facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facts }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user facts');
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartJourney = () => {
    if (recommendedFramework) {
      // Save framework preference
      fetch('/api/prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework: recommendedFramework.slug })
      });
      
      router.push(`/frameworks/${recommendedFramework.slug}`);
    }
  };

  const handleSkip = () => {
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  if (showResults && personalityProfile && recommendedFramework) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Personalized Path
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Based on your unique profile, here's your recommended journey
              </p>
            </div>

            {/* Framework Recommendation */}
            <Card className="glass-effect mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">{recommendedFramework.name}</CardTitle>
                <CardDescription className="text-lg italic">
                  "{recommendedFramework.teachingChip}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Why This Path?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Aligns with your {personalityProfile.primaryVirtue.toLowerCase()} focus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Matches your {personalityProfile.learningStyle} learning style</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Suits your {personalityProfile.energyLevel} energy level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Fits your {personalityProfile.timeAvailability} time availability</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">What You'll Experience</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">Personalized coaching from {recommendedFramework.name} perspective</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">Structured practices and quests</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <Scale className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">Virtue tracking and progress insights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personality Insights */}
            <Card className="glass-effect mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Your Personality Insights</CardTitle>
                <CardDescription>
                  Understanding your unique profile helps us tailor your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Virtue</h4>
                    <div className="flex items-center gap-2">
                      {personalityProfile.primaryVirtue === 'WISDOM' && <Brain className="w-4 h-4 text-blue-500" />}
                      {personalityProfile.primaryVirtue === 'COURAGE' && <Shield className="w-4 h-4 text-red-500" />}
                      {personalityProfile.primaryVirtue === 'JUSTICE' && <Scale className="w-4 h-4 text-green-500" />}
                      {personalityProfile.primaryVirtue === 'TEMPERANCE' && <Leaf className="w-4 h-4 text-purple-500" />}
                      <span className="capitalize">{personalityProfile.primaryVirtue.toLowerCase()}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Learning Style</h4>
                    <span className="capitalize">{personalityProfile.learningStyle}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Motivation</h4>
                    <span className="capitalize">{personalityProfile.motivationType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartJourney}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3"
              >
                Start My Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/coach')}
                className="px-8 py-3"
              >
                Explore All Frameworks
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {assessmentSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / assessmentSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / assessmentSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="glass-effect">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">{currentStepData.title}</CardTitle>
              <CardDescription className="text-lg">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Choice Options */}
              {currentStepData.type === 'choice' && currentStepData.options && (
                <div className="space-y-3">
                  {currentStepData.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => handleChoiceSelect(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Voice Recording Section */}
              {currentStepData.type === 'voice' && (
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleVoiceRecord}
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="w-20 h-20 rounded-full mb-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    disabled={isProcessing || !mediaRecorder}
                  >
                    {isRecording ? (
                      <MicOff className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {isRecording ? 'Recording... Speak now' : 
                     isProcessing ? 'Processing...' :
                     !mediaRecorder ? 'Initializing microphone...' :
                     'Tap to start recording'}
                  </p>

                  {/* Waveform Animation */}
                  {(isRecording || isProcessing) && (
                    <div className="waveform justify-center mb-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="waveform-bar w-1 bg-amber-500"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Manual Text Input Fallback */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Or type your response manually:
                    </p>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder={currentStepData.placeholder || "Type your response here..."}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      rows={3}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              )}

              {/* Transcript Display */}
              {transcript && currentStepData.type === 'voice' && (
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">What you said:</h4>
                  <p className="text-sm">{transcript}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isProcessing}
                >
                  Skip for now
                </Button>
                
                {currentStepData.type === 'voice' && (
                  <Button
                    onClick={handleNext}
                    disabled={!transcript.trim() || isProcessing}
                    className="ml-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {currentStep < assessmentSteps.length - 1 ? 'Next' : 'Complete'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <h3 className="font-medium">Intelligent Matching</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered personality analysis for perfect framework matching
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <h3 className="font-medium">Personalized Path</h3>
                <p className="text-sm text-muted-foreground">
                  Customized practices and coaching based on your unique profile
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <h3 className="font-medium">Virtue Development</h3>
                <p className="text-sm text-muted-foreground">
                  Track your growth in wisdom, courage, justice, and temperance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 