export function practiceDetailPrompt(a: {
  moduleName: string; 
  level: string; 
  style: string; 
  locale: string; 
  baseFacts: { safety?: string[]; measurement?: string[] }
}) {
  const { moduleName, level, style, locale, baseFacts } = a;
  return `
You are a practical coach. Style:${style}. Locale:${locale}.
Generate a PRACTICE DETAIL for "${moduleName}" at level "${level}".
Honor facts; non-medical; conservative.

Facts:
- Safety: ${(baseFacts.safety || ["—"]).join("; ")}
- Measurement: ${(baseFacts.measurement || ["minutes; mood (1–5)"]).join("; ")}

JSON ONLY:
{ "title":"","body":"","bullets":[],"coach_prompts":[],"safety_reminders":[],"est_time_min":5 }
`.trim();
}

export function virtuePracticePrompt(a: {
  title: string; 
  virtue: string; 
  shortDesc?: string; 
  safety?: string; 
  measurement?: string; 
  style: string; 
  locale: string;
}) {
  const { title, virtue, shortDesc, safety, measurement, style, locale } = a;
  return `
Style:${style}. Locale:${locale}.
Generate detailed card for virtue "${virtue}" titled "${title}".
Facts:
- Short:${shortDesc || "—"}; Safety:${safety || "—"}; Measurement:${measurement || "minutes; mood 1–5"}
JSON ONLY:
{ "title":"","body":"","bullets":[],"coach_prompts":[],"safety_reminders":[],"est_time_min":5 }
`.trim();
}

export function hiddenWisdomPrompt(a: {
  dateBucket: string; 
  style: string; 
  locale: string
}) {
  const { dateBucket, style, locale } = a;
  return `One practical micro-lesson. Date:${dateBucket}. Style:${style}. Locale:${locale}.
JSON ONLY:{ "insight":"","micro_experiment":"","reflection":"" }`.trim();
}

export function reflectionPrompt(args: { moduleName: string; minutes: number; pre: number; post: number }) {
  const { moduleName, minutes, pre, post } = args;
  return `
Supportive brief coach.
User completed ${minutes} minutes of ${moduleName}. Pre-mood ${pre}, post-mood ${post}.
Output JSON: { "ack": "", "next_step": "" }
`.trim();
} 