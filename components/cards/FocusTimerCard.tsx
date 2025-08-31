'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Info, Settings, Sparkles, Brain, Target, Coffee, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusTimerCardProps {
  className?: string;
}

interface FocusSession {
  id: string;
  duration: number;
  type: 'focus' | 'break' | 'longBreak';
  timestamp: Date;
  completed: boolean;
}

interface FocusSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
  enableHaptic: boolean;
}

const defaultSettings: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartFocus: false,
  enableNotifications: true,
  enableSound: true,
  enableHaptic: true,
};

export function FocusTimerCard({ className }: FocusTimerCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [currentMode, setCurrentMode] = useState<'focus' | 'break' | 'longBreak'>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<FocusSettings>(defaultSettings);
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved data
  useEffect(() => {
    const savedSettings = localStorage.getItem('focusTimerSettings');
    const savedSessions = localStorage.getItem('focusTimerSessions');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      })));
      setCompletedSessions(parsed.filter((s: FocusSession) => s.completed).length);
    }
  }, []);

  // Save data
  const saveSettings = (newSettings: FocusSettings) => {
    setSettings(newSettings);
    localStorage.setItem('focusTimerSettings', JSON.stringify(newSettings));
  };

  const saveSessions = (newSessions: FocusSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('focusTimerSessions', JSON.stringify(newSessions));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDuration = () => {
    switch (currentMode) {
      case 'focus': return settings.focusDuration * 60;
      case 'break': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return settings.focusDuration * 60;
    }
  };

  const getNextMode = (): { mode: typeof currentMode; autoStart: boolean } => {
    if (currentMode === 'focus') {
      const shouldLongBreak = (completedSessions + 1) % settings.longBreakInterval === 0;
      return {
        mode: shouldLongBreak ? 'longBreak' : 'break',
        autoStart: settings.autoStartBreaks
      };
    } else {
      return {
        mode: 'focus',
        autoStart: settings.autoStartFocus
      };
    }
  };

  const playNotification = () => {
    if (settings.enableSound && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio failed to play, continue without sound
      });
    }
    
    if (settings.enableHaptic && navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    if (settings.enableNotifications && 'Notification' in window && Notification.permission === 'granted') {
      const titles = {
        focus: 'Focus session complete!',
        break: 'Break time is over',
        longBreak: 'Long break complete!'
      };
      
      new Notification(titles[currentMode], {
        body: 'Time to switch modes',
        icon: '/favicon.ico'
      });
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Session complete
          const session: FocusSession = {
            id: Date.now().toString(),
            duration: getCurrentDuration(),
            type: currentMode,
            timestamp: new Date(),
            completed: true,
          };
          
          const updatedSessions = [session, ...sessions];
          saveSessions(updatedSessions);
          
          if (currentMode === 'focus') {
            setCompletedSessions(prev => prev + 1);
          }
          
          playNotification();
          
          // Switch to next mode
          const { mode: nextMode, autoStart } = getNextMode();
          setCurrentMode(nextMode);
          setTimeRemaining(getCurrentDuration());
          
          if (autoStart) {
            return getCurrentDuration();
          } else {
            setIsActive(false);
            setIsPaused(false);
            return getCurrentDuration();
          }
        }
        
        return prev - 1;
      });
    }, 1000);
  };

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setTimeRemaining(getCurrentDuration());
    startTimer();
  };

  const handlePause = () => {
    if (isPaused) {
      setIsPaused(false);
      startTimer();
    } else {
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(getCurrentDuration());
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const switchMode = (mode: typeof currentMode) => {
    setCurrentMode(mode);
    setTimeRemaining(getCurrentDuration());
    
    if (isActive) {
      handleReset();
    }
  };

  const getProgress = () => {
    const total = getCurrentDuration();
    return ((total - timeRemaining) / total) * 100;
  };

  const getModeColor = () => {
    const colors = {
      focus: 'text-orange-500',
      break: 'text-green-500',
      longBreak: 'text-blue-500'
    };
    return colors[currentMode];
  };

  const getModeLabel = () => {
    const labels = {
      focus: 'Focus',
      break: 'Short Break',
      longBreak: 'Long Break'
    };
    return labels[currentMode];
  };

  const getTodaySessions = () => {
    const today = new Date();
    return sessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate.toDateString() === today.toDateString();
    });
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(session => 
      new Date(session.timestamp) > weekAgo
    );
    
    const focusSessions = weekSessions.filter(s => s.type === 'focus' && s.completed);
    const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.duration, 0);
    
    return {
      sessions: focusSessions.length,
      totalTime: Math.round(totalFocusTime / 60), // minutes
      averageTime: focusSessions.length > 0 ? Math.round(totalFocusTime / focusSessions.length / 60) : 0
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const weeklyStats = getWeeklyStats();

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
            <Timer className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Focus Timer</h3>
            <p className="text-xs text-muted">Pomodoro technique</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
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
            How to use Focus Timer
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Work in focused 25-minute sessions</p>
            <p>• Take short breaks between sessions</p>
            <p>• Take longer breaks every 4 sessions</p>
            <p>• Use auto-start to maintain flow</p>
            <p>• Track your daily and weekly progress</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Settings</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted mb-1 block">Focus (min)</label>
                <input
                  type="number"
                  value={settings.focusDuration}
                  onChange={(e) => saveSettings({ ...settings, focusDuration: parseInt(e.target.value) || 25 })}
                  className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Short break (min)</label>
                <input
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={(e) => saveSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                  className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                  min="1"
                  max="30"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Long break (min)</label>
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) => saveSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                min="5"
                max="60"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Auto-start breaks</span>
              <button
                onClick={() => saveSettings({ ...settings, autoStartBreaks: !settings.autoStartBreaks })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.autoStartBreaks 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Notifications</span>
              <button
                onClick={() => saveSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.enableNotifications 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector */}
      {!isActive && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => switchMode('focus')}
              className={cn(
                'p-3 rounded-lg border transition-all duration-150 text-center',
                currentMode === 'focus'
                  ? 'bg-orange-500/20 border-orange-500/30'
                  : 'bg-surface-2 border-border hover:border-orange-500/30'
              )}
            >
              <div className="text-sm font-medium text-text">Focus</div>
              <div className="text-xs text-muted">{settings.focusDuration}m</div>
            </button>
            <button
              onClick={() => switchMode('break')}
              className={cn(
                'p-3 rounded-lg border transition-all duration-150 text-center',
                currentMode === 'break'
                  ? 'bg-green-500/20 border-green-500/30'
                  : 'bg-surface-2 border-border hover:border-green-500/30'
              )}
            >
              <div className="text-sm font-medium text-text">Break</div>
              <div className="text-xs text-muted">{settings.shortBreakDuration}m</div>
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={cn(
                'p-3 rounded-lg border transition-all duration-150 text-center',
                currentMode === 'longBreak'
                  ? 'bg-blue-500/20 border-blue-500/30'
                  : 'bg-surface-2 border-border hover:border-blue-500/30'
              )}
            >
              <div className="text-sm font-medium text-text">Long</div>
              <div className="text-xs text-muted">{settings.longBreakDuration}m</div>
            </button>
          </div>
        </div>
      )}

      {/* Timer Display */}
      {isActive && (
        <div className="mb-4">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-surface-2"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - getProgress() / 100)}`}
                className={cn('transition-all duration-1000 ease-linear', getModeColor())}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-text">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-xs text-muted">{getModeLabel()}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-text">
              Session {completedSessions + 1}
            </div>
            <div className="text-xs text-muted">
              {completedSessions} completed today
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Today</span>
            </div>
            <div className="text-lg font-bold text-text">
              {getTodaySessions().filter(s => s.type === 'focus' && s.completed).length}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Coffee className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Weekly</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.sessions}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Avg (min)</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.averageTime}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-2">
        {!isActive ? (
          <button
            onClick={startSession}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-150"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Start Session</span>
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-4 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface hover:border-primary/30 transition-colors duration-150"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm font-medium">Pause</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-surface-2 border border-border text-muted rounded-lg hover:bg-surface hover:text-text transition-colors duration-150"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reset</span>
            </button>
          </>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
} 