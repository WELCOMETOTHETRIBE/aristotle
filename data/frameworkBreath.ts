// data/frameworkBreath.ts
export type BreathPhase = {
  name: string;                 // label shown to the user
  inhaleSec: number;            // seconds
  holdInSec?: number;           // hold after inhale
  exhaleSec: number;            // seconds
  holdOutSec?: number;          // hold after exhale
  nostril?: "left" | "right" | "alternate" | "both";
  sound?: "ujjayi" | "dhikr" | "none";
  repeats?: number;             // cycles for this phase (if not duration-based)
};

export type BreathPattern = {
  id: string;                   // framework id (spartan, bushido, etc.)
  title: string;                // e.g., "Box Breathing"
  subtitle?: string;            // short tag line
  intent: "calm" | "focus" | "balance" | "energize" | "resilience" | "devotion";
  primaryVirtue: "Wisdom" | "Courage" | "Temperance" | "Justice";
  durationMin?: number;         // fallback session length (minutes) when phases use time
  bpmApprox?: number;           // breaths/min (for coherent/resonance etc.)
  notes?: string[];             // simple guidance bullets
  contraindications?: string[]; // safety flags
  phases: BreathPhase[];        // ordered phases; widget will step through in sequence
  rounds?: number;              // for multi-round protocols (e.g., Wim Hof)
};

