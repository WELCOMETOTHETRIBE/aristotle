'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { MessageSquare, Send, Bot, User, Sparkles, BookOpen, Brain, Shield, Scale, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Philosopher {
  id: string;
  name: string;
  era: string;
  school: string;
  description: string;
  icon: any;
  color: string;
  specialties: string[];
}

const philosophers: Philosopher[] = [
  {
    id: 'socrates',
    name: 'Socrates',
    era: '470-399 BCE',
    school: 'Classical Greek',
    description: 'The father of Western philosophy, known for the Socratic method and questioning everything.',
    icon: Brain,
    color: 'bg-primary/20 text-primary border-primary/30',
    specialties: ['Ethics', 'Knowledge', 'Self-examination', 'Dialogue']
  },
  {
    id: 'plato',
    name: 'Plato',
    era: '428-348 BCE',
    school: 'Platonism',
    description: 'Student of Socrates, founder of the Academy, and author of philosophical dialogues.',
    icon: BookOpen,
    color: 'bg-courage/20 text-courage border-courage/30',
    specialties: ['Metaphysics', 'Justice', 'Education', 'Forms']
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    era: '384-322 BCE',
    school: 'Aristotelianism',
    description: 'Student of Plato, founder of logic, and systematic philosopher of nature and ethics.',
    icon: Shield,
    color: 'bg-justice/20 text-justice border-justice/30',
    specialties: ['Virtue Ethics', 'Logic', 'Politics', 'Natural Science']
  },
  {
    id: 'marcus-aurelius',
    name: 'Marcus Aurelius',
    era: '121-180 CE',
    school: 'Stoicism',
    description: 'Roman Emperor and Stoic philosopher, author of Meditations.',
    icon: Scale,
    color: 'bg-temperance/20 text-temperance border-temperance/30',
    specialties: ['Stoicism', 'Self-control', 'Leadership', 'Resilience']
  },
  {
    id: 'epictetus',
    name: 'Epictetus',
    era: '50-135 CE',
    school: 'Stoicism',
    description: 'Former slave turned Stoic philosopher, teacher of practical wisdom.',
    icon: Leaf,
    color: 'bg-primary/20 text-primary border-primary/30',
    specialties: ['Freedom', 'Acceptance', 'Inner peace', 'Practical wisdom']
  },
  {
    id: 'seneca',
    name: 'Seneca',
    era: '4 BCE-65 CE',
    school: 'Stoicism',
    description: 'Roman statesman and Stoic philosopher, author of Letters and Essays.',
    icon: Brain,
    color: 'bg-courage/20 text-courage border-courage/30',
    specialties: ['Virtue', 'Time', 'Anger', 'Friendship']
  }
];

export default function AcademyPage() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = (philosopher: Philosopher) => {
    setSelectedPhilosopher(philosopher);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Greetings, seeker of wisdom. I am ${philosopher.name}, and I welcome you to our philosophical dialogue. What questions do you bring to our conversation today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !selectedPhilosopher) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsGenerating(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages([...updatedMessages, typingMessage]);

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are ${selectedPhilosopher.name}, a ${selectedPhilosopher.school} philosopher from ${selectedPhilosopher.era}. Respond to this question or reflection in your authentic philosophical voice: "${userInput.trim()}".

IMPORTANT: Respond as ${selectedPhilosopher.name} would, using their philosophical perspective and style. Keep your response concise (2-3 sentences max) and conversational. Focus on practical wisdom that the user can immediately apply.`,
          context: {
            page: 'academy',
            focusVirtue: 'wisdom',
            timeOfDay: new Date().getHours(),
          },
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
          
          // Clean markdown from response
          const cleanContent = content
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/^#+\s*/gm, '')
            .replace(/^\s*[-*+]\s*/gm, '')
            .replace(/^\s*\d+\.\s*/gm, '')
            .trim();
          
          const aiMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: cleanContent || 'I appreciate your question. Let me reflect on this with you...',
            timestamp: new Date(),
          };

          const finalMessages = [...updatedMessages, aiMessage];
          setMessages(finalMessages);
        }
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue="wisdom" />
      
      <main className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">AI Academy</h1>
          <p className="text-muted">Chat with ancient philosophers and learn timeless wisdom</p>
        </div>

        {!selectedPhilosopher ? (
          /* Philosopher Selection */
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text">Choose Your Philosopher</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {philosophers.map((philosopher) => {
                const IconComponent = philosopher.icon;
                return (
                  <button
                    key={philosopher.id}
                    onClick={() => startConversation(philosopher)}
                    className="p-4 bg-surface border border-border rounded-lg hover:bg-surface-2 transition-colors duration-150 text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', philosopher.color)}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text">{philosopher.name}</h3>
                        <p className="text-xs text-muted mb-1">{philosopher.era} • {philosopher.school}</p>
                        <p className="text-sm text-muted mb-2">{philosopher.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {philosopher.specialties.slice(0, 3).map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-surface-2 text-xs text-muted rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="space-y-4">
            {/* Philosopher Header */}
            <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', selectedPhilosopher.color)}>
                  <selectedPhilosopher.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">{selectedPhilosopher.name}</h3>
                  <p className="text-xs text-muted">{selectedPhilosopher.era} • {selectedPhilosopher.school}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPhilosopher(null);
                  setMessages([]);
                }}
                className="text-sm text-muted hover:text-text transition-colors"
              >
                Choose Another
              </button>
            </div>

            {/* Messages */}
            <div className="bg-surface border border-border rounded-lg p-4 h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p className="text-sm text-muted">Start a conversation with {selectedPhilosopher.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', selectedPhilosopher.color)}>
                          <selectedPhilosopher.icon className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] p-3 rounded-lg text-sm',
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-surface-2 border border-border text-text'
                        )}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-pulse">Thinking</div>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-muted rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Ask ${selectedPhilosopher.name} about wisdom, philosophy, or life...`}
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                disabled={isGenerating}
              />
              <button
                onClick={sendMessage}
                disabled={!userInput.trim() || isGenerating}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <TabBar />
    </div>
  );
} 