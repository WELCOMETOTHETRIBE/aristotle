'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mic, Send, Brain, Shield, Scale, Leaf, MessageCircle, 
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

interface PhilosophersDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhilosophersDialogueModal({ isOpen, onClose }: PhilosophersDialogueModalProps) {
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
    // Initialize with philosopher's greeting when modal opens
    if (isOpen && selectedPhilosopher) {
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
  }, [isOpen, selectedPhilosopher]);

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
    setIsProcessing(true);

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/chat/philosopher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          philosopher: selectedPhilosopher.id,
          context: {
            previousMessages: messages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          }
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let content = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    content += parsed.content;
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
          
          // Add philosopher's response
          const philosopherMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: content,
            sender: 'philosopher',
            timestamp: new Date(),
            philosopher: {
              name: selectedPhilosopher.name,
              title: selectedPhilosopher.title,
              avatar: selectedPhilosopher.avatar
            }
          };

          setMessages(prev => [...prev, philosopherMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'philosopher',
        timestamp: new Date(),
        philosopher: {
          name: selectedPhilosopher.name,
          title: selectedPhilosopher.title,
          avatar: selectedPhilosopher.avatar
        }
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const resetConversation = () => {
    setMessages([]);
    setInputValue('');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">Philosopher's Dialogue</h2>
                  <p className="text-sm text-muted">Chat with ancient wisdom</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetConversation}
                  className="p-2 text-muted hover:text-text transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Philosopher Selection */}
            <div className="p-4 border-b border-border">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between p-3 bg-surface-2 border border-border rounded-xl hover:bg-surface transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-300">
                        {selectedPhilosopher.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-text">{selectedPhilosopher.name}</div>
                      <div className="text-xs text-muted">{selectedPhilosopher.title}</div>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted transition-transform", showDropdown && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                    >
                      {philosophers.map((philosopher) => (
                        <button
                          key={philosopher.id}
                          onClick={() => {
                            setSelectedPhilosopher(philosopher);
                            setShowDropdown(false);
                            resetConversation();
                          }}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-surface-2 transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-300">
                              {philosopher.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-text">{philosopher.name}</div>
                            <div className="text-xs text-muted">{philosopher.title}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] p-4 rounded-2xl",
                      message.sender === 'user'
                        ? "bg-primary text-white"
                        : "bg-surface-2 border border-border"
                    )}
                  >
                    {message.sender === 'philosopher' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-300">
                            {message.philosopher?.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-muted">
                          {message.philosopher?.name}
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  <div className="bg-surface-2 border border-border rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-300">
                          {selectedPhilosopher.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your philosopher a question..."
                    className="w-full p-3 bg-surface-2 border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 