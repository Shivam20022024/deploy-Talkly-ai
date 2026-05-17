'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CTASection = ({ onStart }: { onStart?: () => void }) => {
  return (
    <section className="relative py-12 sm:py-20 md:py-30 px-4 md:px-8 bg-[#0A0A1C] overflow-hidden">
      {/* Animated gradient orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(219,183,242,0.07) 0%, rgba(122,102,138,0.03) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Horizontal glow line */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px">
        <div className="max-w-2xl mx-auto h-full bg-gradient-to-r from-transparent via-[#DBB7F2]/15 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Large display heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1] mb-6 md:mb-8"
        >
          Ready to unlock your{' '}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBB7F2] via-[#EDDBF9] to-[#DBB7F2] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
            revenue intelligence?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10 md:mb-14 font-medium"
        >
          Transform every customer conversation into actionable intelligence. Start in minutes—no code required.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-12 md:mb-16"
        >
          <button
            onClick={onStart}
            className="group relative w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#DBB7F2] to-[#7A668A] text-[#181623] font-bold text-sm shadow-[0_0_40px_rgba(219,183,242,0.15)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(219,183,242,0.25)] hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10">Book a Demo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#EDDBF9] to-[#DBB7F2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/[0.08] text-gray-400 font-semibold text-sm transition-all duration-300 hover:border-[#DBB7F2]/20 hover:text-white hover:bg-white/[0.03] hover:scale-[1.03] active:scale-[0.98]"
          >
            View Product Demo
          </button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2"
        >
          {['No credit card required', 'Free 14-day trial', 'Setup in 5 minutes'].map((text, i) => (
            <span key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <span className="w-1 h-1 rounded-full bg-[#DBB7F2]/30" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
};
