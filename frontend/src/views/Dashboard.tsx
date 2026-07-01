import React, { useState, useMemo, useRef } from "react";
import {
  UploadCloud,
  Mic,
  Globe2,
  FileAudio,
  Play,
  Pause,
  AlertCircle,
  BarChart3,
  MessageSquare,
  CheckCircle2, CheckSquare,
  Tag,
  Copy,
  Flame,
  Home,
  MapPin,
  Calendar,
  Wallet,
  TrendingUp,
  ChevronRight,
  Download,
  Languages,
  Check,
  Zap,
  Target,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { CallInteraction } from "../types";
import { api } from "../services/api";

interface DashboardProps {
  interactions: CallInteraction[];
  onAnalysisComplete: () => void;
  onOpenRecordModal: () => void;
  isProcessingLiveAudio?: boolean;
  selectedCallId: string | null;
  onSelectCall: (id: string | null) => void;
}

const SENTIMENT_COLORS = {
  positive: "#10b981",
  neutral: "#94a3b8",
  negative: "#ef4444",
};

const INTENT_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

const formatShortDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard: React.FC<DashboardProps> = ({
  interactions,
  onAnalysisComplete,
  onOpenRecordModal,
  isProcessingLiveAudio = false,
  selectedCallId,
  onSelectCall,
}) => {
  const [analyzing, setAnalyzing] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedCall = useMemo(
    () => interactions.find((c) => c.id === selectedCallId) || null,
    [interactions, selectedCallId]
  );

  const processFile = async (file: File) => {
    const agentName = prompt("Enter the name of the agent who handled this call:", "AI Agent");
    setAnalyzing(true);
    try {
      await api.uploadAudio(file, agentName || "AI Agent");
      await onAnalysisComplete();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // --- Metrics ---
  const totalAudios = interactions.length;
  const hotLeadsCount = interactions.filter(i => i.leadTemperature === "Hot").length;
  
  const avgIntentScore = useMemo(() => {
    if (!totalAudios) return 0;
    const total = interactions.reduce((acc, i) => acc + (i.intentScore || 50), 0);
    return Math.round(total / totalAudios);
  }, [interactions, totalAudios]);

  const languagesProcessed = useMemo(() => {
    const langs = new Set<string>();
    interactions.forEach((i) => {
      if (i.language) langs.add(i.language);
    });
    return langs.size || 1;
  }, [interactions]);

  const languageDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    interactions.forEach((i) => {
      // Normalize language name slightly
      const lang = i.language ? i.language.split('/')[0].trim() : "English";
      counts[lang] = (counts[lang] || 0) + 1;
      total++;
    });
    
    if (total === 0) return [];
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, value: Math.round((count / total) * 100) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4); // Top 4 languages
  }, [interactions]);

  const sentimentData = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    interactions.forEach((i) => {
      const s = (i.sentiment || "neutral").toLowerCase();
      if (s.includes("positive")) counts.positive++;
      else if (s.includes("negative")) counts.negative++;
      else counts.neutral++;
    });
    return [
      { name: "Positive", value: counts.positive, color: SENTIMENT_COLORS.positive },
      { name: "Neutral", value: counts.neutral, color: SENTIMENT_COLORS.neutral },
      { name: "Negative", value: counts.negative, color: SENTIMENT_COLORS.negative },
    ].filter(d => d.value > 0);
  }, [interactions]);

  const trendingTopics = useMemo(() => {
    const topicCount: Record<string, number> = {};
    interactions.forEach((call) => {
      if (Array.isArray(call.tags)) {
        call.tags.forEach((tag) => {
          topicCount[tag] = (topicCount[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [interactions]);

  const actionItems = useMemo(() => {
    if (!selectedCall || !selectedCall.analysis?.action_items) return [];
    return selectedCall.analysis.action_items;
  }, [selectedCall]);

  const isProcessing = analyzing || isProcessingLiveAudio;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50/50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 min-h-[300px] flex items-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
             <img 
               src="/realty_voice_ai_bg.png" 
               className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-[10s] ease-linear animate-pulse" 
               alt="AI Analytics Background"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-10 md:p-14 w-full flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 animate-fade-in">
                <div className="ai-wave"><span></span><span></span><span></span><span></span><span></span></div>
                Multilingual AI Engine Active
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight mb-4">
                Talkly<span className="text-blue-500">AI</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-xl">
                Transform every real estate conversation into actionable leads and property insights. Supporting English, Hindi, Hinglish, and regional languages.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="gap-2 h-12 px-6 text-[15px] font-semibold premium-gradient border-none shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                >
                  <UploadCloud size={20} />
                  Upload Sales Call
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 h-12 px-6 text-[15px] font-semibold border-slate-700 text-white hover:bg-slate-800 transition-all" 
                  onClick={onOpenRecordModal}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  Live Stream Call
                </Button>
                <input id="file-upload" type="file" hidden accept="audio/*" onChange={handleFileInput} />
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4 w-72 glass-card p-6 rounded-2xl border-white/10">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Health</span>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-300">AI Transcription</span>
                     <span className="text-sm font-mono text-green-400">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-300">Intent Accuracy</span>
                     <span className="text-sm font-mono text-blue-400">96.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-300">Languages</span>
                     <span className="text-sm font-mono text-purple-400">12+</span>
                  </div>
               </div>
               <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Zap size={20} />
                     </div>
                     <div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase">Real-time Insight</div>
                        <div className="text-xs text-white">Detecting buyer intent...</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {isProcessing && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
               <div className="h-full bg-blue-500 shimmer w-full"></div>
            </div>
          )}
        </div>

        {/* TOP METRICS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard title="Total Leads" value={totalAudios} icon={<FileAudio size={22} className="text-blue-500" />} color="blue" />
          <MetricCard title="Hot Leads" value={hotLeadsCount} icon={<Flame size={22} className="text-orange-500" />} color="orange" trend="+12% vs LW" />
          <MetricCard title="Buyer Intent Score" value={`${avgIntentScore}%`} icon={<Target size={22} className="text-purple-500" />} color="purple" />
          <MetricCard title="Languages" value={languagesProcessed} icon={<Globe2 size={22} className="text-indigo-500" />} color="indigo" />
          <MetricCard title="Conversions" value={interactions.filter(i => i.converted).length} icon={<CheckCircle2 size={22} className="text-green-500" />} color="green" trend="+5% LW" />
        </div>

        {/* MAIN ANALYSIS CENTER */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CALL ANALYSIS (8 Cols) */}
          <div className="xl:col-span-8 space-y-8">
            <Card className="p-0 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
              
              <div className="bg-slate-900 text-white p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <h2 className="text-2xl font-bold tracking-tight">
                            {selectedCall ? (selectedCall.customerName || `Lead #${String(selectedCall.id || "").slice(-4)}`) : "Select a Call to Analyze"}
                         </h2>
                         {selectedCall && (
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                             selectedCall.leadTemperature === "Hot" ? "bg-orange-500 text-white" : 
                             selectedCall.leadTemperature === "Warm" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"
                           }`}>
                             {selectedCall.leadTemperature || "Processing"} Lead
                           </span>
                         )}
                      </div>
                      <p className="text-slate-400 text-sm flex items-center gap-4">
                         <span className="flex items-center gap-1.5"><Calendar size={14} /> {selectedCall ? formatShortDate(selectedCall.date) : "N/A"}</span>
                         <span className="flex items-center gap-1.5"><Globe2 size={14} /> {selectedCall?.language || "Detecting..."}</span>
                      </p>
                   </div>
                   
                   {selectedCall && (
                     <div className="flex gap-3">
                        <Button 
                           size="sm" 
                           variant="outline" 
                           className="h-10 px-4 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
                           onClick={() => api.downloadOverallExcel()}
                        >
                           <Download size={16} /> Export
                        </Button>
                        <Button 
                           size="sm" 
                           className="h-10 px-4 premium-gradient border-none gap-2"
                           onClick={() => {
                             const text = `Lead: ${selectedCall.customerName}\nSummary: ${selectedCall.summary}\nIntent: ${selectedCall.intentScore}%`;
                             navigator.clipboard.writeText(text);
                             alert("Analysis copied to clipboard!");
                           }}
                        >
                           <Copy size={16} /> Copy Analysis
                        </Button>
                     </div>
                   )}
                </div>

                {selectedCall && (
                  <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-6">
                    <button onClick={togglePlayPause} className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                       {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
                    </button>
                    <div className="flex-1 space-y-2">
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-1/4 rounded-full"></div>
                       </div>
                       <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>0:45</span>
                          <span>{selectedCall.duration || "0:00"}</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {!selectedCall ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 min-h-[600px]">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Mic size={40} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Call Selected</h3>
                  <p className="text-slate-500 text-center max-w-sm">Select a recording from the lead table below to view deep AI intelligence and property requirements.</p>
                </div>
              ) : (
                <div className="p-8 space-y-10">
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1">Intent Score</div>
                        <div className="flex items-end gap-2">
                           <span className="text-2xl font-bold text-slate-900">{selectedCall.intentScore || 0}%</span>
                           <span className="text-xs text-blue-500 font-medium mb-1">High Intent</span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-100 rounded-full mt-3 overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${selectedCall.intentScore || 0}%` }}></div>
                        </div>
                     </div>
                     <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                        <div className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-1">Sentiment</div>
                        <div className="flex items-center gap-2">
                           <SentimentBadge sentiment={selectedCall.sentiment} />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-3 font-medium">Confidence: {Math.round((selectedCall.sentimentConfidence || 0) * 100)}%</div>
                     </div>
                     <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/50">
                        <div className="text-[11px] font-bold text-purple-600 uppercase tracking-widest mb-1">Language</div>
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                           <Languages size={18} className="text-purple-500" />
                           {selectedCall.language || "English"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 font-medium">Auto-detected</div>
                     </div>
                     <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                        <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Conversion Prob.</div>
                        <div className="text-2xl font-bold text-slate-900">{(selectedCall.conversionProbability || 0) * 100}%</div>
                        <div className="h-1.5 w-full bg-emerald-100 rounded-full mt-3 overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${(selectedCall.conversionProbability || 0) * 100}%` }}></div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           <MessageSquare size={20} className="text-blue-500" /> AI Conversation Summary
                        </h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                           <button className="px-3 py-1 text-xs font-bold rounded-md bg-white shadow-sm text-slate-900">English</button>
                           <button className="px-3 py-1 text-xs font-bold rounded-md text-slate-500">{selectedCall.language?.split(" ")[0] || "Hindi"}</button>
                        </div>
                     </div>
                     <p className="text-slate-600 leading-relaxed text-[15px] bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {selectedCall.summary || "Summary processing..."}
                     </p>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Home size={20} className="text-indigo-500" /> Property Requirements
                     </h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <RequirementItem icon={<Wallet size={16}/>} label="Budget" value={selectedCall.propertyRequirements?.budget || "N/A"} color="emerald" />
                        <RequirementItem icon={<MapPin size={16}/>} label="Location" value={selectedCall.propertyRequirements?.location || "N/A"} color="blue" />
                        <RequirementItem icon={<Home size={16}/>} label="Type" value={selectedCall.propertyRequirements?.propertyType || "N/A"} color="indigo" />
                        <RequirementItem icon={<Calendar size={16}/>} label="Timeline" value={selectedCall.propertyRequirements?.timeline || "N/A"} color="orange" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           <Mic size={20} className="text-purple-500" /> Call Transcript
                        </h3>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                              <span className="text-xs font-bold text-slate-500">Show Translation</span>
                              <button 
                                 onClick={() => setShowTranslation(!showTranslation)}
                                 className={`w-9 h-5 rounded-full transition-colors relative ${showTranslation ? "bg-blue-600" : "bg-slate-300"}`}
                              >
                                 <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${showTranslation ? "left-4.5" : "left-0.5"}`}></div>
                              </button>
                           </div>
                        </div>
                     </div>
                     
                     <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[400px] overflow-y-auto space-y-6">
                        {selectedCall.transcript ? (
                           selectedCall.transcript.split("\n").map((line, idx) => {
                              const match = line.match(/^(Agent|Customer|Unknown):\s*(.*)/i);
                              const speaker = match ? match[1] : "Unknown";
                              const text = match ? match[2] : line;
                              
                              if (!text.trim()) return null;

                              return (
                                 <TranscriptLine 
                                    key={idx}
                                    speaker={speaker} 
                                    time={`0:${(idx * 8).toString().padStart(2, '0')}`} 
                                    text={text} 
                                    translation={showTranslation && speaker !== "Agent" ? selectedCall.englishTranslation : undefined}
                                    isMultilingual={speaker !== "Agent" && selectedCall.language?.toLowerCase() !== "english"}
                                 />
                              );
                           })
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full text-slate-400">
                              <p>No transcript available for this call.</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           <CheckSquare size={20} className="text-orange-500" /> Follow-Up Actions
                        </h3>
                        <div className="space-y-3">
                           {actionItems && actionItems.length > 0 ? (
                              actionItems.map((item: string, idx: number) => (
                                 <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group cursor-pointer">
                                    <div className="w-6 h-6 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-colors">
                                       <Check size={14} className="text-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">{item}</span>
                                 </div>
                              ))
                           ) : (
                              <p className="text-sm text-slate-400 italic p-4">No follow-up actions identified.</p>
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           <Tag size={20} className="text-blue-500" /> Extracted Insights
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {selectedCall.tags && selectedCall.tags.length > 0 ? (
                              selectedCall.tags.map((tag, i) => (
                                 <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold uppercase tracking-wider">
                                    {tag}
                                 </span>
                              ))
                           ) : (
                              <p className="text-sm text-slate-400 italic">No tags identified.</p>
                           )}
                        </div>
                     </div>
                  </div>

                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-4 space-y-8">
             <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <TrendingUp size={20} className="text-blue-500" /> Regional Lead Insights
                </h3>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendingTopics}>
                         <XAxis dataKey="name" hide />
                         <YAxis hide />
                         <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                           cursor={{ fill: '#f8fafc' }}
                         />
                         <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {trendingTopics.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={INTENT_COLORS[index % INTENT_COLORS.length]} />
                            ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-4">
                   {trendingTopics.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: INTENT_COLORS[idx % INTENT_COLORS.length] }}></div>
                            <span className="text-sm font-medium text-slate-600">{item.name}</span>
                         </div>
                         <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                      </div>
                   ))}
                </div>
             </Card>

             <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <PieChartIcon size={20} className="text-indigo-500" /> Buyer Intent Split
                </h3>
                <div className="h-[220px] w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie 
                           data={sentimentData} 
                           innerRadius={60} 
                           outerRadius={90} 
                           paddingAngle={5} 
                           dataKey="value"
                           stroke="none"
                         >
                            {sentimentData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-slate-900">{avgIntentScore}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Intent</span>
                   </div>
                </div>
                <div className="mt-8 flex justify-around">
                   {sentimentData.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                         <div className="text-sm font-bold text-slate-900">{item.value}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</div>
                      </div>
                   ))}
                </div>
             </Card>

             <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Globe2 size={120} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">Language Analysis</h3>
                <p className="text-sm text-slate-500 mb-6 relative z-10">Regional language processing dashboard.</p>
                
                <div className="space-y-5 relative z-10">
                   {languageDistribution.length > 0 ? languageDistribution.map((lang, idx) => {
                      const colors = ["blue", "orange", "purple", "emerald"];
                      return <LanguageProgress key={idx} label={lang.name} value={lang.value} color={colors[idx % colors.length]} />
                   }) : (
                      <div className="text-slate-500 text-sm italic">No language data available.</div>
                   )}
                </div>

                <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <Languages size={20} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-indigo-700 uppercase">Pro Tip</div>
                      <div className="text-[11px] text-indigo-600">Hindi/English mix (Hinglish) detects highest conversion intent.</div>
                   </div>
                </div>
             </Card>
          </div>

        </div>

        <div id="leads-table">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
             <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">Multilingual Lead Manager</h3>
                 <p className="text-sm text-slate-500 mt-1">Real-time intelligence from ongoing property sales conversations.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <input 
                       type="text" 
                       placeholder="Search leads..." 
                       className="w-full h-11 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Target size={18} className="absolute left-3 top-3 text-slate-400" />
                 </div>
                 <Button 
                    variant="outline" 
                    className="h-11 rounded-xl border-slate-200 gap-2 text-slate-600" 
                    onClick={() => api.downloadOverallExcel()}
                 >
                    <Download size={18} /> Export Excel
                 </Button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                       <th className="px-8 py-4">Customer</th>
                       <th className="px-8 py-4">Language</th>
                       <th className="px-8 py-4">Budget</th>
                       <th className="px-8 py-4">Location</th>
                       <th className="px-8 py-4">Intent Score</th>
                       <th className="px-8 py-4">Lead Status</th>
                       <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {interactions.length === 0 ? (
                       <tr>
                          <td colSpan={7} className="px-8 py-20 text-center text-slate-400">
                             <div className="flex flex-col items-center">
                                <FileAudio size={48} className="text-slate-200 mb-4" />
                                <p>No leads detected yet. Upload audio to begin.</p>
                             </div>
                          </td>
                       </tr>
                    ) : (
                       interactions.map((lead) => (
                          <tr 
                             key={lead.id} 
                             onClick={() => onSelectCall(lead.id)}
                             className={`group hover:bg-slate-50 transition-colors cursor-pointer ${selectedCallId === lead.id ? 'bg-blue-50/50' : ''}`}
                          >
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                      lead.leadTemperature === "Hot" ? "bg-orange-500" : 
                                      lead.leadTemperature === "Warm" ? "bg-blue-500" : "bg-slate-400"
                                   }`}>
                                      {lead.customerName?.[0] || lead.customerId?.[0] || "C"}
                                   </div>
                                   <div>
                                      <div className="text-sm font-bold text-slate-900">{lead.customerName && lead.customerName !== "NA" ? lead.customerName : `Lead #${String(lead.id || "").slice(-4)}`}</div>
                                      <div className="text-xs text-slate-400 font-medium">{formatShortDate(lead.date)}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                   <Languages size={14} className="text-slate-400" />
                                   {lead.language || "Hindi"}
                                </div>
                             </td>
                             <td className="px-8 py-5 text-sm font-bold text-slate-700">
                                {lead.propertyRequirements?.budget || "N/A"}
                             </td>
                             <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                                {lead.propertyRequirements?.location || "N/A"}
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                   <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                         className={`h-full ${lead.intentScore && lead.intentScore > 80 ? 'bg-blue-500' : 'bg-slate-400'}`} 
                                         style={{ width: `${lead.intentScore || 65}%` }}
                                      ></div>
                                   </div>
                                   <span className="text-xs font-bold text-slate-700">{lead.intentScore || 65}%</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                   lead.leadTemperature === "Hot" ? "bg-orange-100 text-orange-700" : 
                                   lead.leadTemperature === "Warm" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                   {lead.leadTemperature || "Warm"}
                                </span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                   <ChevronRight size={20} />
                                </button>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; trend?: string }> = ({ title, value, icon, color, trend }) => {
   const colors: Record<string, string> = {
      blue: "bg-blue-500/10 text-blue-600",
      orange: "bg-orange-500/10 text-orange-600",
      purple: "bg-purple-500/10 text-purple-600",
      indigo: "bg-indigo-500/10 text-indigo-600",
      green: "bg-green-500/10 text-green-600",
      slate: "bg-slate-500/10 text-slate-600",
   };

   return (
      <Card className="p-6 border-none shadow-lg shadow-slate-200/40 rounded-3xl bg-white hover:scale-[1.02] transition-transform cursor-default overflow-hidden relative">
         <div className="flex items-start justify-between relative z-10">
            <div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
               <h4 className="text-3xl font-display font-bold text-slate-900">{value}</h4>
               {trend && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-green-600">
                     <TrendingUp size={12} /> {trend}
                  </div>
               )}
            </div>
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
               {icon}
            </div>
         </div>
      </Card>
   );
};

const RequirementItem: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
   const colors: Record<string, string> = {
      blue: "text-blue-600 bg-blue-50",
      emerald: "text-emerald-600 bg-emerald-50",
      indigo: "text-indigo-600 bg-indigo-50",
      orange: "text-orange-600 bg-orange-50",
   };
   
   return (
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
         <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colors[color]}`}>
            {icon}
         </div>
         <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-bold text-slate-900 truncate">{value}</div>
         </div>
      </div>
   );
};

const TranscriptLine: React.FC<{ speaker: string; time: string; text: string; translation?: string; isMultilingual?: boolean }> = ({ speaker, time, text, translation, isMultilingual }) => (
   <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[13px] ${speaker === "Agent" ? "bg-slate-100 text-slate-600" : "bg-blue-600 text-white"}`}>
            {speaker[0]}
         </div>
         <div className="w-0.5 flex-1 bg-slate-100 mt-2 group-last:hidden"></div>
      </div>
      <div className="flex-1 pb-8">
         <div className="flex items-center gap-3 mb-1.5">
            <span className="text-sm font-bold text-slate-900">{speaker}</span>
            <span className="text-[10px] font-mono text-slate-400">{time}</span>
            {isMultilingual && (
               <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-bold uppercase">Multilingual</span>
            )}
         </div>
         <div className="space-y-3">
            <p className="text-[14px] text-slate-700 leading-relaxed font-medium">{text}</p>
            {translation && (
               <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3">
                  <Languages size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700 italic leading-relaxed">{translation}</p>
               </div>
            )}
         </div>
      </div>
   </div>
);

const SentimentBadge: React.FC<{ sentiment?: string }> = ({ sentiment }) => {
   const raw = (sentiment || "Neutral").toLowerCase();
   const isPositive = raw.includes("positive");
   const isNegative = raw.includes("negative");

   let colorClass = "bg-slate-100 text-slate-600 border-slate-200";
   let label = "Neutral";
   
   if (isPositive) {
      colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
      label = "Positive";
   } else if (isNegative) {
      colorClass = "bg-red-100 text-red-700 border-red-200";
      label = "Negative";
   }

   return (
      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
         {label}
      </span>
   );
};

const LanguageProgress: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
   const colors: Record<string, string> = {
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      slate: "bg-slate-500",
      emerald: "bg-emerald-500"
   };

   return (
      <div className="space-y-2">
         <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">{label}</span>
            <span className="text-slate-900">{value}%</span>
         </div>
         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${colors[color]}`} style={{ width: `${value}%` }}></div>
         </div>
      </div>
   );
};

export default Dashboard;
