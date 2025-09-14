import { LYCEUM_DATA } from './lyceum-data';

// AI System for Lyceum
export interface AITutorResponse {
  message: string;
  question?: string;
  hint?: string;
  encouragement?: string;
}

export interface AIEvaluatorResponse {
  scores: { [criterion: string]: number };
  notes: string;
  mastery_deltas: { [domain: string]: number };
  passed: boolean;
  improvement_suggestion?: string;
}

export interface AICoachResponse {
  suggestion: string;
  habit?: string;
  telos_alignment?: string;
}

// AI Tutor System
export class LyceumAITutor {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = LYCEUM_DATA.ai_prompts.tutor_system;
  }

  async provideGuidance(
    lessonId: string,
    activityId: string,
    userResponse?: any,
    context?: string
  ): Promise<AITutorResponse> {
    const lesson = LYCEUM_DATA.paths
      .flatMap(path => path.lessons)
      .find(l => l.id === lessonId);

    if (!lesson) {
      return {
        message: "I'm here to help guide your learning. What would you like to explore?",
        encouragement: "Every step in your journey brings you closer to wisdom."
      };
    }

    const activity = lesson.activities.find(a => a.id === activityId);
    const aiHooks = lesson.ai_hooks;

    // Simulate AI response based on activity type and user response
    let message = "";
    let question = "";
    let hint = "";
    let encouragement = "";

    switch (activity?.type) {
      case 'drag_drop_categorize':
        if (userResponse) {
          const correctCount = this.evaluateCategorization(userResponse, activity);
          if (correctCount >= 8) {
            message = "Excellent categorization! You're seeing the essential distinctions clearly.";
            encouragement = "Your analytical thinking is developing well.";
          } else if (correctCount >= 6) {
            message = "Good progress! Consider the fundamental nature of each item.";
            hint = "Think about what makes something what it is, versus what it happens to be.";
          } else {
            message = "Let's think through this step by step.";
            hint = "Start with the most obvious categories and work from there.";
          }
        } else {
          message = "Take your time to consider each item carefully.";
          question = "What do you notice about the nature of these different items?";
        }
        break;

      case 'reflection':
        if (userResponse?.text) {
          const wordCount = userResponse.text.split(' ').length;
          if (wordCount >= 10) {
            message = "Thoughtful reflection! You're engaging deeply with the concepts.";
            encouragement = "This kind of introspection builds wisdom.";
          } else {
            message = "I'd love to hear more of your thoughts.";
            question = "What else comes to mind when you consider this?";
          }
        } else {
          message = "Share your thoughts freely - there are no wrong answers here.";
          question = "What insights are emerging for you?";
        }
        break;

      case 'quiz':
        if (userResponse) {
          const correctAnswers = this.evaluateQuiz(userResponse, activity);
          if (correctAnswers >= 2) {
            message = "Well reasoned! You're grasping the key concepts.";
            encouragement = "Your understanding is growing stronger.";
          } else {
            message = "Let's think about this together.";
            hint = "Consider what Aristotle would say about this situation.";
          }
        } else {
          message = "Take your best guess - learning happens through engagement.";
          question = "What seems most reasonable to you?";
        }
        break;

      case 'photo_capture':
        if (userResponse?.photo) {
          message = "Great observation! You're developing the art of careful seeing.";
          encouragement = "This mindful attention is the foundation of wisdom.";
        } else {
          message = "Look closely at what you're photographing.";
          question = "What patterns or structures do you notice?";
        }
        break;

      case 'slider':
        if (userResponse) {
          message = "Interesting perspective! You're finding your own balance.";
          question = "How does this feel in relation to your daily life?";
        } else {
          message = "There's no perfect answer - find what feels right for you.";
          question = "Where do you currently see yourself on this spectrum?";
        }
        break;

      case 'voice_note':
        if (userResponse?.audio) {
          message = "Your voice carries wisdom! Speaking our thoughts clarifies them.";
          encouragement = "You're developing the art of persuasive communication.";
        } else {
          message = "Speak from the heart - authenticity moves people.";
          question = "What do you most want your audience to understand?";
        }
        break;

      default:
        message = "I'm here to support your learning journey.";
        question = "What would you like to explore further?";
    }

    return {
      message,
      question,
      hint,
      encouragement
    };
  }

  private evaluateCategorization(response: any, activity: any): number {
    // Mock evaluation - in real implementation, this would use AI
    const correctMappings: { [key: string]: string } = {
      'triangle': 'substance',
      'red apple': 'substance', 
      'taller than Bob': 'relation',
      'in the park': 'place',
      'running': 'action',
      'five': 'quantity',
      'metallic': 'quality',
      'ownership': 'possession',
      'today': 'time',
      'possible': 'possibility'
    };

    let correct = 0;
    Object.entries(response).forEach(([item, category]) => {
      if (correctMappings[item] === category) {
        correct++;
      }
    });

    return correct;
  }

  private evaluateQuiz(response: any, activity: any): number {
    // Mock evaluation - in real implementation, this would use AI
    const correctAnswers: { [key: number]: string } = {
      0: 'humans', // For syllogism question
      1: 'slippery slope' // For fallacy question
    };

    let correct = 0;
    Object.entries(response).forEach(([questionIndex, answer]) => {
      if (correctAnswers[parseInt(questionIndex)] === answer) {
        correct++;
      }
    });

    return correct;
  }
}

