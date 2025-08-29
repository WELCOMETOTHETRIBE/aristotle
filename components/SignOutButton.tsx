'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      // Force a hard reload to clear all client-side state
      window.location.href = '/auth';
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="btn-secondary btn-small flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      Sign Out
    </button>
  );
} 