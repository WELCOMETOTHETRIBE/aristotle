import { VirtueXP } from './frameworks.config';

export interface VirtueTotals {
  wisdom: number;
  justice: number;
  courage: number;
  temperance: number;
}

export interface CheckinData {
  widgetId: string;
  frameworkSlug: string;
  questId?: string;
  payload: Record<string, any>;
  virtues: VirtueXP;
}

export const grantVirtues = (checkin: CheckinData, baseGrant: VirtueXP): VirtueXP => {
  // Calculate total virtue XP granted
  const totalGrant: VirtueXP = {
    wisdom: (baseGrant.wisdom || 0) + (checkin.virtues.wisdom || 0),
    justice: (baseGrant.justice || 0) + (checkin.virtues.justice || 0),
    courage: (baseGrant.courage || 0) + (checkin.virtues.courage || 0),
    temperance: (baseGrant.temperance || 0) + (checkin.virtues.temperance || 0)
  };

  return totalGrant;
};

export const calculateVirtueLevel = (totalXP: number): number => {
  // Simple level calculation: every 100 XP = 1 level
  return Math.floor(totalXP / 100) + 1;
};

export const getVirtueProgress = (currentXP: number): number => {
  // Progress within current level (0-100%)
  return (currentXP % 100);
};

export const getVirtueEmoji = (virtue: keyof VirtueTotals): string => {
  const emojis = {
    wisdom: '🧠',
    justice: '⚖️',
    courage: '🛡️',
    temperance: '⚖️'
  };
  return emojis[virtue];
};

export const getVirtueColor = (virtue: keyof VirtueTotals): string => {
  const colors = {
    wisdom: 'text-blue-400',
    justice: 'text-green-400',
    courage: 'text-red-400',
    temperance: 'text-purple-400'
  };
  return colors[virtue];
};

export const getVirtueGradient = (virtue: keyof VirtueTotals): string => {
  const gradients = {
    wisdom: 'from-blue-500 to-blue-600',
    justice: 'from-green-500 to-green-600',
    courage: 'from-red-500 to-red-600',
    temperance: 'from-purple-500 to-purple-600'
  };
  return gradients[virtue];
}; 