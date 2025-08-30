import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return comprehensive resources with enhanced data
    const resources = [
      {
        id: 'stoic-wisdom-1',
        title: 'Stoic Wisdom for Modern Life',
        thinker: 'Marcus Aurelius',
        era: 'Ancient Rome',
        type: 'wisdom',
        estMinutes: 15,
        keyIdeas: ['Accept what you cannot change', 'Focus on what you can control', 'Virtue is the only good'],
        microPractices: ['Morning reflection', 'Evening review', 'Negative visualization'],
        reflections: ['What did I control today?', 'What can I improve tomorrow?', 'How did I practice virtue?'],
        level: 'Beginner',
        description: 'Essential Stoic principles for cultivating inner peace and resilience in modern life.',
        tags: ['stoic', 'philosophy', 'resilience', 'inner-peace'],
        externalLinks: [
          {
            title: 'Meditations by Marcus Aurelius',
            url: 'https://en.wikipedia.org/wiki/Meditations',
            type: 'book'
          },
          {
            title: 'Stoicism Guide',
            url: 'https://plato.stanford.edu/entries/stoicism/',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'spartan-discipline-1',
        title: 'Spartan Discipline Principles',
        thinker: 'Plutarch',
        era: 'Ancient Greece',
        type: 'practice',
        estMinutes: 10,
        keyIdeas: ['Embrace discomfort', 'Build resilience', 'Discipline equals freedom'],
        microPractices: ['Cold exposure', 'Physical training', 'Mental toughness exercises'],
        reflections: ['What discomfort did I embrace today?', 'How did I build resilience?'],
        level: 'Intermediate',
        description: 'Ancient Spartan principles for developing mental and physical discipline.',
        tags: ['spartan', 'discipline', 'resilience', 'physical'],
        externalLinks: [
          {
            title: 'Life of Lycurgus',
            url: 'https://en.wikipedia.org/wiki/Lycurgus_of_Sparta',
            type: 'book'
          },
          {
            title: 'Spartan Training Methods',
            url: 'https://en.wikipedia.org/wiki/Agoge',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'bushido-honor-1',
        title: 'Bushido: The Way of the Warrior',
        thinker: 'Yamamoto Tsunetomo',
        era: 'Edo Period',
        type: 'wisdom',
        estMinutes: 20,
        keyIdeas: ['Honor above all', 'Loyalty and duty', 'Courage in adversity'],
        microPractices: ['Mindful movement', 'Meditation', 'Service to others'],
        reflections: ['How did I honor my commitments today?', 'What duty calls to me?'],
        level: 'Beginner',
        description: 'The samurai code of honor and ethical principles for modern warriors.',
        tags: ['bushido', 'samurai', 'honor', 'ethics'],
        externalLinks: [
          {
            title: 'Hagakure',
            url: 'https://en.wikipedia.org/wiki/Hagakure',
            type: 'book'
          },
          {
            title: 'Bushido Principles',
            url: 'https://en.wikipedia.org/wiki/Bushido',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'yogic-breath-1',
        title: 'Yogic Breathing Techniques',
        thinker: 'Patanjali',
        era: 'Ancient India',
        type: 'practice',
        estMinutes: 15,
        keyIdeas: ['Breath is life', 'Mind-body connection', 'Prana flow'],
        microPractices: ['Pranayama', 'Asana practice', 'Meditation'],
        reflections: ['How did my breath affect my state of mind?', 'What did I learn about my body?'],
        level: 'Beginner',
        description: 'Ancient yogic breathing techniques for physical and mental well-being.',
        tags: ['yogic', 'breathing', 'meditation', 'wellness'],
        externalLinks: [
          {
            title: 'Yoga Sutras',
            url: 'https://en.wikipedia.org/wiki/Yoga_Sutras_of_Patanjali',
            type: 'book'
          },
          {
            title: 'Pranayama Guide',
            url: 'https://en.wikipedia.org/wiki/Pranayama',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'monastic-rhythm-1',
        title: 'Monastic Daily Rhythm',
        thinker: 'Benedict of Nursia',
        era: 'Medieval',
        type: 'lifestyle',
        estMinutes: 30,
        keyIdeas: ['Order and balance', 'Work and prayer', 'Community service'],
        microPractices: ['Regular prayer times', 'Manual labor', 'Silent reflection'],
        reflections: ['How did I balance work and rest today?', 'What did I contribute to my community?'],
        level: 'Intermediate',
        description: 'Benedictine principles for creating a balanced and meaningful daily rhythm.',
        tags: ['monastic', 'rhythm', 'balance', 'community'],
        externalLinks: [
          {
            title: 'Rule of Saint Benedict',
            url: 'https://en.wikipedia.org/wiki/Rule_of_Saint_Benedict',
            type: 'book'
          },
          {
            title: 'Benedictine Spirituality',
            url: 'https://en.wikipedia.org/wiki/Benedictine_Spirituality',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'confucian-harmony-1',
        title: 'Confucian Harmony and Relationships',
        thinker: 'Confucius',
        era: 'Ancient China',
        type: 'wisdom',
        estMinutes: 25,
        keyIdeas: ['Ren (Humaneness)', 'Li (Propriety)', 'Xiao (Filial Piety)'],
        microPractices: ['Respect for elders', 'Proper conduct', 'Family harmony'],
        reflections: ['How did I show respect today?', 'What relationships need attention?'],
        level: 'Beginner',
        description: 'Confucian principles for creating harmony in relationships and society.',
        tags: ['confucian', 'harmony', 'relationships', 'ethics'],
        externalLinks: [
          {
            title: 'Analects of Confucius',
            url: 'https://en.wikipedia.org/wiki/Analects',
            type: 'book'
          },
          {
            title: 'Confucian Philosophy',
            url: 'https://plato.stanford.edu/entries/confucius/',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'daoist-flow-1',
        title: 'Daoist Flow and Naturalness',
        thinker: 'Laozi',
        era: 'Ancient China',
        type: 'practice',
        estMinutes: 20,
        keyIdeas: ['Wu Wei (Non-action)', 'Natural flow', 'Simplicity'],
        microPractices: ['Flow with nature', 'Simplify life', 'Let go of control'],
        reflections: ['Where did I resist the natural flow?', 'What can I simplify?'],
        level: 'Intermediate',
        description: 'Daoist principles for living in harmony with natural flow and simplicity.',
        tags: ['daoist', 'flow', 'simplicity', 'naturalness'],
        externalLinks: [
          {
            title: 'Tao Te Ching',
            url: 'https://en.wikipedia.org/wiki/Tao_Te_Ching',
            type: 'book'
          },
          {
            title: 'Daoist Philosophy',
            url: 'https://plato.stanford.edu/entries/daoism/',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      },
      {
        id: 'zen-mindfulness-1',
        title: 'Zen Mindfulness and Presence',
        thinker: 'Bodhidharma',
        era: 'Ancient India/China',
        type: 'practice',
        estMinutes: 15,
        keyIdeas: ['Present moment awareness', 'Non-attachment', 'Direct experience'],
        microPractices: ['Mindful walking', 'Tea ceremony', 'Zazen meditation'],
        reflections: ['How present was I today?', 'What did I notice in the moment?'],
        level: 'Beginner',
        description: 'Zen practices for cultivating mindfulness and present-moment awareness.',
        tags: ['zen', 'mindfulness', 'meditation', 'presence'],
        externalLinks: [
          {
            title: 'Zen Mind, Beginner\'s Mind',
            url: 'https://en.wikipedia.org/wiki/Zen_Mind,_Beginner%27s_Mind',
            type: 'book'
          },
          {
            title: 'Zen Buddhism',
            url: 'https://en.wikipedia.org/wiki/Zen',
            type: 'article'
          }
        ],
        completionRate: 0,
        userRating: 0
      }
    ];

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
} 