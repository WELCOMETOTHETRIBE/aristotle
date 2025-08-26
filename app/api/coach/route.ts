import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { CoachRequestSchema } from '@/lib/validators';
import { SYSTEM_PROMPT } from '@/lib/prompts/system';
import { DEVELOPER_PROMPT } from '@/lib/prompts/developer';
import { extractCoachPlan } from '@/lib/json';
import { retrieveUserFacts } from '@/lib/embeddings';
import { filterKnowledgeFacts, updateRollingSummary } from '@/lib/salience';
import { calculateHedonicScore, getHedonicRiskLevel, generateCounterMoves, analyzeHedonicPatterns } from '@/lib/hedonic';
import { 
  getOrCreateUser, 
  getUserState, 
  getUserFacts, 
  createSession, 
  createTasksFromPlan,
  updateConversationSummary,
  createUserFacts
} from '@/lib/db';
import { generateEmbedding } from '@/lib/embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const { text } = CoachRequestSchema.parse(body);

    // For demo purposes, use a default user
    // In production, this would come from authentication
    const user = await getOrCreateUser('Demo User');
    
    // Step 1: Generate embedding for user utterance
    const queryEmbedding = await generateEmbedding(text);
    
    // Step 2: Retrieve relevant user facts
    const userFacts = await getUserFacts(user.id);
    const retrievedFacts = await retrieveUserFacts(text, userFacts, 8);
    
    // Step 3: Load user state
    const userState = await getUserState(user.id);
    
    // Step 4: Analyze for hedonic patterns
    const hedonicAnalysis = analyzeHedonicPatterns(text);
    
    // Step 5: Build context for LLM
    const context = {
      user: {
        name: user.name,
        tone: 'gentle', // Could be dynamic based on user preference
      },
      retrievedFacts: retrievedFacts.map(f => f.content).join('\n'),
      userState: {
        activeGoals: userState.activeGoals.map(g => `${g.title} (${g.category})`).join(', '),
        dueTasks: userState.dueTasks.map(t => `${t.title} (${t.priority})`).join(', '),
        habits: userState.habits.map(h => `${h.name} (${h.streakCount} day streak)`).join(', '),
        rollingSummary: userState.rollingSummary,
      },
      hedonicCheck: hedonicAnalysis,
    };

    // Step 6: Build messages for LLM
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: DEVELOPER_PROMPT },
      { role: 'assistant' as const, content: 'I understand. I will provide a natural reply followed by a valid JSON block.' },
      { 
        role: 'user' as const, 
        content: `Context:
User: ${context.user.name}
Retrieved Facts: ${context.retrievedFacts}
Active Goals: ${context.userState.activeGoals}
Due Tasks: ${context.userState.dueTasks}
Habits: ${context.userState.habits}
Recent Summary: ${context.userState.rollingSummary || 'None'}
Hedonic Risk: ${context.hedonicCheck.riskLevel} (${context.hedonicCheck.score}/100)

User says: ${text}`
      }
    ];

    // Step 7: Call LLM
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Step 8: Extract and validate CoachPlan
    const coachPlan = extractCoachPlan(response);
    
    // Step 9: Create session
    const session = await createSession({
      userId: user.id,
      inputMode: 'text',
      transcript: text,
      coachReply: coachPlan.reply,
      coachJSON: coachPlan,
    });

    // Step 10: Create tasks from plan
    if (coachPlan.actions && coachPlan.actions.length > 0) {
      await createTasksFromPlan(user.id, session.id, coachPlan.actions);
    }

    // Step 11: Update conversation summary
    const newSummary = updateRollingSummary(
      userState.rollingSummary,
      { transcript: text, coachReply: coachPlan.reply }
    );
    await updateConversationSummary(user.id, newSummary);

    // Step 12: Process knowledge facts if any
    if (coachPlan.knowledgeFacts && coachPlan.knowledgeFacts.length > 0) {
      const filteredFacts = await filterKnowledgeFacts(coachPlan.knowledgeFacts, userFacts);
      
      if (filteredFacts.length > 0) {
        const factEmbeddings = await Promise.all(
          filteredFacts.map(async (fact) => ({
            kind: 'insight' as const,
            content: fact,
            embedding: await generateEmbedding(fact),
          }))
        );
        
        await createUserFacts(user.id, factEmbeddings);
      }
    }

    return NextResponse.json({
      reply: coachPlan.reply,
      plan: coachPlan,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Coach API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 