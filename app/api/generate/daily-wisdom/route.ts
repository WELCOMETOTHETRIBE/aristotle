import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Helper function to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  let userId: number | null = null;
  
  // Try Bearer token first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;
    }
  }
  
  // If no Bearer token, try cookie-based auth directly
  if (!userId) {
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
        }
      }
    } catch (error) {
      console.error('Cookie auth check failed:', error);
    }
  }
  
  return userId;
}

// Framework definitions for AI generation
const frameworkDefinitions = {
  stoic: {
    name: "Stoicism",
    description: "Ancient Greek philosophy emphasizing rational thinking, emotional control, and acceptance of what cannot be changed",
    key_principles: ["virtue", "wisdom", "justice", "courage", "temperance", "acceptance", "rationality"],
    notable_philosophers: ["Marcus Aurelius", "Epictetus", "Seneca", "Zeno of Citium"]
  },
  spartan: {
    name: "Spartan Agōgē",
    description: "Ancient Spartan warrior training system emphasizing discipline, courage, and self-sacrifice",
    key_principles: ["discipline", "courage", "honor", "self-sacrifice", "resilience", "loyalty"],
    notable_philosophers: ["King Leonidas", "Lycurgus", "Spartan Mothers"]
  },
  bushido: {
    name: "Samurai Bushidō",
    description: "Japanese warrior code emphasizing honor, loyalty, and moral rectitude",
    key_principles: ["honor", "loyalty", "rectitude", "courage", "benevolence", "respect", "sincerity"],
    notable_philosophers: ["Yamamoto Tsunetomo", "Inazo Nitobe", "Miyamoto Musashi"]
  },
  monastic: {
    name: "Monastic Rule",
    description: "Christian monastic tradition emphasizing prayer, work, and service to others",
    key_principles: ["prayer", "work", "humility", "obedience", "hospitality", "service", "contemplation"],
    notable_philosophers: ["St. Benedict", "St. Francis", "Thomas Merton"]
  },
  berserker: {
    name: "Viking Berserker",
    description: "Norse warrior tradition emphasizing courage, strength, and fearless battle",
    key_principles: ["courage", "strength", "honor", "loyalty", "fearlessness", "determination"],
    notable_philosophers: ["Viking Sagas", "Norse Mythology", "Ragnar Lothbrok"]
  },
  druid: {
    name: "Celtic Druid",
    description: "Ancient Celtic wisdom tradition emphasizing connection to nature and natural cycles",
    key_principles: ["nature", "wisdom", "balance", "cycles", "harmony", "intuition", "connection"],
    notable_philosophers: ["Celtic Bards", "Druid Priests", "Celtic Mythology"]
  },
  monk: {
    name: "Tibetan Monk",
    description: "Buddhist monastic tradition emphasizing mindfulness, compassion, and enlightenment",
    key_principles: ["mindfulness", "compassion", "wisdom", "meditation", "non-attachment", "enlightenment"],
    notable_philosophers: ["Buddha", "Dalai Lama", "Thich Nhat Hanh", "Pema Chödrön"]
  },
  taoist: {
    name: "Taoist Sage",
    description: "Chinese philosophical tradition emphasizing balance, flow, and harmony with the Tao",
    key_principles: ["balance", "flow", "harmony", "wu-wei", "simplicity", "naturalness"],
    notable_philosophers: ["Lao Tzu", "Chuang Tzu", "Lieh Tzu"]
  },
  epicurean: {
    name: "Epicurean",
    description: "Ancient Greek philosophy emphasizing pleasure, friendship, and simple living",
    key_principles: ["pleasure", "friendship", "simplicity", "moderation", "tranquility", "wisdom"],
    notable_philosophers: ["Epicurus", "Lucretius", "Philodemus"]
  },
  aristotelian: {
    name: "Aristotelian",
    description: "Ancient Greek philosophy emphasizing virtue, reason, and human flourishing (eudaimonia)",
    key_principles: ["virtue", "reason", "eudaimonia", "excellence", "habits", "golden mean"],
    notable_philosophers: ["Aristotle", "Thomas Aquinas", "Alasdair MacIntyre"]
  }
};

