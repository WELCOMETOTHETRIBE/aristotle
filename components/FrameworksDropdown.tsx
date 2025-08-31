"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FrameworksDropdown() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/frameworks", { cache: "no-store" })
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const getFrameworkIcon = (slug: string) => {
    const iconMap: { [key: string]: string } = {
      stoic: "🧘",
      spartan: "🛡️",
      bushido: "⚔️",
      yogic: "🧘‍♀️",
      taoist: "☯️",
      buddhist: "🕉️",
      confucian: "📚",
      epicurean: "🍇",
      cynic: "🐕",
      skeptic: "❓"
    };
    return iconMap[slug] || "✨";
  };

  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="px-2 py-1 rounded text-white/70 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors"
        title="Frameworks — Explore 10 Universal Paths"
      >
        Frameworks ▾
      </button>

      {open && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 max-h-[70vh] overflow-auto rounded-xl bg-black/85 backdrop-blur border border-white/10 shadow-xl z-[60]"
          role="listbox"
        >
          <div className="px-3 py-2 text-xs opacity-70">10 Universal Frameworks</div>
          <ul className="py-1">
            {items.map((f: any) => (
              <li key={f.id}>
                <Link
                  href={`/frameworks/${f.slug}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{getFrameworkIcon(f.slug)}</span>
                  <span className="truncate">{f.name}</span>
                  <span className="ml-auto text-[10px] opacity-70">{f.virtuePrimary}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10" />
          <Link
            href="/frameworks"
            className="block px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            View all frameworks →
          </Link>
        </div>
      )}
    </div>
  );
} 