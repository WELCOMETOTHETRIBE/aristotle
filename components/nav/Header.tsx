'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, User, ChevronDown, Settings, Target } from 'lucide-react';
import AcademyLogo from '@/components/AcademyLogo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  focusVirtue?: 'wisdom' | 'courage' | 'justice' | 'temperance';
}

const virtueColors = {
  wisdom: 'bg-primary/20 text-primary border-primary/30',
  courage: 'bg-courage/20 text-courage border-courage/30',
  justice: 'bg-justice/20 text-justice border-justice/30',
  temperance: 'bg-temperance/20 text-temperance border-temperance/30',
};

const virtueLabels = {
  wisdom: 'Wisdom',
  courage: 'Courage',
  justice: 'Justice',
  temperance: 'Temperance',
};

export function Header({ focusVirtue }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Fetch pending task count
    const fetchTaskCount = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          // Handle both old format (array) and new format (object with pendingCount)
          if (Array.isArray(data)) {
            const pending = data.filter((task: any) => !task.completedAt).length;
            setPendingTaskCount(pending);
          } else {
            setPendingTaskCount(data.pendingCount || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch task count:', error);
      }
    };

    fetchTaskCount();
  }, []);

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
      await signOut();
      // Close profile menu
      setShowProfileMenu(false);
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      // Even on error, redirect to auth page
      window.location.href = '/auth';
    }
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    window.location.href = '/settings';
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Academy Logo - Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-2 p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors duration-150"
        >
          <AcademyLogo className="w-8 h-8" />
        </button>

        {/* Focus Virtue Chip */}
        {focusVirtue && (
          <div className={cn(
            'px-3 py-1 rounded-full border text-xs font-medium',
            virtueColors[focusVirtue]
          )}>
            {virtueLabels[focusVirtue]}
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors duration-150">
          <Bell className="w-5 h-5" />
          {pendingTaskCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse shadow-lg">
              {pendingTaskCount > 9 ? '9+' : pendingTaskCount}
            </div>
          )}
        </button>

        {/* Task Count Notification - Only show red blip, no giant notification */}
        {pendingTaskCount > 0 && (
          <div className="relative">
            <button
              onClick={() => window.location.href = '/today'}
              className="group relative flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-full text-red-600 hover:from-red-500/20 hover:to-pink-500/20 hover:border-red-500/30 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <Target className="w-4 h-4 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-medium">{pendingTaskCount} Task{pendingTaskCount !== 1 ? 's' : ''} Open</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </button>
          </div>
        )}

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors duration-150"
          >
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-1">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-text">
                  {user?.displayName || user?.username || 'User'}
                </p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <button
                onClick={handleSettingsClick}
                className="w-full text-left px-4 py-2 text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors duration-150 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors duration-150"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
