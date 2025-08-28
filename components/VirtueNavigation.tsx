"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Shield, Scale, Leaf, Search, Settings, User } from "lucide-react";
import { motion } from "framer-motion";

const virtues = [
  {
    name: "Wisdom",
    path: "/wisdom",
    icon: Brain,
    color: "from-accent to-blue-500",
  },
  {
    name: "Courage",
    path: "/courage",
    icon: Shield,
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Justice",
    path: "/justice",
    icon: Scale,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Temperance",
    path: "/temperance",
    icon: Leaf,
    color: "from-accent-2 to-purple-500",
  },
];

export function VirtueNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container-academy">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 interactive">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-accent-2 rounded-xl flex items-center justify-center shadow-lg">
              <Brain size={22} className="text-black" />
            </div>
            <span className="font-bold text-white text-xl">Academy</span>
          </Link>

          {/* Virtue Dock */}
          <div className="hidden md:flex items-center gap-3">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              const isActive = pathname === virtue.path;
              
              return (
                <Link key={virtue.path} href={virtue.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-4 rounded-xl transition-all duration-200 interactive ${
                      isActive 
                        ? 'bg-white/10 border border-white/20 shadow-lg' 
                        : 'hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${virtue.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <IconComponent size={18} className="text-white" />
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtue"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full shadow-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-3 text-muted hover:text-white transition-colors interactive rounded-xl hover:bg-white/5">
              <Search size={20} />
            </button>
            <button className="p-3 text-muted hover:text-white transition-colors interactive rounded-xl hover:bg-white/5">
              <Settings size={20} />
            </button>
            <button className="p-3 text-muted hover:text-white transition-colors interactive rounded-xl hover:bg-white/5">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Virtue Dock */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass rounded-2xl p-3 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              const isActive = pathname === virtue.path;
              
              return (
                <Link key={virtue.path} href={virtue.path}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-3 rounded-xl transition-all duration-200 interactive ${
                      isActive 
                        ? 'bg-white/10 border border-white/20' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${virtue.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <IconComponent size={14} className="text-white" />
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtueMobile"
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full shadow-lg"
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
      </div>
    </nav>
  );
} 