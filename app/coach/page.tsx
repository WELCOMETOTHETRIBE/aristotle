'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Send, Brain, Shield, Scale, Leaf, MessageCircle, Volume2, VolumeX, RotateCcw, Lightbulb, Heart, Zap, ArrowLeft, Quote, BookOpen, User, Bot } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'philosopher';
  timestamp: Date;
  virtue?: string;
  type: 'text' | 'question' | 'guidance' | 'reflection';
}

interface PhilosopherPersona {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  background: string;
  writingStyle: string;
  keyWorks: string[];
  questions: string[];
  greeting: string;
}

const philosophers: PhilosopherPersona[] = [
  {
    name: 'Socrates',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    description: 'The father of Western philosophy, master of the Socratic method',
    background: 'Ancient Greek philosopher who taught through questioning and dialogue',
    writingStyle: 'Socratic questioning, dialectical method, intellectual humility',
    keyWorks: ['Apology', 'Crito', 'Phaedo', 'The Republic (via Plato)'],
    questions: [
      'What do you think you know about this topic?',
      'How do you know that to be true?',
      'What evidence supports your belief?',
      'What would someone who disagrees with you say?'
    ],
    greeting: "Greetings, seeker of truth. I am Socrates, and I believe that 'the unexamined life is not worth living.' Through thoughtful questioning, let us explore your ideas together. What would you like to examine today?"
  },
  {
    name: 'Aristotle',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    description: 'Student of Plato, founder of systematic philosophy',
    background: 'Ancient Greek philosopher who emphasized empirical observation and practical wisdom',
    writingStyle: 'Systematic analysis, empirical observation, practical application',
    keyWorks: ['Nicomachean Ethics', 'Politics', 'Metaphysics', 'Poetics'],
    questions: [
      'What is the purpose or end goal of this action?',
      'How does this relate to the concept of eudaimonia (human flourishing)?',
      'What is the golden mean between excess and deficiency here?',
      'How can we apply this principle practically in daily life?'
    ],
    greeting: "Greetings, seeker of wisdom. I am Aristotle, and I believe that 'we are what we repeatedly do. Excellence, then, is not an act, but a habit.' What aspect of virtue or human flourishing would you like to explore?"
  },
  {
    name: 'Marcus Aurelius',
    icon: Scale,
    color: 'from-green-500 to-emerald-600',
    description: 'Roman Emperor and Stoic philosopher',
    background: 'Roman Emperor who practiced Stoic philosophy during challenging times',
    writingStyle: 'Personal reflection, practical stoicism, inner resilience',
    keyWorks: ['Meditations', 'Letters to Fronto'],
    questions: [
      'What is within your control in this situation?',
      'How can you respond with virtue regardless of external circumstances?',
      'What would a wise person do in your position?',
      'How can you find meaning in this challenge?'
    ],
    greeting: "Greetings, fellow traveler. I am Marcus Aurelius, and I believe that 'the happiness of your life depends upon the quality of your thoughts.' What challenge or situation would you like to examine through the lens of Stoic wisdom?"
  },
  {
    name: 'Epictetus',
    icon: Leaf,
    color: 'from-purple-500 to-pink-600',
    description: 'Former slave turned Stoic teacher',
    background: 'Former slave who became a leading Stoic philosopher, emphasizing inner freedom',
    writingStyle: 'Direct instruction, practical exercises, emphasis on inner control',
    keyWorks: ['Discourses', 'Enchiridion (Manual)'],
    questions: [
      'What is truly under your control in this matter?',
      'How can you maintain your inner peace regardless of external events?',
      'What would it mean to accept this situation with equanimity?',
      'How can you turn this obstacle into an opportunity for growth?'
    ],
    greeting: "Greetings, seeker of inner freedom. I am Epictetus, and I believe that 'freedom is not procured by a full enjoyment of what is desired, but by controlling the desire.' What desire or attachment would you like to examine?"
  }
];

const philosophicalPrompts = [
  "Tell me about a challenge you're facing, and let's explore it philosophically.",
  "What virtue would you like to cultivate today?",
  "Share a recent decision you made, and let's examine it through wisdom.",
  "What does living a good life mean to you?",
  "How can we apply ancient wisdom to your modern situation?"
];

