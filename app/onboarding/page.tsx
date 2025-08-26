'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, ArrowRight, Brain, Heart, Target } from 'lucide-react';

const onboardingSteps = [
  {
    id: 'name',
    title: 'What should I call you?',
    description: 'Tell me your name so I can personalize our conversations.',
    placeholder: 'My name is...',
  },
  {
    id: 'values',
    title: 'What matters most to you?',
    description: 'Share your core values and what drives you in life.',
    placeholder: 'I value...',
  },
  {
    id: 'goals',
    title: 'What are your biggest goals?',
    description: 'What would you like to achieve or improve in your life?',
    placeholder: 'I want to...',
  },
  {
    id: 'challenges',
    title: 'What challenges do you face?',
    description: 'What obstacles or struggles are you currently dealing with?',
    placeholder: 'I struggle with...',
  },
  {
    id: 'triggers',
    title: 'What triggers unhealthy habits?',
    description: 'What situations or emotions lead to behaviors you want to change?',
    placeholder: 'I tend to... when...',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const router = useRouter();

  const currentStepData = onboardingSteps[currentStep];

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
        
        // Try to use a more compatible format
        let mimeType = 'audio/webm;codecs=opus';
        
        // Check if the browser supports mp3 recording
        if (MediaRecorder.isTypeSupported('audio/mp3')) {
          mimeType = 'audio/mp3';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=vorbis')) {
          mimeType = 'audio/webm;codecs=vorbis';
        }
        
        console.log('Using MIME type:', mimeType);
        
        const recorder = new MediaRecorder(stream, {
          mimeType,
          audioBitsPerSecond: 128000,
        });
        
        let chunks: Blob[] = [];
        
        recorder.ondataavailable = (event) => {
          console.log('Data available:', event.data.size, 'bytes');
          if (event.data.size > 0) {
            chunks.push(event.data);
            setAudioChunks(prev => [...prev, event.data]);
          }
        };

        recorder.onstop = async () => {
          console.log('Recording stopped, chunks:', chunks.length);
          const audioBlob = new Blob(chunks, { type: mimeType });
          console.log('Audio blob size:', audioBlob.size, 'bytes');
          
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
      
      console.log('Sending audio for transcription, size:', audioBlob.size);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const data = await response.json();
      setTranscript(data.text);
    } catch (error: any) {
      console.error('Transcription error:', error);
      setTranscript(`Error transcribing audio: ${error.message}. Please try again.`);
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
      
      // Start recording with a small timeslice to get data more frequently
      mediaRecorder.start(1000); // Get data every second
    } else {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  const handleNext = async () => {
    if (transcript.trim()) {
      setResponses(prev => ({
        ...prev,
        [currentStepData.id]: transcript,
      }));
      setTranscript('');
      
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    try {
      setIsProcessing(true);
      
      // Save user facts with embeddings
      const facts = Object.entries(responses).map(([key, value]) => ({
        kind: key === 'name' ? 'bio' : 
              key === 'values' ? 'value' : 
              key === 'goals' ? 'goal' : 
              key === 'challenges' ? 'constraint' : 'preference',
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

      router.push('/coach');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
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
              {/* Voice Recording Section */}
              <div className="text-center">
                <Button
                  onClick={handleVoiceRecord}
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  className="w-20 h-20 rounded-full mb-4"
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
                        className="waveform-bar w-1"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Transcript Display */}
              {transcript && (
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">What you said:</h4>
                  <p className="text-sm">{transcript}</p>
                </div>
              )}

              {/* Previous Responses */}
              {Object.keys(responses).length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Your responses so far:</h4>
                  <div className="space-y-2">
                    {Object.entries(responses).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{onboardingSteps.find(s => s.id === key)?.title}:</span>
                        <span className="ml-2 text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
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
                
                <Button
                  onClick={handleNext}
                  disabled={!transcript.trim() || isProcessing}
                  className="ml-auto"
                >
                  {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Complete'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Evolving Memory</h3>
                <p className="text-sm text-muted-foreground">
                  I'll remember your values and preferences
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Structured Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Concrete actions to help you flourish
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Hedonic Awareness</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor patterns and suggest counter-moves
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 