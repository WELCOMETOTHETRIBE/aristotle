'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, X, Brain, Heart, Target, Shield } from 'lucide-react';
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
      }, 2000);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl glass-effect border-0 shadow-2xl">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-3xl mb-2">Welcome to Your Journey</CardTitle>
              <CardDescription className="text-lg">
                Let's personalize your path to wisdom and flourishing
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">Personalized Path</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get matched with your ideal philosophical framework
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">Tailored Practices</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Practices that align with your personality and goals
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">Clear Direction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Know exactly where to start and how to progress
                  </p>
                </div>
              </div>

              {/* Quick Assessment Preview */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">What to Expect:</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• 12 quick questions about your preferences and goals</li>
                  <li>• Voice recording for natural responses</li>
                  <li>• Instant personality analysis and framework matching</li>
                  <li>• Personalized recommendations and next steps</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleStartOnboarding}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  Start My Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSkipForNow}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Takes about 3-5 minutes • Your data is private and secure
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 