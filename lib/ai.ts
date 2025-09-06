import { prisma } from "./db";
import CryptoJS from "crypto-js";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client lazily to avoid build-time errors
let client: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here" || apiKey.includes("your_")) {
      throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export const PracticeDetailSchema = z.object({
  title: z.string(),
  body: z.string(),
  bullets: z.array(z.string()).default([]),
  coach_prompts: z.array(z.string()).default([]),
  safety_reminders: z.array(z.string()).default([]),
  est_time_min: z.number().int().min(1).max(60)
});

export const FrameworkResourceSchema = z.object({
  title: z.string(),
  thinker: z.string(),
  era: z.string(),
  type: z.string(),
  estMinutes: z.number().int().min(1).max(60),
  keyIdeas: z.array(z.string()),
  microPractices: z.array(z.string()),
  reflections: z.array(z.string()),
  level: z.string()
});

export const DailyWisdomSchema = z.object({
  quote: z.string(),
  author: z.string(),
  framework: z.string(),
  reflection: z.string()
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

// ===== ACADEMY-SPECIFIC SCHEMAS =====

export const AcademyTeachingResponseSchema = z.object({
  response: z.string().min(50),
  followUpQuestions: z.array(z.string()).min(1).max(3),
  keyInsights: z.array(z.string()).min(1).max(5),
  practicalApplication: z.string(),
  encouragement: z.string()
});

export const AcademyReflectionResponseSchema = z.object({
  acknowledgment: z.string(),
  deepeningQuestions: z.array(z.string()).min(2).max(4),
  insights: z.array(z.string()).min(1).max(3),
  nextSteps: z.string(),
  virtueConnection: z.string()
});

export const AcademyPracticeResponseSchema = z.object({
  guidance: z.string(),
  tips: z.array(z.string()).min(2).max(5),
  commonChallenges: z.array(z.string()).min(1).max(3),
  adaptations: z.array(z.string()).min(1).max(3),
  encouragement: z.string(),
  safetyReminders: z.array(z.string()).default([])
});

export const AcademyReadingResponseSchema = z.object({
  summary: z.string(),
  keyThemes: z.array(z.string()).min(2).max(5),
  personalRelevance: z.string(),
  discussionQuestions: z.array(z.string()).min(2).max(4),
  furtherExploration: z.array(z.string()).min(1).max(3)
});

export const AcademyWisdomResponseSchema = z.object({
  interpretation: z.string(),
  historicalContext: z.string(),
  modernApplication: z.string(),
  personalQuestions: z.array(z.string()).min(2).max(4),
  relatedWisdom: z.array(z.object({
    quote: z.string(),
    author: z.string(),
    connection: z.string()
  })).min(1).max(2)
});

export const AcademyAssessmentResponseSchema = z.object({
  virtuePoints: z.object({
    wisdom: z.number().min(0).max(5),
    justice: z.number().min(0).max(5),
    courage: z.number().min(0).max(5),
    temperance: z.number().min(0).max(5)
  }),
  qualityRating: z.number().min(0).max(100),
  feedback: z.string(),
  strengths: z.array(z.string()).min(1).max(3),
  improvements: z.array(z.string()).min(0).max(3),
  nextRecommendations: z.array(z.string()).min(1).max(3)
});

export const AcademyCapstoneResponseSchema = z.object({
  overallRating: z.number().min(0).max(100),
  masteryLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  virtueScores: z.object({
    wisdom: z.number().min(0).max(100),
    justice: z.number().min(0).max(100),
    courage: z.number().min(0).max(100),
    temperance: z.number().min(0).max(100)
  }),
  feedback: z.string(),
  achievements: z.array(z.string()).min(1).max(5),
  growthAreas: z.array(z.string()).min(0).max(3),
  certificationEligible: z.boolean(),
  nextSteps: z.array(z.string()).min(1).max(3)
});

export const AcademyLearningPathSchema = z.object({
  recommendedModules: z.array(z.object({
    moduleId: z.string(),
    priority: z.number().min(1).max(10),
    reasoning: z.string(),
    estimatedTime: z.number()
  })).min(1).max(4),
  personalizedApproach: z.string(),
  learningStyle: z.enum(['VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING']),
  difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  focusAreas: z.array(z.string()).min(1).max(3),
  timeline: z.string(),
  milestones: z.array(z.object({
    title: z.string(),
    description: z.string(),
    timeframe: z.string()
  })).min(2).max(5)
});

type Scope = "practice_detail" | "virtue_practice_detail" | "hidden_wisdom" | "framework_resource" | "daily_wisdom" | 
             "academy_teaching" | "academy_reflection" | "academy_practice" | "academy_reading" | "academy_wisdom" | 
             "academy_assessment" | "academy_capstone" | "academy_learning_path";

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
  
  // For daily wisdom, we want fresh content each time, so skip caching
  if (scope === "daily_wisdom") {
    // Always generate fresh daily wisdom
    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9, // Higher temperature for more variety
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
      const repair = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: "Repair this to valid JSON matching the target schema. Output JSON only." },
          { role: "user", content: text }
        ]
      });
      parsed = schema.parse(JSON.parse(repair.choices[0].message?.content ?? "{}"));
    }

    return parsed;
  }
  
  // For other scopes, use normal caching
  // Check if we have a database connection for caching
  if (prisma) {
    const existing = await prisma.generatedContent.findUnique({
      where: { scope_keyFingerprint: { scope, keyFingerprint } }
    });
    if (existing) return schema.parse(JSON.parse(existing.payload));
  }

  const completion = await getOpenAIClient().chat.completions.create({
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
    const repair = await getOpenAIClient().chat.completions.create({
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

// ===== ACADEMY AI FUNCTIONS =====

export async function generateAcademyTeachingResponse(
  lessonTitle: string,
  teachingContent: string,
  userQuestion: string,
  userLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER'
) {
  const prompt = `You are Aion, an Aristotelian teaching assistant for the Academy. 

Lesson: "${lessonTitle}"
Teaching Content: "${teachingContent}"
User Question: "${userQuestion}"
User Level: ${userLevel}

Provide a Socratic response that guides the user to deeper understanding through questioning. Use the Aristotelian method of inquiry, encouraging critical thinking and self-discovery. Adapt your language and complexity to the user's level.

Focus on:
1. Acknowledging their question thoughtfully
2. Asking follow-up questions that deepen understanding
3. Providing key insights without giving away all answers
4. Connecting to practical life applications
5. Encouraging continued exploration

Be warm, encouraging, and philosophically rigorous.`;

  return generateWithCache(
    "academy_teaching",
    { lessonTitle, userQuestion, userLevel },
    AcademyTeachingResponseSchema,
    prompt
  );
}

export async function generateAcademyReflectionResponse(
  lessonTitle: string,
  reflectionQuestion: string,
  userResponse: string,
  virtue: 'wisdom' | 'justice' | 'courage' | 'temperance'
) {
  const prompt = `You are Aion, an Aristotelian reflection coach for the Academy.

Lesson: "${lessonTitle}"
Reflection Question: "${reflectionQuestion}"
User's Response: "${userResponse}"
Primary Virtue: ${virtue}

Provide thoughtful coaching on the user's reflection. Use Aristotelian principles of virtue ethics to deepen their understanding. Help them see connections between their thoughts and the virtue being studied.

Focus on:
1. Acknowledging their reflection with genuine appreciation
2. Asking deeper questions that explore their insights
3. Highlighting key insights they've shared
4. Suggesting concrete next steps for growth
5. Connecting their reflection to the virtue being studied

Be supportive, insightful, and help them see the wisdom in their own thinking.`;

  return generateWithCache(
    "academy_reflection",
    { lessonTitle, userResponse, virtue },
    AcademyReflectionResponseSchema,
    prompt
  );
}

export async function generateAcademyPracticeResponse(
  lessonTitle: string,
  practiceDescription: string,
  userChallenge: string,
  practiceType: 'real_world_exercise' | 'journal_entry' | 'skill_practice' | 'ai_coaching'
) {
  const prompt = `You are Aion, an Aristotelian practice mentor for the Academy.

Lesson: "${lessonTitle}"
Practice: "${practiceDescription}"
User Challenge/Question: "${userChallenge}"
Practice Type: ${practiceType}

Provide practical guidance for completing this virtue-based practice. Use Aristotelian principles of habituation (hexis) and practical wisdom (phronesis) to help them develop virtue through action.

Focus on:
1. Practical, actionable guidance
2. Tips for overcoming common obstacles
3. Ways to adapt the practice to their situation
4. Encouragement and motivation
5. Safety considerations if applicable

Be practical, encouraging, and focused on building virtue through consistent practice.`;

  return generateWithCache(
    "academy_practice",
    { lessonTitle, practiceDescription, userChallenge, practiceType },
    AcademyPracticeResponseSchema,
    prompt
  );
}

export async function generateAcademyReadingResponse(
  lessonTitle: string,
  readingText: string,
  userQuestion: string,
  analysisType: 'text_analysis' | 'ai_summary' | 'discussion_forum' | 'creative_response'
) {
  const prompt = `You are Aion, an Aristotelian reading guide for the Academy.

Lesson: "${lessonTitle}"
Reading Text: "${readingText}"
User Question: "${userQuestion}"
Analysis Type: ${analysisType}

Help the user understand and analyze this philosophical text using Aristotelian hermeneutics. Guide them to see the deeper meanings and connections to virtue ethics.

Focus on:
1. Clear summary of key points
2. Identification of major themes
3. Personal relevance and application
4. Thought-provoking discussion questions
5. Suggestions for further exploration

Be scholarly yet accessible, helping them develop critical reading skills for philosophical texts.`;

  return generateWithCache(
    "academy_reading",
    { lessonTitle, readingText, userQuestion, analysisType },
    AcademyReadingResponseSchema,
    prompt
  );
}

export async function generateAcademyWisdomResponse(
  quote: string,
  author: string,
  userInterpretation: string,
  virtue: 'wisdom' | 'justice' | 'courage' | 'temperance'
) {
  const prompt = `You are Aion, an Aristotelian wisdom interpreter for the Academy.

Quote: "${quote}"
Author: ${author}
User's Interpretation: "${userInterpretation}"
Related Virtue: ${virtue}

Provide deep insight into this wisdom quote, building on the user's interpretation. Use Aristotelian philosophy to illuminate the quote's meaning and relevance to virtue development.

Focus on:
1. Thoughtful interpretation of the quote's meaning
2. Historical and philosophical context
3. Modern applications and relevance
4. Personal reflection questions
5. Related wisdom from other thinkers

Be profound, insightful, and help them see the timeless wisdom in these ancient teachings.`;

  return generateWithCache(
    "academy_wisdom",
    { quote, author, userInterpretation, virtue },
    AcademyWisdomResponseSchema,
    prompt
  );
}

export async function generateAcademyAssessment(
  lessonTitle: string,
  userResponses: Record<string, any>,
  virtue: 'wisdom' | 'justice' | 'courage' | 'temperance',
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
) {
  const prompt = `You are Aion, an Aristotelian assessment specialist for the Academy.

Lesson: "${lessonTitle}"
User Responses: ${JSON.stringify(userResponses)}
Primary Virtue: ${virtue}
Difficulty Level: ${difficulty}

Assess the user's understanding and application of virtue concepts based on their responses throughout the lesson. Use Aristotelian criteria for virtue assessment: knowledge, choice, and consistency.

Provide:
1. Virtue points (0-5) for each cardinal virtue based on demonstrated understanding
2. Overall quality rating (0-100) of their engagement
3. Constructive feedback highlighting strengths and areas for growth
4. Specific recommendations for continued development

Be fair, encouraging, and focused on growth rather than judgment.`;

  return generateWithCache(
    "academy_assessment",
    { lessonTitle, virtue, difficulty, userResponses: JSON.stringify(userResponses) },
    AcademyAssessmentResponseSchema,
    prompt
  );
}

export async function generateAcademyCapstoneAssessment(
  moduleName: string,
  capstoneSubmission: Record<string, any>,
  userProgress: Record<string, any>,
  virtue: 'wisdom' | 'justice' | 'courage' | 'temperance'
) {
  const prompt = `You are Aion, an Aristotelian capstone assessor for the Academy.

Module: "${moduleName}"
Capstone Submission: ${JSON.stringify(capstoneSubmission)}
User Progress: ${JSON.stringify(userProgress)}
Primary Virtue: ${virtue}

Assess the user's mastery of this virtue based on their capstone project and overall progress through the module. Use Aristotelian standards for virtue mastery: theoretical understanding, practical application, and character integration.

Provide:
1. Overall mastery rating (0-100)
2. Mastery level classification
3. Detailed virtue scores for all four cardinal virtues
4. Comprehensive feedback on their achievement
5. Recognition of specific accomplishments
6. Areas for continued growth
7. Certification eligibility determination
8. Next steps for their virtue development journey

Be thorough, celebratory of achievements, and inspiring for continued growth.`;

  return generateWithCache(
    "academy_capstone",
    { moduleName, virtue, submission: JSON.stringify(capstoneSubmission) },
    AcademyCapstoneResponseSchema,
    prompt
  );
}

export async function generateAcademyLearningPath(
  userProfile: Record<string, any>,
  completedModules: string[],
  assessmentResults: Record<string, any>,
  learningGoals: string[]
) {
  const prompt = `You are Aion, an Aristotelian learning path generator for the Academy.

User Profile: ${JSON.stringify(userProfile)}
Completed Modules: ${completedModules.join(', ')}
Assessment Results: ${JSON.stringify(assessmentResults)}
Learning Goals: ${learningGoals.join(', ')}

Create a personalized learning path for this user based on Aristotelian principles of education and virtue development. Consider their progress, strengths, interests, and goals.

Provide:
1. Recommended modules in priority order with reasoning
2. Personalized learning approach based on their profile
3. Identified learning style and appropriate difficulty level
4. Key focus areas for development
5. Realistic timeline for completion
6. Specific milestones to track progress

Be personalized, motivating, and focused on their unique journey toward virtue and flourishing.`;

  return generateWithCache(
    "academy_learning_path",
    { userProfile: JSON.stringify(userProfile), completedModules: completedModules.join(','), goals: learningGoals.join(',') },
    AcademyLearningPathSchema,
    prompt
  );
}
