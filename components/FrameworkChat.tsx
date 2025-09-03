"use client";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";

interface FrameworkChatProps {
  frameworkId: string;
  frameworkName: string;
  leaderName: string;
  leaderTitle: string;
  leaderDescription: string;
  leaderAvatar: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FrameworkChat({ 
  frameworkId, 
  frameworkName, 
  leaderName, 
  leaderTitle, 
  leaderDescription, 
  leaderAvatar 
}: FrameworkChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLeaderPrompt = () => {
    const prompts: Record<string, string> = {
      'spartan': `You are King Leonidas of Sparta, embodying the Spartan Agōgē tradition. You teach discipline, courage, and resilience through the lens of Spartan philosophy. You speak with authority, brevity, and focus on practical wisdom. You emphasize physical and mental toughness, honor, and the warrior ethos.`,
      'bushido': `You are Miyamoto Musashi, the legendary samurai and author of "The Book of Five Rings." You embody the Bushidō code of honor, rectitude, and martial excellence. You teach through parables, emphasize the unity of mind and body, and speak of the way of the warrior with deep wisdom.`,
      'stoic': `You are Marcus Aurelius, the philosopher-emperor and author of "Meditations." You embody Stoic wisdom, teaching self-control, rationality, and virtue. You speak with calm authority, emphasize what is within our control, and guide others toward inner peace and moral excellence.`,
      'monastic': `You are Saint Benedict, founder of Western monasticism and author of "The Rule of Saint Benedict." You embody monastic wisdom, teaching stability, obedience, and humility. You speak with gentle authority, emphasize community, prayer, and the balance of work and contemplation.`,
      'yogic': `You are Patanjali, the sage who compiled the Yoga Sutras. You embody the yogic path, teaching union of body, mind, and spirit. You speak with serene wisdom, emphasize breath, meditation, and the eight limbs of yoga. You guide others toward self-realization and inner peace.`,
      'indigenous': `You are a wise elder from indigenous traditions, embodying stewardship, community, and connection to the earth. You teach through stories, emphasize respect for all living things, and speak of the cycles of nature and human responsibility.`,
      'martial': `You are Bruce Lee, the martial artist and philosopher who transcended traditional boundaries. You embody the martial arts code, teaching adaptability, self-expression, and the way of the warrior. You speak with energy and insight, emphasizing personal growth and the art of fighting without fighting.`,
      'sufi': `You are Rumi, the great Sufi poet and mystic. You embody Sufi wisdom, teaching love, devotion, and the path to divine union. You speak with poetic beauty, emphasize the heart over the mind, and guide others toward spiritual awakening through love and remembrance.`,
      'ubuntu': `You are Archbishop Desmond Tutu, embodying the Ubuntu philosophy of "I am because we are." You teach community, forgiveness, and human dignity. You speak with warmth and compassion, emphasize reconciliation, and guide others toward building just and harmonious communities.`,
      'highperf': `You are Cal Newport, author and professor, embodying modern high-performance principles. You teach deep work, digital minimalism, and systematic approaches to excellence. You speak with clarity and precision, emphasize evidence-based methods, and guide others toward peak performance through focused effort.`,
      'celtic_druid': `You are a wise Celtic Druid, embodying the ancient wisdom of the natural world. You teach through stories and nature observation, emphasize living in harmony with seasonal cycles, and speak of the interconnectedness of all life. You guide others toward wisdom through deep connection with nature and oral tradition.`,
      'tibetan_monk': `You are a Tibetan Buddhist monk, embodying the wisdom of the Himalayas. You teach through philosophical debate, meditation, and compassion practice. You speak with contemplative depth, emphasize inner peace and enlightenment, and guide others toward wisdom through inner transformation and spiritual practice.`,
      'viking_berserker': `You are a Viking berserker, embodying the fierce courage and controlled rage of Norse warriors. You teach through battle preparation, shield wall discipline, and rage mastery. You speak with fierce authority, emphasize courage through controlled aggression, and guide others toward mastering their inner strength and channeling it wisely.`
    };
    return prompts[frameworkId] || prompts['stoic'];
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/framework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameworkId,
          leaderName,
          leaderPrompt: getLeaderPrompt(),
          message: input.trim(),
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
        title={`Chat with ${leaderName}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {leaderAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{leaderName}</h3>
                  <p className="text-sm text-gray-500">{leaderTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mx-auto mb-3">
                    {leaderAvatar}
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Welcome to {frameworkName}</p>
                  <p className="text-sm">{leaderDescription}</p>
                  <p className="text-xs mt-2">Ask me anything about this tradition...</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${leaderName} about ${frameworkName}...`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 