'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, Users, ArrowRight, CheckCircle, AlertCircle, Loader2, Brain, Target, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import PageLayout from '@/components/PageLayout';
import AuroraBackground from '@/components/AuroraBackground';
import GraduationCapIcon from '@/components/GraduationCapIcon';
import AcademyLogoData from '@/components/AcademyLogoData';
import Image from 'next/image';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    displayName: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always call useAuth hook - React hooks must be called unconditionally
  const { signIn, signUp, user, loading } = useAuth();
  // Redirect if already authenticated
  useEffect(() => {
    if (!isClient) return;
    
    try {
      if (user && !loading) {
        router.replace('/');
      }
    } catch (error) {
      console.error('Redirect error:', error);
      setError('Navigation error. Please try again.');
    }
  }, [user, loading, router, isClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!signIn || !signUp) {
        setError('Authentication system not available. Please refresh the page.');
        return;
      }

      if (isSignUp) {
        const result = await signUp(formData.username, formData.password, formData.email, formData.displayName);
        if (result.success) {
          setSuccess('Account created successfully!');
          // Redirect immediately since auth context already updated
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          setError(result.error || 'Sign up failed. Please try again.');
        }
      } else {
        const result = await signIn(formData.username, formData.password);
        if (result.success) {
          setSuccess('Welcome back!');
          // Redirect immediately since auth context already updated
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          setError(result.error || 'Sign in failed. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Auth submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Show loading state while auth context loads
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if auth context failed
  if (authError) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text">Authentication Error</h1>
            <p className="text-muted">{authError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <AuroraBackground />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/eudaimonia.png"
                alt="EudAimonia Academy Logo"
                width={400}
                height={400}
                className="w-96 h-96 object-contain"
                priority
              />
            </div>
            <p className="text-muted">
              Your journey to ancient wisdom begins here
            </p>
          </div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl"
          >
            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-success/20 border border-success/30 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-success text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-error/20 border border-error/30 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-error" />
                  <span className="text-error text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
                    placeholder="Enter your email"
                  />
                </div>
              )}

              {/* Display Name (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-text mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
                    placeholder="Enter your display name"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 pr-10 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                }}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            <div className="text-center p-3 bg-surface/30 rounded-lg">
              <Brain className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted">Ancient Wisdom</p>
            </div>
            <div className="text-center p-3 bg-surface/30 rounded-lg">
              <Target className="w-6 h-6 text-courage mx-auto mb-2" />
              <p className="text-xs text-muted">Daily Practice</p>
            </div>
            <div className="text-center p-3 bg-surface/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-justice mx-auto mb-2" />
              <p className="text-xs text-muted">Progress Tracking</p>
            </div>
            <div className="text-center p-3 bg-surface/30 rounded-lg">
              <Users className="w-6 h-6 text-temperance mx-auto mb-2" />
              <p className="text-xs text-muted">Community</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
} 