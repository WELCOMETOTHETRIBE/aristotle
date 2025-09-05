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

// Framework-specific wisdom database
const frameworkWisdom = {
  stoic: [
    {
      quote: "The unexamined life is not worth living.",
      author: "Socrates",
      reflection: "What aspect of your life needs deeper examination today?"
    },
    {
      quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      reflection: "What external event can you reframe with a more empowering perspective?"
    },
    {
      quote: "The obstacle is the way.",
      author: "Epictetus",
      reflection: "What current challenge is actually an opportunity for growth?"
    },
    {
      quote: "Waste no more time arguing what a good man should be. Be one.",
      author: "Marcus Aurelius",
      reflection: "What action can you take today to embody your values?"
    }
  ],
  spartan: [
    {
      quote: "With your shield or on it.",
      author: "Spartan Mother",
      reflection: "What commitment are you willing to see through to the end?"
    },
    {
      quote: "Spartans, eat well, for tonight we dine in hell.",
      author: "King Leonidas",
      reflection: "What fear are you ready to face with courage today?"
    },
    {
      quote: "The Spartans do not ask how many are the enemy, but where are they.",
      author: "Spartan Saying",
      reflection: "What problem are you avoiding that you should confront directly?"
    }
  ],
  bushido: [
    {
      quote: "The way of the warrior is the way of death.",
      author: "Yamamoto Tsunetomo",
      reflection: "What are you willing to sacrifice for your principles?"
    },
    {
      quote: "A warrior is worthless unless he rises above others and stands strong in the midst of a storm.",
      author: "Yamamoto Tsunetomo",
      reflection: "How can you demonstrate strength in your current challenges?"
    },
    {
      quote: "Rectitude is one's power to decide upon a course of conduct in accordance with reason.",
      author: "Inazo Nitobe",
      reflection: "What decision requires you to choose principle over convenience?"
    }
  ],
  monastic: [
    {
      quote: "Pray and work.",
      author: "St. Benedict",
      reflection: "How can you balance contemplation with action today?"
    },
    {
      quote: "The first step of humility is unhesitating obedience.",
      author: "St. Benedict",
      reflection: "What guidance are you resisting that could serve your growth?"
    },
    {
      quote: "Let all guests who arrive be received like Christ.",
      author: "St. Benedict",
      reflection: "How can you show greater hospitality to others today?"
    }
  ],
  berserker: [
    {
      quote: "Fear not death, for the hour of your doom is set and none may escape it.",
      author: "Viking Proverb",
      reflection: "What would you do today if you had no fear of failure?"
    },
    {
      quote: "Better to fight and fall than to live without hope.",
      author: "Viking Saying",
      reflection: "What battle is worth fighting even if you might lose?"
    }
  ],
  druid: [
    {
      quote: "The oak and the reed had a contest of strength.",
      author: "Celtic Proverb",
      reflection: "When is flexibility more powerful than rigid strength?"
    },
    {
      quote: "Listen to the wind, it talks. Listen to the silence, it speaks. Listen to your heart, it knows.",
      author: "Celtic Wisdom",
      reflection: "What is your inner wisdom trying to tell you today?"
    }
  ],
  monk: [
    {
      quote: "The mind is everything. What you think you become.",
      author: "Buddha",
      reflection: "What thoughts are you cultivating that serve your highest good?"
    },
    {
      quote: "Peace comes from within. Do not seek it without.",
      author: "Buddha",
      reflection: "What external source of peace can you find within yourself?"
    }
  ],
  taoist: [
    {
      quote: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      reflection: "What small step can you take today toward your larger goal?"
    },
    {
      quote: "When I let go of what I am, I become what I might be.",
      author: "Lao Tzu",
      reflection: "What identity or belief are you holding onto that limits your growth?"
    }
  ],
  epicurean: [
    {
      quote: "Pleasure is the beginning and the end of living happily.",
      author: "Epicurus",
      reflection: "What simple pleasure can you savor today?"
    },
    {
      quote: "The art of living well and the art of dying well are one.",
      author: "Epicurus",
      reflection: "How can you live more fully in this present moment?"
    }
  ],
  aristotelian: [
    {
      quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle",
      reflection: "What habit can you strengthen today that leads to excellence?"
    },
    {
      quote: "The whole is greater than the sum of its parts.",
      author: "Aristotle",
      reflection: "How can you see the bigger picture in your current situation?"
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frameworks, date } = body;

    // Get user ID from authentication (optional for daily wisdom)
    const userId = await getUserIdFromRequest(request);

    // Use provided frameworks or default to stoic
    const selectedFrameworks = frameworks && frameworks.length > 0 ? frameworks : ['stoic'];
    
    // Select a random framework from the user's preferences
    const randomFramework = selectedFrameworks[Math.floor(Math.random() * selectedFrameworks.length)];
    
    // Get wisdom from the selected framework
    const frameworkQuotes = frameworkWisdom[randomFramework as keyof typeof frameworkWisdom] || frameworkWisdom.stoic;
    const randomQuote = frameworkQuotes[Math.floor(Math.random() * frameworkQuotes.length)];
    
    // Generate wisdom based on selected framework
    const wisdom = {
      quote: randomQuote.quote,
      author: randomQuote.author,
      framework: randomFramework.charAt(0).toUpperCase() + randomFramework.slice(1),
      reflection: randomQuote.reflection,
      date: date || new Date().toISOString().split('T')[0]
    };

    return NextResponse.json(wisdom);

  } catch (error) {
    console.error('Daily wisdom generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily wisdom' },
      { status: 500 }
    );
  }
}
