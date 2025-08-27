'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to global error buffer for doctor
    if (typeof window !== 'undefined') {
      if (!window.__doctorErrors) {
        window.__doctorErrors = [];
      }
      window.__doctorErrors.push({
        timestamp: new Date().toISOString(),
        type: 'react-error',
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack || undefined
      });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  copyDiagnostic = () => {
    if (this.state.error) {
      const diagnostic = {
        error: this.state.error.message,
        stack: this.state.error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      navigator.clipboard.writeText(JSON.stringify(diagnostic, null, 2));
      alert('Diagnostic copied to clipboard!');
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="space-y-3">
                <Button onClick={this.resetError} className="w-full">
                  Try again
                </Button>
                <Button 
                  onClick={this.copyDiagnostic} 
                  variant="outline" 
                  className="w-full"
                >
                  Copy Diagnostic
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (!window.__doctorErrors) {
      window.__doctorErrors = [];
    }
    
    window.__doctorErrors.push({
      timestamp: new Date().toISOString(),
      type: 'unhandled-rejection',
      error: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });
}

declare global {
  interface Window {
    __doctorErrors?: Array<{
      timestamp: string;
      type: string;
      error: string;
      stack?: string;
      componentStack?: string;
      metadata?: Record<string, any>;
    }>;
  }
}
