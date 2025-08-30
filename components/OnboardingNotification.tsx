'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';

interface OnboardingNotificationProps {
  className?: string;
  variant?: 'badge' | 'button' | 'text';
}

export default function OnboardingNotification({ 
  className = '', 
  variant = 'badge' 
}: OnboardingNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const { isComplete, isLoading, shouldShowPrompt } = useOnboardingStatus();
  const router = useRouter();

  useEffect(() => {
    // Show notification if onboarding is not complete and user hasn't dismissed it
    const dismissed = localStorage.getItem('onboarding-notification-dismissed');
    if (!isLoading && shouldShowPrompt && dismissed !== 'true') {
      setShowNotification(true);
    }
  }, [isComplete, isLoading, shouldShowPrompt]);

  const handleStartOnboarding = () => {
    setShowNotification(false);
    localStorage.removeItem('onboarding-notification-dismissed');
    router.push('/onboarding');
  };

  const handleDismiss = () => {
    setShowNotification(false);
    localStorage.setItem('onboarding-notification-dismissed', 'true');
  };

  if (isLoading || !showNotification) {
    return null;
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium ${className}`}>
        <Sparkles className="w-3 h-3" />
        <span>Complete Assessment</span>
        <Button
          onClick={handleStartOnboarding}
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-white hover:bg-white/10"
        >
          Start
        </Button>
        <Button
          onClick={handleDismiss}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-white hover:bg-white/10"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={handleStartOnboarding}
        size="sm"
        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
      >
        <Sparkles className="w-3 h-3 mr-1" />
        Start Assessment
      </Button>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-2 text-amber-500 ${className}`}>
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">Complete your assessment for personalized guidance</span>
        <Button
          onClick={handleStartOnboarding}
          size="sm"
          variant="link"
          className="text-amber-500 hover:text-amber-600 p-0 h-auto"
        >
          Start now
        </Button>
      </div>
    );
  }

  return null;
} 