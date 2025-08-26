/**
 * Hedonic treadmill detection and scoring
 * Monitors language signals for addictive behaviors and counter-signals
 */

export interface HedonicSignals {
  negative: string[];
  positive: string[];
}

export const HEDONIC_SIGNALS: HedonicSignals = {
  negative: [
    'binge', 'doomscroll', 'impulse buy', 'sugar', 'porn', 'gambling',
    'procrastinate', 'avoid', 'escape', 'numb', 'distract', 'scroll',
    'waste time', 'mindless', 'addictive', 'compulsive', 'obsessive',
    'can\'t stop', 'need to', 'have to', 'must', 'urge', 'craving'
  ],
  positive: [
    'exercise', 'service', 'learning', 'connection', 'gratitude',
    'meditation', 'breathwork', 'reflection', 'growth', 'progress',
    'intentional', 'mindful', 'present', 'focused', 'purposeful',
    'help others', 'volunteer', 'study', 'read', 'create', 'build'
  ]
};

/**
 * Calculate hedonic score from text content
 * Returns score from 0-100 (higher = more hedonic treadmill signals)
 */
export function calculateHedonicScore(text: string): number {
  const lowerText = text.toLowerCase();
  let negativeCount = 0;
  let positiveCount = 0;

  // Count negative signals
  for (const signal of HEDONIC_SIGNALS.negative) {
    const matches = (lowerText.match(new RegExp(signal, 'g')) || []).length;
    negativeCount += matches;
  }

  // Count positive signals
  for (const signal of HEDONIC_SIGNALS.positive) {
    const matches = (lowerText.match(new RegExp(signal, 'g')) || []).length;
    positiveCount += matches;
  }

  // Calculate score (0-100)
  const totalSignals = negativeCount + positiveCount;
  if (totalSignals === 0) return 50; // Neutral baseline

  const negativeRatio = negativeCount / totalSignals;
  return Math.round(negativeRatio * 100);
}

/**
 * Determine risk level from hedonic score
 */
export function getHedonicRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 30) return 'low';
  if (score <= 70) return 'medium';
  return 'high';
}

/**
 * Generate counter-moves for high hedonic risk
 */
export function generateCounterMoves(triggers: string[]): string[] {
  const counterMoves = [
    'Take 3 deep breaths',
    'Go for a 5-minute walk',
    'Call a friend or family member',
    'Do 10 push-ups or jumping jacks',
    'Write down 3 things you\'re grateful for',
    'Read a book for 10 minutes',
    'Practice a hobby or skill',
    'Help someone else with a small task'
  ];

  // Return 2-3 random counter-moves
  const shuffled = counterMoves.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(3, shuffled.length));
}

/**
 * Analyze text for hedonic treadmill patterns
 */
export function analyzeHedonicPatterns(text: string): {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  triggers: string[];
  counterMoves: string[];
} {
  const score = calculateHedonicScore(text);
  const riskLevel = getHedonicRiskLevel(score);
  
  // Extract specific triggers mentioned
  const lowerText = text.toLowerCase();
  const triggers = HEDONIC_SIGNALS.negative.filter(signal => 
    lowerText.includes(signal)
  );

  const counterMoves = riskLevel === 'high' ? generateCounterMoves(triggers) : [];

  return {
    score,
    riskLevel,
    triggers,
    counterMoves
  };
}

/**
 * Track daily hedonic trends
 */
export interface DailyHedonicData {
  date: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  sessions: number;
}

export function calculateDailyTrend(data: DailyHedonicData[]): {
  trend: 'improving' | 'stable' | 'declining';
  averageScore: number;
  daysTracked: number;
} {
  if (data.length < 2) {
    return {
      trend: 'stable',
      averageScore: data[0]?.score || 50,
      daysTracked: data.length
    };
  }

  // Calculate trend over last 7 days
  const recentData = data.slice(-7);
  const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2));
  const secondHalf = recentData.slice(Math.floor(recentData.length / 2));

  const firstAvg = firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length;

  let trend: 'improving' | 'stable' | 'declining';
  const diff = secondAvg - firstAvg;
  
  if (diff < -5) trend = 'improving';
  else if (diff > 5) trend = 'declining';
  else trend = 'stable';

  const averageScore = recentData.reduce((sum, d) => sum + d.score, 0) / recentData.length;

  return {
    trend,
    averageScore: Math.round(averageScore),
    daysTracked: recentData.length
  };
} 