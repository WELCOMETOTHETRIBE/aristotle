import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import OpenAI from 'openai';
import { PHILOSOPHERS } from '@/lib/philosophers';

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { 
      imageUrl, 
      caption, 
      tags, 
      location, 
      weather, 
      mood, 
      postId,
      philosopherId = 'aristotle' // Default to Aristotle
    } = body;

    if (!imageUrl || !postId) {
      return NextResponse.json({ 
        error: 'imageUrl and postId are required' 
      }, { status: 400 });
    }

    // Get the selected philosopher
    const philosopher = PHILOSOPHERS.find(p => p.id === philosopherId) || PHILOSOPHERS[0];
    
    // Ensure AI user exists
    let aiUser = await prisma.user.findUnique({ where: { id: 1 } });
    if (!aiUser) {
      aiUser = await prisma.user.create({
        data: {
          id: 1,
          username: 'ai_philosopher',
          displayName: 'AI Philosopher',
          email: 'ai@aristotle.com',
          password: 'system_user_no_password',
        }
      });
    }

    // Generate AI philosopher comment using GPT-4o vision
    let aiComment = null;
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const openai = new OpenAI({ apiKey });

      // Build context from photo metadata
      const context = [
        caption ? `Caption: ${caption}` : null,
        (Array.isArray(tags) && tags.length > 0) ? `Tags: ${tags.join(', ')}` : null,
        location ? `Location: ${location}` : null,
        weather ? `Weather: ${weather}` : null,
        mood ? `Mood: ${mood}` : null,
      ].filter(Boolean).join('\n');

      // Create the system prompt for the philosopher
      const systemPrompt = `You are ${philosopher.name}, ${philosopher.title}. 

${philosopher.systemPrompt}

You are now looking at a nature photo that has been shared in a philosophical community. Your task is to provide an inspirational, philosophical reflection on this image that:

1. Acknowledges what you observe in the image
2. Connects it to your philosophical teachings
3. Offers wisdom or insight that could inspire the community
4. Speaks in your authentic voice and style
5. Is concise but meaningful (2-3 sentences)

Keep your response natural, philosophical, and inspiring. Avoid being overly formal or academic - speak as if you're genuinely moved by what you see and want to share wisdom with fellow seekers.`;

      // Create the user prompt
      const userPrompt = `Please share your philosophical reflection on this nature photo. Consider the context provided and respond as ${philosopher.name} would.

Context:
${context}

Respond as ${philosopher.name} with wisdom and inspiration.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ] as any,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      });

      aiComment = completion.choices?.[0]?.message?.content || null;

      if (!aiComment) {
        throw new Error('No AI comment generated');
      }

    } catch (aiError) {
      console.error('AI comment generation failed:', aiError);
      // Fallback to a generic philosophical response
      aiComment = `As ${philosopher.name}, I find beauty in this moment of nature. It reminds us that wisdom often lies in the simple observation of the world around us, and that every natural scene can teach us something about living well.`;
    }

    // Create the AI philosopher reply
    const reply = await prisma.communityReply.create({
      data: {
        content: aiComment,
        authorId: aiUser.id,
        postId: postId,
        philosopher: philosopher.name,
        isAI: true,
      },
    });

    // Update the community post with AI insights
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        aiInsights: [aiComment],
        aiComment: aiComment,
      },
    });

    return NextResponse.json({
      success: true,
      reply,
      philosopher: philosopher.name,
      message: `AI philosopher comment created successfully by ${philosopher.name}`
    });

  } catch (error) {
    console.error('Error creating AI philosopher comment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create AI philosopher comment', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 