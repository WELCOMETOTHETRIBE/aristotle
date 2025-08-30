import { useState, useEffect } from 'react';

interface OnboardingStatus {
  isComplete: boolean;
  hasUserFacts: boolean;
  hasFrameworkPreference: boolean;
  shouldShowPrompt: boolean;
  isLoading: boolean;
}

export function useOnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus>({
    isComplete: false,
    hasUserFacts: false,
    hasFrameworkPreference: false,
    shouldShowPrompt: false,
    isLoading: true,
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding-status');
      const data = await response.json();
      
      setStatus({
        isComplete: data.isComplete,
        hasUserFacts: data.hasUserFacts,
        hasFrameworkPreference: data.hasFrameworkPreference,
        shouldShowPrompt: data.shouldShowPrompt,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setStatus({
        isComplete: false,
        hasUserFacts: false,
        hasFrameworkPreference: false,
        shouldShowPrompt: true,
        isLoading: false,
      });
    }
  };

  const refreshStatus = () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    checkOnboardingStatus();
  };

  return {
    ...status,
    refreshStatus,
  };
} 