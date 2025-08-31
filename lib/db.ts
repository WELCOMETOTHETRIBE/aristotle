import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Only create PrismaClient if DATABASE_URL is available
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, skipping PrismaClient creation');
    return null;
  }
  try {
    return new PrismaClient();
  } catch (error) {
    console.warn('Failed to create PrismaClient:', error);
    return null;
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Get or create a user
 * In production, this would integrate with proper auth
 */
export async function getOrCreateUser(username: string) {
  try {
    // Try to find existing user first
    let user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          username,
          password: 'demo-password', // In production, this would be properly hashed
          displayName: username,
          tz: 'UTC',
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    // Return a mock user with integer ID for development
    return {
      id: 1, // Use integer ID instead of string
      username: username,
      email: null,
      password: 'demo-password',
      displayName: username,
      tz: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Get user state for coach context
 */
export async function getUserState(userId: number) {
  const [activeGoals, dueTasks, habits] = await Promise.all([
    prisma.goal.findMany({
      where: { userId, status: 'active' },
      select: { id: true, title: true, category: true, status: true },
    }),
    prisma.task.findMany({
      where: { 
        userId, 
        completedAt: null,
        dueDate: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Due within 24 hours
      },
      select: { id: true, title: true, tag: true, priority: true, dueDate: true },
    }),
    prisma.habit.findMany({
      where: { userId },
      select: { id: true, name: true, frequency: true },
    }),
  ]);

  return {
    activeGoals,
    dueTasks,
    habits,
    rollingSummary: null, // Removed conversationSummary as it doesn't exist
  };
}

/**
 * Get user facts for semantic retrieval
 */
export async function getUserFacts(userId: number) {
  try {
    // For now, return empty array since userFact model doesn't exist
    return [];
  } catch (error) {
    console.error('Error fetching user facts:', error);
    return [];
  }
}

/**
 * Create tasks from session
 */
export async function createTasksFromSession(sessionId: string, userId: number, tasks: any[]) {
  try {
    const taskData = tasks.map(task => ({
      userId,
      sessionId,
      title: task.title,
      description: task.description,
      tag: task.tag,
      priority: task.priority,
      dueDate: task.dueAt ? new Date(task.dueAt) : null,
    }));

    const createdTasks = await prisma.task.createMany({
      data: taskData,
    });

    return createdTasks;
  } catch (error) {
    console.error('Error creating tasks from session:', error);
    throw error;
  }
}

/**
 * Update conversation summary
 */
export async function updateConversationSummary(userId: number, summary: string) {
  try {
    // For now, just log the summary since conversationSummary model doesn't exist
    console.log(`Conversation summary for user ${userId}:`, summary);
    return { success: true };
  } catch (error) {
    console.error('Error updating conversation summary:', error);
    throw error;
  }
}

/**
 * Get user facts for semantic retrieval
 */
export async function getUserFactsForSemantic(userId: number) {
  try {
    // For now, return empty array since userFact model doesn't exist
    return [];
  } catch (error) {
    console.error('Error fetching user facts for semantic:', error);
    return [];
  }
} 