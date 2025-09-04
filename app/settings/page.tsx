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

export default function SettingsPage() {
  const [settingsState, setSettingsState] = useState<Record<string, any>>({
    displayName: 'User',
    email: '',
    timezone: 'UTC',
    theme: 'dark',
    focusVirtue: 'wisdom',
    dailyReminders: true,
    weeklyInsights: true,
    communityUpdates: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        // First try to load from localStorage
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const parsed = JSON.parse(savedPreferences);
          setSettingsState(parsed);
        } else {
          // Fallback to API if no localStorage data
          const loadFromAPI = async () => {
            try {
              const response = await fetch('/api/prefs');
              if (response.ok) {
                const data = await response.json();
                setSettingsState(data.preferences);
                // Save to localStorage for future use
                localStorage.setItem('userPreferences', JSON.stringify(data.preferences));
              }
            } catch (error) {
              console.error('Error loading preferences:', error);
            }
          };
          loadFromAPI();
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

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Account deleted successfully. Redirecting...');
        // Clear localStorage
        localStorage.clear();
        // Redirect to auth page after a short delay
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to delete account');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Failed to delete account');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const settings: SettingSection[] = [
    {
      title: 'Profile',
      icon: User,
      items: [
        {
          id: 'displayName',
          label: 'First Name',
          description: 'How your name appears in the app',
          type: 'text',
          value: settingsState.displayName || 'User',
        },
        {
          id: 'email',
          label: 'Email',
          description: 'Your email address',
          type: 'text',
          value: settingsState.email || '',
        },
        {
          id: 'timezone',
          label: 'Timezone',
          description: 'Your local timezone for accurate AI content',
          type: 'select',
          value: settingsState.timezone || 'UTC',
          options: [
            'UTC',
            'America/New_York',
            'America/Chicago',
            'America/Denver',
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Paris',
            'Europe/Berlin',
            'Asia/Tokyo',
            'Asia/Shanghai',
            'Australia/Sydney',
            'Pacific/Auckland'
          ],
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
          value: settingsState.theme || 'dark',
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
          value: settingsState.focusVirtue || 'wisdom',
          options: ['wisdom', 'courage', 'justice', 'temperance'],
        },
      ],
    },
    {
      title: 'Onboarding',
      icon: Shield,
      items: [
        {
          id: 'editOnboarding',
          label: 'Edit Onboarding Preferences',
          description: 'Modify your name, timezone, and framework selections',
          type: 'button',
          action: () => window.location.href = '/onboarding',
        },
        {
          id: 'viewFrameworks',
          label: 'View Selected Frameworks',
          description: 'See which frameworks are currently active',
          type: 'button',
          action: () => console.log('View frameworks'),
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
          value: settingsState.dailyReminders || true,
        },
        {
          id: 'weeklyInsights',
          label: 'Weekly Insights',
          description: 'Receive weekly progress summaries',
          type: 'toggle',
          value: settingsState.weeklyInsights || true,
        },
        {
          id: 'communityUpdates',
          label: 'Community Updates',
          description: 'Notifications about community activity',
          type: 'toggle',
          value: settingsState.communityUpdates || false,
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
          action: () => handleDeleteAccount(),
        },
      ],
    },
  ];

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

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-text mb-4">Delete Account</h3>
              <p className="text-muted mb-6">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-surface-2 text-text rounded-lg hover:bg-surface-3 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <GuideFAB />
      <TabBar />
    </div>
  );
} 