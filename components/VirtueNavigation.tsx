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
    color: "from-accent-primary to-blue-500",
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
    color: "from-accent-secondary to-purple-500",
  },
];

export function VirtueNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container-academy">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
              <Brain size={20} className="text-white" />
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/10 border border-white/20' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${virtue.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent size={16} className="text-white" />
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtue"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full"
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
            <button className="p-2 text-muted hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 text-muted hover:text-white transition-colors">
              <Settings size={18} />
            </button>
            <button className="p-2 text-muted hover:text-white transition-colors">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Virtue Dock */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass rounded-2xl p-2 border border-white/10">
          <div className="flex items-center gap-1">
            {virtues.map((virtue) => {
              const IconComponent = virtue.icon;
              const isActive = pathname === virtue.path;
              
              return (
                <Link key={virtue.path} href={virtue.path}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/10' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-gradient-to-r ${virtue.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent size={12} className="text-white" />
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeVirtueMobile"
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full"
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