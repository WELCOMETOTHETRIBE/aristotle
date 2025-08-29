export const toneGradients: Record<string, string> = {
  // Spartan
  gritty: 'from-gray-900 via-gray-800 to-gray-900',
  
  // Samurai
  honor: 'from-red-900 via-red-800 to-red-900',
  
  // Stoic
  calm: 'from-slate-700 via-slate-600 to-slate-700',
  
  // Monastic
  order: 'from-amber-800 via-amber-700 to-amber-800',
  
  // Yogic
  embodied: 'from-emerald-700 via-emerald-600 to-emerald-700',
  
  // Indigenous
  stewardship: 'from-green-800 via-green-700 to-green-800',
  
  // Martial Arts
  disciplined: 'from-orange-800 via-orange-700 to-orange-800',
  
  // Sufi
  devotional: 'from-purple-800 via-purple-700 to-purple-800',
  
  // Ubuntu
  communal: 'from-blue-700 via-blue-600 to-blue-700',
  
  // High Performance
  crisp: 'from-indigo-800 via-indigo-700 to-indigo-800'
};

export function getToneGradient(tone: string): string {
  return toneGradients[tone] || 'from-gray-700 via-gray-600 to-gray-700';
}

export function getToneTextColor(tone: string): string {
  const lightTones = ['crisp', 'calm'];
  return lightTones.includes(tone) ? 'text-gray-100' : 'text-white';
}

export function getToneAccentColor(tone: string): string {
  const accentColors: Record<string, string> = {
    gritty: 'border-gray-600',
    honor: 'border-red-600',
    calm: 'border-slate-500',
    order: 'border-amber-600',
    embodied: 'border-emerald-500',
    stewardship: 'border-green-600',
    disciplined: 'border-orange-600',
    devotional: 'border-purple-600',
    communal: 'border-blue-500',
    crisp: 'border-indigo-500'
  };
  
  return accentColors[tone] || 'border-gray-500';
} 