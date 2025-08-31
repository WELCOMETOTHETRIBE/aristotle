'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '@/lib/virtue';

// Import all widget components
import TimerCard from '@/components/widgets/TimerCard';
import CounterCard from '@/components/widgets/CounterCard';
import { HydrationWidget, SleepTrackerWidget, MovementWidget, NaturePhotoLogWidget } from '@/components/ModuleWidgets';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { HedonicAwarenessWidget } from '@/components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '@/components/MoodTrackerWidget';
import { PhilosophicalTerminologyWidget } from '@/components/PhilosophicalTerminologyWidget';

interface VirtueScores {
  wisdom: number;
  courage: number;
  justice: number;
  temperance: number;
}

interface WidgetRendererProps {
  widgetId: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  color: string;
  showInfo?: boolean;
  onInfoToggle?: () => void;
  frameworkTone?: string;
  className?: string;
}

function VirtueProgressWidget() {
  const [virtueScores, setVirtueScores] = useState<VirtueScores>({ wisdom: 0, courage: 0, justice: 0, temperance: 0 });

  useEffect(() => {
    fetchVirtueScores();
  }, []);

  const fetchVirtueScores = async () => {
    try {
      const response = await fetch('/api/progress/virtues');
      if (response.ok) {
        const data = await response.json();
        setVirtueScores(data.scores);
      }
    } catch (error) {
      console.error('Error fetching virtue scores:', error);
    }
  };

  const handleVirtueUpdate = async (virtue: keyof VirtueScores, value: number) => {
    try {
      const updatedScores = { ...virtueScores, [virtue]: value };
      const response = await fetch('/api/progress/virtues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedScores)
      });

      if (response.ok) {
        setVirtueScores(updatedScores);
      }
    } catch (error) {
      console.error('Error updating virtue scores:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(virtueScores).map(([virtue, score]) => (
        <div key={virtue} className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">{getVirtueEmoji(virtue as keyof VirtueScores)}</span>
            <span className={`text-sm font-medium ${getVirtueColor(virtue as keyof VirtueScores)}`}>
              {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getVirtueGradient(virtue as keyof VirtueScores)}`}
              style={{ width: `${Math.min(100, score)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">{score}/100</div>
          <div className="flex gap-1 mt-2">
            {[20, 40, 60, 80, 100].map((value) => (
              <button
                key={value}
                onClick={() => handleVirtueUpdate(virtue as keyof VirtueScores, value)}
                className={`w-4 h-4 rounded-full text-xs ${
                  score >= value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WisdomSpotlightWidget() {
  const [todayWisdom, setTodayWisdom] = useState({
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    framework: "Stoic",
    reflection: "What aspect of your life needs deeper examination today?"
  });

  useEffect(() => {
    const loadDailyWisdom = async () => {
      try {
        const frameworks = ['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic'];
        const randomFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
        
        const response = await fetch('/api/generate/daily-wisdom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            framework: randomFramework,
            date: new Date().toISOString().split('T')[0]
          }),
        });

        if (response.ok) {
          const wisdom = await response.json();
          setTodayWisdom(wisdom);
        }
      } catch (error) {
        console.error('Error loading daily wisdom:', error);
        // Keep the default wisdom if API fails
      }
    };

    loadDailyWisdom();
  }, []);

  return (
    <div className="text-center space-y-4">
      <div className="text-2xl font-serif italic text-purple-200 mb-4">
        "{todayWisdom.quote}"
      </div>
      <div className="text-sm text-purple-300">
        — {todayWisdom.author}
      </div>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
        {todayWisdom.framework} Tradition
      </div>
      {todayWisdom.reflection && (
        <div className="text-sm text-purple-300 italic">
          {todayWisdom.reflection}
        </div>
      )}
      <div className="pt-4">
        <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
          Reflect on This Wisdom
        </Button>
      </div>
    </div>
  );
}

function GratitudeJournalWidget() {
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [saved, setSaved] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);

  const handleSave = async () => {
    if (!gratitudeEntry.trim()) return;
    
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'gratitude',
          content: gratitudeEntry,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiInsights(result.entry.aiInsights);
        setSaved(true);
        setShowInsights(true);
        setGratitudeEntry('');
        setTimeout(() => {
          setSaved(false);
          setShowInsights(false);
          setAiInsights(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
    }
  };

  return (
    <div className="space-y-3">
      <textarea 
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-sm"
        placeholder="What are you grateful for today?"
        rows={3}
        value={gratitudeEntry}
        onChange={(e) => setGratitudeEntry(e.target.value)}
      />
      <Button 
        size="sm" 
        className="w-full"
        onClick={handleSave}
        disabled={!gratitudeEntry.trim()}
      >
        {saved ? '✓ Saved' : 'Save Gratitude'}
      </Button>

      {/* Show AI insights */}
      {showInsights && aiInsights && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="text-sm font-medium mb-2">AI Insights</h4>
          {aiInsights.themes && (
            <div className="mb-2">
              <p className="text-xs text-gray-400 mb-1">Themes:</p>
              <div className="flex flex-wrap gap-1">
                {aiInsights.themes.map((theme: string, index: number) => (
                  <span key={index} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
          {aiInsights.reflection && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Reflection:</p>
              <p className="text-sm text-gray-300">{aiInsights.reflection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReflectionJournalWidget() {
  const [reflectionEntry, setReflectionEntry] = useState('');
  const [saved, setSaved] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);

  const handleSave = async () => {
    if (!reflectionEntry.trim()) return;
    
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'reflection',
          content: reflectionEntry,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiInsights(result.entry.aiInsights);
        setSaved(true);
        setShowInsights(true);
        setReflectionEntry('');
        setTimeout(() => {
          setSaved(false);
          setShowInsights(false);
          setAiInsights(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving reflection entry:', error);
    }
  };

  return (
    <div className="space-y-3">
      <textarea 
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-sm"
        placeholder="What insights did you gain today?"
        rows={4}
        value={reflectionEntry}
        onChange={(e) => setReflectionEntry(e.target.value)}
      />
      <Button 
        size="sm" 
        className="w-full"
        onClick={handleSave}
        disabled={!reflectionEntry.trim()}
      >
        {saved ? '✓ Saved' : 'Save Reflection'}
      </Button>

      {/* Show AI insights */}
      {showInsights && aiInsights && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="text-sm font-medium mb-2">AI Insights</h4>
          {aiInsights.themes && (
            <div className="mb-2">
              <p className="text-xs text-gray-400 mb-1">Themes:</p>
              <div className="flex flex-wrap gap-1">
                {aiInsights.themes.map((theme: string, index: number) => (
                  <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
          {aiInsights.reflection && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Reflection:</p>
              <p className="text-sm text-gray-300">{aiInsights.reflection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VirtueAssessmentWidget() {
  const [virtueScores, setVirtueScores] = useState({
    wisdom: 5,
    courage: 5,
    justice: 5,
    temperance: 5
  });
  const [saved, setSaved] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);

  const handleVirtueChange = (virtue: string, value: number) => {
    setVirtueScores(prev => ({ ...prev, [virtue.toLowerCase()]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/progress/virtues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(virtueScores)
      });

      if (response.ok) {
        const result = await response.json();
        // Generate AI insights for virtue assessment
        try {
          const insightsResponse = await fetch('/api/generate/virtue-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              virtueScores,
              userId: 1 // In real app, get from auth
            })
          });

          if (insightsResponse.ok) {
            const insights = await insightsResponse.json();
            setAiInsights(insights);
            setShowInsights(true);
          }
        } catch (error) {
          console.error('Error generating virtue insights:', error);
        }

        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          setShowInsights(false);
          setAiInsights(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving virtue assessment:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Daily virtue assessment</p>
        <div className="space-y-3">
          {Object.entries(virtueScores).map(([virtue, score]) => (
            <div key={virtue} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm capitalize">{virtue}</span>
                <span className="text-xs text-muted-foreground">{score}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={score}
                onChange={(e) => handleVirtueChange(virtue, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
      <Button 
        size="sm" 
        className="w-full"
        onClick={handleSave}
      >
        {saved ? '✓ Saved' : 'Save Assessment'}
      </Button>

      {/* Show AI insights */}
      {showInsights && aiInsights && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="text-sm font-medium mb-2">AI Insights</h4>
          {aiInsights.analysis && (
            <div className="mb-2">
              <p className="text-xs text-gray-400 mb-1">Analysis:</p>
              <p className="text-sm text-gray-300">{aiInsights.analysis}</p>
            </div>
          )}
          {aiInsights.recommendations && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Recommendations:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {aiInsights.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-xs">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BoundarySetterWidget() {
  const [selectedBoundary, setSelectedBoundary] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  const boundaries = [
    {
      id: 'say_no',
      title: 'Say "No" to unnecessary commitments',
      description: 'Practice declining requests that don\'t align with your priorities'
    },
    {
      id: 'protect_energy',
      title: 'Protect my energy',
      description: 'Set limits on draining activities and people'
    },
    {
      id: 'time_boundaries',
      title: 'Set time boundaries',
      description: 'Establish clear start and end times for activities'
    }
  ];

  const handleBoundarySelect = async (boundaryId: string) => {
    setSelectedBoundary(boundaryId);
    
    try {
      const response = await fetch('/api/boundaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          boundaryId,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiInsights(result.practice.aiInsights);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          setSelectedBoundary(null);
          setAiInsights(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving boundary practice:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Set healthy boundaries</p>
        <div className="space-y-2">
          {boundaries.map((boundary) => (
            <Button 
              key={boundary.id}
              size="sm" 
              variant={selectedBoundary === boundary.id ? "default" : "outline"}
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => handleBoundarySelect(boundary.id)}
              disabled={saved}
            >
              <div>
                <div className="font-medium">{boundary.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {boundary.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {saved && (
        <div className="space-y-2">
          <div className="text-center text-sm text-green-400">
            ✓ Boundary practice recorded
          </div>
          {aiInsights && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-sm font-medium mb-2">AI Insights</h4>
              {aiInsights.strength && (
                <div className="mb-2">
                  <p className="text-xs text-gray-400 mb-1">Strength:</p>
                  <p className="text-sm text-gray-300">{aiInsights.strength}</p>
                </div>
              )}
              {aiInsights.growth && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Growth:</p>
                  <p className="text-sm text-gray-300">{aiInsights.growth}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CommunityConnectionWidget() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  const communityActions = [
    {
      id: 'reach_out',
      title: 'Reach out to a friend',
      description: 'Send a message or call someone you haven\'t connected with recently'
    },
    {
      id: 'join_group',
      title: 'Join a community',
      description: 'Find and participate in a group with shared interests'
    },
    {
      id: 'share_wisdom',
      title: 'Share wisdom',
      description: 'Share insights or help someone with their practice'
    }
  ];

  const handleActionSelect = async (actionId: string) => {
    setSelectedAction(actionId);
    
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          actionId,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiInsights(result.action.aiInsights);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          setSelectedAction(null);
          setAiInsights(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving community action:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-sm text-gray-400 mb-3 text-center">Connect with your community</p>
        <div className="space-y-2">
          {communityActions.map((action) => (
            <Button 
              key={action.id}
              size="sm" 
              variant={selectedAction === action.id ? "default" : "outline"}
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => handleActionSelect(action.id)}
              disabled={saved}
            >
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {saved && (
        <div className="space-y-2">
          <div className="text-center text-sm text-green-400">
            ✓ Community action recorded
          </div>
          {aiInsights && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-sm font-medium mb-2">AI Insights</h4>
              {aiInsights.impact && (
                <div className="mb-2">
                  <p className="text-xs text-gray-400 mb-1">Impact:</p>
                  <p className="text-sm text-gray-300">{aiInsights.impact}</p>
                </div>
              )}
              {aiInsights.growth && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Growth:</p>
                  <p className="text-sm text-gray-300">{aiInsights.growth}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VoiceNotesWidget() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [saved, setSaved] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleStartRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTranscription(null);
    setAiInsights(null);
    setShowResults(false);
    
    // In a real implementation, this would start actual audio recording
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Store interval reference for cleanup
    (window as any).recordingInterval = interval;
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    clearInterval((window as any).recordingInterval);
    
    // Simulate audio data (in real app, this would be actual audio)
    const mockAudioData = `audio_data_${Date.now()}`;
    
    try {
      const response = await fetch('/api/voice-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: mockAudioData,
          duration: recordingTime,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTranscription(result.voiceNote.transcription);
        setAiInsights(result.voiceNote.aiInsights);
        setSaved(true);
        setShowResults(true);
        
        setTimeout(() => setSaved(false), 5000);
      }
    } catch (error) {
      console.error('Error saving voice note:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-sm text-gray-400 mb-3 text-center">Voice recording</p>
        {isRecording && (
          <div className="mb-3 text-center">
            <div className="text-lg font-mono">{formatTime(recordingTime)}</div>
            <div className="text-xs text-red-400">Recording...</div>
          </div>
        )}
        <Button 
          size="sm" 
          variant={isRecording ? "destructive" : "outline"}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={saved}
          className="w-full"
        >
          {isRecording ? 'Stop Recording' : saved ? '✓ Saved' : 'Start Recording'}
        </Button>
      </div>

      {/* Show transcription and AI insights */}
      {showResults && transcription && (
        <div className="space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Transcription</h4>
            <p className="text-sm text-gray-300">{transcription}</p>
          </div>
          
          {aiInsights && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-sm font-medium mb-2">AI Insights</h4>
              {aiInsights.themes && (
                <div className="mb-2">
                  <p className="text-xs text-gray-400 mb-1">Themes:</p>
                  <div className="flex flex-wrap gap-1">
                    {aiInsights.themes.map((theme: string, index: number) => (
                      <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {aiInsights.reflection && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Reflection:</p>
                  <p className="text-sm text-gray-300">{aiInsights.reflection}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HabitManagerWidget() {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits/today');
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits || []);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitCheckin = async (habitId: string) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, done: true })
      });

      if (response.ok) {
        fetchHabits(); // Refresh habits data
      }
    } catch (error) {
      console.error('Error checking in habit:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading habits...</div>;
  }

  return (
    <div className="space-y-3">
      {habits.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No habits set up yet. Start building positive routines!
        </p>
      ) : (
        habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium text-sm">{habit.name}</h4>
              <p className="text-xs text-muted-foreground">
                {habit.streakCount} day streak
              </p>
            </div>
            <Button
              variant={habit.checkedToday ? "default" : "outline"}
              size="sm"
              onClick={() => handleHabitCheckin(habit.id)}
              disabled={habit.checkedToday}
            >
              {habit.checkedToday ? "✓ Done" : "Check In"}
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

function TaskManagerWidget() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const dueTasks = tasks.filter(task => !task.completedAt && task.dueAt);

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-3">
      {dueTasks.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No tasks due today. Great job staying on top of things!
        </p>
      ) : (
        dueTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTaskComplete(task.id, true)}
              className="h-6 w-6 p-0"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                {task.tag && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {task.tag}
                  </span>
                )}
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function GoalTrackerWidget() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');

  if (loading) {
    return <div className="text-center py-4">Loading goals...</div>;
  }

  return (
    <div className="space-y-3">
      {activeGoals.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No active goals. Set some meaningful objectives to work toward!
        </p>
      ) : (
        activeGoals.map((goal) => (
          <div key={goal.id} className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm">{goal.title}</h4>
            {goal.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {goal.description}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {goal.category}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function WidgetRenderer({
  widgetId,
  title,
  description,
  icon: IconComponent,
  category,
  color,
  showInfo = false,
  onInfoToggle,
  frameworkTone = 'stoic',
  className = ''
}: WidgetRendererProps) {
  const [showWidgetInfo, setShowWidgetInfo] = useState(false);

  const handleInfoToggle = () => {
    if (onInfoToggle) {
      onInfoToggle();
    } else {
      setShowWidgetInfo(!showWidgetInfo);
    }
  };

  const renderWidgetContent = () => {
    switch (widgetId) {
      case 'virtue_progress':
        return <VirtueProgressWidget />;
      
      case 'wisdom_spotlight':
        return <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
          <p className="text-sm text-gray-400">Wisdom Spotlight moved to Today page</p>
        </div>;
      
      case 'breathwork_timer':
        return <BreathworkWidgetNew frameworkTone={frameworkTone} />;
      
      case 'hydration_tracker':
        return <HydrationWidget frameworkTone={frameworkTone} />;
      
      case 'mood_tracker':
        return <MoodTrackerWidget frameworkTone={frameworkTone} />;
      
      case 'hedonic_awareness':
        return <HedonicAwarenessWidget frameworkTone={frameworkTone} />;
      
      case 'sleep_tracker':
        return <SleepTrackerWidget frameworkTone={frameworkTone} />;
      
      case 'movement_widget':
        return <MovementWidget frameworkTone={frameworkTone} />;
      
      case 'nature_photo_log':
        return <NaturePhotoLogWidget frameworkTone={frameworkTone} />;
      
      case 'philosophical_terminology':
        return <PhilosophicalTerminologyWidget />;
      
      case 'habit_manager':
        return <HabitManagerWidget />;
      
      case 'task_manager':
        return <TaskManagerWidget />;
      
      case 'goal_tracker':
        return <GoalTrackerWidget />;
      
      case 'focus_timer':
        return (
          <TimerCard 
            title="Deep Work Session"
            config={{ duration: 1500, includeRPE: false, teaching: "Focus is the new superpower" }}
            onComplete={() => console.log('Focus session completed')}
            virtueGrantPerCompletion={{ wisdom: 2 }}
          />
        );
      
      case 'meditation_timer':
        return (
          <TimerCard 
            title="Mindfulness Session"
            config={{ duration: 600, includeRPE: false, teaching: "Stillness reveals the warrior within" }}
            onComplete={() => console.log('Meditation completed')}
            virtueGrantPerCompletion={{ wisdom: 1, temperance: 1 }}
          />
        );
      
      case 'strength_counter':
        return (
          <CounterCard 
            title="Push-ups"
            config={{ target: 20, unit: "reps", exercises: ["push-ups", "squats", "pull-ups"], teaching: "Perfect practice makes perfect" }}
            onComplete={() => console.log('Strength training completed')}
            virtueGrantPerCompletion={{ courage: 2 }}
          />
        );
      
      case 'gratitude_journal':
        return <GratitudeJournalWidget />;
      
      case 'reflection_journal':
        return <ReflectionJournalWidget />;
      
      case 'voice_notes':
        return <VoiceNotesWidget />;
      
      case 'boundary_setter':
        return <BoundarySetterWidget />;
      
      case 'community_connection':
        return <CommunityConnectionWidget />;
      
      case 'virtue_assessment':
        return <VirtueAssessmentWidget />;
      
      default:
        return (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <p className="text-sm text-gray-400">Widget not implemented yet</p>
          </div>
        );
    }
  };

  const getCardStyling = () => {
    switch (widgetId) {
      case 'wisdom_spotlight':
        return 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20';
      case 'breathwork_timer':
        return 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20';
      case 'sleep_tracker':
        return 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20';
      case 'movement_widget':
        return 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20';
      case 'nature_photo_log':
        return 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20';
      case 'philosophical_terminology':
        return 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (widgetId) {
      case 'wisdom_spotlight':
        return 'text-purple-400';
      case 'breathwork_timer':
        return 'text-cyan-400';
      case 'sleep_tracker':
        return 'text-indigo-400';
      case 'movement_widget':
        return 'text-orange-400';
      case 'nature_photo_log':
        return 'text-green-400';
      case 'philosophical_terminology':
        return 'text-blue-400';
      default:
        return 'text-primary';
    }
  };

  const getInfoStyling = () => {
    switch (widgetId) {
      case 'wisdom_spotlight':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-200';
      case 'breathwork_timer':
        return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-200';
      case 'sleep_tracker':
        return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200';
      case 'movement_widget':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-200';
      case 'nature_photo_log':
        return 'bg-green-500/10 border-green-500/20 text-green-200';
      case 'philosophical_terminology':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
    }
  };

  return (
    <Card className={`glass-effect ${getCardStyling()} ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className={`h-5 w-5 ${getIconColor()}`} />
          {title}
          <button
            onClick={handleInfoToggle}
            className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(showInfo || showWidgetInfo) && (
          <div className={`mb-4 p-3 rounded-lg border ${getInfoStyling()}`}>
            <p className="text-sm">{description}</p>
          </div>
        )}
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
} 