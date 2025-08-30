'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, X, Brain, Shield, Target } from 'lucide-react';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);
  const { isComplete, isLoading, shouldShowPrompt } = useOnboardingStatus();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't show prompt on onboarding page itself
    if (pathname === '/onboarding') {
      return;
    }

    // Check if user has dismissed the prompt for this session
    const dismissed = localStorage.getItem('onboarding-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Show prompt if onboarding is not complete
    if (!isLoading && shouldShowPrompt) {
      // Add a small delay to avoid showing immediately
      setTimeout(() => {
        setShowOnboardingPrompt(true);
      }, 3000);
    }
  }, [isComplete, isLoading, shouldShowPrompt, pathname]);

  const handleStartOnboarding = () => {
    setShowOnboardingPrompt(false);
    // Clear the dismissed flag when they actually start onboarding
    localStorage.removeItem('onboarding-dismissed');
    router.push('/onboarding');
  };

  const handleDismiss = () => {
    setShowOnboardingPrompt(false);
  };

  const handleSkipForNow = () => {
    setShowOnboardingPrompt(false);
    // Save a flag to not show again for this session
    localStorage.setItem('onboarding-dismissed', 'true');
  };

  // Don't show anything while loading
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Onboarding Prompt Modal */}
      {showOnboardingPrompt && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg glass-effect border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95">
            <CardHeader className="text-center relative pb-4">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              
              <CardTitle className="text-2xl mb-2">Welcome to Your Journey</CardTitle>
              <CardDescription className="text-base">
                Let's personalize your path to wisdom and flourishing
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Benefits */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Personalized Framework</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get matched with your ideal philosophical path
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-500/10 to-orange-600/10 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Tailored Practices</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Practices that align with your personality
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Clear Direction</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Know exactly where to start and progress
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleStartOnboarding}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  Start My Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipForNow}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Maybe Later
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                Takes about 3-5 minutes • Your data is private and secure
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 