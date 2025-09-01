'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, Mic } from 'lucide-react';
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
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const prompts = [
    "What did I learn about myself today?",
    "How did I handle challenges today?",
    "What would I do differently?",
    "What am I proud of today?",
    "What am I struggling with?",
    "What am I grateful for?"
  ];

  const handleSave = async () => {
    if (!reflectionEntry.trim()) return;
    
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'reflection',
          content: reflectionEntry,
          prompt: prompts[selectedPrompt],
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
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">Reflection Journal</h3>
        <div className="text-xs text-muted">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-muted">Reflection Prompt</label>
        <select
          value={selectedPrompt}
          onChange={(e) => setSelectedPrompt(Number(e.target.value))}
          className="w-full p-2 bg-surface border border-border rounded-lg text-text text-sm"
        >
          {prompts.map((prompt, index) => (
            <option key={index} value={index}>{prompt}</option>
          ))}
        </select>
      </div>

      <textarea
        value={reflectionEntry}
        onChange={(e) => setReflectionEntry(e.target.value)}
        placeholder="Write your reflection..."
        className="w-full p-3 bg-surface border border-border rounded-lg text-text placeholder-muted resize-none"
        rows={4}
      />

      <button
        onClick={handleSave}
        disabled={!reflectionEntry.trim() || saved}
        className="w-full py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saved ? 'Saved!' : 'Save Reflection'}
      </button>

      {showInsights && aiInsights && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <h4 className="font-medium text-primary mb-2">AI Insights</h4>
          <p className="text-sm text-muted">{aiInsights}</p>
        </div>
      )}
    </div>
  );
}

function VoiceNotesWidget() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [saved, setSaved] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      
      // Stop recording after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setTranscription(result.text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const saveNote = async () => {
    if (!transcription.trim()) return;
    
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'voice_note',
          content: transcription,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiInsights(result.entry.aiInsights);
        setSaved(true);
        setTranscription('');
        setTimeout(() => {
          setSaved(false);
          setAiInsights(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving voice note:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">Voice Notes</h3>
        <div className="text-xs text-muted">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <button
        onClick={isRecording ? undefined : startRecording}
        disabled={isRecording}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
          isRecording 
            ? 'bg-error text-white animate-pulse' 
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        {isRecording ? (
          <>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Recording... (30s max)
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Start Recording
          </>
        )}
      </button>

      {transcription && (
        <div className="space-y-2">
          <label className="text-sm text-muted">Transcription</label>
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="w-full p-3 bg-surface border border-border rounded-lg text-text placeholder-muted resize-none"
            rows={3}
            placeholder="Your transcribed voice note will appear here..."
          />
          
          <button
            onClick={saveNote}
            disabled={!transcription.trim() || saved}
            className="w-full py-2 bg-success text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? 'Saved!' : 'Save Note'}
          </button>
        </div>
      )}

      {saved && aiInsights && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <h4 className="font-medium text-primary mb-2">AI Insights</h4>
          <p className="text-sm text-muted">{aiInsights}</p>
        </div>
      )}
    </div>
  );
}

function BoundarySetterWidget() {
  const [boundaries, setBoundaries] = useState<string[]>([]);
  const [newBoundary, setNewBoundary] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');

  const categories = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'digital', label: 'Digital', icon: '📱' },
    { id: 'health', label: 'Health', icon: '🏥' }
  ];

  const addBoundary = () => {
    if (newBoundary.trim()) {
      setBoundaries(prev => [...prev, `${selectedCategory}: ${newBoundary.trim()}`]);
      setNewBoundary('');
    }
  };

  const removeBoundary = (index: number) => {
    setBoundaries(prev => prev.filter((_, i) => i !== index));
  };

  const saveBoundaries = async () => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'boundaries',
          content: boundaries.join('\n'),
          category: selectedCategory,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        setBoundaries([]);
      }
    } catch (error) {
      console.error('Error saving boundaries:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">Boundary Setter</h3>
        <div className="text-xs text-muted">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-muted">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 bg-surface border border-border rounded-lg text-text text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">New Boundary</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBoundary}
            onChange={(e) => setNewBoundary(e.target.value)}
            placeholder="e.g., I will not check work emails after 6 PM"
            className="flex-1 p-2 bg-surface border border-border rounded-lg text-text text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addBoundary()}
          />
          <button
            onClick={addBoundary}
            disabled={!newBoundary.trim()}
            className="px-3 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {boundaries.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-muted">Your Boundaries</label>
          <div className="space-y-1">
            {boundaries.map((boundary, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-surface/50 border border-border rounded-lg">
                <span className="text-sm text-text">{boundary}</span>
                <button
                  onClick={() => removeBoundary(index)}
                  className="text-error hover:text-error/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={saveBoundaries}
            className="w-full py-2 bg-success text-white rounded-lg font-medium"
          >
            Save Boundaries
          </button>
        </div>
      )}
    </div>
  );
}

