"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Shield, Scale, Leaf, Search, Settings, User, Home } from "lucide-react";
import { motion } from "framer-motion";

const virtues = [
  {
    name: "Home",
    path: "/",
    icon: Home,
    color: "from-accent to-accent-2",
    bgColor: "bg-accent/20",
    borderColor: "border-accent/30"
  },
  {
    name: "Wisdom",
    path: "/wisdom",
    icon: Brain,
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-400/30"
  },
  {
    name: "Courage",
    path: "/courage",
    icon: Shield,
    color: "from-red-400 to-orange-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-400/30"
  },
  {
    name: "Justice",
    path: "/justice",
    icon: Scale,
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-400/30"
  },
  {
    name: "Temperance",
    path: "/temperance",
    icon: Leaf,
    color: "from-purple-400 to-violet-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-400/30"
  },
];

export function VirtueNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Header - Ultra compact */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex items-center justify-between h-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 interactive">
              <div className="w-5 h-5 bg-gradient-to-r from-accent to-accent-2 rounded-md flex items-center justify-center shadow-lg">
                <Brain size={10} className="text-black" />
              </div>
              <span className="font-semibold text-white text-xs">Academy</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="Search">
                <Search size={12} />
              </button>
              <button className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="Settings">
                <Settings size={12} />
              </button>
              <button className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="Profile">
                <User size={12} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation - Ultra compact */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex items-center justify-around py-2">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              const isActive = pathname === virtue.path;
              
              return (
                <Link key={virtue.path} href={virtue.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all duration-200 interactive ${
                      isActive 
                        ? `${virtue.bgColor} ${virtue.borderColor} border shadow-md` 
                        : 'hover:bg-white/10 hover:border-white/20 border border-transparent'
                    }`}
                    title={virtue.name}
                  >
                    <div className={`w-6 h-6 bg-gradient-to-r ${virtue.color} rounded-md flex items-center justify-center shadow-sm`}>
                      <IconComponent size={12} className="text-white drop-shadow-sm" />
                    </div>
                    <span className={`text-[10px] font-medium ${
                      isActive ? 'text-white' : 'text-white/70'
                    }`}>
                      {virtue.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtue"
                        className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full shadow-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
} 