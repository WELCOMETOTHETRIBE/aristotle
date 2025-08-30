'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Shield, Users, ArrowRight, CheckCircle, AlertCircle, Loader2, Brain, Target, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import PageLayout from '@/components/PageLayout';
import AuroraBackground from '@/components/AuroraBackground';
import GraduationCapIcon from '@/components/GraduationCapIcon';
import AcademyLogoData from '@/components/AcademyLogoData';

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
              {/* Enhanced Logo Container */}
              <div className="relative mb-10">
                <div className="w-36 h-36 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/20 relative">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 animate-pulse"></div>
                  
                  <AcademyLogoData 
                    className="relative z-10" 
                    size={96}
                  />
                </div>
                
                {/* Enhanced animated elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-inner"></div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                />
              </div>
              
              {/* Enhanced Title and Subtitle */}
              <div className="space-y-6">
                <motion.h1 
                  className="text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                >
                  Aristotle
                </motion.h1>
                <motion.p 
                  className="text-2xl text-gray-200 font-semibold tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Ancient Wisdom for Modern Life
                </motion.p>
                <motion.div
                  className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 96, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-lg text-gray-200 leading-relaxed text-center font-medium">
                  {isSignUp 
                    ? 'Begin your journey of wisdom and discover the path to flourishing through timeless philosophical practices.' 
                    : 'Continue your practice and deepen your understanding of virtue, purpose, and intentional living.'
                  }
                </p>
                <motion.div 
                  className="flex justify-center gap-4 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Virtue Development</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Mindful Practice</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Personal Growth</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Auth Form */}
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <div className="p-10">
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

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-3 text-gray-200">
                      {isSignUp ? 'Username' : 'Username or Email'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        placeholder={isSignUp ? "Enter your username" : "Enter your username or email"}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {!isSignUp && (
                      <p className="text-xs text-gray-400 mt-2">
                        You can sign in with either your username or email address
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-3 text-gray-200">
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
                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg pr-12"
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
                        <label htmlFor="email" className="block text-sm font-semibold mb-3 text-gray-200">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                          placeholder="Enter your email address"
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
                        <label htmlFor="displayName" className="block text-sm font-semibold mb-3 text-gray-200">
                          Display Name (optional)
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                          placeholder="Enter your display name"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Enhanced Toggle Sign In/Sign Up */}
                <div className="mt-10 text-center">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <p className="text-gray-300 text-sm">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                      <motion.button
                        onClick={toggleMode}
                        className="ml-2 font-semibold text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                      </motion.button>
                    </p>
                  </div>
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