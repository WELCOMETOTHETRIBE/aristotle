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