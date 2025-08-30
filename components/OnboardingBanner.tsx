'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';

interface OnboardingBannerProps {
  className?: string;
}

export default function OnboardingBanner({ className = '' }: OnboardingBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const { isComplete, isLoading, shouldShowPrompt } = useOnboardingStatus();
  const router = useRouter();

  useEffect(() => {
    // Show banner if onboarding is not complete and user hasn't dismissed it
    const dismissed = localStorage.getItem('onboarding-banner-dismissed');
    if (!isLoading && shouldShowPrompt && dismissed !== 'true') {
      setShowBanner(true);
    }
  }, [isComplete, isLoading, shouldShowPrompt]);

  const handleStartOnboarding = () => {
    setShowBanner(false);
    localStorage.removeItem('onboarding-banner-dismissed');
    router.push('/onboarding');
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('onboarding-banner-dismissed', 'true');
  };

  if (isLoading || !showBanner) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5" />
          <div>
            <p className="font-medium">
              Get your personalized path to wisdom and flourishing
            </p>
            <p className="text-sm opacity-90">
              Complete a quick assessment to unlock your ideal framework
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleStartOnboarding}
            size="sm"
            variant="secondary"
            className="bg-white text-amber-600 hover:bg-gray-100"
          >
            Start Assessment
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 