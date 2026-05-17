'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Mic, Target, Activity, Clock, Workflow, Lock } from 'lucide-react';

export const CapabilitiesSection = () => {
  const capabilities = [
    { icon: Mic, title: 'Voice Intelligence', desc: 'Industry-leading transcription and entity extraction for complex sales cycles.' },
    { icon: Target, title: 'Lead Intelligence', desc: 'Dynamic lead scoring that adapts to conversation context and intent markers.' },
    { icon: Activity, title: 'Agent Performance', desc: 'Real-time benchmarking against top performers with automated feedback loops.' },
    { icon: Clock, title: 'Live Monitoring', desc: 'Real-time oversight for managers to assist in high-stakes deal negotiations.' },
    { icon: Workflow, title: 'Workflow Automation', desc: 'Seamlessly push extracted requirements and scores directly into your CRM.' },
    { icon: Lock, title: 'Enterprise Security', desc: 'Enterprise-grade security with role-based access control and end-to-end encryption.' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="py-32 px-8 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-24 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            Your Complete Sales <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Conversation Intelligence Stack
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium"
          >
            Voice intelligence, lead scoring, agent coaching, live conversation monitoring, and AI-powered business insights—all in one platform.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {capabilities.map((item, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-700 shadow-sm text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <item.icon size={26} strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
