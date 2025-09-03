"use client";
import { useState } from "react";

export default function FrameworkPersonaChat({ frameworkId, title }: { frameworkId: string; title: string }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Array<{role:"user"|"assistant"; content:string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRepresentativeInfo = (frameworkId: string) => {
    switch (frameworkId) {
      case 'spartan':
        return { name: 'King Leonidas', avatar: '🛡️', description: 'Legendary Spartan King' };
      case 'samurai':
        return { name: 'Miyamoto Musashi', avatar: '⚔️', description: 'Greatest Samurai' };
      case 'stoic':
        return { name: 'Marcus Aurelius', avatar: '🏛️', description: 'Philosopher-Emperor' };
      case 'monastic':
        return { name: 'Saint Benedict', avatar: '⛪', description: 'Founder of Western Monasticism' };
      case 'yogic':
        return { name: 'Patanjali', avatar: '🧘', description: 'Father of Classical Yoga' };
      case 'indigenous':
        return { name: 'Chief Seattle', avatar: '🌍', description: 'Great Tribal Leader' };
      case 'martial':
        return { name: 'Bruce Lee', avatar: '🥋', description: 'Legendary Martial Artist' };
      case 'sufi':
        return { name: 'Rumi', avatar: '🕊️', description: 'Great Persian Poet' };
      case 'ubuntu':
        return { name: 'Archbishop Tutu', avatar: '🤝', description: 'Nobel Peace Laureate' };
      case 'highperf':
        return { name: 'Cal Newport', avatar: '🚀', description: 'High-Performance Expert' };
      case 'celtic_druid':
        return { name: 'Celtic Druid', avatar: '🌿', description: 'Ancient Natural Wisdom' };
      case 'tibetan_monk':
        return { name: 'Tibetan Monk', avatar: '🧘', description: 'Himalayan Sage' };
      case 'viking_berserker':
        return { name: 'Viking Berserker', avatar: '⚔️', description: 'Norse Warrior' };
      default:
        return { name: 'Ancient Sage', avatar: '🧙', description: 'Wisdom Keeper' };
    }
  };

  const representative = getRepresentativeInfo(frameworkId);

  async function send() {
    if (!input.trim() || isLoading) return;
    const user = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", content: user }]);
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: frameworkId, // server maps id -> system prompt/tone
          userMessage: user
        })
      });
      const data = await res.json().catch(()=>({ reply: "…" }));
      setMsgs(m => [...m, { role: "assistant", content: data.reply ?? "…" }]);
    } catch (error) {
      setMsgs(m => [...m, { role: "assistant", content: "I'm having trouble responding right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
          {representative.avatar}
        </div>
        <div>
          <div className="font-semibold text-lg text-white">{representative.name}</div>
          <div className="text-sm text-gray-300">{representative.description} • {title} Representative</div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-auto mb-4 p-4 bg-black/20 rounded-xl border border-white/10">
        {msgs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <div className="text-gray-400 text-sm mb-2">Begin a conversation with {representative.name}</div>
            <div className="text-gray-500 text-xs">Ask for wisdom, guidance, or insights from this legendary figure</div>
          </div>
        ) : (
          msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
                m.role === "user" 
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
                  : "bg-white/10 text-white border border-white/20"
              }`}>
                <div className="font-medium text-xs mb-1 opacity-70">
                  {m.role === "user" ? "You" : representative.name}
                </div>
                <div className="leading-relaxed">{m.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm bg-white/10 text-white border border-white/20">
              <div className="font-medium text-xs mb-1 opacity-70">{representative.name}</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-xs opacity-70">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask ${representative.name} for wisdom, guidance, or insights...`}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          disabled={isLoading}
        />
        <button 
          onClick={send} 
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
} 