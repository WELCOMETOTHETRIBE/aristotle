import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllFrameworks, FrameworkConfig } from '@/lib/frameworks.config';

const PersonalityAnalysisRequestSchema = z.object({
  responses: z.record(z.string()),
  voiceTranscripts: z.array(z.string()).optional(),
});

interface PersonalityInsights {
  primaryVirtue: 'WISDOM' | 'COURAGE' | 'JUSTICE' | 'TEMPERANCE';
  secondaryVirtue?: 'WISDOM' | 'COURAGE' | 'JUSTICE' | 'TEMPERANCE';
  learningStyle: 'structured' | 'intuitive' | 'experiential' | 'contemplative';
  motivationType: 'achievement' | 'connection' | 'mastery' | 'contribution';
  challengeResponse: 'confront' | 'adapt' | 'analyze' | 'accept';
  energyLevel: 'high' | 'moderate' | 'low';
  socialPreference: 'individual' | 'community' | 'balanced';
  timeAvailability: 'minimal' | 'moderate' | 'extensive';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  stressTriggers: string[];
  strengths: string[];
  weaknesses: string[];
  aspirations: string[];
  knowledgeGaps: string[];
  personalityTraits: string[];
  growthAreas: string[];
  recommendedPractices: string[];
  frameworkMatch: {
    framework: FrameworkConfig;
    score: number;
    reasoning: string[];
  };
  alternativeFrameworks: Array<{
    framework: FrameworkConfig;
    score: number;
    reasoning: string[];
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { responses, voiceTranscripts } = PersonalityAnalysisRequestSchema.parse(body);

    // Analyze personality from responses
    const insights = analyzePersonality(responses, voiceTranscripts || []);
    
    // Find best framework match
    const frameworkMatch = findBestFrameworkMatch(insights);
    
    // Find alternative frameworks
    const alternativeFrameworks = findAlternativeFrameworks(insights, frameworkMatch.framework.slug);

    return NextResponse.json({
      success: true,
      insights: {
        ...insights,
        frameworkMatch,
        alternativeFrameworks,
      },
    });

  } catch (error) {
    console.error('Personality analysis error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze personality' },
      { status: 500 }
    );
  }
}

