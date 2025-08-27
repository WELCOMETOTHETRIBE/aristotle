'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, Send, CheckCircle, Target, Heart, Brain, Timer, Sparkles, Settings, AlertCircle, Volume2, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

interface CoachPlan {
  reply: string;
  actions: Array<{
    title: string;
    description?: string;
    tag?: string;
    priority?: string;
  }>;
  habitNudges?: Array<{
    habitName: string;
    suggestion: string;
  }>;
  breathwork?: {
    name: string;
    pattern: any;
  };
  reflectionPrompt?: string;
  hedonicCheck?: {
    riskLevel: string;
    triggers: string[];
    counterMoves: string[];
  };
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<CoachPlan | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [microphoneAvailable, setMicrophoneAvailable] = useState(false);
  const [showTextInput, setShowTextInput] = useState(true); // Always show text input as fallback
  const [textInput, setTextInput] = useState('');

  // Initialize media recorder
  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Microphone access not supported in this browser');
        }
        
        // Request microphone permission with better error handling
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
            channelCount: 1,
          } 
        });
        
        // Try different MIME types in order of preference
        const mimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/wav',
          'audio/ogg;codecs=opus'
        ];
        
        let selectedMimeType = null;
        for (const mimeType of mimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType;
            break;
          }
        }
        
        if (!selectedMimeType) {
          throw new Error('No supported audio format found');
        }
        
        console.log('Using MIME type:', selectedMimeType);
        
        const recorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType,
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
          const audioBlob = new Blob(chunks, { type: selectedMimeType });
          console.log('Audio blob size:', audioBlob.size, 'bytes');
          
          if (audioBlob.size > 0) {
            await transcribeAudio(audioBlob);
          } else {
            setError('No audio detected. Please try recording again.');
          }
          chunks = [];
          setAudioChunks([]);
        };

        recorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setError('Recording error. Please try again.');
        };

        setMediaRecorder(recorder);
        setMicrophoneAvailable(true);
        setIsInitializing(false);
        console.log('✅ MediaRecorder initialized successfully');
      } catch (error: any) {
        console.error('Error accessing microphone:', error);
        
        // More specific error messages
        let errorMessage = 'Microphone not available. You can still type your messages below.';
        
        if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and refresh the page.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Audio recording not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.';
        }
        
        setError(errorMessage);
        setMicrophoneAvailable(false);
        setIsInitializing(false);
      }
    };

    initMediaRecorder();
  }, []);

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setError(null);
      
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
      setError(`Voice transcription is currently unavailable. Please type your message below.`);
      // Show text input as fallback
      setShowTextInput(true);
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
      setError(null);
      
      // Start recording with a small timeslice to get data more frequently
      mediaRecorder.start(1000); // Get data every second
    } else {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || transcript;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setTextInput('');
    setShowTextInput(false);
    setIsProcessing(true);
    setError(null);

    try {
      // Call coach API
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Coach API failed');
      }

      const data = await response.json();
      
      // Generate TTS for coach reply (optional - don't block if it fails)
      let audioUrl: string | undefined;
      try {
        console.log('Generating TTS for coach reply...');
        const ttsResponse = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: data.reply,
            voice: 'nova' // Use a clear voice for coach responses
          }),
        });

        if (ttsResponse.ok) {
          const ttsData = await ttsResponse.json();
          audioUrl = ttsData.url;
          console.log('✅ TTS generated successfully:', audioUrl);
        } else {
          const errorData = await ttsResponse.json();
          console.warn('TTS API error:', errorData);
        }
      } catch (error) {
        console.warn('TTS error (non-critical):', error);
        // Don't fail the whole request if TTS fails
      }

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: data.reply,
        timestamp: new Date(),
        audioUrl,
      };

      setMessages(prev => [...prev, coachMessage]);
      setCurrentPlan(data.plan);
    } catch (error: any) {
      console.error('Coach API error:', error);
      setError(`I'm experiencing some technical difficulties. Please try typing your message again.`);
      
      // Fallback message with helpful guidance
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: 'I understand you\'re reaching out, and I want to support you. While I\'m having some technical difficulties right now, I encourage you to take a moment to breathe deeply and consider what would be most helpful for you in this moment. You can try typing your message again, or simply take some time for self-reflection.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayAudio = async (audioUrl: string) => {
    if (isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);
      console.log('Playing audio:', audioUrl);
      
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.8; // Set volume to 80%
      
      audio.onended = () => {
        console.log('Audio playback ended');
        setIsPlayingAudio(false);
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlayingAudio(false);
      };
      
      audio.onloadstart = () => console.log('Audio loading started');
      audio.oncanplay = () => console.log('Audio can play');
      
      setAudioElement(audio);
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log('✅ Audio playback started successfully');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlayingAudio(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aion Coach
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your Aristotle-inspired life coach for wisdom, virtue, and the good life
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="glass-effect border-0 shadow-2xl bg-white/80 backdrop-blur-xl h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Conversation
                  </CardTitle>
                  <CardDescription>
                    Speak or type to begin your coaching session
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Error Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Start your first conversation</p>
                        <p className="text-sm">Tap the microphone to begin speaking</p>
                        <p className="text-xs mt-2">Or type your message below</p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm mb-2">{message.content}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.audioUrl && message.type === 'coach' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePlayAudio(message.audioUrl!)}
                                disabled={isPlayingAudio}
                                className="ml-2 h-6 px-2"
                              >
                                <Volume2 className="h-3 w-3 mr-1" />
                                {isPlayingAudio ? 'Playing...' : 'Play'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-1">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                  style={{ animationDelay: `${i * 0.2}s` }}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Aion is thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t pt-4">
                    {transcript ? (
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-900">{transcript}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSendMessage()}
                            disabled={isProcessing}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send to Coach
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setTranscript('')}
                            disabled={isProcessing}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    ) : showTextInput ? (
                      <div className="space-y-3">
                        <textarea
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          disabled={isProcessing}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSendMessage(textInput)}
                            disabled={isProcessing || !textInput.trim()}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send to Coach
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowTextInput(false);
                              setTextInput('');
                            }}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="flex justify-center gap-4 mb-4">
                          {microphoneAvailable ? (
                            <Button
                              onClick={handleVoiceRecord}
                              size="lg"
                              variant={isRecording ? "destructive" : "default"}
                              className={`w-16 h-16 rounded-full ${
                                isRecording 
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                              }`}
                              disabled={isProcessing || isInitializing}
                            >
                              {isRecording ? (
                                <MicOff className="h-6 w-6" />
                              ) : (
                                <Mic className="h-6 w-6" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                // Try to reinitialize microphone
                                window.location.reload();
                              }}
                              size="lg"
                              variant="outline"
                              className="w-16 h-16 rounded-full border-2 border-orange-300 hover:border-orange-500"
                              disabled={isProcessing}
                            >
                              <Mic className="h-6 w-6 text-orange-600" />
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => setShowTextInput(true)}
                            size="lg"
                            variant="outline"
                            className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-blue-500"
                            disabled={isProcessing}
                          >
                            <MessageCircle className="h-6 w-6" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRecording ? 'Recording... Speak now' : 
                           isProcessing ? 'Processing...' :
                           isInitializing ? 'Initializing microphone...' :
                           !microphoneAvailable ? 'Microphone not available - tap to retry or type your message' :
                           'Tap to record or type your message'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Panel */}
            <div className="space-y-6">
              {currentPlan && (
                <>
                  {/* Actions */}
                  <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Today's Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPlan.actions && currentPlan.actions.map((action, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">{action.title}</h4>
                              {action.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {action.description}
                                </p>
                              )}
                              <div className="flex gap-2 mt-2">
                                {action.tag && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {action.tag}
                                  </span>
                                )}
                                {action.priority && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    action.priority === 'H' ? 'bg-red-100 text-red-700' :
                                    action.priority === 'M' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {action.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Habit Nudges */}
                  {currentPlan.habitNudges && currentPlan.habitNudges.length > 0 && (
                    <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Habit Reminders
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentPlan.habitNudges.map((nudge, index) => (
                            <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                              <h4 className="font-medium text-sm text-gray-900">{nudge.habitName}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {nudge.suggestion}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hedonic Check */}
                  {currentPlan.hedonicCheck && (
                    <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-primary" />
                          Hedonic Awareness
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              currentPlan.hedonicCheck.riskLevel === 'high' ? 'bg-red-500' :
                              currentPlan.hedonicCheck.riskLevel === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`} />
                            <span className="text-sm font-medium capitalize">
                              {currentPlan.hedonicCheck.riskLevel} risk
                            </span>
                          </div>
                          
                          {currentPlan.hedonicCheck.triggers && currentPlan.hedonicCheck.triggers.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Triggers:</h4>
                              <div className="flex flex-wrap gap-1">
                                {currentPlan.hedonicCheck.triggers.map((trigger, index) => (
                                  <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    {trigger}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {currentPlan.hedonicCheck.counterMoves && currentPlan.hedonicCheck.counterMoves.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Counter-moves:</h4>
                              <div className="space-y-1">
                                {currentPlan.hedonicCheck.counterMoves.map((move, index) => (
                                  <div key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {move}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reflection Prompt */}
                  {currentPlan.reflectionPrompt && (
                    <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          Reflection
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm italic text-muted-foreground">
                          "{currentPlan.reflectionPrompt}"
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Getting Started Guide */}
              {!currentPlan && (
                <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Share your thoughts</h4>
                          <p className="text-muted-foreground">Speak or type about your goals, challenges, or reflections</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">Receive guidance</h4>
                          <p className="text-muted-foreground">Get personalized advice and actionable steps</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">Take action</h4>
                          <p className="text-muted-foreground">Follow through with the suggested practices and habits</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 