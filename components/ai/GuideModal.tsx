'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Target, Heart, Brain, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const contextChips = [
  {
    label: 'Plan',
    icon: Target,
    description: 'Design your day',
    color: 'bg-primary/20 text-primary border-primary/30',
  },
  {
    label: 'Practice',
    icon: Heart,
    description: 'Refine your habits',
    color: 'bg-courage/20 text-courage border-courage/30',
  },
  {
    label: 'Reflect',
    icon: Brain,
    description: 'Evening debrief',
    color: 'bg-justice/20 text-justice border-justice/30',
  },
  {
    label: 'Learn',
    icon: BookOpen,
    description: '2-minute wisdom',
    color: 'bg-temperance/20 text-temperance border-temperance/30',
  },
];

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Aristotle, your guide to flourishing. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: {
            page: 'guide',
            focusVirtue: 'wisdom', // TODO: Get from context
            timeOfDay: new Date().getHours(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

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
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again later.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextChip = (label: string) => {
    const prompts = {
      Plan: 'Help me plan my day with intention. What are the top 3 things I should focus on today?',
      Practice: 'I want to improve my daily habits. How can I make my current practices more effective?',
      Reflect: 'It\'s evening and I want to reflect on my day. What questions should I ask myself?',
      Learn: 'Teach me a quick 2-minute lesson from ancient wisdom that I can apply today.',
    };

    setInputValue(prompts[label as keyof typeof prompts] || '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[80vh] bg-surface border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">AI Guide</h2>
              <p className="text-xs text-muted">Your personal Aristotle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Chips */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-2 gap-2">
            {contextChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleContextChip(chip.label)}
                className={cn(
                  'flex items-center space-x-2 p-3 rounded-lg border transition-all duration-150 hover:scale-105',
                  chip.color
                )}
              >
                <chip.icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">{chip.label}</div>
                  <div className="text-xs opacity-80">{chip.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] p-3 rounded-lg',
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-text border border-border'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-2 border border-border rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Aristotle anything..."
              className="flex-1 px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 