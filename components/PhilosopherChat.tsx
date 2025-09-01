'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Users, ChevronDown, Sparkles, Brain, Shield, Scale, Leaf } from 'lucide-react';
import { getAllPhilosophers, getPhilosopher, type Philosopher } from '@/lib/philosophers';

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

interface PhilosopherChatProps {
  className?: string;
}

export default function PhilosopherChat({ className = '' }: PhilosopherChatProps) {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher>(getAllPhilosophers()[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const getVirtueIcon = (philosopherId: string) => {
    const virtueMap: Record<string, any> = {
      'aristotle': Brain,
      'socrates': Brain,
      'epictetus': Shield,
      'confucius': Scale,
      'laozi': Leaf,
      'marcus-aurelius': Shield,
      'seneca': Shield,
      'plato': Brain
    };
    return virtueMap[philosopherId] || Brain;
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className={`fixed bottom-20 right-4 w-80 h-96 bg-surface border border-border rounded-2xl shadow-2xl flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text text-sm">Philosophical Chat</h3>
            <p className="text-xs text-muted">Choose your guide</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted hover:text-text transition-colors"
        >
          ×
        </button>
      </div>

      {/* Philosopher Selection */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between p-3 bg-surface-2 border border-border rounded-xl hover:bg-surface-3 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedPhilosopher.avatar}</span>
              <div className="text-left">
                <p className="font-medium text-text text-sm">{selectedPhilosopher.name}</p>
                <p className="text-xs text-muted">{selectedPhilosopher.title}</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
              {philosophers.map((philosopher) => (
                <button
                  key={philosopher.id}
                  onClick={() => {
                    setSelectedPhilosopher(philosopher);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-surface-2 transition-colors text-left"
                >
                  <span className="text-xl">{philosopher.avatar}</span>
                  <div>
                    <p className="font-medium text-text text-sm">{philosopher.name}</p>
                    <p className="text-xs text-muted">{philosopher.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Key Teachings */}
        <div className="mt-3 p-3 bg-surface-2 border border-border rounded-xl">
          <p className="text-xs text-muted mb-2">Key teachings:</p>
          <div className="flex flex-wrap gap-1">
            {selectedPhilosopher.keyTeachings.slice(0, 3).map((teaching, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
              >
                {teaching}
              </span>
            ))}
          </div>
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
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`p-3 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-2 border border-border'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.sender === 'philosopher' && (
                <div className="flex items-center space-x-2 mt-2 order-1">
                  <span className="text-lg">{message.philosopher?.avatar}</span>
                  <div className="text-xs text-muted">
                    <p className="font-medium">{message.philosopher?.name}</p>
                    <p>{message.philosopher?.title}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Example Questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <div className="text-center">
              <p className="text-xs text-muted mb-2">Try asking about:</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {selectedPhilosopher.exampleQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="w-full text-left p-2 bg-primary/5 hover:bg-primary/10 rounded-lg text-xs text-primary border border-primary/20 hover:border-primary/30 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xs text-muted">Or type your own question below</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question..."
            className="flex-1 p-3 bg-surface-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            disabled={isProcessing}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={clearConversation}
            className="text-xs text-muted hover:text-text transition-colors"
          >
            Clear chat
          </button>
          <div className="flex items-center space-x-2 text-xs text-muted">
            <Sparkles className="w-3 h-3" />
            <span>AI-powered wisdom</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 