function analyzePersonality(responses: Record<string, string>, voiceTranscripts: string[]): PersonalityInsights {
  const insights: PersonalityInsights = {
    primaryVirtue: 'WISDOM',
    learningStyle: 'structured',
    motivationType: 'achievement',
    challengeResponse: 'confront',
    energyLevel: 'moderate',
    socialPreference: 'individual',
    timeAvailability: 'moderate',
    experienceLevel: 'beginner',
    stressTriggers: [],
    strengths: [],
    weaknesses: [],
    aspirations: [],
    knowledgeGaps: [],
    personalityTraits: [],
    growthAreas: [],
    recommendedPractices: [],
    frameworkMatch: { framework: getAllFrameworks()[0], score: 0, reasoning: [] },
    alternativeFrameworks: [],
  };

  // Analyze structured responses
  if (responses.learning_style) {
    const learningMap: Record<string, 'structured' | 'intuitive' | 'experiential' | 'contemplative'> = {
      'Through structured practice and discipline': 'structured',
      'By following my intuition and inner wisdom': 'intuitive',
      'Through direct experience and experimentation': 'experiential',
      'Through deep reflection and contemplation': 'contemplative'
    };
    insights.learningStyle = learningMap[responses.learning_style] || 'structured';
  }

  if (responses.motivation) {
    const motivationMap: Record<string, 'achievement' | 'connection' | 'mastery' | 'contribution'> = {
      'Achieving goals and building skills': 'achievement',
      'Connecting with others and building community': 'connection',
      'Mastering knowledge and understanding': 'mastery',
      'Contributing to something larger than myself': 'contribution'
    };
    insights.motivationType = motivationMap[responses.motivation] || 'achievement';
  }

  if (responses.challenges) {
    const challengeMap: Record<string, 'confront' | 'adapt' | 'analyze' | 'accept'> = {
      'I confront them directly and push through': 'confront',
      'I adapt and find creative solutions': 'adapt',
      'I analyze and understand the problem first': 'analyze',
      'I accept what I can\'t change and work with what I can': 'accept'
    };
    insights.challengeResponse = challengeMap[responses.challenges] || 'confront';
  }

  if (responses.energy) {
    const energyMap: Record<string, 'high' | 'moderate' | 'low'> = {
      'High energy - I thrive on intensity and action': 'high',
      'Moderate energy - I prefer steady, balanced activity': 'moderate',
      'Lower energy - I value calm and thoughtful approaches': 'low'
    };
    insights.energyLevel = energyMap[responses.energy] || 'moderate';
  }

  if (responses.social) {
    const socialMap: Record<string, 'individual' | 'community' | 'balanced'> = {
      'Individually - I prefer personal practice and reflection': 'individual',
      'In community - I thrive with others and shared experiences': 'community',
      'Balanced - I value both personal practice and community connection': 'balanced'
    };
    insights.socialPreference = socialMap[responses.social] || 'individual';
  }

  if (responses.time) {
    const timeMap: Record<string, 'minimal' | 'moderate' | 'extensive'> = {
      'Minimal (5-15 minutes)': 'minimal',
      'Moderate (15-45 minutes)': 'moderate',
      'Extensive (45+ minutes)': 'extensive'
    };
    insights.timeAvailability = timeMap[responses.time] || 'moderate';
  }

  if (responses.experience) {
    const experienceMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      'Beginner - I\'m just starting this journey': 'beginner',
      'Intermediate - I have some experience and want to deepen': 'intermediate',
      'Advanced - I\'m experienced and looking for new challenges': 'advanced'
    };
    insights.experienceLevel = experienceMap[responses.experience] || 'beginner';
  }

  // Extract text-based responses
  if (responses.strengths) insights.strengths = [responses.strengths];
  if (responses.weaknesses) insights.weaknesses = [responses.weaknesses];
  if (responses.stress) insights.stressTriggers = [responses.stress];
  if (responses.aspirations) insights.aspirations = [responses.aspirations];

  // Determine primary virtue
  if (insights.challengeResponse === 'confront' && insights.energyLevel === 'high') {
    insights.primaryVirtue = 'COURAGE';
  } else if (insights.motivationType === 'connection' || insights.socialPreference === 'community') {
    insights.primaryVirtue = 'JUSTICE';
  } else if (insights.learningStyle === 'contemplative' || insights.motivationType === 'mastery') {
    insights.primaryVirtue = 'WISDOM';
  } else {
    insights.primaryVirtue = 'TEMPERANCE';
  }

  // Analyze personality traits from voice transcripts
  if (voiceTranscripts.length > 0) {
    const allText = voiceTranscripts.join(' ').toLowerCase();
    
    // Simple keyword analysis for personality traits
    if (allText.includes('confident') || allText.includes('strong') || allText.includes('powerful')) {
      insights.personalityTraits.push('confident');
    }
    if (allText.includes('calm') || allText.includes('peaceful') || allText.includes('gentle')) {
      insights.personalityTraits.push('calm');
    }
    if (allText.includes('curious') || allText.includes('learn') || allText.includes('understand')) {
      insights.personalityTraits.push('curious');
    }
    if (allText.includes('help') || allText.includes('serve') || allText.includes('community')) {
      insights.personalityTraits.push('service-oriented');
    }
  }

  // Identify growth areas based on weaknesses and stress triggers
  if (insights.weaknesses.length > 0) {
    insights.growthAreas = insights.weaknesses.map(weakness => 
      `Develop ${weakness.toLowerCase()}`
    );
  }

  // Recommend practices based on profile
  if (insights.primaryVirtue === 'COURAGE') {
    insights.recommendedPractices.push('Cold exposure training', 'Physical challenges', 'Boundary setting');
  } else if (insights.primaryVirtue === 'WISDOM') {
    insights.recommendedPractices.push('Contemplative reading', 'Philosophical reflection', 'Knowledge synthesis');
  } else if (insights.primaryVirtue === 'JUSTICE') {
    insights.recommendedPractices.push('Community service', 'Conflict resolution', 'Fair decision making');
  } else {
    insights.recommendedPractices.push('Mindful breathing', 'Emotional regulation', 'Balance practices');
  }

  return insights;
}

