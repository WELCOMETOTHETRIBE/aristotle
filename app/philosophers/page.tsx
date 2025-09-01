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
    // Get user's display name from localStorage
    const userPreferences = localStorage.getItem('userPreferences');
    let displayName = 'seeker of wisdom';
    if (userPreferences) {
      try {
        const parsed = JSON.parse(userPreferences);
        if (parsed.displayName && parsed.displayName.trim()) {
          displayName = parsed.displayName.trim();
        }
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }

    const greetings: Record<string, string> = {
      'aristotle': `Greetings, ${displayName}. I am Aristotle, and I am here to guide you on your journey toward eudaimonia - human flourishing. What virtue would you like to explore today, or what challenge brings you to seek philosophical guidance?`,
      'socrates': `Greetings, ${displayName}. I am Socrates, and I know that I know nothing. But together, through questioning and dialogue, we may discover truth. What question burns in your mind today?`,
      'epictetus': `Greetings, ${displayName}. I am Epictetus, and I understand that true freedom lies not in controlling the world, but in mastering your own mind. What aspect of your life would you like to examine?`,
      'confucius': `Greetings, ${displayName}. I am Confucius, and I believe that through proper relationships and moral cultivation, we can create harmony in ourselves and society. What aspect of your character would you like to develop?`,
      'laozi': `Greetings, ${displayName}. I am Laozi, and I understand that the Dao flows naturally. Sometimes the softest approach is the strongest. What brings you to seek the natural way?`,
      'marcus-aurelius': `Greetings, ${displayName}. I am Marcus Aurelius, and I believe that our duty is to serve others and live virtuously regardless of circumstances. What responsibility calls to you today?`,
      'seneca': `Greetings, ${displayName}. I am Seneca, and I understand that time is our most precious possession. How are you using your time, and what wisdom do you seek to guide your journey?`,
      'plato': `Greetings, ${displayName}. I am Plato, and I believe that through philosophical inquiry, we can turn our souls toward the Good and discover the eternal truths that lie beyond appearances. What truth do you seek?`
    };
    return greetings[philosopher.id] || `Greetings, ${displayName}. I am here to guide you on your philosophical journey.`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-3 font-display">
              Philosopher's Dialogue
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Engage in dialogue with history's greatest minds and explore timeless wisdom
            </p>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{philosophers.length}</div>
            <div className="text-sm text-gray-300">Philosophers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">25+</div>
            <div className="text-sm text-gray-300">Terms</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">∞</div>
            <div className="text-sm text-gray-300">Conversations</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">8</div>
            <div className="text-sm text-gray-300">Traditions</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Dialogue
            </button>
            <button
              onClick={() => setActiveTab('terminology')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'terminology'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Terms
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        {activeTab === 'chat' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="border-b border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedPhilosopher.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {selectedPhilosopher.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedPhilosopher.name}</h3>
                        <p className="text-sm text-gray-300">
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
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        {message.sender === 'philosopher' && message.philosopher && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{message.philosopher.avatar}</span>
                            <span className="text-sm font-medium text-gray-300">
                              {message.philosopher.name}
                            </span>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</div>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
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
                      <div className="bg-white/10 text-white p-3 rounded-xl border border-white/20">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span className="text-sm text-gray-300">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Ask ${selectedPhilosopher.name} anything...`}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={isProcessing}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Philosopher Selector */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Choose Your Guide
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedPhilosopher.avatar}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{selectedPhilosopher.name}</div>
                        <div className="text-xs text-gray-400">{selectedPhilosopher.title}</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg z-10 max-h-48 overflow-y-auto"
                    >
                      {philosophers.map((philosopher) => (
                        <button
                          key={philosopher.id}
                          onClick={() => {
                            setSelectedPhilosopher(philosopher);
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 p-3 hover:bg-white/10 transition-all text-left"
                        >
                          <span className="text-lg">{philosopher.avatar}</span>
                          <div>
                            <div className="font-medium text-white text-sm">{philosopher.name}</div>
                            <div className="text-xs text-gray-400">{philosopher.title}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Philosopher Info */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  About {selectedPhilosopher.name}
                </h3>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{selectedPhilosopher.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-400" />
                      Key Teachings
                    </h4>
                    <div className="space-y-1">
                      {selectedPhilosopher.keyTeachings.map((teaching, index) => (
                        <div key={index} className="text-xs text-gray-400 flex items-start gap-2 p-2 bg-white/5 rounded">
                          <Sparkle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{teaching}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Example Questions */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Start a Conversation
                </h3>
                <div className="space-y-2">
                  {selectedPhilosopher.exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => askExampleQuestion(question)}
                      className="w-full text-left p-2 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/20"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Philosophical Terminology
              </h2>
              <p className="text-gray-300 mb-4">
                Explore 25 profound philosophical concepts from various traditions
              </p>
              <PhilosophicalTerminologyWidget />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 