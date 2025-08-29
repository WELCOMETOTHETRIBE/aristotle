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
  try {
    const gradients: Record<string, string> = {
      'gritty': 'from-red-900 via-red-800 to-red-900',
      'honor': 'from-gray-900 via-gray-800 to-gray-900',
      'calm': 'from-slate-700 via-slate-600 to-slate-700',
      'order': 'from-blue-900 via-blue-800 to-blue-900',
      'embodied': 'from-green-900 via-green-800 to-green-900',
      'stewardship': 'from-emerald-900 via-emerald-800 to-emerald-900',
      'disciplined': 'from-purple-900 via-purple-800 to-purple-900',
      'devotional': 'from-indigo-900 via-indigo-800 to-indigo-900',
      'communal': 'from-orange-900 via-orange-800 to-orange-900',
      'crisp': 'from-cyan-900 via-cyan-800 to-cyan-900'
    };
    return gradients[tone] || gradients['calm'];
  } catch (error) {
    console.error('Error getting tone gradient:', error);
    return 'from-slate-700 via-slate-600 to-slate-700';
  }
}

export function getToneTextColor(tone: string): string {
  try {
    const colors: Record<string, string> = {
      'gritty': 'text-red-100',
      'honor': 'text-gray-100',
      'calm': 'text-gray-100',
      'order': 'text-blue-100',
      'embodied': 'text-green-100',
      'stewardship': 'text-emerald-100',
      'disciplined': 'text-purple-100',
      'devotional': 'text-indigo-100',
      'communal': 'text-orange-100',
      'crisp': 'text-cyan-100'
    };
    return colors[tone] || colors['calm'];
  } catch (error) {
    console.error('Error getting tone text color:', error);
    return 'text-gray-100';
  }
}

export function getToneAccentColor(tone: string): string {
  try {
    const colors: Record<string, string> = {
      'gritty': 'border-red-500',
      'honor': 'border-gray-500',
      'calm': 'border-slate-500',
      'order': 'border-blue-500',
      'embodied': 'border-green-500',
      'stewardship': 'border-emerald-500',
      'disciplined': 'border-purple-500',
      'devotional': 'border-indigo-500',
      'communal': 'border-orange-500',
      'crisp': 'border-cyan-500'
    };
    return colors[tone] || colors['calm'];
  } catch (error) {
    console.error('Error getting tone accent color:', error);
    return 'border-slate-500';
  }
} 