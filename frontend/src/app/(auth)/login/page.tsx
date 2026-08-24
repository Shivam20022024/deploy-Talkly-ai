'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

const LoginContent = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      
      let redirectPath = searchParams.get('redirect');
      if (!redirectPath) {
        redirectPath = user?.role === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/dashboard';
      }
      const intent = searchParams.get('intent');
      const amount = searchParams.get('amount');
      const plan = searchParams.get('plan');
      
      const params = new URLSearchParams();
      if (intent) params.append('intent', intent);
      if (amount) params.append('amount', amount);
      if (plan) params.append('plan', plan);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      router.push(`${redirectPath}${queryString}`);
      
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans selection:bg-theme-500/30 selection:text-theme-900 overflow-hidden relative bg-gray-50 dark:bg-bg-dark-base transition-colors duration-300 px-4">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-theme-400/20 dark:bg-brand-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-theme-300/20 dark:bg-brand-muted/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Brand Header */}
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
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center px-4">
            Sign in to manage your calls, leads, and AI agents
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-bg-dark-card/80 backdrop-blur-xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl dark:shadow-[0_0_60px_rgba(0,0,0,0.5)] p-8 sm:p-10 relative overflow-hidden">

          {/* Subtle Card Inner Glow (Dark Mode Only) */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none rounded-[28px]" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email Field */} 
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-theme-600 dark:group-focus-within:text-brand-primary transition-colors">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-500/20 dark:focus:ring-brand-primary/20 focus:border-theme-500 dark:focus:border-brand-primary transition-all text-[15px] shadow-inner dark:shadow-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-theme-600 dark:group-focus-within:text-brand-primary transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-500/20 dark:focus:ring-brand-primary/20 focus:border-theme-500 dark:focus:border-brand-primary transition-all text-[15px] shadow-inner dark:shadow-none"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-[13px] font-medium border border-red-200 dark:border-red-500/20 flex items-start gap-2"
              >
                <span className="mt-0.5">⚠️</span>
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-brand-primary to-brand-muted text-white dark:text-bg-dark-card py-4 rounded-xl text-[15px] font-bold shadow-lg shadow-theme-500/25 dark:shadow-brand-primary/20 transition-all hover:shadow-xl hover:shadow-theme-500/30 dark:hover:shadow-brand-primary/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 dark:border-bg-dark-card/30 border-t-white dark:border-t-bg-dark-card rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        {/* Request Access Section */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">or</span>
          <a 
            href="/request-access"
            className="text-[14px] font-semibold text-theme-600 dark:text-brand-primary hover:text-theme-700 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer w-full justify-center py-2 rounded-lg hover:bg-theme-50 dark:hover:bg-white/5 relative z-20 pointer-events-auto"
          >
            Request Access <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 backdrop-blur-md">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
                Enterprise-Grade Security
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
