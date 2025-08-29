"use client";
import { useState } from "react";

export default function FrameworkPersonaChat({ frameworkId, title }: { frameworkId: string; title: string }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Array<{role:"user"|"assistant"; content:string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
      <div className="font-medium mb-2 text-white">Chat with {title} Guide</div>
      <div className="space-y-2 max-h-64 overflow-auto mb-3">
        {msgs.length === 0 ? (
          <div className="text-center text-gray-400 py-4 text-sm">
            Ask for guidance from the {title} tradition...
          </div>
        ) : (
          msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div className={`inline-block px-3 py-2 rounded-xl text-sm max-w-xs ${
                m.role === "user" 
                  ? "bg-cyan-500/20 text-cyan-100" 
                  : "bg-white/10 text-white"
              }`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-xl text-sm bg-white/10 text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask for guidance…"
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none text-white placeholder-gray-400"
          disabled={isLoading}
        />
        <button 
          onClick={send} 
          disabled={!input.trim() || isLoading}
          className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
} 