'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Mic, Send, Brain, Shield, Scale, Leaf, BookOpen, Target, Users, MessageCircle, Volume2, VolumeX, RotateCcw, Lightbulb, Heart, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'aristotle';
  timestamp: Date;
  virtue?: string;
  type: 'text' | 'question' | 'guidance' | 'reflection';
}

interface VirtueContext {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  questions: string[];
}

const virtues: VirtueContext[] = [
  {
    name: 'Wisdom',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    description: 'Knowledge and understanding',
    questions: [
      'What have you learned today that challenged your assumptions?',
      'How can you apply Aristotle\'s teachings to your current situation?',
      'What question has been on your mind that you\'d like to explore?'
    ]
  },
  {
    name: 'Courage',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    description: 'Facing challenges with strength',
    questions: [
      'What fear or challenge are you currently facing?',
      'What action have you been avoiding that would help you grow?',
      'How can you step outside your comfort zone today?'
    ]
  },
  {
    name: 'Justice',
    icon: Scale,
    color: 'from-green-500 to-emerald-600',
    description: 'Fairness and right relationships',
    questions: [
      'How can you be more fair in your relationships today?',
      'What injustice have you witnessed that you could address?',
      'How can you contribute to your community\'s well-being?'
    ]
  },
  {
    name: 'Temperance',
    icon: Leaf,
    color: 'from-purple-500 to-pink-600',
    description: 'Self-control and moderation',
    questions: [
      'What habit or behavior would you like to moderate?',
      'How can you find more balance in your life today?',
      'What practice would help you cultivate inner peace?'
    ]
  }
];

const philosophicalPrompts = [
  "Tell me about a challenge you're facing, and let's explore it through Aristotle's lens.",
  "What virtue would you like to cultivate today?",
  "Share a recent decision you made, and let's examine it philosophically.",
  "What does eudaimonia (human flourishing) mean to you?",
  "How can we apply ancient wisdom to your modern life?"
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Greetings, seeker of wisdom. I am Aristotle, and I am here to guide you on your journey toward eudaimonia - human flourishing. What virtue would you like to explore today, or what challenge brings you to seek philosophical guidance?",
      sender: 'aristotle',
      timestamp: new Date(),
      type: 'guidance'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVirtue, setSelectedVirtue] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAristotleResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "Ah, an excellent question that touches upon the very nature of human excellence. Let me share with you what I have observed about this matter...",
      "This brings to mind a fundamental principle I discovered in my studies: that virtue lies not in the extremes, but in the golden mean between excess and deficiency.",
      "Consider this: every action we take is either moving us toward eudaimonia or away from it. Your situation presents an opportunity for growth.",
      "In my Nicomachean Ethics, I wrote that 'we are what we repeatedly do. Excellence, then, is not an act, but a habit.' How does this apply to your circumstance?",
      "The wise person seeks not just to know what is right, but to do what is right. Your question reveals a thoughtful mind seeking practical wisdom.",
      "Let us examine this through the lens of the four cardinal virtues. Which virtue - wisdom, courage, justice, or temperance - is most relevant here?",
      "Remember, my friend, that the goal of life is not happiness as a fleeting emotion, but eudaimonia - a life of flourishing and excellence.",
      "This challenge you face is not an obstacle, but a teacher. What is it trying to teach you about yourself and your character?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await generateAristotleResponse(inputValue);
      const aristotleMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'aristotle',
        timestamp: new Date(),
        type: 'guidance'
      };

      setMessages(prev => [...prev, aristotleMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVirtueSelect = (virtue: string) => {
    setSelectedVirtue(virtue);
    const virtueData = virtues.find(v => v.name === virtue);
    if (virtueData) {
      const question = virtueData.questions[Math.floor(Math.random() * virtueData.questions.length)];
      const message: Message = {
        id: Date.now().toString(),
        content: `Let us explore ${virtue.toLowerCase}. ${question}`,
        sender: 'aristotle',
        timestamp: new Date(),
        type: 'question',
        virtue: virtue
      };
      setMessages(prev => [...prev, message]);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setInputValue("I've been thinking about how to apply Aristotle's teachings to my daily life...");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Aristotle AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your philosophical guide for cultivating wisdom, courage, justice, and temperance in modern life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-amber-600" />
                  Philosophical Dialogue
                </CardTitle>
                <CardDescription>
                  Engage in Socratic dialogue with Aristotle to explore virtue and wisdom
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'aristotle' && (
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                       onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask Aristotle about virtue, wisdom, or life..."
                      className="flex-1"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={startRecording}
                      variant="outline"
                      size="sm"
                      disabled={isRecording || isProcessing}
                      className={isRecording ? 'bg-red-100 border-red-300' : ''}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Virtue Selection */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Explore Virtues
                </CardTitle>
                <CardDescription>
                  Choose a virtue to focus our discussion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {virtues.map((virtue) => {
                  const IconComponent = virtue.icon;
                  return (
                    <Button
                      key={virtue.name}
                      variant="outline"
                      className={`w-full justify-start ${
                        selectedVirtue === virtue.name ? 'bg-gradient-to-r ' + virtue.color + ' text-white border-0' : ''
                      }`}
                      onClick={() => handleVirtueSelect(virtue.name)}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {virtue.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Conversation Starters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {philosophicalPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptSelect(prompt)}
                    className="text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors w-full"
                  >
                    {prompt}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Aristotle's Wisdom */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "The more you know, the more you realize you don't know."
                </blockquote>
                <cite className="text-sm opacity-90">— Aristotle</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 