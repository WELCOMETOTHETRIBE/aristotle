import { FastingBenefitAnalysis, BenefitType, FastingSession, FastingBenefit } from './types';

/**
 * Fasting benefit definitions with scientific background
 */
export const BENEFIT_DEFINITIONS: Record<BenefitType, { description: string; scientificBackground: string }> = {
  energy: {
    description: "Increased energy levels and reduced fatigue",
    scientificBackground: "Fasting promotes ketone production and mitochondrial efficiency, leading to sustained energy without blood sugar crashes."
  },
  clarity: {
    description: "Enhanced mental clarity and focus",
    scientificBackground: "Ketones provide an alternative fuel source for the brain, often resulting in improved cognitive function and mental sharpness."
  },
  weight_loss: {
    description: "Fat burning and weight management",
    scientificBackground: "Fasting creates a caloric deficit and promotes fat oxidation through increased lipolysis and ketone production."
  },
  inflammation: {
    description: "Reduced inflammation markers",
    scientificBackground: "Fasting reduces inflammatory cytokines and promotes anti-inflammatory pathways, potentially reducing chronic inflammation."
  },
  autophagy: {
    description: "Cellular repair and regeneration",
    scientificBackground: "Fasting triggers autophagy, a cellular cleanup process that removes damaged cells and promotes cellular renewal."
  },
  insulin_sensitivity: {
    description: "Improved insulin sensitivity",
    scientificBackground: "Fasting periods allow insulin levels to decrease, improving cellular response to insulin and metabolic flexibility."
  },
  mental_focus: {
    description: "Enhanced concentration and productivity",
    scientificBackground: "Fasting increases BDNF (Brain-Derived Neurotrophic Factor) and reduces brain fog through ketone utilization."
  },
  digestive_health: {
    description: "Improved digestive function",
    scientificBackground: "Fasting gives the digestive system a rest, allowing for repair and reducing inflammation in the gut."
  }
};

/**
 * Analyze fasting benefits and provide insights
 */
export function analyzeFastingBenefits(benefits: FastingBenefit[]): FastingBenefitAnalysis[] {
  const benefitGroups = benefits.reduce((acc, benefit) => {
    if (!acc[benefit.benefitType]) {
      acc[benefit.benefitType] = [];
    }
    acc[benefit.benefitType].push(benefit);
    return acc;
  }, {} as Record<BenefitType, FastingBenefit[]>);

  return Object.entries(benefitGroups).map(([benefitType, benefitList]) => {
    const averageIntensity = benefitList.reduce((sum, b) => sum + b.intensity, 0) / benefitList.length;
    const frequency = benefitList.length;
    
    // Calculate trend based on recent vs older recordings
    const sortedBenefits = benefitList.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    const recentBenefits = sortedBenefits.slice(0, Math.ceil(sortedBenefits.length / 2));
    const olderBenefits = sortedBenefits.slice(Math.ceil(sortedBenefits.length / 2));
    
    let trend: "improving" | "stable" | "declining" = "stable";
    if (recentBenefits.length > 0 && olderBenefits.length > 0) {
      const recentAvg = recentBenefits.reduce((sum, b) => sum + b.intensity, 0) / recentBenefits.length;
      const olderAvg = olderBenefits.reduce((sum, b) => sum + b.intensity, 0) / olderBenefits.length;
      
      if (recentAvg > olderAvg + 1) trend = "improving";
      else if (recentAvg < olderAvg - 1) trend = "declining";
    }

    return {
      benefitType: benefitType as BenefitType,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      frequency,
      trend,
      description: BENEFIT_DEFINITIONS[benefitType as BenefitType].description,
      scientificBackground: BENEFIT_DEFINITIONS[benefitType as BenefitType].scientificBackground
    };
  });
}

/**
 * Calculate fasting duration in hours and minutes
 */
export function calculateFastingDuration(startTime: Date, endTime?: Date): { hours: number; minutes: number; totalMinutes: number } {
  const end = endTime || new Date();
  const diffMs = end.getTime() - startTime.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes, totalMinutes };
}

/**
 * Get fasting stage based on duration
 */
export function getFastingStage(durationHours: number): { stage: string; description: string; benefits: string[] } {
  if (durationHours < 12) {
    return {
      stage: "Early Fasting",
      description: "Your body is transitioning from glucose to fat burning",
      benefits: ["Blood sugar stabilization", "Reduced insulin levels", "Beginning of fat oxidation"]
    };
  } else if (durationHours < 18) {
    return {
      stage: "Ketosis",
      description: "Your body is now primarily burning fat for energy",
      benefits: ["Increased energy", "Mental clarity", "Fat burning", "Reduced hunger"]
    };
  } else if (durationHours < 24) {
    return {
      stage: "Autophagy Initiation",
      description: "Cellular repair processes are beginning",
      benefits: ["Cellular cleanup", "Anti-inflammatory effects", "Enhanced mental focus", "Improved insulin sensitivity"]
    };
  } else if (durationHours < 48) {
    return {
      stage: "Deep Autophagy",
      description: "Significant cellular repair and regeneration",
      benefits: ["Enhanced autophagy", "Reduced inflammation", "Improved metabolic health", "Cellular renewal"]
    };
  } else {
    return {
      stage: "Extended Fasting",
      description: "Advanced fasting with maximum benefits",
      benefits: ["Maximum autophagy", "Stem cell activation", "Deep cellular repair", "Metabolic reset"]
    };
  }
}

/**
 * Generate fasting recommendations based on progress
 */
export function generateFastingRecommendations(sessions: FastingSession[], benefits: FastingBenefit[]): string[] {
  const recommendations: string[] = [];
  
  if (sessions.length === 0) {
    recommendations.push("Start with a 16:8 fasting schedule to build consistency");
    recommendations.push("Track your energy levels and mental clarity during fasting periods");
    recommendations.push("Stay hydrated with water, herbal tea, and electrolytes");
  } else {
    const recentSessions = sessions.filter(s => 
      new Date(s.startTime) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    if (recentSessions.length < 3) {
      recommendations.push("Aim for at least 3 fasting sessions per week for optimal benefits");
    }
    
    const avgDuration = recentSessions.reduce((sum, s) => {
      const duration = s.duration || 0;
      return sum + duration;
    }, 0) / recentSessions.length;
    
    if (avgDuration < 16 * 60) { // Less than 16 hours average
      recommendations.push("Consider extending your fasting window to 18-20 hours for enhanced benefits");
    }
    
    const energyBenefits = benefits.filter(b => b.benefitType === "energy");
    if (energyBenefits.length > 0) {
      const avgEnergy = energyBenefits.reduce((sum, b) => sum + b.intensity, 0) / energyBenefits.length;
      if (avgEnergy < 6) {
        recommendations.push("Focus on electrolyte balance and adequate hydration during fasting");
      }
    }
  }
  
  return recommendations;
}

/**
 * Format duration for display
 */
export function formatDuration(hours: number, minutes: number): string {
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
} 