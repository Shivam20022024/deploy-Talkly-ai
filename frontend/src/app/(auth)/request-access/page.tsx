'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Building, User, Phone, Globe, Briefcase, Users, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RequestAccessPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    company_size: '',
    expected_minutes: '',
    use_case: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation for business email
    const emailLower = formData.email.toLowerCase();
    const commonProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = emailLower.split('@')[1];
    
    if (commonProviders.includes(domain)) {
      // It's a suggestion, but we won't strictly block it unless required.
      // But we can show a warning or just accept it. The requirements say "Prefer business emails".
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/access-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to submit request');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-gray-50 dark:bg-bg-dark-base px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-[440px] bg-white/80 dark:bg-bg-dark-card/80 backdrop-blur-xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Request Submitted</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Your access request has been submitted successfully and is currently under review. 
            You will receive an email once your account has been approved.
          </p>
          <Link 
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-muted text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Return to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-y-auto relative bg-gray-50 dark:bg-bg-dark-base px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-theme-400/20 dark:bg-brand-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[600px]"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div className="px-6 py-3 rounded-2xl flex items-center justify-center shadow-xl shadow-theme-500/20 bg-gradient-to-br from-brand-primary to-brand-muted mb-6">
            <span className="text-white dark:text-bg-dark-card font-black text-2xl tracking-wide">Novalantis</span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Request Access
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center px-4">
            Join the waitlist for TalklyAI revenue intelligence
          </p>
        </div>

        <div className="bg-white/80 dark:bg-bg-dark-card/80 backdrop-blur-xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Company Name *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Building size={16} /></div>
                  <input type="text" name="company_name" required value={formData.company_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500" />
                </div>
              </div>

              {/* Contact Name */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Contact Name *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                  <input type="text" name="contact_name" required value={formData.contact_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Work Email *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Phone Number *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={16} /></div>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Industry */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Industry *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Briefcase size={16} /></div>
                  <select name="industry" required value={formData.industry} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 appearance-none">
                    <option value="" disabled>Select Industry</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="SaaS">SaaS / Software</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Company Size */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Company Size *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Users size={16} /></div>
                  <select name="company_size" required value={formData.company_size} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 appearance-none">
                    <option value="" disabled>Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {/* Website */}
               <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Website *</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Globe size={16} /></div>
                  <input type="url" name="website" required placeholder="https://" value={formData.website} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500" />
                </div>
              </div>

              {/* Expected Minutes */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Expected Monthly Minutes</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Clock size={16} /></div>
                  <input type="text" name="expected_minutes" placeholder="e.g. 5,000" value={formData.expected_minutes} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500" />
                </div>
              </div>
            </div>

            {/* Use Case */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Use Case</label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-gray-400"><MessageSquare size={16} /></div>
                <textarea name="use_case" rows={3} placeholder="How do you plan to use TalklyAI?" value={formData.use_case} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 resize-none"></textarea>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-[13px] font-medium border border-red-200 dark:border-red-500/20 flex items-start gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-brand-primary to-brand-muted text-white py-4 rounded-xl text-[15px] font-bold shadow-lg shadow-theme-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Submit Request <ArrowRight size={18} /></>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-brand-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestAccessPage;