export const FRAMEWORK_BREATH_MAP: Record<string, BreathPattern> = {
  spartan: {
    id: "spartan",
    title: "Box Breathing (4-4-4-4)",
    subtitle: "Discipline under pressure",
    intent: "focus",
    primaryVirtue: "Courage",
    durationMin: 4,
    bpmApprox: 3.75, // 16s per breath
    notes: [
      "In through the nose, out through the nose or mouth.",
      "Keep posture tall; shoulders relaxed.",
      "Draw the box in your mind: inhale → hold → exhale → hold."
    ],
    contraindications: ["If dizzy, shorten holds or pause."],
    phases: [
      { name: "Box cycle", inhaleSec: 4, holdInSec: 4, exhaleSec: 4, holdOutSec: 4, nostril: "both", repeats: 12 }
    ]
  },

  bushido: {
    id: "bushido",
    title: "Hara (Tanden) Breathing",
    subtitle: "Grounded rectitude",
    intent: "calm",
    primaryVirtue: "Justice",
    durationMin: 5,
    bpmApprox: 5, // ~12s per breath (4+8)
    notes: [
      "Breathe low to the belly (tanden).",
      "Smooth, silent exhale slightly longer than inhale.",
      "Maintain poised posture and soft gaze."
    ],
    contraindications: [],
    phases: [
      { name: "Hara cycle", inhaleSec: 4, exhaleSec: 6, nostril: "both", repeats: 20 }
    ]
  },

  stoic: {
    id: "stoic",
    title: "Coherent Breathing (~5–6 bpm)",
    subtitle: "Equanimity & clarity",
    intent: "balance",
    primaryVirtue: "Wisdom",
    durationMin: 5,
    bpmApprox: 6,
    notes: [
      "Even inhale/exhale with no strain.",
      "If you prefer, sync to a 5-5 timing.",
      "Let thoughts pass; return to the breath."
    ],
    contraindications: [],
    phases: [
      { name: "Coherent cycle", inhaleSec: 5, exhaleSec: 5, nostril: "both", repeats: 30 }
    ]
  },

  monastic: {
    id: "monastic",
    title: "4-7-8 (Prayer Rhythm)",
    subtitle: "Settling the nervous system",
    intent: "calm",
    primaryVirtue: "Temperance",
    durationMin: 4,
    bpmApprox: 3, // ~20s per breath
    notes: [
      "Gentle inhale, no strain on the 7-second hold.",
      "Whispered prayer/mantra optional on exhale."
    ],
    contraindications: ["Avoid long holds during pregnancy or if you feel lightheaded."],
    phases: [
      { name: "4-7-8 cycle", inhaleSec: 4, holdInSec: 7, exhaleSec: 8, nostril: "both", repeats: 8 }
    ]
  },

  yogic: {
    id: "yogic",
    title: "Nadi Shodhana (Alternate Nostril)",
    subtitle: "Union & harmony",
    intent: "balance",
    primaryVirtue: "Temperance",
    durationMin: 6,
    bpmApprox: 5,
    notes: [
      "Comfortable seat; use right hand to switch nostrils.",
      "Light, even breath; no force.",
      "Start L→R, then mirror."
    ],
    contraindications: ["Skip if congested or ill."],
    phases: [
      // One full cycle = L in → hold → R out; R in → hold → L out
      { name: "Left in / hold / Right out", inhaleSec: 4, holdInSec: 4, exhaleSec: 4, nostril: "alternate", repeats: 6 },
      { name: "Right in / hold / Left out", inhaleSec: 4, holdInSec: 4, exhaleSec: 4, nostril: "alternate", repeats: 6 }
    ]
  },

  indigenous: {
    id: "indigenous",
    title: "Circular (Connected) Breathing",
    subtitle: "Continuity & cycles",
    intent: "balance",
    primaryVirtue: "Justice",
    durationMin: 5,
    bpmApprox: 10,
    notes: [
      "No pauses between inhale and exhale.",
      "Soft, continuous rhythm; imagine a circle.",
      "Can be practiced with gentle movement."
    ],
    contraindications: ["If you feel tingling/dizziness, slow down."],
    phases: [
      { name: "Connected cycle", inhaleSec: 3, exhaleSec: 3, nostril: "both", repeats: 50 }
    ]
  },

  martial: {
    id: "martial",
    title: "Sanchin Breath (Dynamic Tension)",
    subtitle: "Form, etiquette, control",
    intent: "focus",
    primaryVirtue: "Courage",
    durationMin: 5,
    bpmApprox: 5,
    notes: [
      "Stand tall; engage core lightly.",
      "Nasal inhale; slow, controlled exhale (hissing optional).",
      "Keep jaw unclenched and gaze steady."
    ],
    contraindications: ["Avoid straining or breath-holding if hypertensive."],
    phases: [
      { name: "Sanchin cycle", inhaleSec: 3, exhaleSec: 6, nostril: "both", repeats: 20 }
    ]
  },

  sufi: {
    id: "sufi",
    title: "Dhikr Breath (Remembrance)",
    subtitle: "Heart-centered devotion",
    intent: "devotion",
    primaryVirtue: "Wisdom",
    durationMin: 5,
    bpmApprox: 5,
    notes: [
      "Soft whisper/mantra on exhale.",
      "Let breath and remembrance weave together.",
      "Keep shoulders and chest relaxed."
    ],
    contraindications: [],
    phases: [
      { name: "Dhikr cycle", inhaleSec: 4, exhaleSec: 6, sound: "dhikr", nostril: "both", repeats: 25 }
    ]
  },

  ubuntu: {
    id: "ubuntu",
    title: "Resonance (Group Coherence)",
    subtitle: "I am because we are",
    intent: "balance",
    primaryVirtue: "Justice",
    durationMin: 5,
    bpmApprox: 5.5,
    notes: [
      "Sync breathing with others if present.",
      "Even, unforced rhythm fosters connection."
    ],
    contraindications: [],
    phases: [
      { name: "Resonance cycle", inhaleSec: 5, exhaleSec: 5, nostril: "both", repeats: 30 }
    ]
  },

  highperf: {
    id: "highperf",
    title: "Wim Hof-style Rounds",
    subtitle: "Energy & resilience",
    intent: "energize",
    primaryVirtue: "Courage",
    durationMin: 10,
    notes: [
      "Never practice in/near water or while driving.",
      "Stop if dizzy or uncomfortable.",
      "Lie or sit safely; be gentle on your first rounds."
    ],
    contraindications: [
      "Avoid if pregnant or with certain cardiac conditions; consult a professional."
    ],
    rounds: 3,
    // Round = power breaths → retention (exhale hold) → recovery hold
    phases: [
      { name: "Power breaths", inhaleSec: 1, exhaleSec: 1, nostril: "both", repeats: 30 },
      { name: "Retention (exhale hold)", inhaleSec: 0, exhaleSec: 0, holdOutSec: 60, nostril: "both", repeats: 1 },
      { name: "Recovery hold (after inhale)", inhaleSec: 1, holdInSec: 15, exhaleSec: 0, nostril: "both", repeats: 1 }
    ]
  }
}; 