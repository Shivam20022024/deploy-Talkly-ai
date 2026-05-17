'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { AlertTriangle, BarChart3, Brain, Mic } from 'lucide-react';
import { SectionBadge } from './SectionBadge';

export const ValuePropSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const stats = [
    { value: '80%', label: 'of sales data is lost in unrecorded calls' },
    { value: '2%', label: 'of total call volume gets reviewed by managers' },
    { value: '67%', label: 'of leads are prioritized on gut-feeling alone' },
  ];

  const cards = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'Buyer Intent',
      desc: 'Surface high-intent signals from every conversation to prioritize deals that are ready to close.',
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Objection Mapping',
      desc: 'Automatically track pricing concerns, trust blockers, and competitive mentions across all calls.',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Sentiment Analysis',
      desc: 'Monitor the emotional pulse of every deal to spot risks before they become lost revenue.',
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: 'Voice Intelligence',
      desc: 'AI-powered analysis of client voice notes transformed into actionable, coachable insights.',
    },
  ];

  return (
    <section className="relative pt-52 sm:pt-52 md:pt-76 lg:pt-[20rem] pb-24 sm:pb-32 md:pb-20 px-4 md:px-8 bg-[#0A0A1C] overflow-hidden">
      {/* Subtle radial glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full bg-[#DBB7F2]/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header – centered */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div variants={itemVariants}>
            <SectionBadge label="The Problem" className="mb-6" />
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-5"
          >
            Your Conversations are{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBB7F2] to-[#EDDBF9]">
              Unstructured Revenue Data
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-gray-400 leading-relaxed"
          >
            Most sales teams only capture 20% of what happens in a call. The remaining 80%—the intent, the objections, the sentiment—is lost forever. TalklyAI builds the bridge between conversation and conversion.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16 md:mb-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className="relative text-center py-6 sm:py-8 px-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <span className="block text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#DBB7F2] to-[#7A668A] mb-2">
                {stat.value}
              </span>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {cards.map((item, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className="group relative p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-[#DBB7F2]/20 hover:shadow-[0_0_40px_rgba(219,183,242,0.06)]"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DBB7F2]/15 to-[#7A668A]/10 border border-[#DBB7F2]/10 flex items-center justify-center text-[#DBB7F2] mb-5 group-hover:from-[#DBB7F2]/25 group-hover:to-[#7A668A]/15 group-hover:border-[#DBB7F2]/20 transition-all duration-300">
                {item.icon}
              </div>
              <h4 className="text-base font-semibold text-white mb-2 group-hover:text-[#DBB7F2] transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
