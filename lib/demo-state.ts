import { VirtueScore, TrackerRecord, MoodLog, HydrationLog, SleepLog, UserProfile, DashboardState } from './types';

// Simple fasting session for demo
interface DemoFastingSession {
  id: string;
  startTime: Date;
  targetHours: number;
  isActive: boolean;
}

export const mockVirtueScores: VirtueScore[] = [
  { virtue: 'wisdom', score: 0.72, trend: 'up', lastUpdated: new Date() },
  { virtue: 'courage', score: 0.64, trend: 'stable', lastUpdated: new Date() },
  { virtue: 'justice', score: 0.58, trend: 'up', lastUpdated: new Date() },
  { virtue: 'temperance', score: 0.81, trend: 'down', lastUpdated: new Date() },
];

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Scholar',
  email: 'scholar@academy.com',
  timezone: 'America/New_York',
  preferences: {
    theme: 'dark',
    notifications: true,
    units: 'metric',
  },
  goals: {
    dailyHydration: 2000,
    sleepHours: { start: '22:00', end: '06:00' },
    fastingHours: 16,
  },
  streaks: {
    morningRoutine: 7,
    breathwork: 12,
    fasting: 5,
    coldExposure: 3,
  },
};

export const mockFastingSession: DemoFastingSession = {
  id: '1',
  startTime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  targetHours: 16,
  isActive: true,
};

export const mockHydrationLogs: HydrationLog[] = [
  { id: '1', amount: 250, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'water' },
  { id: '2', amount: 300, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'water' },
  { id: '3', amount: 200, timestamp: new Date(Date.now() - 30 * 60 * 1000), type: 'tea' },
];

export const mockMoodLogs: MoodLog[] = [
  { id: '1', mood: 4, energy: 3, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: '2', mood: 3, energy: 4, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { id: '3', mood: 4, energy: 4, timestamp: new Date() },
];

export const mockSleepLog: SleepLog = {
  id: '1',
  bedtime: new Date(Date.now() - 10 * 60 * 60 * 1000),
  wakeTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  quality: 4,
};

export const mockDashboardState: DashboardState = {
  widgets: [
    { id: 'virtue-radar', type: 'virtue-radar', position: { x: 0, y: 0, w: 2, h: 2 }, isVisible: true },
    { id: 'morning-ritual', type: 'morning-ritual', position: { x: 2, y: 0, w: 2, h: 2 }, isVisible: true },
    { id: 'breathwork-timer', type: 'breathwork-timer', position: { x: 4, y: 0, w: 2, h: 2 }, isVisible: true },
    { id: 'cold-exposure', type: 'cold-exposure', position: { x: 0, y: 2, w: 2, h: 2 }, isVisible: true },
    { id: 'fasting-tracker', type: 'fasting-tracker', position: { x: 2, y: 2, w: 2, h: 2 }, isVisible: true },
    { id: 'mood-reflection', type: 'mood-reflection', position: { x: 4, y: 2, w: 2, h: 2 }, isVisible: true },
    { id: 'sun-path', type: 'sun-path', position: { x: 0, y: 4, w: 2, h: 1 }, isVisible: true },
    { id: 'hydration-ring', type: 'hydration-ring', position: { x: 2, y: 4, w: 2, h: 1 }, isVisible: true },
    { id: 'focus-flow', type: 'focus-flow', position: { x: 4, y: 4, w: 2, h: 1 }, isVisible: true },
    { id: 'resource-spotlight', type: 'resource-spotlight', position: { x: 0, y: 5, w: 6, h: 1 }, isVisible: true },
  ],
  lastUpdated: new Date(),
};

export const getCurrentHydration = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return mockHydrationLogs
    .filter(log => log.timestamp >= today)
    .reduce((total, log) => total + log.amount, 0);
};

export const getFastingTimeRemaining = (): number => {
  if (!mockFastingSession.isActive) return 0;
  
  const elapsed = Date.now() - mockFastingSession.startTime.getTime();
  const targetMs = mockFastingSession.targetHours * 60 * 60 * 1000;
  const remaining = targetMs - elapsed;
  
  return Math.max(0, remaining);
};

export const getCurrentMood = (): MoodLog | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayMoods = mockMoodLogs.filter(log => log.timestamp >= today);
  return todayMoods.length > 0 ? todayMoods[todayMoods.length - 1] : null;
};

export const getSleepQuality = (): number => {
  return mockSleepLog.quality;
};

export const getVirtueRadarData = () => {
  return mockVirtueScores.map(score => ({
    virtue: score.virtue.charAt(0).toUpperCase() + score.virtue.slice(1),
    score: score.score,
  }));
}; 