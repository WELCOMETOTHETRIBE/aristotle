import { prisma } from "./db";
import CryptoJS from "crypto-js";
import { z } from "zod";
import OpenAI from "openai";

// Check if we have a valid API key (not the placeholder)
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey === "your_openai_api_key_here" || apiKey.includes("your_")) {
  throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
}

const client = new OpenAI({ apiKey });

export const PracticeDetailSchema = z.object({
  title: z.string(),
  body: z.string(),
  bullets: z.array(z.string()).default([]),
  coach_prompts: z.array(z.string()).default([]),
  safety_reminders: z.array(z.string()).default([]),
  est_time_min: z.number().int().min(1).max(60)
});

export const HiddenWisdomSchema = z.object({
  insight: z.string(),
  micro_experiment: z.string(),
  reflection: z.string()
});

export const ReflectionSchema = z.object({
  ack: z.string(),
  next_step: z.string()
});

type Scope = "practice_detail" | "hidden_wisdom" | "reflection";

function fingerprint(input: Record<string, any>) {
  const raw = JSON.stringify(input);
  return CryptoJS.SHA256(raw).toString(CryptoJS.enc.Hex);
}

export async function generateWithCache<T>(
  scope: Scope,
  params: Record<string, any>,
  schema: z.ZodSchema<T>,
  prompt: string
): Promise<T> {
  const keyFingerprint = fingerprint({ scope, ...params });
  
  // Check if we have a database connection for caching
  if (prisma) {
    const existing = await prisma.generatedContent.findUnique({
      where: { scope_keyFingerprint: { scope, keyFingerprint } }
    });
    if (existing) return schema.parse(JSON.parse(existing.payload));
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: "You respond with STRICT JSON only. No prose before/after." },
      { role: "user", content: prompt }
    ]
  });

  const text = completion.choices[0].message?.content ?? "{}";
  let parsed: T;
  try {
    parsed = schema.parse(JSON.parse(text));
  } catch (e) {
    // simple repair attempt
    const repair = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Repair this to valid JSON matching the target schema. Output JSON only." },
        { role: "user", content: text }
      ]
    });
    parsed = schema.parse(JSON.parse(repair.choices[0].message?.content ?? "{}"));
  }

  // Cache the result if we have a database connection
  if (prisma) {
    await prisma.generatedContent.create({
      data: {
        scope,
        keyFingerprint,
        moduleId: params.moduleId,
        frameworkId: params.frameworkId,
        level: params.level,
        locale: params.locale ?? "en",
        style: params.style,
        payload: JSON.stringify(parsed)
      }
    });
  }

  return parsed;
} 