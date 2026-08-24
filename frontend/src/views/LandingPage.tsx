import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   BarChart3,
   MessageSquare,
   Activity,
   Flame,
   Sparkles,
   ArrowRight,
   ShieldCheck,
   TrendingUp,
   Globe2,
   Target,
   CheckCircle2,
   Zap,
   BrainCircuit,
   XCircle,
   PhoneCall,
   ChevronRight,
   Play,
   Check,
   User,
   Quote,
   Clock,
   Search,
   LayoutDashboard,
   Mic,
   Cpu,
   Layers,
   MousePointer2,
   AlertCircle,
   PhoneIncoming,
   ArrowDown,
   Building2,
   Lock,
   Workflow
} from 'lucide-react';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
   return (
      <div
         className="min-h-screen text-slate-800 font-sans selection:bg-blue-500/30 selection:text-blue-900 overflow-x-hidden relative"
         style={{
            background: 'linear-gradient(180deg, #F8FBFF 0%, #EAF2FF 50%, #DCE8FF 100%)',
         }}
      >
         {/* PREMIUM LIGHT BACKGROUND DECORATIONS */}
         <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Softer Mesh Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-indigo-300/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>

            {/* Abstract Curved Line / Wave (Subtle SVG) */}
            <svg className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] text-blue-900" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M400 0C300 100 100 200 0 400C100 600 300 700 400 800" stroke="currentColor" strokeWidth="1" />
               <path d="M400 100C320 180 140 260 50 400C140 540 320 620 400 700" stroke="currentColor" strokeWidth="0.5" />
               <path d="M400 200C340 260 180 320 100 400C180 480 340 540 400 600" stroke="currentColor" strokeWidth="0.2" />
            </svg>
         </div>

         {/* MINIMAL NAVBAR */}
         <nav className="fixed top-0 w-full z-[100] border-b border-black/[0.03] bg-white/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                     <img src="/logo.png" alt="TalklyAI" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-slate-900">Talkly<span className="text-blue-600">AI</span></span>
               </div>

               <div className="flex items-center gap-4">
                  {/* Minimalist header - CTA buttons removed per request */}
               </div>
            </div>
         </nav>

         {/* SECTION 1: ENTERPRISE HERO */}
         <section className="relative pt-40 pb-24 px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
               <div className="space-y-10">
                  <div className="h-4"></div> {/* Spacer instead of badge */}

                  <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                     Revenue Intelligence <br />
                     <span className="text-blue-600">For Every Sales Call.</span>
                  </h1>

                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
                     TalklyAI transforms unstructured customer conversations into actionable sales intelligence. Detect buyer intent, automate lead scoring, and coach agents at scale.
                  </p>

                  <div className="flex flex-wrap justify-center gap-6 pt-4">
                     <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-lg text-lg font-bold shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3">
                        Request a Demo <ArrowRight size={20} />
                     </button>
                     <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-lg text-lg font-bold shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3">
                        View Products Demo
                     </button>
                  </div>

                  <div className="pt-16 flex flex-wrap justify-center gap-16 border-t border-black/5">
                     <div className="space-y-1">
                        <p className="text-3xl font-bold text-slate-900">94%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy Rate</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-3xl font-bold text-slate-900">40%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Boost</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-3xl font-bold text-slate-900">24/7</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise-Grade Security</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="py-32 px-8 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                     Your Conversations are <br /> <span className="text-blue-600">Unstructured Revenue Data.</span>
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed max-w-lg font-medium">
                     Most sales teams only capture 20% of what happens in a call. The remaining 80%—the intent, the objections, the sentiment—is lost forever. TalklyAI builds the bridge between conversation and conversion.
                  </p>
                  <div className="space-y-6 pt-4">
                     {[
                        '80% of sales data is lost in unrecorded calls.',
                        'Managers can only review 2% of total call volume.',
                        'Lead prioritization is often based on gut-feeling.'
                     ].map((text, i) => (
                        <div key={i} className="flex items-center gap-4">
                           <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                              <Check size={14} className="text-blue-600" />
                           </div>
                           <p className="text-md font-bold text-slate-800">{text}</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  {[
                     { title: 'Buyer Intent', desc: 'Identify high-intent signals instantly.' },
                     { title: 'Objection Mapping', desc: 'Track every pricing and trust roadblock.' },
                     { title: 'Sentiment Analysis', desc: 'Monitor the emotional pulse of deals.' },
                     { title: 'Voice Note Intelligence', desc: 'AI-powered analysis of client voice notes for actionable business insights.' }
                  ].map((item, i) => (
                     <div key={i} className="p-8 rounded-2xl bg-white border border-blue-100 shadow-md hover:shadow-xl hover:border-blue-300 transition-all group">
                        <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* SECTION 3: CORE CAPABILITIES (Cards) */}
         <section className="py-32 px-8 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
               <div className="max-w-3xl mb-24 space-y-4">
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Your Complete Sales <br /> <span className="text-blue-500">Conversation Intelligence Stack</span></h2>
                  <p className="text-lg text-slate-600">Voice intelligence, lead scoring, agent coaching, live conversation monitoring, and AI-powered business insights—all in one platform.</p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  {[
                     { icon: Mic, title: 'Voice Intelligence', desc: 'Industry-leading transcription and entity extraction for complex sales cycles.' },
                     { icon: Target, title: 'Lead Intelligence', desc: 'Dynamic lead scoring that adapts to conversation context and intent markers.' },
                     { icon: Activity, title: 'Agent Performance', desc: 'Real-time benchmarking against top performers with automated feedback loops.' },
                     { icon: Clock, title: 'Live Conversation Monitoring', desc: 'Real-time oversight for managers to assist in high-stakes deal negotiations.' },
                     { icon: Workflow, title: 'Workflow Automation', desc: 'Seamlessly push extracted requirements and scores directly into your CRM.' },
                     { icon: Lock, title: 'Enterprise Security', desc: 'Enterprise-grade security with role-based access control and end-to-end encryption.' },
                  ].map((item, i) => (
                     <div key={i} className="p-10 rounded-2xl border border-white/5 bg-white/60 border border-black/5 p-10 rounded-2xl shadow-sm backdrop-blur-md hover:shadow-md hover:border-blue-200 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-8 border border-blue-500/20 text-blue-500 group-hover:bg-blue-600 group-hover:text-slate-900 transition-all">
                           <item.icon size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* SECTION 4: PRODUCT WORKFLOW */}
         <section className="py-32 px-8 relative overflow-hidden bg-white/[0.01]">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-24 space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                     How TalklyAI Turns <br /> <span className="text-blue-500 text-5xl md:text-6xl">Conversations Into Sales Intelligence</span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                     From raw customer conversations to actionable business insights in real time.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {/* Step 1: Customer Conversation */}
                  <div className="space-y-6">
                     <div className="h-[300px] rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                 <PhoneIncoming size={16} className="text-blue-500" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Incoming Call</span>
                           </div>
                           <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                              <p className="text-xs italic" style={{ color: '#7A869A' }}>"I'm looking for a 3BHK property in Gurgaon under 2 crore."</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-sm font-medium" style={{ color: '#4B5E84' }}>1. Customer Speaks</h4>
                           <p className="text-[10px] leading-relaxed font-normal" style={{ color: '#667085' }}>Customers interact through calls or chats.</p>
                        </div>
                     </div>
                  </div>

                  {/* Step 2: AI Analysis */}
                  <div className="space-y-6">
                     <div className="h-[300px] rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                 <Sparkles size={16} className="text-blue-500" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">AI Analysis</span>
                           </div>
                           <div className="flex items-center gap-1.5 h-12">
                              {[...Array(8)].map((_, i) => (
                                 <motion.div
                                    key={i}
                                    animate={{ height: [4, 24, 8, 32, 4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                    className="flex-1 bg-blue-500/40 rounded-full"
                                 />
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-sm font-medium" style={{ color: '#4B5E84' }}>2. AI Analysis</h4>
                           <p className="text-[10px] leading-relaxed font-normal" style={{ color: '#667085' }}>TalklyAI listens and analyzes every interaction automatically.</p>
                        </div>
                     </div>
                  </div>

                  {/* Step 3: Intelligence Extraction */}
                  <div className="space-y-6">
                     <div className="h-[300px] rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between">
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                 <Layers size={16} className="text-blue-500" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Extraction</span>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              {['High Intent', 'Budget Found', 'Gurgaon', 'Pricing Objection'].map((tag, i) => (
                                 <div key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-bold text-blue-400">
                                    {tag}
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-sm font-medium" style={{ color: '#4B5E84' }}>3. Intelligence Extraction</h4>
                           <p className="text-[10px] leading-relaxed font-normal" style={{ color: '#667085' }}>AI transforms conversations into structured intelligence.</p>
                        </div>
                     </div>
                  </div>

                  {/* Step 4: Lead Qualification */}
                  <div className="space-y-6">
                     <div className="h-[300px] rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                 <Target size={16} className="text-blue-500" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Qualification</span>
                           </div>
                           <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                              <p className="text-2xl font-black text-emerald-500">🔥 HOT</p>
                              <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Score: 92/100</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-sm font-medium" style={{ color: '#4B5E84' }}>4. Lead Qualification</h4>
                           <p className="text-[10px] leading-relaxed font-normal" style={{ color: '#667085' }}>High-value leads are automatically prioritized.</p>
                        </div>
                     </div>
                  </div>

                  {/* Step 5: Sales Action */}
                  <div className="space-y-6">
                     <div className="h-[300px] rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                 <LayoutDashboard size={16} className="text-blue-500" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Action</span>
                           </div>
                           <div className="space-y-2">
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 w-[80%]"></div>
                              </div>
                              <p className="text-[8px] font-medium" style={{ color: '#5F6C85' }}>Agent Performance: 88%</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-sm font-medium" style={{ color: '#4B5E84' }}>5. Sales Team Action</h4>
                           <p className="text-[10px] leading-relaxed font-normal" style={{ color: '#667085' }}>Teams take faster, smarter action to improve conversions.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* SECTION 5: FINAL CTA */}
         <section className="py-32 px-8 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
               <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  Ready to See TalklyAI in Action?
               </h2>
               <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                  Experience how AI transforms customer conversations into actionable sales intelligence.
               </p>
               <div className="flex flex-wrap justify-center gap-6 pt-4">
                  <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-md font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                     Book Demo
                  </button>
                  <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-md font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                     View Product Demo
                  </button>
               </div>
            </div>
         </section>

         {/* MINIMAL PREMIUM FOOTER */}
         <footer className="py-16 px-8 border-t border-black/5 bg-white/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                     <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                        <img src="/logo.png" alt="TalklyAI" className="w-full h-full object-cover" />
                     </div>
                     <span className="text-xl font-bold tracking-tight text-slate-900">TalklyAI</span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium">
                     AI-powered Sales Conversation Intelligence
                  </p>
                  <div className="flex justify-center md:justify-start">
                     <p className="text-[9px] font-black text-slate-400 flex items-center gap-2 border border-black/10 px-3 py-1.5 rounded-full">
                        <ShieldCheck size={12} className="text-blue-600" /> Enterprise-Grade Security
                     </p>
                  </div>
               </div>

               <div className="flex flex-col items-center md:items-end gap-4">
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">This product is made by Novalantis.</p>
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] opacity-50">Built for modern sales teams</p>
               </div>
            </div>
         </footer>
      </div>
   );
};

export default LandingPage;
