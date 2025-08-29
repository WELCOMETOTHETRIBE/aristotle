"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FrameworkRecord } from "@/lib/types/framework";

export default function FrameworkDropdown() {
  const [items, setItems] = useState<FrameworkRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
    const loadFrameworks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/frameworks");
        if (response.ok) {
          const frameworks = await response.json();
          setItems(frameworks);
        } else {
          console.error('Failed to load frameworks');
        }
      } catch (error) {
        console.error('Error loading frameworks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFrameworks();
  }, []);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(o => !o)} 
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
      >
        <span>Frameworks</span>
        <span className="text-sm">▾</span>
      </button>
      {open && (
        <div className="absolute mt-2 w-80 rounded-xl bg-white/95 backdrop-blur border border-gray-200 shadow-xl z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-200">
              10 Universal Wisdom Traditions
            </div>
            <ul className="max-h-96 overflow-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading frameworks...
                </div>
              ) : items.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No frameworks available
                </div>
              ) : (
                items.map((f: FrameworkRecord) => (
                  <li key={f.id}>
                    <Link 
                      href={`/frameworks/${f.id}`} 
                      className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-xl">{f.nav?.emoji ?? "✨"}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{f.name}</div>
                        <div className="text-sm text-gray-500">{f.nav?.badge}</div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 