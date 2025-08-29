"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FrameworkRecord } from "@/lib/types/framework";

export default function FrameworkDropdown() {
  const [items, setItems] = useState<FrameworkRecord[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => { 
    fetch("/api/frameworks")
      .then(r => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(o => !o)} 
        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        Frameworks ▾
      </button>
      {open && (
        <div className="absolute mt-2 w-64 rounded-xl bg-black/80 backdrop-blur border border-white/10 p-2 shadow-xl z-50">
          <ul className="max-h-80 overflow-auto">
            {items.map((f: FrameworkRecord) => (
              <li key={f.id}>
                <Link 
                  href={`/frameworks/${f.id}`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{f.nav?.emoji ?? "✨"}</span>
                  <span className="text-sm">{f.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 