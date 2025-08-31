'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

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
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-sm mr-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search wisdom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Focus Virtue Chip */}
        {focusVirtue && (
          <div className={cn(
            'px-3 py-1 rounded-full border text-xs font-medium mr-3',
            virtueColors[focusVirtue]
          )}>
            {virtueLabels[focusVirtue]}
          </div>
        )}

        {/* Notifications */}
        <button className="p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors duration-150 mr-2">
          <Bell className="w-5 h-5" />
        </button>

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