function CommunityConnectionWidget() {
  const [connections, setConnections] = useState<string[]>([]);
  const [newConnection, setNewConnection] = useState('');
  const [connectionType, setConnectionType] = useState('gratitude');

  const connectionTypes = [
    { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { id: 'support', label: 'Support', icon: '🤝' },
    { id: 'celebration', label: 'Celebration', icon: '🎉' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'inspiration', label: 'Inspiration', icon: '✨' }
  ];

  const addConnection = () => {
    if (newConnection.trim()) {
      setConnections(prev => [...prev, `${connectionType}: ${newConnection.trim()}`]);
      setNewConnection('');
    }
  };

  const removeConnection = (index: number) => {
    setConnections(prev => prev.filter((_, i) => i !== index));
  };

  const saveConnections = async () => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'community_connections',
          content: connections.join('\n'),
          category: connectionType,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        setConnections([]);
      }
    } catch (error) {
      console.error('Error saving connections:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">Community Connections</h3>
        <div className="text-xs text-muted">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-muted">Connection Type</label>
        <select
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
          className="w-full p-2 bg-surface border border-border rounded-lg text-text text-sm"
        >
          {connectionTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">New Connection</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newConnection}
            onChange={(e) => setNewConnection(e.target.value)}
            placeholder="e.g., Thanked Sarah for her support during my presentation"
            className="flex-1 p-2 bg-surface border border-border rounded-lg text-text text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addConnection()}
          />
          <button
            onClick={addConnection}
            disabled={!newConnection.trim()}
            className="px-3 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {connections.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-muted">Your Connections</label>
          <div className="space-y-1">
            {connections.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-surface/50 border border-border rounded-lg">
                <span className="text-sm text-text">{connection}</span>
                <button
                  onClick={() => removeConnection(index)}
                  className="text-error hover:text-error/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={saveConnections}
            className="w-full py-2 bg-success text-white rounded-lg font-medium"
          >
            Save Connections
          </button>
        </div>
      )}
    </div>
  );
}

function VirtueAssessmentWidget() {
  const [virtueScores, setVirtueScores] = useState({
    wisdom: 3,
    courage: 3,
    justice: 3,
    temperance: 3
  });
  const [assessment, setAssessment] = useState('');
  const [saved, setSaved] = useState(false);

  const virtues = [
    { key: 'wisdom', label: 'Wisdom', emoji: '🧠', color: 'text-primary' },
    { key: 'courage', label: 'Courage', emoji: '⚡', color: 'text-courage' },
    { key: 'justice', label: 'Justice', emoji: '⚖️', color: 'text-justice' },
    { key: 'temperance', label: 'Temperance', emoji: '🌊', color: 'text-temperance' }
  ];

  const updateScore = (virtue: string, score: number) => {
    setVirtueScores(prev => ({ ...prev, [virtue]: score }));
  };

  const saveAssessment = async () => {
    try {
      const response = await fetch('/api/progress/virtues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...virtueScores,
          note: assessment,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setAssessment('');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving virtue assessment:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">Virtue Assessment</h3>
        <div className="text-xs text-muted">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="space-y-3">
        {virtues.map((virtue) => (
          <div key={virtue.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">
                {virtue.emoji} {virtue.label}
              </label>
              <span className="text-sm text-muted">
                {virtueScores[virtue.key as keyof typeof virtueScores]}/5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={virtueScores[virtue.key as keyof typeof virtueScores]}
              onChange={(e) => updateScore(virtue.key, parseInt(e.target.value))}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>Needs Work</span>
              <span>Excellent</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">Reflection</label>
        <textarea
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
          placeholder="How did you demonstrate these virtues today?"
          className="w-full p-3 bg-surface border border-border rounded-lg text-text placeholder-muted resize-none"
          rows={3}
        />
      </div>

      <button
        onClick={saveAssessment}
        disabled={saved}
        className="w-full py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
      >
        {saved ? 'Assessment Saved!' : 'Save Assessment'}
      </button>
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