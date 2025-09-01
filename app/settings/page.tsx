'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { User, Moon, Sun, Monitor, Bell, Shield, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingSection {
  title: string;
  icon: any;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'button' | 'text';
  value?: any;
  options?: string[];
  action?: () => void;
}

const settings: SettingSection[] = [
  {
    title: 'Profile',
    icon: User,
    items: [
      {
        id: 'displayName',
        label: 'Display Name',
        description: 'How your name appears in the app',
        type: 'text',
        value: 'John Doe',
      },
      {
        id: 'email',
        label: 'Email',
        description: 'Your email address',
        type: 'text',
        value: 'john@example.com',
      },
    ],
  },
  {
    title: 'Appearance',
    icon: Monitor,
    items: [
      {
        id: 'theme',
        label: 'Theme',
        description: 'Choose your preferred theme',
        type: 'select',
        value: 'dark',
        options: ['light', 'dark', 'system'],
      },
    ],
  },
  {
    title: 'Focus',
    icon: Shield,
    items: [
      {
        id: 'focusVirtue',
        label: 'Focus Virtue',
        description: 'Your primary virtue for this period',
        type: 'select',
        value: 'wisdom',
        options: ['wisdom', 'courage', 'justice', 'temperance'],
      },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      {
        id: 'dailyReminders',
        label: 'Daily Reminders',
        description: 'Get reminded to practice daily',
        type: 'toggle',
        value: true,
      },
      {
        id: 'weeklyInsights',
        label: 'Weekly Insights',
        description: 'Receive weekly progress summaries',
        type: 'toggle',
        value: true,
      },
      {
        id: 'communityUpdates',
        label: 'Community Updates',
        description: 'Notifications about community activity',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    title: 'Data',
    icon: Download,
    items: [
      {
        id: 'exportData',
        label: 'Export Data',
        description: 'Download your data as JSON',
        type: 'button',
        action: () => console.log('Export data'),
      },
      {
        id: 'deleteAccount',
        label: 'Delete Account',
        description: 'Permanently delete your account and data',
        type: 'button',
        action: () => console.log('Delete account'),
      },
    ],
  },
];

export default function SettingsPage() {
  const [settingsState, setSettingsState] = useState<Record<string, any>>({
    displayName: 'User',
    email: '',
    theme: 'dark',
    focusVirtue: 'wisdom',
    dailyReminders: true,
    weeklyInsights: true,
    communityUpdates: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/prefs');
        if (response.ok) {
          const data = await response.json();
          setSettingsState(data.preferences);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const handleSettingChange = async (id: string, value: any) => {
    const newSettings = {
      ...settingsState,
      [id]: value,
    };
    
    setSettingsState(newSettings);
    
    // Save to localStorage for immediate use
    localStorage.setItem('userPreferences', JSON.stringify(newSettings));
    
    // Save to server
    try {
      setLoading(true);
      const response = await fetch('/api/prefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: newSettings }),
      });
      
      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save settings');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(item.id, !settingsState[item.id])}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
              settingsState[item.id] ? 'bg-primary' : 'bg-surface-2'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                settingsState[item.id] ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        );

      case 'select':
        return (
          <select
            value={settingsState[item.id]}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
            className="px-3 py-1 bg-surface-2 border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {item.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'button':
        return (
          <button
            onClick={item.action}
            className={cn(
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-150',
              item.id === 'deleteAccount'
                ? 'bg-error/10 text-error border border-error/30 hover:bg-error/20'
                : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
            )}
          >
            {item.label}
          </button>
        );

      case 'text':
        return (
          <input
            type="text"
            value={settingsState[item.id]}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
            className="px-3 py-1 bg-surface-2 border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-text">Settings</h1>
          <p className="text-muted">Customize your experience</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            message.includes('successfully') 
              ? 'bg-green-500/10 text-green-500 border border-green-500/30' 
              : 'bg-red-500/10 text-red-500 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {settings.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.title} className="bg-surface border border-border rounded-lg">
                <div className="flex items-center space-x-3 p-4 border-b border-border">
                  <IconComponent className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-text">{section.title}</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-muted mt-1">{item.description}</div>
                        )}
                      </div>
                      <div className="ml-4">
                        {renderSettingItem(item)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* App Info */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-semibold text-text">Aristotle v1.0</h3>
            <p className="text-xs text-muted">Your guide to flourishing</p>
            <p className="text-xs text-muted">© 2024 Aristotle App</p>
          </div>
        </div>
      </main>

      <GuideFAB />
      <TabBar />
    </div>
  );
} 