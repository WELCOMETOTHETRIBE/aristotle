'use client';

export interface SessionSummary {
  id: string;
  date: Date;
  goal: number; // seconds
  secondsStable: number;
  totalDuration: number; // total session time
  balanceState: 'stable' | 'borderline' | 'out';
  motionData?: {
    maxPitch: number;
    maxRoll: number;
    avgDeviation: number;
  };
}

export interface BalanceStats {
  bestStableSeconds: number;
  totalSessions: number;
  averageStableSeconds: number;
  lastSessionDate?: Date;
  currentStreak: number;
  longestStreak: number;
  preferredGoal: number; // 30 or 60 seconds
}

export class SessionStore {
  private static readonly STORAGE_KEY = 'balance_sessions';
  private static readonly STATS_KEY = 'balance_stats';
  
  // Default stats
  private static readonly DEFAULT_STATS: BalanceStats = {
    bestStableSeconds: 0,
    totalSessions: 0,
    averageStableSeconds: 0,
    currentStreak: 0,
    longestStreak: 0,
    preferredGoal: 30
  };
  
  // Get all sessions
  static getSessions(): SessionSummary[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }
  
  // Save a new session
  static saveSession(session: Omit<SessionSummary, 'id'>): SessionSummary {
    const newSession: SessionSummary = {
      ...session,
      id: this.generateId()
    };
    
    const sessions = this.getSessions();
    sessions.push(newSession);
    
    // Keep only last 100 sessions to prevent storage bloat
    const trimmedSessions = sessions.slice(-100);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedSessions));
      this.updateStats(newSession);
    } catch (error) {
      console.error('Error saving session:', error);
    }
    
    return newSession;
  }
  
  // Get current stats
  static getStats(): BalanceStats {
    if (typeof window === 'undefined') return this.DEFAULT_STATS;
    
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      if (!stored) return this.DEFAULT_STATS;
      
      const stats = JSON.parse(stored);
      return {
        ...this.DEFAULT_STATS,
        ...stats,
        lastSessionDate: stats.lastSessionDate ? new Date(stats.lastSessionDate) : undefined
      };
    } catch (error) {
      console.error('Error loading stats:', error);
      return this.DEFAULT_STATS;
    }
  }
  
  // Update stats after a session
  private static updateStats(session: SessionSummary) {
    const currentStats = this.getStats();
    const sessions = this.getSessions();
    
    // Calculate new stats
    const newStats: BalanceStats = {
      bestStableSeconds: Math.max(currentStats.bestStableSeconds, session.secondsStable),
      totalSessions: sessions.length,
      averageStableSeconds: this.calculateAverageStableSeconds(sessions),
      lastSessionDate: session.date,
      currentStreak: this.calculateCurrentStreak(sessions),
      longestStreak: this.calculateLongestStreak(sessions),
      preferredGoal: currentStats.preferredGoal
    };
    
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }
  
  // Update preferred goal
  static updatePreferredGoal(goal: number) {
    const stats = this.getStats();
    const updatedStats = { ...stats, preferredGoal: goal };
    
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error updating preferred goal:', error);
    }
  }
  
  // Clear all data
  static clearAllData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.STATS_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
  
  // Export data for backup
  static exportData(): string {
    const sessions = this.getSessions();
    const stats = this.getStats();
    
    return JSON.stringify({
      sessions,
      stats,
      exportDate: new Date().toISOString()
    }, null, 2);
  }
  
  // Import data from backup
  static importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed.sessions));
      }
      
      if (parsed.stats) {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(parsed.stats));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
  
  // Helper methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  private static calculateAverageStableSeconds(sessions: SessionSummary[]): number {
    if (sessions.length === 0) return 0;
    
    const total = sessions.reduce((sum, session) => sum + session.secondsStable, 0);
    return Math.round(total / sessions.length);
  }
  
  private static calculateCurrentStreak(sessions: SessionSummary[]): number {
    if (sessions.length === 0) return 0;
    
    // Sort by date descending
    const sortedSessions = [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  private static calculateLongestStreak(sessions: SessionSummary[]): number {
    if (sessions.length === 0) return 0;
    
    // Group sessions by date
    const sessionsByDate = new Map<string, SessionSummary[]>();
    
    for (const session of sessions) {
      const dateKey = session.date.toISOString().split('T')[0];
      if (!sessionsByDate.has(dateKey)) {
        sessionsByDate.set(dateKey, []);
      }
      sessionsByDate.get(dateKey)!.push(session);
    }
    
    // Sort dates
    const sortedDates = Array.from(sessionsByDate.keys()).sort();
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    for (const dateKey of sortedDates) {
      const currentDate = new Date(dateKey);
      
      if (lastDate) {
        const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = currentDate;
    }
    
    return Math.max(longestStreak, currentStreak);
  }
  
  // Get recent sessions (last 7 days)
  static getRecentSessions(days: number = 7): SessionSummary[] {
    const sessions = this.getSessions();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return sessions.filter(session => session.date >= cutoffDate);
  }
  
  // Get sessions by date range
  static getSessionsByDateRange(startDate: Date, endDate: Date): SessionSummary[] {
    const sessions = this.getSessions();
    return sessions.filter(session => 
      session.date >= startDate && session.date <= endDate
    );
  }
}