// AI Evaluator System
export class LyceumAIEvaluator {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = LYCEUM_DATA.ai_prompts.evaluator_system;
  }

  async evaluateWork(
    lessonId: string,
    activityResponses: { [key: string]: any },
    assessment: any
  ): Promise<AIEvaluatorResponse> {
    const lesson = LYCEUM_DATA.paths
      .flatMap(path => path.lessons)
      .find(l => l.id === lessonId);

    if (!lesson) {
      return {
        scores: {},
        notes: "Unable to evaluate - lesson not found.",
        mastery_deltas: {},
        passed: false
      };
    }

    // Simulate AI evaluation based on rubric
    const scores: { [criterion: string]: number } = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessment.rubric.forEach((criterion: any) => {
      const score = this.evaluateCriterion(criterion, activityResponses, lesson);
      scores[criterion.criterion] = score;
      totalWeightedScore += score * parseFloat(criterion.weight);
      totalWeight += parseFloat(criterion.weight);
    });

    const averageScore = totalWeightedScore / totalWeight;
    const passed = this.determinePassing(assessment.completion_rule, averageScore, scores);

    const notes = this.generateFeedback(scores, lesson, activityResponses);
    const mastery_deltas = this.calculateMasteryUpdates(lesson, averageScore);
    const improvement_suggestion = this.generateImprovementSuggestion(scores, lesson);

    return {
      scores,
      notes,
      mastery_deltas,
      passed,
      improvement_suggestion
    };
  }

  private evaluateCriterion(criterion: any, responses: any, lesson: any): number {
    // Mock evaluation logic - in real implementation, this would use AI
    switch (criterion.criterion) {
      case 'Correct categorizations':
        return this.evaluateCategorizationAccuracy(responses);
      case 'Reflection clarity':
        return this.evaluateReflectionQuality(responses);
      case 'Validity':
        return this.evaluateSyllogismValidity(responses);
      case 'Concept grasp':
        return this.evaluateConceptualUnderstanding(responses);
      case 'Fallacy ID':
        return this.evaluateFallacyIdentification(responses);
      case 'Repair quality':
        return this.evaluateArgumentRepair(responses);
      default:
        return 0.7; // Default score
    }
  }

  private evaluateCategorizationAccuracy(responses: any): number {
    // Mock: assume 80% accuracy for demonstration
    return 0.8;
  }

  private evaluateReflectionQuality(responses: any): number {
    // Mock: evaluate based on response length and depth
    const textResponses = Object.values(responses).filter(r => r.text);
    if (textResponses.length === 0) return 0.3;
    
    const avgLength = textResponses.reduce((sum: number, r: any) => sum + r.text.length, 0) / textResponses.length;
    if (avgLength > 100) return 0.9;
    if (avgLength > 50) return 0.7;
    return 0.5;
  }

  private evaluateSyllogismValidity(responses: any): number {
    // Mock: check if syllogism structure is correct
    return 0.85;
  }

  private evaluateConceptualUnderstanding(responses: any): number {
    // Mock: evaluate understanding based on responses
    return 0.75;
  }

  private evaluateFallacyIdentification(responses: any): number {
    // Mock: check if fallacies are correctly identified
    return 0.8;
  }

  private evaluateArgumentRepair(responses: any): number {
    // Mock: evaluate quality of argument repair
    return 0.7;
  }

  private determinePassing(completionRule: string, averageScore: number, scores: any): boolean {
    if (completionRule.includes('≥0.8')) {
      return averageScore >= 0.8;
    }
    if (completionRule.includes('≥5/6')) {
      return Object.values(scores).some((score: any) => score >= 0.8);
    }
    return averageScore >= 0.7; // Default threshold
  }

  private generateFeedback(scores: any, lesson: any, responses: any): string {
    const avgScore = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(scores).length;
    
    if (avgScore >= 0.8) {
      return `Excellent work! Your responses demonstrate strong understanding of ${lesson.title}. You're making excellent progress in your philosophical journey.`;
    } else if (avgScore >= 0.6) {
      return `Good effort! You're grasping the key concepts of ${lesson.title}. Consider exploring the connections between different ideas more deeply.`;
    } else {
      return `Keep exploring! ${lesson.title} presents important concepts that will become clearer with practice. Don't hesitate to reflect more deeply on the material.`;
    }
  }

  private calculateMasteryUpdates(lesson: any, averageScore: number): { [domain: string]: number } {
    const updates: { [domain: string]: number } = {};
    
    // Apply mastery updates from lesson, scaled by performance
    Object.entries(lesson.mastery_updates).forEach(([domain, delta]) => {
      updates[domain] = (delta as number) * averageScore;
    });

    return updates;
  }

  private generateImprovementSuggestion(scores: any, lesson: any): string {
    const lowestScore = Math.min(...Object.values(scores) as number[]);
    const lowestCriterion = Object.keys(scores).find(key => scores[key] === lowestScore);
    
    if (lowestCriterion) {
      return `Focus on improving your ${lowestCriterion.toLowerCase()}. Consider reviewing the lesson material and practicing similar exercises.`;
    }
    
    return "Continue practicing and reflecting on these concepts to deepen your understanding.";
  }
}

