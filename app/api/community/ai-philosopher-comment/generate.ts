import { prisma } from '@/lib/db';
import OpenAI from 'openai';
import { PHILOSOPHERS } from '@/lib/philosophers';

interface GenerateAICommentParams {
  imageUrl: string;
  caption?: string;
  tags?: string[];
  location?: string;
  weather?: string;
  mood?: string;
  postId: string;
}

export async function generateAIComment(params: GenerateAICommentParams) {
  try {
    console.log('AI philosopher comment generation started');
    
    if (!prisma) {
      throw new Error('Database not configured');
    }

    const { 
      imageUrl, 
      caption, 
      tags, 
      location, 
      weather, 
      mood, 
      postId
    } = params;

    if (!imageUrl || !postId) {
      throw new Error('imageUrl and postId are required');
    }

    console.log('Processing AI comment for post:', postId);

    // Randomly select a philosopher
    const randomIndex = Math.floor(Math.random() * PHILOSOPHERS.length);
    const philosopher = PHILOSOPHERS[randomIndex];
    console.log('Selected philosopher:', philosopher.name);
    
    // Ensure AI user exists
    let aiUser = await prisma.user.findUnique({ where: { id: 1 } });
    if (!aiUser) {
      console.log('Creating AI user');
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
    console.log('AI user:', aiUser.id);

    // Generate AI philosopher comment using GPT-4o vision
    let aiComment = null;
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('Generating AI comment with OpenAI');
      
      const openai = new OpenAI({ apiKey });

      // Build context from photo metadata
      const context = [
        caption ? `Caption: ${caption}` : null,
        (Array.isArray(tags) && tags.length > 0) ? `Tags: ${tags.join(', ')}` : null,
        location ? `Location: ${location}` : null,
        weather ? `Weather: ${weather}` : null,
        mood ? `Mood: ${mood}` : null,
      ].filter(Boolean).join('\n');

      console.log('Image URL:', imageUrl);
      console.log('Context:', context);

      // Create the system prompt for the philosopher
      const systemPrompt = `You are ${philosopher.name}, ${philosopher.title}. 

${philosopher.systemPrompt}

You are now looking at a nature photo that has been shared in a philosophical community. Your task is to provide an inspirational, philosophical reflection on this image that:

1. Acknowledges what you observe in the image
2. Connects it to your philosophical teachings
3. Offers wisdom or insight that could inspire the community
4. Speaks in your authentic voice and style
5. Is concise but meaningful (2-3 sentences)

IMPORTANT: You MUST analyze the actual image content. Look at the visual elements, colors, composition, and mood of the photograph. Do not give generic responses - your reflection must be specific to what you see in this particular image.

Keep your response natural, philosophical, and inspiring. Avoid being overly formal or academic - speak as if you're genuinely moved by what you see and want to share wisdom with fellow seekers.`;

      // Create the user prompt
      const userPrompt = `Please share your philosophical reflection on this nature photo. Consider the context provided and respond as ${philosopher.name} would.

Context:
${context}

IMPORTANT: Look at the image carefully and describe what you actually see, then connect it to your philosophical wisdom. Be specific about the visual elements you observe.

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

      console.log('AI comment generated:', aiComment);

    } catch (aiError) {
      console.error('AI comment generation failed:', aiError);
      // Only use fallback if there's a critical error, not for vision analysis failures
      if (aiError instanceof Error && aiError.message.includes('vision')) {
        throw new Error('Failed to analyze image with AI vision');
      }
      // Fallback to a generic philosophical response
      aiComment = `As ${philosopher.name}, I find beauty in this moment of nature. It reminds us that wisdom often lies in the simple observation of the world around us, and that every natural scene can teach us something about living well.`;
      console.log('Using fallback comment:', aiComment);
    }

    console.log('Creating community reply in database');
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
    console.log('Reply created:', reply.id);

    // Update the community post with the philosophical comment
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        // Only update aiComment, not aiInsights to avoid duplication
        aiComment: aiComment,
      },
    });
    console.log('Community post updated successfully');

    return {
      success: true,
      reply,
      philosopher: philosopher.name,
      message: `AI philosopher comment created successfully by ${philosopher.name}`
    };

  } catch (error) {
    console.error('Error generating AI philosopher comment:', error);
    throw error;
  }
} 