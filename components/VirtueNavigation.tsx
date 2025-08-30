"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Shield, Scale, Leaf, Search, User, Home, Bell, LogOut, Target, Settings, MessageSquare, TestTube } from "lucide-react";
import GraduationCapIcon from "./GraduationCapIcon";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import FrameworksDropdown from "./FrameworksDropdown";
import OnboardingNotification from "./OnboardingNotification";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Hide navigation on auth page
  if (pathname === '/auth') {
    return null;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included
      });
      
      if (response.ok) {
        // Close the profile menu
        setShowProfileMenu(false);
        
        // Force a hard reload to clear all client-side state
        window.location.href = '/auth';
        window.location.reload();
      } else {
        console.error('Sign out failed:', response.status);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Top Header - Ultra compact */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex items-center justify-between h-8">
            {/* Logo */}
                                  <Link href="/" className="flex items-center gap-1.5 interactive">
                        <img
                          src="/academy_logo_r2.png"
                          alt="Academy Logo"
                          className="w-5 h-5 rounded-md shadow-lg"
                        />
              <span className="font-semibold text-white text-xs">Academy</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="Search">
                <Search size={12} />
              </button>
              <FrameworksDropdown />
              <Link href="/today" className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="Today's Plan">
                <Target size={12} />
              </Link>
              <Link href="/coach" className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="AI Coach">
                <Brain size={12} />
              </Link>
              <button className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" title="Notifications">
                <Bell size={12} />
              </button>
              <OnboardingNotification variant="badge" className="text-xs" />
              
              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button 
                  className="p-1 text-white/70 hover:text-white transition-colors interactive rounded hover:bg-white/10" 
                  title="Profile"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <User size={12} />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      {/* Dev Mode Button */}
                      <button
                        onClick={() => {
                          // Toggle dev mode by setting session storage
                          const isDevMode = sessionStorage.getItem('devAuthenticated') === 'true';
                          if (isDevMode) {
                            sessionStorage.removeItem('devAuthenticated');
                          } else {
                            sessionStorage.setItem('devAuthenticated', 'true');
                          }
                          setShowProfileMenu(false);
                          // Force re-render
                          window.dispatchEvent(new Event('storage'));
                          // Also trigger a page reload to ensure all components update
                          setTimeout(() => window.location.reload(), 100);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Settings size={14} />
                        {sessionStorage.getItem('devAuthenticated') === 'true' ? 'Disable Dev Mode' : 'Enable Dev Mode'}
                      </button>
                      
                      {/* Feedback Dashboard Button - Only show when dev mode is active */}
                      {sessionStorage.getItem('devAuthenticated') === 'true' && (
                        <>
                                          <Link
                  href="/debug/developer-feedback"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  Feedback Dashboard
                </Link>
                
                <Link
                  href="/debug/conformance-matrix"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <TestTube size={14} />
                  Conformance Matrix
                </Link>
                
                <Link
                  href="/debug/module-widgets"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Target size={14} />
                  Module Widgets
                </Link>
                          
                          <button
                            onClick={() => {
                              // Start click-to-feedback mode
                              const event = new CustomEvent('startClickToFeedback');
                              window.dispatchEvent(event);
                              setShowProfileMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <MessageSquare size={14} />
                            Click to Feedback
                          </button>
                        </>
                      )}
                      
                      <div className="border-t border-gray-200 my-1"></div>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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