function findBestFrameworkMatch(insights: PersonalityInsights) {
  const frameworks = getAllFrameworks();
  
  const scores = frameworks.map(framework => {
    let score = 0;
    const reasoning: string[] = [];
    
    // Primary virtue alignment
    if (framework.virtuePrimary === insights.primaryVirtue) {
      score += 10;
      reasoning.push(`Strong alignment with your primary virtue: ${insights.primaryVirtue.toLowerCase()}`);
    }
    if (framework.virtueSecondary === insights.primaryVirtue) {
      score += 5;
      reasoning.push(`Good secondary alignment with ${insights.primaryVirtue.toLowerCase()}`);
    }
    
    // Energy level matching
    if (insights.energyLevel === 'high' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) {
      score += 8;
      reasoning.push('Matches your high energy level');
    }
    if (insights.energyLevel === 'moderate' && ['bushido', 'stoic', 'yogic'].includes(framework.slug)) {
      score += 8;
      reasoning.push('Suits your moderate energy level');
    }
    if (insights.energyLevel === 'low' && ['monastic', 'sufi', 'indigenous'].includes(framework.slug)) {
      score += 8;
      reasoning.push('Fits your calm, thoughtful approach');
    }
    
    // Social preference matching
    if (insights.socialPreference === 'community' && ['ubuntu', 'indigenous'].includes(framework.slug)) {
      score += 7;
      reasoning.push('Emphasizes community and connection');
    }
    if (insights.socialPreference === 'individual' && ['stoic', 'monastic', 'sufi'].includes(framework.slug)) {
      score += 7;
      reasoning.push('Focuses on individual practice and reflection');
    }
    if (insights.socialPreference === 'balanced' && ['bushido', 'yogic'].includes(framework.slug)) {
      score += 7;
      reasoning.push('Balances individual and community practice');
    }
    
    // Learning style matching
    if (insights.learningStyle === 'structured' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) {
      score += 6;
      reasoning.push('Provides structured, disciplined approach');
    }
    if (insights.learningStyle === 'intuitive' && ['yogic', 'sufi'].includes(framework.slug)) {
      score += 6;
      reasoning.push('Emphasizes intuitive and spiritual learning');
    }
    if (insights.learningStyle === 'experiential' && ['indigenous', 'martial'].includes(framework.slug)) {
      score += 6;
      reasoning.push('Learning through direct experience and practice');
    }
    if (insights.learningStyle === 'contemplative' && ['stoic', 'monastic'].includes(framework.slug)) {
      score += 6;
      reasoning.push('Deep reflection and philosophical contemplation');
    }
    
    // Challenge response matching
    if (insights.challengeResponse === 'confront' && ['spartan', 'martial'].includes(framework.slug)) {
      score += 5;
      reasoning.push('Embraces direct confrontation of challenges');
    }
    if (insights.challengeResponse === 'adapt' && ['bushido', 'yogic'].includes(framework.slug)) {
      score += 5;
      reasoning.push('Teaches adaptive response to challenges');
    }
    if (insights.challengeResponse === 'analyze' && ['stoic', 'highperf'].includes(framework.slug)) {
      score += 5;
      reasoning.push('Emphasizes analytical problem-solving');
    }
    if (insights.challengeResponse === 'accept' && ['monastic', 'sufi'].includes(framework.slug)) {
      score += 5;
      reasoning.push('Teaches acceptance and surrender');
    }
    
    // Experience level matching
    if (insights.experienceLevel === 'beginner' && ['stoic', 'yogic'].includes(framework.slug)) {
      score += 4;
      reasoning.push('Great for beginners with gentle introduction');
    }
    if (insights.experienceLevel === 'intermediate' && ['bushido', 'indigenous'].includes(framework.slug)) {
      score += 4;
      reasoning.push('Builds on existing experience');
    }
    if (insights.experienceLevel === 'advanced' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) {
      score += 4;
      reasoning.push('Challenging practices for experienced practitioners');
    }
    
    return { framework, score, reasoning };
  });
  
  scores.sort((a, b) => b.score - a.score);
  return scores[0];
}

function findAlternativeFrameworks(insights: PersonalityInsights, excludeSlug: string) {
  const frameworks = getAllFrameworks().filter(f => f.slug !== excludeSlug);
  
  const scores = frameworks.map(framework => {
    let score = 0;
    const reasoning: string[] = [];
    
    // Similar scoring logic but for alternatives
    if (framework.virtuePrimary === insights.primaryVirtue) score += 8;
    if (framework.virtueSecondary === insights.primaryVirtue) score += 4;
    
    if (insights.energyLevel === 'high' && ['spartan', 'martial', 'highperf'].includes(framework.slug)) score += 6;
    if (insights.energyLevel === 'moderate' && ['bushido', 'stoic', 'yogic'].includes(framework.slug)) score += 6;
    if (insights.energyLevel === 'low' && ['monastic', 'sufi', 'indigenous'].includes(framework.slug)) score += 6;
    
    if (insights.socialPreference === 'community' && ['ubuntu', 'indigenous'].includes(framework.slug)) score += 5;
    if (insights.socialPreference === 'individual' && ['stoic', 'monastic', 'sufi'].includes(framework.slug)) score += 5;
    if (insights.socialPreference === 'balanced' && ['bushido', 'yogic'].includes(framework.slug)) score += 5;
    
    return { framework, score, reasoning };
  });
  
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 3); // Return top 3 alternatives
} 