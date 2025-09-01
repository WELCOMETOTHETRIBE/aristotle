'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, Send, Brain, Shield, Scale, Leaf, MessageCircle, 
  Volume2, VolumeX, RotateCcw, Lightbulb, Heart, Zap, ArrowLeft, 
  ChevronDown, BookOpen, Users, Clock, Star, Info, Search, 
  Sparkle, Quote, GraduationCap, Crown, Target, Zap as ZapIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPhilosophers, getPhilosopher, type Philosopher } from '@/lib/philosophers';
import { cn } from '@/lib/utils';

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

export default function PhilosophersJourney() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher>(getAllPhilosophers()[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showWidgetInfo, setShowWidgetInfo] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const philosophers = getAllPhilosophers();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'philosopher',
          timestamp: new Date(),
          philosopher: {
            name: data.philosopher.name,
            title: data.philosopher.title,
            avatar: data.philosopher.avatar
          }
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 cursor-pointer hover:from-primary/15 hover:to-primary/10 transition-all duration-200"
        onClick={() => setIsExpanded(true)}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text mb-2">Philosopher's Journey</h3>
            <p className="text-sm text-muted mb-4">
              Engage in deep philosophical dialogue with ancient wisdom seekers
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>AI-powered responses</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Historical accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Personal guidance</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-surface border border-border rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Philosopher's Journey</h2>
            <p className="text-sm text-muted">Deep dialogue with ancient wisdom</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="border-border text-muted hover:text-text"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Collapse
        </Button>
      </div>

      {/* Philosopher Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Choose Your Guide</h3>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-4 py-2 bg-surface-2 border border-border rounded-xl hover:border-primary/30 transition-all duration-200"
            >
              <span className="text-2xl">{selectedPhilosopher.avatar}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-text">{selectedPhilosopher.name}</div>
                <div className="text-xs text-muted">{selectedPhilosopher.era}</div>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted transition-transform", showDropdown && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 w-64 bg-surface border border-border rounded-xl shadow-lg z-50"
                >
                  <div className="p-2 space-y-1">
                    {philosophers.map((philosopher) => (
                      <button
                        key={philosopher.id}
                        onClick={() => {
                          setSelectedPhilosopher(philosopher);
                          setShowDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                          selectedPhilosopher.id === philosopher.id
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-surface-2 border border-transparent"
                        )}
                      >
                        <span className="text-2xl">{philosopher.avatar}</span>
                        <div>
                          <div className="text-sm font-medium text-text">{philosopher.name}</div>
                          <div className="text-xs text-muted">{philosopher.era}</div>
                          <div className="text-xs text-muted mt-1 line-clamp-2">{philosopher.title}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Chat Interface */}
            <div className="bg-surface-2 border border-border rounded-xl h-[500px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                      {selectedPhilosopher.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">{selectedPhilosopher.name}</h3>
                      <p className="text-sm text-muted">
                        {selectedPhilosopher.title} • {selectedPhilosopher.era}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={clearConversation}
                    variant="outline"
                    size="sm"
                    className="border-border text-muted hover:text-text"
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
                      className={cn(
                        "max-w-[80%] p-3 rounded-xl",
                        message.sender === 'user'
                          ? "bg-primary text-white"
                          : "bg-surface-3 text-text border border-border"
                      )}
                    >
                      {message.sender === 'philosopher' && message.philosopher && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{message.philosopher.avatar}</span>
                          <span className="text-sm font-medium text-muted">
                            {message.philosopher.name}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface-3 border border-border rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your question..."
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
      </div>
    </motion.div>
  );
} 