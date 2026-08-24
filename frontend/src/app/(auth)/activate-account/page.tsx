'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ActivateAccountContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing activation token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/auth/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to activate account');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during activation.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-gray-50 dark:bg-bg-dark-base px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-[440px] bg-white/80 dark:bg-bg-dark-card/80 backdrop-blur-xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Activated!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Your password has been set successfully. You can now log in to manage your calls, leads, and AI agents.
          </p>
          <Link 
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-muted text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative bg-gray-50 dark:bg-bg-dark-base px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-theme-400/20 dark:bg-brand-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-8 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-muted flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Sparkles className="w-5 h-5 text-white dark:text-bg-dark-card" />
            </div>
            <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Novalantis
            </span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Activate Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center px-4">
            Set your password to complete your account setup
          </p>
        </div>

        <div className="bg-white/80 dark:bg-bg-dark-card/80 backdrop-blur-xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            
            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Create Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-theme-600 transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-[15px]"
                  required
                  disabled={!token}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-theme-600 transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-[15px]"
                  required
                  disabled={!token}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-[13px] font-medium border border-red-200 dark:border-red-500/20 flex items-start gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full mt-2 bg-gradient-to-r from-brand-primary to-brand-muted text-white py-4 rounded-xl text-[15px] font-bold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Activate Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const ActivateAccountPage = () => {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ActivateAccountContent />
    </React.Suspense>
  );
};

export default ActivateAccountPage;
