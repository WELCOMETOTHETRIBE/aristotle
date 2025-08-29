'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Shield, Users, ArrowRight, CheckCircle, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';

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
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  // Auto-detect dark mode preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensure cookies are sent
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccess(isSignUp ? 'Account created successfully!' : 'Welcome back!');
      
      // Check authentication status before redirecting
      setTimeout(async () => {
        try {
          const authCheck = await fetch('/api/debug-auth', {
            credentials: 'include'
          });
          const authData = await authCheck.json();
          
          if (authData.hasToken && authData.verified) {
            console.log('✅ Authentication verified, redirecting...');
            router.push('/');
          } else {
            console.log('❌ Authentication not verified:', authData);
            setError('Authentication failed - please try again');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          setError('Authentication verification failed');
        }
      }, 1000);
    } catch (err) {
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div 
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mr-6 shadow-2xl ${
                  isDark 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
              <div>
                <h1 className={`text-4xl font-bold mb-2 ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                }`}>
                  Aristotle
                </h1>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Ancient Wisdom for Modern Life
                </p>
              </div>
            </motion.div>
            <motion.p 
              className={`text-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
              variants={itemVariants}
            >
              {isSignUp ? 'Begin your journey of wisdom' : 'Continue your practice'}
            </motion.p>
          </motion.div>

          {/* Auth Form */}
          <motion.div 
            className={`backdrop-blur-xl rounded-3xl shadow-2xl border ${
              isDark 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/80 border-white/40'
            }`}
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="p-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-300 text-sm font-medium">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-green-300 text-sm font-medium">{success}</span>
                      <div className="mt-2">
                        <button
                          onClick={() => router.push('/')}
                          className="text-green-300 text-xs underline hover:text-green-200"
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
                <motion.div variants={itemVariants}>
                  <label htmlFor="username" className={`block text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20' 
                          : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                      placeholder="Enter your username"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className={`block text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
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
                      className={`w-full px-4 py-4 pr-12 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20' 
                          : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Email (sign up only) */}
                <AnimatePresence>
                  {isSignUp && (
                    <motion.div 
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="email" className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                        placeholder="Enter your email"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Display Name (sign up only) */}
                <AnimatePresence>
                  {isSignUp && (
                    <motion.div 
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="displayName" className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Display Name (optional)
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                        placeholder="Enter your display name"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isDark 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                </motion.div>
              </form>

              {/* Toggle Sign In/Sign Up */}
              <motion.div 
                className="mt-8 text-center"
                variants={itemVariants}
              >
                <p className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <motion.button
                    onClick={toggleMode}
                    className={`ml-2 font-semibold transition-colors ${
                      isDark 
                        ? 'text-purple-400 hover:text-purple-300' 
                        : 'text-blue-600 hover:text-blue-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="mt-8 grid grid-cols-1 gap-4"
            variants={containerVariants}
          >
            <motion.div 
              className={`backdrop-blur-xl rounded-2xl p-6 border ${
                isDark 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/60 border-white/40'
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-blue-500/20 text-blue-600'
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Secure & Private</h3>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Your data is encrypted and secure</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={`backdrop-blur-xl rounded-2xl p-6 border ${
                isDark 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/60 border-white/40'
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark 
                    ? 'bg-pink-500/20 text-pink-400' 
                    : 'bg-purple-500/20 text-purple-600'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Personalized Journey</h3>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Track your progress and growth</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Theme Toggle */}
          <motion.div 
            className="mt-8 text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-white/60 border-white/40 text-slate-700 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
} 