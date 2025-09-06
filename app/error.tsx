'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
    console.error('🚨 Global error details:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text">Something went wrong</h1>
            <p className="text-muted">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-surface border border-border rounded-lg text-left">
              <p className="text-sm font-medium text-text mb-2">Error Details:</p>
              <p className="text-xs text-muted font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        <div className="text-xs text-muted">
          <p>If this error persists, please check:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• Your internet connection</li>
            <li>• Browser compatibility</li>
            <li>• Clear browser cache and cookies</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 