'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Shield, Users, ArrowRight, CheckCircle, AlertCircle, Loader2, Brain, Target, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import PageLayout from '@/components/PageLayout';
import AuroraBackground from '@/components/AuroraBackground';
import GraduationCapIcon from '@/components/GraduationCapIcon';

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
  const router = useRouter();
  
  // Safe auth context usage
  let authContext: any;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    setAuthError('Authentication system error');
  }

  const { signIn, signUp, user, loading } = authContext || {};

  // Redirect if already authenticated
  useEffect(() => {
    try {
      if (user && !loading) {
        router.replace('/');
      }
    } catch (error) {
      console.error('Redirect error:', error);
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!signIn || !signUp) {
        setError('Authentication system not available');
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
          setError(result.error || 'Sign up failed');
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
          setError(result.error || 'Sign in failed');
        }
      }
    } catch (err) {
      console.error('Auth submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '', email: '', displayName: '' });
  };

  // Show auth error if auth context failed
  if (authError) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <AuroraBackground />
        <div className="relative z-10 text-center">
          <div className="card-base max-w-md mx-auto">
            <h1 className="headline mb-4">Authentication Error</h1>
            <p className="body-text mb-6">{authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <AuroraBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-xl text-text">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <AuroraBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              className="flex flex-col items-center justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo Container */}
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-accent via-accent-2 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/10">
                  <img 
                    src="/academy_logo_r2.png" 
                    alt="Academy Logo" 
                    className="w-20 h-20 object-contain"
                    onError={(e) => {
                      // Fallback to graduation cap icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-20 h-20 flex items-center justify-center"><svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 7V17C2 17.5523 2.44772 18 3 18H21C21.5523 18 22 17.5523 22 17V7"/><path d="M12 12V18"/><path d="M12 18C12 18 10 20 8 20C6 20 4 18 4 18"/></svg></div>';
                      }
                    }}
                  />
                </div>
                <motion.div
                  className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-md"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
              
              {/* Title and Subtitle */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-6xl font-bold bg-gradient-to-r from-white via-accent to-accent-2 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Aristotle
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-300 font-medium tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Ancient Wisdom for Modern Life
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-lg text-gray-400 leading-relaxed">
                {isSignUp 
                  ? 'Begin your journey of wisdom and discover the path to flourishing through timeless philosophical practices.' 
                  : 'Continue your practice and deepen your understanding of virtue, purpose, and intentional living.'
                }
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Auth Form */}
            <motion.div 
              className="panel-base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      className="mb-6 p-4 bg-error/20 border border-error/30 rounded-xl flex items-center gap-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                      <span className="text-error text-sm font-medium">{error}</span>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="mb-6 p-4 bg-success/20 border border-success/30 rounded-xl flex items-center gap-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-success text-sm font-medium">{success}</span>
                        <div className="mt-2">
                          <button
                            onClick={() => router.push('/')}
                            className="text-success text-xs underline hover:text-success/80"
                          >
                            Click here if you're not redirected automatically
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-3 text-text">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="input-base"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-3 text-text">
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
                        className="input-base pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-muted hover:text-text transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Email (sign up only) */}
                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label htmlFor="email" className="block text-sm font-semibold mb-3 text-text">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-base"
                          placeholder="Enter your email"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Display Name (sign up only) */}
                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label htmlFor="displayName" className="block text-sm font-semibold mb-3 text-text">
                          Display Name (optional)
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="input-base"
                          placeholder="Enter your display name"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      <>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Toggle Sign In/Sign Up */}
                <div className="mt-8 text-center">
                  <p className="body-text text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      onClick={toggleMode}
                      className="ml-2 font-semibold text-accent hover:text-accent/80 transition-colors"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card-base">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 text-accent rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="subheadline mb-1">Secure & Private</h3>
                    <p className="body-text">Your data is encrypted and secure</p>
                  </div>
                </div>
              </div>

              <div className="card-base">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-2/20 text-accent-2 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="subheadline mb-1">Personalized Journey</h3>
                    <p className="body-text">Track your progress and growth</p>
                  </div>
                </div>
              </div>

              <div className="card-base">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/20 text-success rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="subheadline mb-1">Daily Practices</h3>
                    <p className="body-text">Structured routines for consistent growth</p>
                  </div>
                </div>
              </div>

              <div className="card-base">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning/20 text-warning rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="subheadline mb-1">AI-Powered Guidance</h3>
                    <p className="body-text">Personalized coaching and insights</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 