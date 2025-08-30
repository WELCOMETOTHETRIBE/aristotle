'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, X, Target, Brain, Users, Shield } from 'lucide-react';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';

export default function OnboardingGuard() {
  const { shouldShowPrompt } = useOnboardingStatus();
  const router = useRouter();
  
  // Remove automatic popup - only show when explicitly triggered
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  const handleStartOnboarding = () => {
    router.push('/onboarding');
  };

  const handleDismiss = () => {
    setShowOnboardingPrompt(false);
    // Store dismissal in localStorage to prevent showing again this session
    localStorage.setItem('onboarding-dismissed', 'true');
  };

  const handleSkipForNow = () => {
    setShowOnboardingPrompt(false);
    // Store dismissal in localStorage to prevent showing again this session
    localStorage.setItem('onboarding-dismissed', 'true');
  };

  // Only show the prompt if shouldShowPrompt is true AND user hasn't dismissed it this session
  useEffect(() => {
    if (shouldShowPrompt && !localStorage.getItem('onboarding-dismissed')) {
      // Don't show automatically - only when explicitly triggered
      // setShowOnboardingPrompt(true);
    }
  }, [shouldShowPrompt]);

  // Don't render anything if not showing prompt
  if (!showOnboardingPrompt) {
    return null;
  }

  return (
    <>
      {showOnboardingPrompt && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg glass-effect border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95">
            <CardHeader className="text-center relative pb-4">
              <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 h-8 w-8 p-0" onClick={handleDismiss}><X className="h-4 w-4" /></Button>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-3"><Sparkles className="w-6 h-6 text-white" /></div>
              <CardTitle className="text-2xl mb-2">Welcome to Your Journey</CardTitle>
              <CardDescription className="text-base">Let's personalize your path to wisdom and flourishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <Target className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">Personalized Framework</p>
                    <p className="text-xs text-gray-400">Get matched with your ideal philosophical path</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-500/20">
                  <Brain className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">AI-Powered Insights</p>
                    <p className="text-xs text-gray-400">Receive tailored guidance and practices</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <Users className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">Community Connection</p>
                    <p className="text-xs text-gray-400">Join others on similar paths</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                  <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">Secure & Private</p>
                    <p className="text-xs text-gray-400">Your data is protected and confidential</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={handleStartOnboarding} size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">Start My Assessment<ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={handleSkipForNow} className="text-gray-600 dark:text-gray-400">Maybe Later</Button>
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">Takes about 3-5 minutes • Your data is private and secure</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 