export async function POST(request: NextRequest) {
  console.log('📱 Server Debug - Daily Wisdom API called');
  console.log('📱 Server Debug - User Agent:', request.headers.get('user-agent'));
  console.log('📱 Server Debug - Content-Type:', request.headers.get('content-type'));  try {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.log('�� Server Debug - JSON parsing error:', error);
    console.log('📱 Server Debug - Request body (raw):', await request.text());
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }  console.log('📱 Server Debug - Request body:', body);
  console.log('📱 Server Debug - Frameworks received:', body.frameworks);
  console.log('📱 Server Debug - Date received:', body.date);    const { frameworks, date } = body;
  // Validate request body structure
  if (!body || typeof body !== 'object') {
    console.log('📱 Server Debug - Invalid body type:', typeof body);
    return NextResponse.json(
      { error: 'Request body must be an object' },
      { status: 400 }
    );
  }
  
  // Validate frameworks field
  if (body.frameworks && !Array.isArray(body.frameworks)) {
    console.log('📱 Server Debug - Frameworks not an array:', body.frameworks);
    return NextResponse.json(
      { error: 'Frameworks must be an array' },
      { status: 400 }
    );
  }
    // Get user ID from authentication (optional for daily wisdom)
    const userId = await getUserIdFromRequest(request);

    // Use provided frameworks or default to stoic
    const selectedFrameworks = frameworks && frameworks.length > 0 ? frameworks : ['stoic'];
    
    // Select a random framework from the user's preferences
    const randomFramework = selectedFrameworks[Math.floor(Math.random() * selectedFrameworks.length)];
    const framework = frameworkDefinitions[randomFramework as keyof typeof frameworkDefinitions];
    
    if (!framework) {
    console.log('📱 Server Debug - Invalid framework:', randomFramework);
    console.log('📱 Server Debug - Available frameworks:', Object.keys(frameworkDefinitions));      return NextResponse.json(
        { error: 'Invalid framework selected' },
        { status: 400 }
      );
    }

    // Generate AI-powered daily wisdom
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a wise philosophical guide specializing in ${framework.name}. Generate daily wisdom that is:
1. Authentic to the ${framework.name} tradition
2. Practical and applicable to modern life
3. Inspiring but not preachy
4. Rooted in the key principles: ${framework.key_principles.join(', ')}
5. Suitable for someone seeking personal growth

Respond ONLY with valid JSON in this exact format:
{
  "quote": "A profound, memorable quote (1-2 sentences)",
  "author": "A relevant philosopher or source from ${framework.name} tradition",
  "framework": "${framework.name}",
  "reflection": "A thoughtful question to prompt self-reflection (ending with ?)"
}

Do not include any other text, explanations, or formatting.`
          },
          {
            role: 'user',
            content: `Generate today's wisdom based on ${framework.name} philosophy. The wisdom should be relevant to someone seeking personal growth and practical application in their daily life.`
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });

    if (!aiResponse.ok) {
      console.error('OpenAI API error:', await aiResponse.text());
      throw new Error('Failed to generate AI wisdom');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content received from AI');
    }

    // Parse the AI response
    let wisdom;
    try {
      wisdom = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Invalid AI response format');
    }

    // Validate the response structure
    if (!wisdom.quote || !wisdom.author || !wisdom.reflection) {
      throw new Error('Incomplete AI response');
    }

    // Add metadata
    const finalWisdom = {
      ...wisdom,
      framework: framework.name,
      date: date || new Date().toISOString().split('T')[0],
      generated_by: 'ai',
      framework_id: randomFramework
    };

    return NextResponse.json(finalWisdom);

  } catch (error) {
    console.error('Daily wisdom generation error:', error);
    
    // Fallback to a simple default wisdom
    const fallbackWisdom = {
      quote: "The unexamined life is not worth living.",
      author: "Socrates",
      framework: "Stoicism",
      reflection: "What aspect of your life needs deeper examination today?",
      date: new Date().toISOString().split('T')[0],
      generated_by: 'fallback',
      framework_id: 'stoic'
    };

    return NextResponse.json(fallbackWisdom);
  }
}
