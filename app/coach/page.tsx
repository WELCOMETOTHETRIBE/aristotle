'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Send, Brain, Shield, Scale, Leaf, MessageCircle, Volume2, VolumeX, RotateCcw, Lightbulb, Heart, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

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
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona: 'aristotle',
          userMessage: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || "I apologize, but I'm having trouble responding right now. Please try again.";
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback responses if API fails
      const fallbackResponses = [
        "Ah, an excellent question that touches upon the very nature of human excellence. Let me share with you what I have observed about this matter...",
        "This brings to mind a fundamental principle I discovered in my studies: that virtue lies not in the extremes, but in the golden mean between excess and deficiency.",
        "Consider this: every action we take is either moving us toward eudaimonia or away from it. Your situation presents an opportunity for growth.",
        "In my Nicomachean Ethics, I wrote that 'we are what we repeatedly do. Excellence, then, is not an act, but a habit.' How does this apply to your circumstance?",
        "The wise person seeks not just to know what is right, but to do what is right. Your question reveals a thoughtful mind seeking practical wisdom.",
        "Let us examine this through the lens of the four cardinal virtues. Which virtue - wisdom, courage, justice, or temperance - is most relevant here?",
        "Remember, my friend, that the goal of life is not happiness as a fleeting emotion, but eudaimonia - a life of flourishing and excellence.",
        "This challenge you face is not an obstacle, but a teacher. What is it trying to teach you about yourself and your character?"
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
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
        content: `Let us explore ${virtue.toLowerCase()}. ${question}`,
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
    <PageLayout title="Aristotle AI" description="Your philosophical guide for cultivating wisdom, courage, justice, and temperance">
      {/* Back to Home Link */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="glass-card shadow-xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-amber-400" />
                <div>
                  <h2 className="section-title">Philosophical Dialogue</h2>
                  <p className="body-text">
                    Engage in Socratic dialogue with Aristotle to explore virtue and wisdom
                  </p>
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
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.sender === 'aristotle' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
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
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-6">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Aristotle about virtue, wisdom, or life..."
                  className="input-primary flex-1"
                  disabled={isProcessing}
                />
                <button
                  onClick={startRecording}
                  disabled={isRecording || isProcessing}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="btn-primary p-3"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Virtue Selection */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-amber-400" />
              <h2 className="section-title">Explore Virtues</h2>
            </div>
            <p className="body-text mb-4">
              Choose a virtue to focus our discussion
            </p>
            <div className="space-y-3">
              {virtues.map((virtue) => {
                const IconComponent = virtue.icon;
                return (
                  <button
                    key={virtue.name}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${
                      selectedVirtue === virtue.name 
                        ? `bg-gradient-to-r ${virtue.color} text-white border-transparent` 
                        : 'bg-white/5 text-white hover:bg-white/10 border-white/20'
                    }`}
                    onClick={() => handleVirtueSelect(virtue.name)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{virtue.name}</div>
                        <div className="text-xs opacity-70">{virtue.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="section-title">Conversation Starters</h2>
            </div>
            <div className="space-y-2">
              {philosophicalPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(prompt)}
                  className="text-left text-sm text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-colors w-full border border-transparent hover:border-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Aristotle's Wisdom */}
          <div className="glass-card bg-gradient-to-r from-amber-500/20 to-orange-600/20">
            <blockquote className="text-lg italic text-white mb-4 leading-relaxed">
              "The more you know, the more you realize you don't know."
            </blockquote>
            <cite className="text-sm text-amber-300">— Aristotle</cite>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 