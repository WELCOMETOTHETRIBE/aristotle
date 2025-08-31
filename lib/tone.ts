export const frameworkTone: Record<string, {grad: string; color: string}> = {
  spartan:  { grad: 'bg-grad-courage',    color: 'text-courage' },
  bushido:  { grad: 'bg-grad-courage',    color: 'text-courage' },
  stoic:    { grad: 'bg-grad-wisdom',     color: 'text-[rgb(var(--wisdom))]' },
  monastic: { grad: 'bg-grad-temperance', color: 'text-temperance' },
  yogic:    { grad: 'bg-grad-temperance', color: 'text-temperance' },
  indigenous:{grad:'bg-grad-justice',     color: 'text-justice' },
  martial:  { grad: 'bg-grad-courage',    color: 'text-courage' },
  sufi:     { grad: 'bg-grad-temperance', color: 'text-temperance' },
  ubuntu:   { grad: 'bg-grad-justice',    color: 'text-justice' },
  highperf: { grad: 'bg-grad-wisdom',     color: 'text-[rgb(var(--wisdom))]' },
}

export const virtueColors = {
  wisdom: {
    bg: 'bg-[rgb(var(--wisdom))]',
    text: 'text-[rgb(var(--wisdom))]',
    border: 'border-[rgb(var(--wisdom))]',
    grad: 'bg-grad-wisdom',
  },
  courage: {
    bg: 'bg-courage',
    text: 'text-courage',
    border: 'border-courage',
    grad: 'bg-grad-courage',
  },
  justice: {
    bg: 'bg-justice',
    text: 'text-justice',
    border: 'border-justice',
    grad: 'bg-grad-justice',
  },
  temperance: {
    bg: 'bg-temperance',
    text: 'text-temperance',
    border: 'border-temperance',
    grad: 'bg-grad-temperance',
  },
}

export const frameworkColors = {
  spartan: 'bg-fw-spartan',
  bushido: 'bg-fw-bushido',
  stoic: 'bg-fw-stoic',
  monastic: 'bg-fw-monastic',
  yogic: 'bg-fw-yogic',
  indigenous: 'bg-fw-indigenous',
  martial: 'bg-fw-martial',
  sufi: 'bg-fw-sufi',
  ubuntu: 'bg-fw-ubuntu',
  highperf: 'bg-fw-highperf',
}

// Legacy functions for backward compatibility
export function getToneGradient(tone: string): string {
  const gradients: Record<string, string> = {
    'gritty': 'from-orange-900 via-orange-800 to-orange-900',
    'honor': 'from-red-900 via-red-800 to-red-900',
    'calm': 'from-slate-700 via-slate-600 to-slate-700',
    'order': 'from-amber-800 via-amber-700 to-amber-800',
    'embodied': 'from-emerald-700 via-emerald-600 to-emerald-700',
    'stewardship': 'from-green-800 via-green-700 to-green-800',
    'disciplined': 'from-purple-900 via-purple-800 to-purple-900',
    'devotional': 'from-indigo-900 via-indigo-800 to-indigo-900',
    'communal': 'from-blue-700 via-blue-600 to-blue-700',
    'crisp': 'from-cyan-900 via-cyan-800 to-cyan-900'
  };
  return gradients[tone] || gradients['calm'];
}

export function getToneTextColor(tone: string): string {
  const colors: Record<string, string> = {
    'gritty': 'text-orange-100',
    'honor': 'text-red-100',
    'calm': 'text-gray-100',
    'order': 'text-amber-100',
    'embodied': 'text-green-100',
    'stewardship': 'text-emerald-100',
    'disciplined': 'text-purple-100',
    'devotional': 'text-indigo-100',
    'communal': 'text-blue-100',
    'crisp': 'text-cyan-100'
  };
  return colors[tone] || colors['calm'];
} 