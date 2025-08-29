import { FrameworkConfig, VirtueXP } from './frameworks.config';
import { VirtueTotals } from './virtue';

export interface Quest {
  id: string;
  title: string;
  description: string;
  widgetIds: string[];
  minutes: number;
  virtueGrants: VirtueXP;
  completed?: boolean;
}

export interface QuestEngineInput {
  frameworkSlug: string;
  userVirtues: VirtueTotals;
  recentCompletions: string[]; // widget IDs completed recently
  timeBudget: number; // minutes available (20-25)
  frameworkConfig: FrameworkConfig;
}

export const generateDailyQuests = (input: QuestEngineInput): Quest[] => {
  const { frameworkConfig, userVirtues, recentCompletions, timeBudget } = input;
  
  // Get all available quests from framework config
  const availableQuests = frameworkConfig.quests.map(q => ({
    ...q,
    completed: false
  }));

  // Calculate virtue deficits (which virtues need more XP)
  const virtueDeficits = calculateVirtueDeficits(userVirtues);
  
  // Score quests based on multiple factors
  const scoredQuests = availableQuests.map(quest => {
    let score = 0;
    
    // Bonus for quests that grant XP in deficient virtues
    Object.entries(quest.virtueGrants).forEach(([virtue, xp]) => {
      if (virtueDeficits[virtue as keyof VirtueTotals] > 0) {
        score += xp * 2; // Double score for deficient virtues
      }
    });
    
    // Bonus for variety (avoid repeating recently completed widgets)
    const newWidgets = quest.widgetIds.filter(widgetId => 
      !recentCompletions.includes(widgetId)
    );
    score += newWidgets.length * 3;
    
    // Penalty for long quests if time budget is tight
    if (quest.minutes > timeBudget * 0.4) {
      score -= 5;
    }
    
    // Bonus for balanced virtue distribution
    const virtueCount = Object.keys(quest.virtueGrants).length;
    score += virtueCount * 2;
    
    return { ...quest, score };
  });

  // Sort by score and select quests that fit time budget
  const sortedQuests = scoredQuests.sort((a, b) => b.score - a.score);
  
  const selectedQuests: Quest[] = [];
  let totalMinutes = 0;
  
  for (const quest of sortedQuests) {
    if (totalMinutes + quest.minutes <= timeBudget && selectedQuests.length < 5) {
      selectedQuests.push(quest);
      totalMinutes += quest.minutes;
    }
  }
  
  // Ensure we have at least 3 quests
  if (selectedQuests.length < 3) {
    const remainingQuests = sortedQuests.filter(q => 
      !selectedQuests.find(sq => sq.id === q.id)
    );
    
    for (const quest of remainingQuests) {
      if (selectedQuests.length < 3) {
        selectedQuests.push(quest);
      }
    }
  }
  
  return selectedQuests;
};

const calculateVirtueDeficits = (userVirtues: VirtueTotals): VirtueTotals => {
  const maxVirtue = Math.max(
    userVirtues.wisdom,
    userVirtues.justice,
    userVirtues.courage,
    userVirtues.temperance
  );
  
  return {
    wisdom: Math.max(0, maxVirtue - userVirtues.wisdom),
    justice: Math.max(0, maxVirtue - userVirtues.justice),
    courage: Math.max(0, maxVirtue - userVirtues.courage),
    temperance: Math.max(0, maxVirtue - userVirtues.temperance)
  };
};

export const getQuestProgress = (quest: Quest, completedWidgets: string[]): number => {
  const completedCount = quest.widgetIds.filter(widgetId => 
    completedWidgets.includes(widgetId)
  ).length;
  
  return (completedCount / quest.widgetIds.length) * 100;
};

export const isQuestComplete = (quest: Quest, completedWidgets: string[]): boolean => {
  return quest.widgetIds.every(widgetId => 
    completedWidgets.includes(widgetId)
  );
}; 