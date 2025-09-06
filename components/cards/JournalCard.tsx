'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Sparkles, Info, Settings, Brain, Calendar, Heart, MessageSquare, Save, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalCardProps {
  className?: string;
}

interface JournalEntry {
  id: string;
  type: string;
  content: string;
  prompt?: string;
  category?: string;
  date: Date;
  aiInsights?: string;
  metadata?: any;
}
interface JournalSettings {
  enableAIInsights: boolean;
  autoSave: boolean;
  showMoodTracking: boolean;
  showTags: boolean;
  defaultMood: number;
  enableReminders: boolean;
  reminderTime: string;
}

const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];

const commonTags = [
  'Gratitude', 'Reflection', 'Goals', 'Challenges', 'Achievements', 
  'Relationships', 'Work', 'Health', 'Learning', 'Creativity', 'Travel', 'Family'
];

export function JournalCard({ className }: JournalCardProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 3,
    tags: []
  });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [settings, setSettings] = useState<JournalSettings>({
    enableAIInsights: true,
    autoSave: true,
    showMoodTracking: true,
    showTags: true,
    defaultMood: 3,
    enableReminders: true,
    reminderTime: '20:00',
  });

  // Load journal entries from database API
  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        console.log('📝 Fetched journal entries from database:', data.entries);
        setEntries(data.entries || []);
      } else {
        console.error('Failed to fetch journal entries');
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };  // Save data
  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
  };

  const saveSettings = (newSettings: JournalSettings) => {
    setSettings(newSettings);
    localStorage.setItem('journalSettings', JSON.stringify(newSettings));
  };

  const generateAIInsights = async (content: string) => {
    if (!settings.enableAIInsights || !content.trim()) return [];

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze this journal entry and provide 2-3 insights about patterns, emotions, or growth opportunities: "${content.substring(0, 500)}..."`,
          context: {
            page: 'journal',
            focusVirtue: 'wisdom',
            timeOfDay: new Date().getHours(),
          },
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let content = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    content += parsed.content;
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
          
          // Clean markdown formatting and parse insights from AI response
          const cleanContent = content
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
            .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
            .replace(/`(.*?)`/g, '$1') // Remove code formatting
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
            .replace(/^#+\s*/gm, '') // Remove markdown headers
            .replace(/^\s*[-*+]\s*/gm, '') // Remove markdown list markers
            .replace(/^\s*\d+\.\s*/gm, ''); // Remove numbered list markers
          
          const insights = cleanContent.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
          return insights.length > 0 ? insights : [
            'Your writing shows thoughtful reflection',
            'Consider exploring this topic further',
            'This entry reveals personal growth'
          ];
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    }
    
    return [
      'Your writing shows thoughtful reflection',
      'Consider exploring this topic further',
      'This entry reveals personal growth'
    ];
  };

  const saveEntry = async () => {
    if (!currentEntry.title?.trim() || !currentEntry.content?.trim()) return;

    const wordCount = currentEntry.content.trim().split(/\s+/).length;
    const aiInsights = await generateAIInsights(currentEntry.content);

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title.trim(),
      content: currentEntry.content.trim(),
      mood: currentEntry.mood || 3,
      tags: currentEntry.tags || [],
      timestamp: new Date(),
      aiInsights,
      wordCount,
    };

    const updatedEntries = [entry, ...entries];
    saveEntries(updatedEntries);
    
    setCurrentEntry({
      title: '',
      content: '',
      mood: 3,
      tags: []
    });
    setShowNewEntry(false);
  };

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    saveEntries(updatedEntries);
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null);
    }
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = entries.filter(entry => entry.timestamp > weekAgo);
    const totalWords = weekEntries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const averageMood = weekEntries.length > 0 
      ? weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length 
      : 0;
    
    return { entriesCount: weekEntries.length, totalWords, averageMood };
  };

  const getMoodTrend = () => {
    const recentEntries = entries.slice(0, 7);
    if (recentEntries.length < 2) return 'stable';
    
    const moods = recentEntries.map(entry => entry.mood);
    const firstHalf = moods.slice(0, Math.ceil(moods.length / 2));
    const secondHalf = moods.slice(Math.ceil(moods.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.5) return 'improving';
    if (secondAvg < firstAvg - 0.5) return 'declining';
    return 'stable';
  };

  const weeklyStats = getWeeklyStats();
  const moodTrend = getMoodTrend();

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Journal</h3>
            <p className="text-xs text-muted">Reflect and grow</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={fetchJournalEntries}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
            title="Refresh from database"
          >
            <RefreshCw className="w-4 h-4 text-muted hover:text-text" />
          </button>          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4 text-muted" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            How to use Journal
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Write daily reflections to process thoughts and emotions</p>
            <p>• Track your mood to identify patterns over time</p>
            <p>• Use tags to organize and find related entries</p>
            <p>• Get AI insights to discover patterns and growth opportunities</p>
            <p>• Build a habit of self-reflection and mindfulness</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">AI insights</span>
              <button
                onClick={() => saveSettings({ ...settings, enableAIInsights: !settings.enableAIInsights })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.enableAIInsights 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Brain className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Auto-save</span>
              <button
                onClick={() => saveSettings({ ...settings, autoSave: !settings.autoSave })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.autoSave 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Mood tracking</span>
              <button
                onClick={() => saveSettings({ ...settings, showMoodTracking: !settings.showMoodTracking })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.showMoodTracking 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">This week</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.entriesCount}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Words</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.totalWords}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Mood</span>
            </div>
            <div className="text-lg font-bold text-text">
              {moodEmojis[Math.round(weeklyStats.averageMood) - 1]}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs text-muted mb-2">Recent Entries</h4>
          <div className="space-y-2">
            {entries.slice(0, 3).map(entry => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                className="bg-surface-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-surface transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-medium text-text truncate">{entry.type.replace(/_/g, ' ').replace(/bw/g, l => l.toUpperCase())}</h5>                  <div className="flex items-center gap-2">
                    {entry.metadata?.mood && (                      <span className="text-sm">{moodEmojis[entry.mood - 1]}</span>
                    )}
                    <span className="text-xs text-muted">
                      {new Date(entry.date).toLocaleDateString()}                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted line-clamp-2">{entry.content}</p>                
                {selectedEntry?.id === entry.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted mb-2">
                      {entry.content.length} characters • {entry.category || 'General'}                    </div>
                    {entry.aiInsights && entry.aiInsights.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-primary mb-1">AI Insights:</div>
                        {entry.aiInsights && entry.aiInsights.split('n').map((insight, index) => (                          <div key={index} className="text-xs text-primary/80 mb-1 flex items-start gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality could be added here
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry.id);
                        }}
                        className="text-xs text-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Entry Button */}
      {!showNewEntry ? (
        <button
          onClick={() => setShowNewEntry(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Entry</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-muted mb-2 block">Title</label>
            <input
              type="text"
              value={currentEntry.title || ''}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs text-muted mb-2 block">Your thoughts</label>
            <textarea
              value={currentEntry.content || ''}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write freely about your day, thoughts, feelings, or anything you want to reflect on..."
              rows={4}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Mood */}
                    {entry.metadata?.mood && (            <div>
              <label className="text-xs text-muted mb-2 block">How are you feeling?</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCurrentEntry(prev => ({ ...prev, mood: level }))}
                    className={cn(
                      'p-3 rounded-lg border transition-all duration-150 text-center',
                      currentEntry.mood === level
                        ? 'bg-blue-500/20 border-blue-500/30'
                        : 'bg-surface-2 border-border hover:border-blue-500/30'
                    )}
                  >
                    <div className="text-lg">{moodEmojis[level - 1]}</div>
                    <div className="text-xs text-muted mt-1">{moodLabels[level - 1]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {settings.showTags && (
            <div>
              <label className="text-xs text-muted mb-2 block">Tags (optional)</label>
              <div className="flex flex-wrap gap-1">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setCurrentEntry(prev => ({
                        ...prev,
                        tags: prev.tags?.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...(prev.tags || []), tag]
                      }));
                    }}
                    className={cn(
                      'px-2 py-1 rounded-full text-xs transition-colors',
                      currentEntry.tags?.includes(tag)
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                        : 'bg-surface-2 text-muted border border-border hover:border-blue-500/30'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowNewEntry(false);
                setCurrentEntry({
                  title: '',
                  content: '',
                  mood: 3,
                  tags: []
                });
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={saveEntry}
              disabled={!currentEntry.title?.trim() || !currentEntry.content?.trim()}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 