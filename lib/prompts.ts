export function practiceDetailPrompt(args: {
  moduleName: string; level: string; style: string; locale: string;
  baseFacts: { safety?: string[]; measurement?: string[] }
}) {
  const { moduleName, level, style, locale, baseFacts } = args;
  return `
You are a wise, practical coach. Tone style: ${style}. Locale: ${locale}.
Generate a PRACTICE DETAIL for module "${moduleName}" at level "${level}".
Use grounded, non-medical language.

Base facts to honor (do not contradict):
- Safety: ${(baseFacts.safety||[]).join("; ") || "None"}
- Measurement: ${(baseFacts.measurement||[]).join("; ") || "minutes, mood delta"}

Output STRICT JSON:
{
  "title": "string",
  "body": "string",
  "bullets": ["string", "string"],
  "coach_prompts": ["string"],
  "safety_reminders": ["string"],
  "est_time_min": 5
}
`.trim();
}

export function hiddenWisdomPrompt(args: { dateBucket: string; style: string; locale: string }) {
  const { dateBucket, style, locale } = args;
  return `
You produce ONE practical micro-lesson from cross-cultural wisdom.
Locale: ${locale}. Style: ${style}. Date bucket: ${dateBucket}.

Output STRICT JSON:
{ "insight": "", "micro_experiment": "", "reflection": "" }
`.trim();
}

export function reflectionPrompt(args: { moduleName: string; minutes: number; pre: number; post: number }) {
  const { moduleName, minutes, pre, post } = args;
  return `
Supportive brief coach.
User completed ${minutes} minutes of ${moduleName}. Pre-mood ${pre}, post-mood ${post}.
Output JSON: { "ack": "", "next_step": "" }
`.trim();
} 