// AI Coach System
export class LyceumAICoach {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = LYCEUM_DATA.ai_prompts.coach_system;
  }

  async provideCoaching(
    userTelos: string,
    currentPath?: string,
    recentActivity?: string,
    masteryScores?: { [domain: string]: number }
  ): Promise<AICoachResponse> {
    
    // Generate coaching based on user's stated purpose and current progress
    let suggestion = "";
    let habit = "";
    let telos_alignment = "";

    if (userTelos.toLowerCase().includes('wisdom') || userTelos.toLowerCase().includes('understanding')) {
      suggestion = "Spend 5 minutes each morning reflecting on one thing you learned yesterday.";
      habit = "Daily wisdom reflection";
      telos_alignment = "This builds the habit of continuous learning and self-reflection.";
    } else if (userTelos.toLowerCase().includes('virtue') || userTelos.toLowerCase().includes('character')) {
      suggestion = "Choose one small act of kindness to perform today.";
      habit = "Daily virtue practice";
      telos_alignment = "Small virtuous actions build character over time.";
    } else if (userTelos.toLowerCase().includes('flourish') || userTelos.toLowerCase().includes('happiness')) {
      suggestion = "Identify one activity today that truly engages your strengths.";
      habit = "Strength-based activity";
      telos_alignment = "Engaging your natural abilities leads to authentic flourishing.";
    } else if (userTelos.toLowerCase().includes('lead') || userTelos.toLowerCase().includes('influence')) {
      suggestion = "Listen actively to one person today without trying to solve their problem.";
      habit = "Active listening practice";
      telos_alignment = "Good leadership begins with understanding others deeply.";
    } else {
      // Default coaching
      suggestion = "Take a 10-minute walk today and observe your surroundings mindfully.";
      habit = "Mindful observation";
      telos_alignment = "This cultivates the attention and awareness that supports all learning.";
    }

    // Adjust based on mastery scores if provided
    if (masteryScores) {
      const lowestDomain = Object.entries(masteryScores).reduce((min, [domain, score]) => 
        score < masteryScores[min[0]] ? [domain, score] : min
      )[0];

      if (lowestDomain === 'logic') {
        suggestion = "Practice identifying one logical fallacy in today's news or conversations.";
        habit = "Logic practice";
        telos_alignment = "Sharpening your reasoning skills supports clear thinking.";
      } else if (lowestDomain === 'ethics') {
        suggestion = "Reflect on one ethical decision you made today and why.";
        habit = "Ethical reflection";
        telos_alignment = "Regular ethical reflection builds moral wisdom.";
      }
    }

    return {
      suggestion,
      habit,
      telos_alignment
    };
  }

  async provideDailyCheckin(
    userTelos: string,
    previousCheckins: number
  ): Promise<string> {
    const encouragements = [
      "Every step forward, no matter how small, brings you closer to your purpose.",
      "Your commitment to growth is admirable. Keep nurturing your potential.",
      "Wisdom grows through consistent practice. You're building something beautiful.",
      "Each day offers new opportunities to align your actions with your values.",
      "Your journey toward flourishing is inspiring. Trust the process."
    ];

    const encouragement = encouragements[previousCheckins % encouragements.length];
    
    return `${encouragement} ${this.generateCoaching(userTelos)}`;
  }

  private generateCoaching(telos: string): string {
    const coachingOptions = [
      "What small step toward your telos will you take today?",
      "How can you practice virtue in your next interaction?",
      "What observation from your day connects to your learning?",
      "Which of your strengths can you engage today?",
      "What would Aristotle advise for your current situation?"
    ];

    return coachingOptions[Math.floor(Math.random() * coachingOptions.length)];
  }
}

// Export singleton instances
export const lyceumAITutor = new LyceumAITutor();
export const lyceumAIEvaluator = new LyceumAIEvaluator();
export const lyceumAICoach = new LyceumAICoach();
