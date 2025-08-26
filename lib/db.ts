import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client with error handling for missing DATABASE_URL
let prisma: PrismaClient;

try {
  prisma = globalThis.__prisma || new PrismaClient();
} catch (error) {
  console.warn('Failed to initialize Prisma client:', error);
  // Create a mock Prisma client for development/deployment without database
  prisma = {
    user: { findFirst: async () => null, create: async () => ({ id: 'demo-user', name: 'Demo User' }) },
    goal: { findMany: async () => [], create: async () => ({}) },
    habit: { findMany: async () => [], create: async () => ({}) },
    task: { findMany: async () => [], create: async () => ({}) },
    fastingSession: { findMany: async () => [], create: async () => ({}) },
    fastingBenefit: { findMany: async () => [], create: async () => ({}) },
    session: { create: async () => ({}) },
    conversationSummary: { findUnique: async () => null, upsert: async () => ({}) },
    userFact: { findMany: async () => [], createMany: async () => ({}) },
  } as any;
}

export { prisma };

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

/**
 * Get or create a user (for demo purposes)
 * In production, this would integrate with proper auth
 */
export async function getOrCreateUser(name: string) {
  try {
    // Try to find existing user first
    let user = await prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      // Create new user with proper JSON string for privacyPrefs
      user = await prisma.user.create({
        data: {
          name,
          voicePreference: 'alloy',
          coachTone: 'gentle',
          timezone: 'UTC',
          privacyPrefs: JSON.stringify({}), // Convert object to JSON string
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    // Return a demo user if database is not available
    return {
      id: 'demo-user',
      name: name,
      voicePreference: 'alloy',
      coachTone: 'gentle',
      timezone: 'UTC',
      privacyPrefs: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Get user state for coach context
 */
export async function getUserState(userId: string) {
  const [activeGoals, dueTasks, habits, conversationSummary] = await Promise.all([
    prisma.goal.findMany({
      where: { userId, status: 'active' },
      select: { id: true, title: true, category: true, status: true },
    }),
    prisma.task.findMany({
      where: { 
        userId, 
        completedAt: null,
        dueAt: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Due within 24 hours
      },
      select: { id: true, title: true, tag: true, priority: true, dueAt: true },
    }),
    prisma.habit.findMany({
      where: { userId },
      select: { id: true, name: true, streakCount: true, lastCheckInAt: true },
    }),
    prisma.conversationSummary.findUnique({
      where: { userId },
      select: { rolling: true },
    }),
  ]);

  return {
    activeGoals,
    dueTasks,
    habits,
    rollingSummary: conversationSummary?.rolling || null,
  };
}

/**
 * Get user facts for semantic retrieval
 */
export async function getUserFacts(userId: string) {
  return await prisma.userFact.findMany({
    where: { userId },
    select: { id: true, content: true, embedding: true, createdAt: true },
  });
}

/**
 * Create a new session
 */
export async function createSession(data: {
  userId: string;
  inputMode: string;
  transcript: string;
  coachReply: string;
  coachJSON: any;
  audioReplyUrl?: string;
}) {
  return await prisma.session.create({
    data: {
      userId: data.userId,
      inputMode: data.inputMode,
      transcript: data.transcript,
      coachReply: data.coachReply,
      coachJSON: JSON.stringify(data.coachJSON),
      audioReplyUrl: data.audioReplyUrl,
      endedAt: new Date(),
    },
  });
}

/**
 * Create tasks from coach plan
 */
export async function createTasksFromPlan(
  userId: string,
  sessionId: string,
  actions: Array<{
    title: string;
    description?: string;
    tag?: string;
    dueAt?: string;
    priority?: string;
  }>
) {
  const tasks = actions.map(action => ({
    userId,
    sessionId,
    title: action.title,
    description: action.description,
    tag: action.tag as any,
    priority: action.priority as any,
    dueAt: action.dueAt ? new Date(action.dueAt) : null,
  }));

  return await prisma.task.createMany({
    data: tasks,
  });
}

/**
 * Update conversation summary
 */
export async function updateConversationSummary(userId: string, rolling: string) {
  return await prisma.conversationSummary.upsert({
    where: { userId },
    update: { rolling },
    create: { userId, rolling },
  });
}

/**
 * Create user facts with embeddings
 */
export async function createUserFacts(
  userId: string,
  facts: Array<{ kind: string; content: string; embedding: number[] }>
) {
  const userFacts = facts.map(fact => ({
    userId,
    kind: fact.kind,
    content: fact.content,
    embedding: JSON.stringify(fact.embedding),
  }));

  return await prisma.userFact.createMany({
    data: userFacts,
  });
} 