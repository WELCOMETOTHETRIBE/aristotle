import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, return fallback resources
    // In the future, this could fetch from a database
    const fallbackResources = [
      {
        id: 'stoic-wisdom-1',
        title: 'Stoic Wisdom for Modern Life',
        thinker: 'Marcus Aurelius',
        era: 'Ancient Rome',
        type: 'Philosophy',
        estMinutes: 15,
        keyIdeas: ['Accept what you cannot change', 'Focus on what you can control'],
        microPractices: ['Morning reflection', 'Evening review'],
        reflections: ['What did I control today?', 'What can I improve tomorrow?'],
        level: 'Beginner'
      },
      {
        id: 'spartan-discipline-1',
        title: 'Spartan Discipline Principles',
        thinker: 'Plutarch',
        era: 'Ancient Greece',
        type: 'Philosophy',
        estMinutes: 10,
        keyIdeas: ['Embrace discomfort', 'Build resilience'],
        microPractices: ['Cold exposure', 'Physical training'],
        reflections: ['What discomfort did I embrace today?'],
        level: 'Intermediate'
      },
      {
        id: 'bushido-honor-1',
        title: 'Bushido: The Way of the Warrior',
        thinker: 'Yamamoto Tsunetomo',
        era: 'Edo Period',
        type: 'Philosophy',
        estMinutes: 20,
        keyIdeas: ['Honor above all', 'Loyalty and duty'],
        microPractices: ['Mindful movement', 'Meditation'],
        reflections: ['How did I honor my commitments today?'],
        level: 'Beginner'
      },
      {
        id: 'yogic-breath-1',
        title: 'Yogic Breathing Techniques',
        thinker: 'Patanjali',
        era: 'Ancient India',
        type: 'Practice',
        estMinutes: 15,
        keyIdeas: ['Breath is life', 'Mind-body connection'],
        microPractices: ['Pranayama', 'Asana practice'],
        reflections: ['How did my breath affect my state of mind?'],
        level: 'Beginner'
      },
      {
        id: 'monastic-rhythm-1',
        title: 'Monastic Daily Rhythm',
        thinker: 'Benedict of Nursia',
        era: 'Medieval',
        type: 'Lifestyle',
        estMinutes: 30,
        keyIdeas: ['Order and balance', 'Work and prayer'],
        microPractices: ['Regular prayer times', 'Manual labor'],
        reflections: ['How did I balance work and rest today?'],
        level: 'Intermediate'
      }
    ];

    return NextResponse.json(fallbackResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
} 