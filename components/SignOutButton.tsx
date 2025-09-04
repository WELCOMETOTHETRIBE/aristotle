'use client';

import { useState } from 'react';
import { LogOut, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      await signOut();
      setIsSuccess(true);
      
      // Show success state briefly
      setTimeout(() => {
        // Redirect to auth page
        router.push('/auth');
        // Force a hard reload to clear all client-side state
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Even on error, redirect to auth page
      router.push('/auth');
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading || isSuccess}
      className={`btn-secondary btn-small flex items-center gap-2 ${
        isSuccess ? 'bg-green-500 hover:bg-green-600 text-white' : ''
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSuccess ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {isLoading ? 'Signing Out...' : isSuccess ? 'Signed Out!' : 'Sign Out'}
    </button>
  );
} 