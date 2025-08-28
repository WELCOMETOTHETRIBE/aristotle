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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
      <div className="container-academy">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 interactive">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-2 rounded-lg flex items-center justify-center shadow-lg">
              <Brain size={16} className="text-black" />
            </div>
            <span className="font-semibold text-white text-lg">Academy</span>
          </Link>

          {/* Virtue Dock */}
          <div className="hidden md:flex items-center gap-2">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              const isActive = pathname === virtue.path;
              
              return (
                <Link key={virtue.path} href={virtue.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-2 rounded-lg transition-all duration-200 interactive ${
                      isActive 
                        ? `${virtue.bgColor} ${virtue.borderColor} border shadow-lg` 
                        : 'hover:bg-white/10 hover:border-white/20 border border-transparent'
                    }`}
                    title={virtue.name}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${virtue.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <IconComponent size={16} className="text-white drop-shadow-sm" />
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtue"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-lg"
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
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/70 hover:text-white transition-colors interactive rounded-lg hover:bg-white/10" title="Search">
              <Search size={18} />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors interactive rounded-lg hover:bg-white/10" title="Settings">
              <Settings size={18} />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors interactive rounded-lg hover:bg-white/10" title="Profile">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Virtue Dock */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-2 border border-white/10 shadow-xl">
          <div className="flex items-center gap-1">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              const isActive = pathname === virtue.path;
              
              return (
                <Link key={virtue.path} href={virtue.path}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-lg transition-all duration-200 interactive ${
                      isActive 
                        ? `${virtue.bgColor} ${virtue.borderColor} border` 
                        : 'hover:bg-white/10'
                    }`}
                    title={virtue.name}
                  >
                    <div className={`w-7 h-7 bg-gradient-to-r ${virtue.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <IconComponent size={12} className="text-white drop-shadow-sm" />
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtueMobile"
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-lg"
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