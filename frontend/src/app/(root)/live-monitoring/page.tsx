'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Activity,
  Phone,
  Loader2,
  CheckCircle2,
  PhoneCall,
  BrainCircuit,
  XCircle,
  Sparkles,
  PhoneForwarded,
  Volume2,
  User,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CallStatus = 'Idle' | 'Dialing' | 'Ringing' | 'Connected' | 'AI Speaking' | 'Customer Speaking' | 'Ended' | 'Failed' | 'Analyzing';

export default function LiveMonitoringPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [campaignLanguage, setCampaignLanguage] = useState('English');
  const [aiVoice, setAiVoice] = useState('Default');
  const [voiceGender, setVoiceGender] = useState('Female');
  const [regionalAccent, setRegionalAccent] = useState('Default');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('Idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<{ speaker: 'AI' | 'Customer', text: string }[]>([]);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveTranscript]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Polling for Live Transcript
  useEffect(() => {
    let pollInterval: any;
    if (isCallActive && currentCallId) {
      pollInterval = setInterval(async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const res = await fetch(`${apiUrl}/calls/${currentCallId}`);
          if (res.ok) {
            const callData = await res.json();
            
            // Update Transcript
            if (callData.transcript) {
              const lines = callData.transcript.trim().split('\n').filter((l: string) => l.trim() !== "");
              const formattedTranscript: { speaker: 'AI' | 'Customer', text: string }[] = lines.map((line: string) => {
                const isAssistant = line.toLowerCase().startsWith('assistant:') || line.toLowerCase().startsWith('agent:');
                const cleanText = line.replace(/^(assistant|user|agent):\s*/i, '');
                return { speaker: isAssistant ? 'AI' : 'Customer', text: cleanText };
              });
              setLiveTranscript(formattedTranscript);
              
              // Determine Speaker State
              const lastLine = lines[lines.length - 1]?.toLowerCase() || "";
              if (lastLine.includes('assistant:') || lastLine.includes('agent:')) {
                setCallStatus('AI Speaking');
              } else if (lastLine.includes('user:') || lastLine.includes('customer:')) {
                setCallStatus('Customer Speaking');
              } else {
                setCallStatus('Connected');
              }
            }

            // Sync Status from Backend
            const backendStatus = callData.status;
            if (backendStatus === 'Ringing') setCallStatus('Ringing');
            if (backendStatus === 'Failed') setCallStatus('Failed');
            if (backendStatus === 'Ended' || backendStatus === 'Completed') {
              setCallStatus('Ended');
              setIsCallActive(false);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(pollInterval);
  }, [isCallActive, currentCallId]);

  const startCall = async () => {
    if (!phoneNumber) return;
    
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.length === 10 && !formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const tempId = `call_${Date.now()}`;
    setCurrentCallId(tempId);
    setIsCallActive(true);
    setCallStatus('Dialing');
    setLiveTranscript([]);
    setResult(null);
    setElapsed(0);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/calls/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: formattedPhone, 
          lead_id: tempId,
          campaign_language: campaignLanguage,
          ai_voice: aiVoice,
          voice_gender: voiceGender,
          regional_accent: regionalAccent
        })
      });
      if (!res.ok) {
        const errorDetail = await res.text();
        throw new Error(errorDetail || "An unknown error occurred");
      }
    } catch (err: any) {
      alert(`Call failed: ${err.message}`);
      setIsCallActive(false);
      setCallStatus('Idle');
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('campaign_language', campaignLanguage);
      formData.append('ai_voice', aiVoice);
      formData.append('voice_gender', voiceGender);
      formData.append('regional_accent', regionalAccent);
      
      const res = await fetch(`${apiUrl}/calls/trigger-bulk`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorDetail = await res.text();
        throw new Error(errorDetail || "An unknown error occurred");
      }
      
      const data = await res.json();
      alert(`Success: ${data.message}`);
      setSelectedFile(null);
    } catch (err: any) {
      alert(`Bulk upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const stopCall = () => {
    if (!currentCallId) return;

    setCallStatus('Analyzing');
    setIsCallActive(false);
    
    let attempts = 0;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const pollFinal = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${apiUrl}/calls/${currentCallId}`);
        if (res.ok) {
          const callData = await res.json();
          if (callData.status === 'Analyzed' || callData.status === 'Completed' || attempts > 10) {
            clearInterval(pollFinal);
            if (callData.status === 'Analyzed') {
              setResult({
                summary: callData.summary || "Call analyzed.",
                intentScore: callData.analysis?.intent_score || 0,
                leadTemperature: callData.analysis?.lead_temperature || "Warm Lead"
              });
            } else {
              setResult({
                summary: "Call ended. Partial data captured.",
                intentScore: 0,
                leadTemperature: "Cold Lead"
              });
            }
            setCallStatus('Idle');
          }
        }
      } catch (err) {
        console.error("Final poll error:", err);
        if (attempts > 10) {
          clearInterval(pollFinal);
          setCallStatus('Idle');
        }
      }
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Live Analysis
            <span className="text-[10px] font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded uppercase tracking-wider ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
            </span>
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Initiate and monitor AI-powered outbound sales calls in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Console */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/[0.06] rounded-2xl flex flex-col min-h-[500px] shadow-sm relative overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/[0.06] flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${isCallActive ? 'bg-theme-50 dark:bg-brand-primary/10 border-theme-100 dark:border-brand-primary/20 text-theme-600 dark:text-brand-primary' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'}`}>
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">AI Sales Session</h3>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">Outbound voice agent</p>
                </div>
              </div>
              
              {isCallActive && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 dark:bg-black/50 border border-gray-800 dark:border-white/10 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[13px] font-bold text-white tracking-wider">{formatTime(elapsed)}</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-6 flex flex-col relative z-10">
              <AnimatePresence mode="wait">
                
                {/* IDLE STATE */}
                {!isCallActive && !result && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm relative group">
                      <div className="absolute inset-0 bg-theme-500/5 dark:bg-brand-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <PhoneForwarded className="w-8 h-8 text-gray-400 group-hover:text-theme-600 dark:group-hover:text-brand-primary transition-colors relative z-10" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Initiate Live Call</h3>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8">
                      Enter a customer's phone number to dispatch the AI agent. The agent will attempt to qualify the lead automatically.
                    </p>
                    
                    <div className="w-full space-y-4">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="text" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98765 43210" 
                          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 dark:focus:border-brand-primary text-[15px] font-medium text-gray-900 dark:text-white outline-none transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        />
                      </div>
                      
                      {/* Advanced Settings */}
                      <div className="grid grid-cols-2 gap-3 mt-4 mb-2">
                        <select 
                          value={campaignLanguage}
                          onChange={(e) => setCampaignLanguage(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white dark:bg-bg-dark-card border border-gray-200 dark:border-white/10 rounded-lg text-[13px] font-medium text-gray-900 dark:text-white outline-none focus:border-theme-500"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Marathi">Marathi</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Punjabi">Punjabi</option>
                          <option value="Bhojpuri">Bhojpuri</option>
                          <option value="Odia">Odia</option>
                          <option value="Assamese">Assamese</option>
                          <option value="Urdu">Urdu</option>
                        </select>
                        
                        <select 
                          value={voiceGender}
                          onChange={(e) => setVoiceGender(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white dark:bg-bg-dark-card border border-gray-200 dark:border-white/10 rounded-lg text-[13px] font-medium text-gray-900 dark:text-white outline-none focus:border-theme-500"
                        >
                          <option value="Female">Female Voice</option>
                          <option value="Male">Male Voice</option>
                        </select>
                      </div>

                      <button  
                        onClick={startCall}
                        disabled={!phoneNumber}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-primary to-brand-grad-1 text-bg-dark-card text-[14px] font-bold rounded-xl shadow-lg shadow-brand-grad-1/20 hover:shadow-brand-grad-1/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PhoneCall className="w-4 h-4" /> Start AI Call
                      </button>

                      <div className="flex items-center gap-4 py-2">
                        <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                        <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                      </div>

                      <div className="relative">
                        <input 
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="w-full py-3.5 px-4 bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-[13px] text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-theme-100 file:text-theme-700 dark:file:bg-brand-primary/20 dark:file:text-brand-primary hover:file:bg-theme-200 dark:hover:file:bg-brand-primary/30 cursor-pointer transition-all"
                        />
                      </div>
                      <button 
                        onClick={handleBulkUpload}
                        disabled={!selectedFile || isUploading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-bg-dark-base text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
                        {isUploading ? "Processing Bulk Calls..." : "Upload Excel & Call All"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ACTIVE CALL STATE */}
                {isCallActive && (
                  <motion.div 
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col h-full"
                  >
                    {/* Status Bar */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 mb-6">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-bg-dark-card border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 relative">
                        {callStatus === 'AI Speaking' && <Volume2 className="w-4 h-4 text-theme-600 dark:text-brand-primary animate-pulse" />}
                        {callStatus === 'Customer Speaking' && <User className="w-4 h-4 text-green-500 animate-pulse" />}
                        {callStatus !== 'AI Speaking' && callStatus !== 'Customer Speaking' && <BrainCircuit className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Line Status</p>
                        <p className="text-[14px] font-semibold text-gray-900 dark:text-white">
                          {callStatus === 'Dialing' && `Dialing ${phoneNumber}...`}
                          {callStatus === 'Ringing' && `Ringing...`}
                          {callStatus === 'Connected' && `Connected. Analyzing stream...`}
                          {callStatus === 'AI Speaking' && `TalklyAI is speaking...`}
                          {callStatus === 'Customer Speaking' && `Customer is speaking...`}
                        </p>
                      </div>
                      {/* Audio visualizer mock */}
                      {(callStatus === 'AI Speaking' || callStatus === 'Customer Speaking') && (
                        <div className="flex items-center gap-1 h-6">
                          {[1,2,3,4,5].map(i => (
                            <motion.div 
                              key={i}
                              className={`w-1 rounded-full ${callStatus === 'AI Speaking' ? 'bg-brand-primary' : 'bg-green-400'}`}
                              animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                              transition={{ duration: 0.5 + (i * 0.1), repeat: Infinity, repeatType: "mirror" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Live Transcript */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[250px] custom-scrollbar pb-4">
                      {liveTranscript.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[13px] text-gray-400 italic">
                          Waiting for speech...
                        </div>
                      ) : (
                        liveTranscript.map((msg, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx} 
                            className={`flex flex-col max-w-[85%] ${msg.speaker === 'Customer' ? 'self-end items-end ml-auto' : 'self-start items-start'}`}
                          >
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1 px-1">
                              {msg.speaker === 'AI' ? 'TalklyAI Agent' : 'Customer'}
                            </span>
                            <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                              msg.speaker === 'Customer' 
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-bg-dark-base rounded-tr-sm' 
                                : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-tl-sm'
                            }`}>
                              {msg.text}
                            </div>
                          </motion.div>
                        ))
                      )}
                      <div ref={transcriptEndRef} />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                      <button 
                        onClick={stopCall}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[13px] font-bold rounded-xl border border-red-100 dark:border-red-500/20 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> End Active Session
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* RESULT STATE */}
                {result && !isCallActive && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-4 p-5 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 mb-8">
                      <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Call Completed</h3>
                        <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">Intelligence has been successfully mapped from the live session.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Intent Score</p>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{result.intentScore}</span>
                            <span className="text-sm font-semibold text-gray-400 pb-1">/ 100</span>
                          </div>
                        </div>
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Lead Temp</p>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold border ${
                            result.leadTemperature === 'Hot Lead' 
                              ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' 
                              : 'bg-theme-100 dark:bg-brand-primary/10 text-theme-700 dark:text-brand-primary border-theme-200 dark:border-brand-primary/20'
                          }`}>
                            <Flame className="w-4 h-4" /> {result.leadTemperature}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[12px] font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brand-primary" /> Analysis Summary
                        </h4>
                        <div className="p-5 rounded-xl bg-theme-50/50 dark:bg-brand-primary/[0.02] border border-theme-100/50 dark:border-brand-primary/10">
                          <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {result.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => setResult(null)}
                        className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-bg-dark-base text-[13px] font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        Start New Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          
          {/* Live Intelligence Panel */}
          <div className="bg-gray-900 dark:bg-bg-dark-surface border border-gray-800 dark:border-white/[0.06] rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none" />
            
            <h3 className="text-[15px] font-bold mb-6 flex items-center gap-2 relative z-10">
              <BrainCircuit className="w-5 h-5 text-blue-400" />
              Live Intelligence
            </h3>
            
            <div className="space-y-5 relative z-10">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">System Status</p>
                <div className="flex items-center gap-3">
                  {callStatus === 'Analyzing' || callStatus === 'Dialing' || callStatus === 'Ringing' ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : isCallActive ? (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  )}
                  <p className="text-[13px] font-semibold text-gray-200">
                    {!isCallActive && !result && "Ready for connection"}
                    {callStatus === 'Dialing' && "Establishing line..."}
                    {callStatus === 'Ringing' && "Waiting for pickup"}
                    {callStatus === 'Connected' && "Line secured"}
                    {callStatus === 'AI Speaking' && "Agent responding"}
                    {callStatus === 'Customer Speaking' && "Receiving input"}
                    {callStatus === 'Analyzing' && "Processing data models..."}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Real-time Coaching
                </h4>
                <p className="text-[12px] text-blue-100/80 leading-relaxed">
                  {isCallActive 
                    ? "The AI is dynamically adjusting questions based on customer responses to maximize intent score discovery."
                    : "Enter a phone number to dispatch the agent. The system will auto-detect voicemail vs human pickup."}
                </p>
              </div>
            </div>
          </div>

          {/* Tips Panel */}
          <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm dark:shadow-none">
             <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-theme-600 dark:text-brand-primary" />
                Dialer Guidelines
              </h4>
              <ul className="text-[12px] space-y-3 text-gray-600 dark:text-gray-400 font-medium">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5" />
                  Always use valid country codes (e.g. +91)
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5" />
                  Ensure you have sufficient Voice Minutes in your plan
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5" />
                  Transcripts may have a 1-2s latency during live generation
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

