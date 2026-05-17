'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { PhoneIncoming, Sparkles, Layers, Target, LayoutDashboard } from 'lucide-react';

export const WorkflowSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-32 px-8 relative overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            How TalklyAI Turns <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Conversations Into Intelligence
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto font-medium"
          >
            From raw customer conversations to actionable business insights in real time.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 relative"
        >
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[150px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-slate-800 via-blue-500/50 to-slate-800 z-0"></div>

          {/* Step 1: Customer Conversation */}
          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <div className="h-[320px] rounded-3xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-xl hover:bg-slate-800 hover:border-slate-600 transition-all group flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <PhoneIncoming size={18} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Incoming</span>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-sm italic text-slate-400">"I'm looking for a 3BHK property in Gurgaon under 2 crore."</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">1. Customer Speaks</h4>
                <p className="text-xs leading-relaxed text-slate-400 font-medium">Customers interact through calls or voice notes.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 2: AI Analysis */}
          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <div className="h-[320px] rounded-3xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-xl hover:bg-slate-800 hover:border-slate-600 transition-all group flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Sparkles size={18} className="text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Analysis</span>
                </div>
                <div className="flex items-center gap-2 h-16 px-2">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 32, 16, 40, 8] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                      className="flex-1 bg-indigo-500/60 rounded-full w-2"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">2. AI Processing</h4>
                <p className="text-xs leading-relaxed text-slate-400 font-medium">TalklyAI listens and analyzes every interaction instantly.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Intelligence Extraction */}
          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <div className="h-[320px] rounded-3xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-xl hover:bg-slate-800 hover:border-slate-600 transition-all group flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Layers size={18} className="text-purple-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Extraction</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['High Intent', '2 Cr Budget', 'Gurgaon', 'Ready Move'].map((tag, i) => (
                    <div key={i} className="px-2 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[10px] font-bold text-purple-300 text-center">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">3. Data Extraction</h4>
                <p className="text-xs leading-relaxed text-slate-400 font-medium">Transforms unstructured chats into structured points.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 4: Lead Qualification */}
          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <div className="h-[320px] rounded-3xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-xl hover:bg-slate-800 hover:border-slate-600 transition-all group flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Target size={18} className="text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Scoring</span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center">
                  <p className="text-3xl font-black text-emerald-400">🔥 HOT</p>
                  <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest mt-2">Score: 92/100</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">4. Qualification</h4>
                <p className="text-xs leading-relaxed text-slate-400 font-medium">High-value leads are automatically prioritized.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 5: Sales Action */}
          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <div className="h-[320px] rounded-3xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-xl hover:bg-slate-800 hover:border-slate-600 transition-all group flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <LayoutDashboard size={18} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Action</span>
                </div>
                <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '88%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-blue-500"
                    ></motion.div>
                  </div>
                  <p className="text-xs font-medium text-slate-400">Push to CRM: <span className="text-blue-400">Success</span></p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">5. Team Action</h4>
                <p className="text-xs leading-relaxed text-slate-400 font-medium">Teams take faster, smarter action to close deals.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
