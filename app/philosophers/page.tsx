'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Send, Brain, Shield, Scale, Leaf, MessageCircle, Volume2, VolumeX, RotateCcw, Lightbulb, Heart, Zap, ArrowLeft, ChevronDown, BookOpen, Users, Clock, Star, Info } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
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
    <PageLayout title="Philosopher's Journey" description="Engage in dialogue with the greatest minds of history">
      {/* Back to Home Link */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 py-16 -mt-12 mb-8 rounded-xl border border-indigo-500/20">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <span className="text-lg font-medium text-white">
              Ancient Wisdom
            </span>
          </div>
          
          <div className="max-w-2xl mx-auto mb-6">
            <p className="text-lg text-white opacity-90 leading-relaxed">
              Explore the timeless wisdom of history's greatest philosophers through interactive dialogue and deep learning.
            </p>
          </div>
        </div>
      </div>

      {/* Terminology Section */}
      <div className="page-section">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="section-title">Philosophical Terminology</h2>
          <button
            onClick={() => setShowWidgetInfo(showWidgetInfo === 'terminology' ? null : 'terminology')}
            className="p-1 text-muted-foreground hover:text-white transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="section-description">
          Explore 25 profound philosophical concepts from various traditions
        </p>
        {showWidgetInfo === 'terminology' && (
          <div className="mb-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <p className="text-sm text-indigo-200">
              This comprehensive terminology guide covers key concepts from Aristotelian, Stoic, Daoist, Confucian, and other philosophical traditions. 
              Each term includes pronunciation, definition, examples, and significance to deepen your understanding of philosophical wisdom.
            </p>
          </div>
        )}
        <PhilosophicalTerminologyWidget />
      </div>

      {/* AI Chat Section */}
      <div className="page-section">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="section-title">Philosophical Dialogue</h2>
          <button
            onClick={() => setShowWidgetInfo(showWidgetInfo === 'chat' ? null : 'chat')}
            className="p-1 text-muted-foreground hover:text-white transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="section-description">
          Engage in meaningful conversation with history's greatest philosophers
        </p>
        {showWidgetInfo === 'chat' && (
          <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-200">
              Each philosopher has been carefully crafted with unique system prompts that capture their authentic voice, 
              teaching style, and philosophical approach. Ask questions, seek guidance, or explore their wisdom through interactive dialogue.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="glass-card shadow-xl h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedPhilosopher.color} flex items-center justify-center text-2xl`}>
                      {selectedPhilosopher.avatar}
                    </div>
                    <div>
                      <h3 className="section-title text-xl">{selectedPhilosopher.name}</h3>
                      <p className="body-text text-gray-400">
                        {selectedPhilosopher.title} • {selectedPhilosopher.era}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearConversation}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Clear conversation"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-white'
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
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
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
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isProcessing}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Philosopher Selector */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Choose Your Guide</h3>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{selectedPhilosopher.avatar}</span>
                    <div className="text-left">
                      <div className="font-medium">{selectedPhilosopher.name}</div>
                      <div className="text-sm text-gray-400">{selectedPhilosopher.title}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg z-10 max-h-64 overflow-y-auto">
                    {philosophers.map((philosopher) => (
                      <button
                        key={philosopher.id}
                        onClick={() => {
                          setSelectedPhilosopher(philosopher);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-left"
                      >
                        <span className="text-xl">{philosopher.avatar}</span>
                        <div>
                          <div className="font-medium text-white">{philosopher.name}</div>
                          <div className="text-sm text-gray-400">{philosopher.title}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Philosopher Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">About {selectedPhilosopher.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{selectedPhilosopher.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Key Teachings</h4>
                  <div className="space-y-1">
                    {selectedPhilosopher.keyTeachings.map((teaching, index) => (
                      <div key={index} className="text-xs text-gray-400 flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {teaching}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Start a Conversation</h3>
              <div className="space-y-2">
                {selectedPhilosopher.exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => askExampleQuestion(question)}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 