'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CTASection = ({ onStart }: { onStart?: () => void }) => {
  return (
    <section className="py-32 px-8 relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/5 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Ready to See <span className="text-blue-600">TalklyAI</span> in Action?
          </h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
        >
          Experience how AI transforms customer conversations into actionable sales intelligence.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 pt-4"
        >
          <button 
            onClick={onStart} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
          >
            Book a Demo
          </button>
          <button 
            onClick={onStart} 
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-all hover:scale-105 active:scale-95"
          >
            View Product Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
};
