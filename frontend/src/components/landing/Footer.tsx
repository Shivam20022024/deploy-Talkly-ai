'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-16 px-8 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm bg-gradient-to-br from-blue-600 to-indigo-600">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TalklyAI</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            AI-powered Sales Conversation Intelligence
          </p>
          <div className="flex justify-center md:justify-start">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full bg-white dark:bg-slate-900 shadow-sm">
              <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" /> Enterprise-Grade Security
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2026 TalklyAI Technologies Inc.</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Built for modern sales teams</p>
        </div>
      </div>
    </footer>
  );
};
