'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Send, Brain, Shield, Scale, Leaf, MessageCircle, Volume2, VolumeX, RotateCcw, Lightbulb, Heart, Zap, ArrowLeft, ChevronDown, BookOpen, Users, Clock, Star, Info, Search, Sparkle, Quote, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPhilosophers, getPhilosopher, type Philosopher } from '@/lib/philosophers';
import { PhilosophicalTerminologyWidget } from '@/components/PhilosophicalTerminologyWidget';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'philosopher';
  timestamp: Date;
  philosopher?: {
    name: string;
    title: string;
    avatar: string;
  };
}

export default function PhilosophersPage() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher>(getAllPhilosophers()[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showWidgetInfo, setShowWidgetInfo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'terminology'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const philosophers = getAllPhilosophers();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with philosopher's greeting
    if (selectedPhilosopher) {
      const greeting = getPhilosopherGreeting(selectedPhilosopher);
      setMessages([{
        id: '1',
        content: greeting,
        sender: 'philosopher',
        timestamp: new Date(),
        philosopher: {
          name: selectedPhilosopher.name,
          title: selectedPhilosopher.title,
          avatar: selectedPhilosopher.avatar
        }
      }]);
    }
  }, [selectedPhilosopher]);

  const getPhilosopherGreeting = (philosopher: Philosopher): string => {
    const greetings: Record<string, string> = {
      'aristotle': "Greetings, seeker of wisdom. I am Aristotle, and I am here to guide you on your journey toward eudaimonia - human flourishing. What virtue would you like to explore today, or what challenge brings you to seek philosophical guidance?",
      'socrates': "Greetings, fellow seeker. I am Socrates, and I know that I know nothing. But together, through questioning and dialogue, we may discover truth. What question burns in your mind today?",
      'epictetus': "Greetings, friend. I am Epictetus, and I understand that true freedom lies not in controlling the world, but in mastering your own mind. What aspect of your life would you like to examine?",
      'confucius': "Greetings, noble one. I am Confucius, and I believe that through proper relationships and moral cultivation, we can create harmony in ourselves and society. What aspect of your character would you like to develop?",
      'laozi': "Greetings, traveler on the Way. I am Laozi, and I understand that the Dao flows naturally. Sometimes the softest approach is the strongest. What brings you to seek the natural way?",
      'marcus-aurelius': "Greetings, citizen of the world. I am Marcus Aurelius, and I believe that our duty is to serve others and live virtuously regardless of circumstances. What responsibility calls to you today?",
      'seneca': "Greetings, friend. I am Seneca, and I understand that time is our most precious possession. How are you using your time, and what wisdom do you seek to guide your journey?",
      'plato': "Greetings, lover of wisdom. I am Plato, and I believe that through philosophical inquiry, we can turn our souls toward the Good and discover the eternal truths that lie beyond appearances. What truth do you seek?"
    };
    return greetings[philosopher.id] || "Greetings, seeker of wisdom. I am here to guide you on your philosophical journey.";
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    }]);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat/philosopher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          philosopherId: selectedPhilosopher.id,
          message: userMessage,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'philosopher',
          timestamp: new Date(),
          philosopher: data.philosopher
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'philosopher',
        timestamp: new Date(),
        philosopher: {
          name: selectedPhilosopher.name,
          title: selectedPhilosopher.title,
          avatar: selectedPhilosopher.avatar
        }
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    const greeting = getPhilosopherGreeting(selectedPhilosopher);
    setMessages([{
      id: '1',
      content: greeting,
      sender: 'philosopher',
      timestamp: new Date(),
      philosopher: {
        name: selectedPhilosopher.name,
        title: selectedPhilosopher.title,
        avatar: selectedPhilosopher.avatar
      }
    }]);
  };

  const askExampleQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4 font-display">
                Philosopher's Journey
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Engage in dialogue with history's greatest minds and explore timeless wisdom through interactive conversations
              </p>
            </motion.div>
          </div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{philosophers.length}</div>
                <div className="text-gray-300">Ancient Philosophers</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">25+</div>
                <div className="text-gray-300">Philosophical Terms</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-300">Wisdom Conversations</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">8</div>
                <div className="text-gray-300">Philosophical Traditions</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Philosophical Dialogue
              </button>
              <button
                onClick={() => setActiveTab('terminology')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                  activeTab === 'terminology'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Philosophical Terms
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          {activeTab === 'chat' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Main Chat Area */}
              <div className="lg:col-span-3">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-[600px] flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedPhilosopher.color} flex items-center justify-center text-3xl shadow-lg`}>
                          {selectedPhilosopher.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">{selectedPhilosopher.name}</CardTitle>
                          <p className="text-gray-300">
                            {selectedPhilosopher.title} • {selectedPhilosopher.era}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={clearConversation}
                        variant="outline"
                        size="sm"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Chat
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white/10 text-white border border-white/20'
                          }`}
                        >
                          {message.sender === 'philosopher' && message.philosopher && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl">{message.philosopher.avatar}</span>
                              <span className="text-sm font-medium text-gray-300">
                                {message.philosopher.name}
                              </span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                          <div className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 text-white p-4 rounded-2xl border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span className="text-gray-300">Thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-white/10 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={`Ask ${selectedPhilosopher.name} anything...`}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isProcessing}
                        />
                      </div>
                      <Button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isProcessing}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Philosopher Selector */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Choose Your Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedPhilosopher.avatar}</span>
                          <div className="text-left">
                            <div className="font-medium">{selectedPhilosopher.name}</div>
                            <div className="text-sm text-gray-400">{selectedPhilosopher.title}</div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl z-10 max-h-64 overflow-y-auto"
                        >
                          {philosophers.map((philosopher) => (
                            <button
                              key={philosopher.id}
                              onClick={() => {
                                setSelectedPhilosopher(philosopher);
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center gap-3 p-4 hover:bg-white/10 transition-all text-left"
                            >
                              <span className="text-xl">{philosopher.avatar}</span>
                              <div>
                                <div className="font-medium text-white">{philosopher.name}</div>
                                <div className="text-sm text-gray-400">{philosopher.title}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Philosopher Info */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      About {selectedPhilosopher.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPhilosopher.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          Key Teachings
                        </h4>
                        <div className="space-y-2">
                          {selectedPhilosopher.keyTeachings.map((teaching, index) => (
                            <div key={index} className="text-xs text-gray-400 flex items-start gap-2 p-2 bg-white/5 rounded-lg">
                              <Sparkle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span>{teaching}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Example Questions */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Start a Conversation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPhilosopher.exampleQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => askExampleQuestion(question)}
                          className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/20"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Philosophical Terminology
                  </CardTitle>
                  <p className="text-gray-300">
                    Explore 25 profound philosophical concepts from various traditions
                  </p>
                </CardHeader>
                <CardContent>
                  <PhilosophicalTerminologyWidget />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 