'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Check } from 'lucide-react';

export const ValuePropSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-32 px-8 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Your Conversations are <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Unstructured Revenue Data.
            </span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
            Most sales teams only capture 20% of what happens in a call. The remaining 80%—the intent, the objections, the sentiment—is lost forever. TalklyAI builds the bridge between conversation and conversion.
          </motion.p>
          <motion.div variants={containerVariants} className="space-y-6 pt-4">
            {[
              '80% of sales data is lost in unrecorded calls.',
              'Managers can only review 2% of total call volume.',
              'Lead prioritization is often based on gut-feeling.'
            ].map((text, i) => (
              <motion.div variants={itemVariants} key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800/50">
                  <Check size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-md font-bold text-slate-800 dark:text-slate-200">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-2 gap-6"
        >
          {[
            { title: 'Buyer Intent', desc: 'Identify high-intent signals instantly.' },
            { title: 'Objection Mapping', desc: 'Track every pricing and trust roadblock.' },
            { title: 'Sentiment Analysis', desc: 'Monitor the emotional pulse of deals.' },
            { title: 'Voice Note Intelligence', desc: 'AI-powered analysis of client voice notes for actionable insights.' }
          ].map((item, i) => (
            <motion.div 
              variants={itemVariants} 
              key={i} 
              className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 group cursor-default"
            >
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