export default function PhilosophersCornerPage() {
  const searchParams = useSearchParams();
  const quote = searchParams.get('quote');
  const author = searchParams.get('author');
  const framework = searchParams.get('framework');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<PhilosopherPersona | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize with quote context if available
  useEffect(() => {
    if (quote && author) {
      const defaultPhilosopher = philosophers.find(p => 
        p.name.toLowerCase().includes(author.toLowerCase()) || 
        author.toLowerCase().includes(p.name.toLowerCase())
      ) || philosophers[0];
      
      setSelectedPhilosopher(defaultPhilosopher);
      
      const initialMessage: Message = {
        id: '1',
        content: `${defaultPhilosopher.greeting}\n\nI see you've been reflecting on this quote: "${quote}"\n\n— ${author}\n\nWhat would you like to explore about this wisdom?`,
        sender: 'philosopher',
        timestamp: new Date(),
        type: 'guidance'
      };
      
      setMessages([initialMessage]);
    } else {
      // Default to Socrates if no quote context
      setSelectedPhilosopher(philosophers[0]);
      const initialMessage: Message = {
        id: '1',
        content: philosophers[0].greeting,
        sender: 'philosopher',
        timestamp: new Date(),
        type: 'guidance'
      };
      setMessages([initialMessage]);
    }
  }, [quote, author]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generatePhilosopherResponse = async (userMessage: string): Promise<string> => {
    if (!selectedPhilosopher) return "I'm not sure which philosopher you'd like to speak with.";
    
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona: selectedPhilosopher.name.toLowerCase(),
          userMessage: userMessage,
          philosopherContext: {
            name: selectedPhilosopher.name,
            background: selectedPhilosopher.background,
            writingStyle: selectedPhilosopher.writingStyle,
            keyWorks: selectedPhilosopher.keyWorks,
            quote: quote || null,
            author: author || null
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || `I apologize, but I'm having trouble responding right now. Please try again.`;
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback responses based on selected philosopher
      return getFallbackResponse(selectedPhilosopher, userMessage);
    }
  };

  const getFallbackResponse = (philosopher: PhilosopherPersona, userMessage: string): string => {
    const responses = {
      'Socrates': [
        "That's an interesting perspective. Let me ask you this: how do you know that to be true?",
        "I wonder if we might examine this more carefully. What evidence supports your belief?",
        "This reminds me of a question I often ask: what do you think you know about this topic?",
        "Let's explore this together through questioning. What would someone who disagrees with you say?"
      ],
      'Aristotle': [
        "This brings to mind a fundamental principle I discovered: that virtue lies in the golden mean between excess and deficiency.",
        "Consider this: every action we take is either moving us toward eudaimonia or away from it. How does this apply to your situation?",
        "In my studies, I found that 'we are what we repeatedly do. Excellence, then, is not an act, but a habit.'",
        "Let us examine this through the lens of practical wisdom. What is the purpose or end goal here?"
      ],
      'Marcus Aurelius': [
        "This challenge you face is not an obstacle, but a teacher. What is it trying to teach you about yourself?",
        "Remember, the quality of your thoughts determines the quality of your life. How can you respond with virtue?",
        "What is within your control in this situation? Focus on that, and accept what you cannot change.",
        "Every difficulty is an opportunity to practice wisdom and resilience. How can you grow from this?"
      ],
      'Epictetus': [
        "What is truly under your control in this matter? Focus on that, and let go of what you cannot change.",
        "This situation is not good or bad in itself - it's your judgment that makes it so. How can you choose differently?",
        "Freedom comes from controlling your desires, not from fulfilling them. What desire can you examine?",
        "Turn this obstacle into an opportunity. How can you use this challenge to strengthen your character?"
      ]
    };
    
    const philosopherResponses = responses[philosopher.name as keyof typeof responses] || responses['Socrates'];
    return philosopherResponses[Math.floor(Math.random() * philosopherResponses.length)];
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
      const response = await generatePhilosopherResponse(inputValue);
      const philosopherMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'philosopher',
        timestamp: new Date(),
        type: 'guidance'
      };

      setMessages(prev => [...prev, philosopherMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhilosopherSelect = (philosopher: PhilosopherPersona) => {
    setSelectedPhilosopher(philosopher);
    setMessages([{
      id: Date.now().toString(),
      content: philosopher.greeting,
      sender: 'philosopher',
      timestamp: new Date(),
      type: 'guidance'
    }]);
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
      setInputValue("I've been thinking about how to apply philosophical wisdom to my daily life...");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-b border-primary/20">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/today" className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors">
                <ArrowLeft size={16} />
                Back to Today
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-text">Philosopher's Corner</h1>
              <p className="text-sm text-muted">Engage in deep dialogue with history's greatest minds</p>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        {/* Quote Context Banner - Show if quote is provided */}
        {quote && author && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Quote className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text mb-2">Today's Wisdom</h3>
                <blockquote className="text-lg font-serif italic text-text leading-relaxed mb-3">
                  "{quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <cite className="text-purple-300 font-medium">— {author}</cite>
                  {framework && (
                    <div className="text-sm text-muted bg-surface/60 px-3 py-1 rounded-full">
                      {framework} Tradition
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl shadow-xl h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-border/20 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Philosophical Dialogue</h2>
                    <p className="text-sm text-muted">
                      {selectedPhilosopher ? `Engaging with ${selectedPhilosopher.name}` : 'Choose a philosopher to begin'}
                    </p>
                  </div>
                </div>
              </div>
              
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
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary to-courage text-white'
                          : 'bg-surface/60 backdrop-blur-sm text-text border border-border/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.sender === 'philosopher' && (
                          <div className={`w-8 h-8 bg-gradient-to-r ${selectedPhilosopher?.color || 'from-primary to-courage'} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-courage rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${selectedPhilosopher?.color || 'from-primary to-courage'} rounded-full flex items-center justify-center`}>
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border/20 p-6">
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={selectedPhilosopher ? `Ask ${selectedPhilosopher.name} about wisdom, virtue, or life...` : "Choose a philosopher to begin..."}
                    className="flex-1 px-4 py-3 bg-surface-2 border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    disabled={isProcessing || !selectedPhilosopher}
                  />
                  <button
                    onClick={startRecording}
                    disabled={isRecording || isProcessing || !selectedPhilosopher}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-surface/50 text-muted hover:text-text hover:bg-surface border border-border/50'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing || !selectedPhilosopher}
                    className="px-4 py-3 bg-gradient-to-r from-primary to-courage text-white rounded-xl hover:from-primary/90 hover:to-courage/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Philosopher Selection */}
            <div className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-text">Choose Your Guide</h2>
              </div>
              <p className="text-sm text-muted mb-4">
                Select a philosopher to engage with their unique perspective
              </p>
              <div className="space-y-3">
                {philosophers.map((philosopher) => (
                  <motion.button
                    key={philosopher.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                      selectedPhilosopher?.name === philosopher.name 
                        ? `bg-gradient-to-r ${philosopher.color} text-white border-transparent` 
                        : 'bg-surface/50 text-text hover:bg-surface border-border/50'
                    }`}
                    onClick={() => handlePhilosopherSelect(philosopher)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${philosopher.color} rounded-lg flex items-center justify-center`}>
                        <philosopher.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{philosopher.name}</div>
                        <div className="text-xs opacity-70">{philosopher.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Philosopher Info */}
            {selectedPhilosopher && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 bg-gradient-to-r ${selectedPhilosopher.color} rounded-xl flex items-center justify-center`}>
                    <selectedPhilosopher.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text">{selectedPhilosopher.name}</h3>
                </div>
                <p className="text-sm text-muted mb-4">{selectedPhilosopher.background}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-text mb-2">Writing Style</h4>
                    <p className="text-xs text-muted">{selectedPhilosopher.writingStyle}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text mb-2">Key Works</h4>
                    <div className="text-xs text-muted space-y-1">
                      {selectedPhilosopher.keyWorks.map((work, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <BookOpen className="w-3 h-3" />
                          {work}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Prompts */}
            <div className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-courage/30 to-courage/10 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-courage" />
                </div>
                <h3 className="text-lg font-semibold text-text">Conversation Starters</h3>
              </div>
              <div className="space-y-2">
                {philosophicalPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptSelect(prompt)}
                    className="text-left text-sm text-muted hover:text-text p-3 rounded-lg hover:bg-surface/50 transition-colors w-full border border-transparent hover:border-border/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Wisdom Link */}
            <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">Get New Wisdom</h3>
                <p className="text-sm text-muted mb-4">
                  Refresh your daily quote and continue the conversation
                </p>
                <Link 
                  href="/today"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 