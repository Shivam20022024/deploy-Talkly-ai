import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  Activity,
  Phone,
  Loader2,
  CheckCircle2,
  PhoneCall,
  User,
  BrainCircuit,
  XCircle
} from 'lucide-react';
import { api } from '../services/api';

const LiveCallAnalyzer: React.FC = () => {
  // Modes: 'bolna' (AI Phone Agent) is now the only mode
  
  // State for AI Phone Agent
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'Idle' | 'Dialing' | 'Ringing' | 'Connected' | 'AI Speaking' | 'Customer Speaking' | 'Ended' | 'Failed' | 'Analyzing'>('Idle');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer for calls
  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    } else if (!isCallActive) {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Polling for Live Transcript
  useEffect(() => {
    let pollInterval: any;
    if (isCallActive && currentCallId) {
      pollInterval = setInterval(async () => {
        try {
          const callData = await api.getCallById(currentCallId);
          if (callData) {
            // Update Transcript
            if (callData.transcript) {
              setLiveTranscript(callData.transcript);
              
              // Determine Speaker State
              const lines = callData.transcript.trim().split('\n');
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
            if (backendStatus === 'Failed') {
              setCallStatus('Failed');
              setIsCallActive(false);
            }
            if (backendStatus === 'Ended' || backendStatus === 'Completed') {
              setCallStatus('Ended');
              setIsCallActive(false);
            }
            if (backendStatus === 'Analyzed') {
              setResult(callData);
              setCallStatus('Idle');
              setIsCallActive(false);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000); // Poll every 2s for better real-time feel
    }
    return () => clearInterval(pollInterval);
  }, [isCallActive, currentCallId]);

  // --- Call Logic ---
  const startCall = async () => {
    if (!phoneNumber) return alert("Please enter a phone number");
    
    // Auto-fix format
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.length === 10 && !formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const tempId = `call_${Date.now()}`;
    setCurrentCallId(tempId);
    setIsCallActive(true);
    setCallStatus('Dialing');
    setLiveTranscript('');
    setResult(null);

    try {
      await api.triggerCall(formattedPhone, tempId);
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || err.message || "An unknown error occurred";
      alert(`Call failed: ${errorDetail}`);
      setIsCallActive(false);
      setCallStatus('Idle');
    }
  };

  const stopCall = async () => {
    if (!currentCallId) return;
    
    setCallStatus('Analyzing');
    setIsCallActive(false);

    // Poll for the final analysis results
    let attempts = 0;
    const pollFinal = setInterval(async () => {
      attempts++;
      try {
        const callData = await api.getCallById(currentCallId);
        if (callData.status === 'Analyzed' || attempts > 10) {
          clearInterval(pollFinal);
          if (callData.status === 'Analyzed') {
            setResult(callData);
          }
          setCallStatus('Idle');
        }
      } catch (err) {
        console.error("Final poll error:", err);
        clearInterval(pollFinal);
        setCallStatus('Idle');
      }
    }, 2000);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Live Analysis</h2>
          <p className="text-secondary">AI-powered insights for real-time sales calls</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <div className="px-4 py-2 bg-white text-emerald-600 shadow-sm rounded-lg text-sm font-bold flex items-center gap-2">
            <PhoneCall size={16} />
            AI Phone Agent
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card min-h-[500px] flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-700">
                <Activity size={18} className="text-emerald-500" />
                AI Sales Session
              </h3>
              {isCallActive && (
                <div className="flex items-center gap-2 text-red-600 animate-pulse font-mono font-bold text-sm">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  {formatTime(elapsed)}
                </div>
              )}
            </div>

            {!isCallActive && !result && (
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6">
                   <PhoneCall className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">AI Phone Agent Dialer</h3>
                <div className="w-full max-w-sm space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter customer number (+91...)" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <button 
                    onClick={startCall}
                    className="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full py-3 shadow-lg shadow-emerald-200"
                  >
                    Initiate AI Outbound Call
                  </button>
                </div>
              </div>
            )}

            {isCallActive && (
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <BrainCircuit size={16} className="text-slate-600" />
                    </div>
                    <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none">
                      <p className="text-xs font-bold text-slate-500 mb-1">AI ANALYZER</p>
                      <p className="text-sm text-slate-700">
                        {callStatus === 'Dialing' && `Initiating secure line to ${phoneNumber}...`}
                        {callStatus === 'Ringing' && `Calling ${phoneNumber}... Ringing.`}
                        {callStatus === 'Connected' && `Call Connected. Analyzing voice stream...`}
                        {callStatus === 'AI Speaking' && `AI Agent is speaking...`}
                        {callStatus === 'Customer Speaking' && `Customer is speaking...`}
                        {callStatus === 'Ended' && `Call disconnected. Finalizing intelligence...`}
                        {callStatus === 'Failed' && `Call failed or recipient was busy.`}
                        {callStatus === 'Analyzing' && `Analyzing conversation context...`}
                      </p>
                    </div>
                  </div>
                  
                  {liveTranscript && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Conversation History</p>
                      {liveTranscript.split('\n').filter(l => l.trim()).map((line, i) => {
                        const isAssistant = line.toLowerCase().startsWith('assistant:');
                        const cleanText = line.replace(/^(assistant|user|agent):\s*/i, '');
                        return (
                          <div key={i} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl ${isAssistant ? 'bg-slate-100 text-slate-800 rounded-tl-none' : 'bg-emerald-600 text-white rounded-tr-none shadow-sm'}`}>
                              <p className="text-[10px] font-bold opacity-60 mb-1 uppercase">
                                {isAssistant ? 'AI Agent' : 'Customer'}
                              </p>
                              <p className="text-sm leading-relaxed">{cleanText}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {result && (
               <div className="animate-fade-in w-full text-left">
               <div className="flex items-center gap-3 mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                 <CheckCircle2 className="text-emerald-600" size={24} />
                 <div>
                   <p className="font-bold text-emerald-900 text-sm">Session Complete</p>
                   <p className="text-xs text-emerald-800 opacity-80">Insights extracted from the phone call.</p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Analysis Summary</h4>
                   <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                     "{result.summary || "Conversation processed successfully."}"
                   </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="card p-4">
                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Intent Score</p>
                     <p className="text-xl font-bold text-primary">{result.analysis?.intent_score || result.intentScore || 0}%</p>
                   </div>
                   <div className="card p-4">
                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Lead Temp</p>
                     <p className="text-xl font-bold text-orange-500">{result.analysis?.lead_temperature || result.leadTemperature || 'Warm'}</p>
                   </div>
                 </div>
                 <button onClick={() => {setResult(null); setLiveTranscript('');}} className="btn btn-outline w-full py-2">Start New Session</button>
               </div>
             </div>
            )}

            {isCallActive && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={stopCall}
                  className="btn bg-red-600 hover:bg-red-700 text-white w-full py-3 flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  End Active Session
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-slate-900 text-white border-none shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-blue-400" size={20} />
              Live Intelligence
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Current Status</p>
                <div className="flex items-center gap-3">
                  {isCallActive ? <Loader2 className="animate-spin text-primary" size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-500"></div>}
                  <p className="text-sm font-bold text-slate-200">
                    {!isCallActive && !result ? "Waiting for Input" : ""}
                    {callStatus === 'Dialing' && "Status: Dialing"}
                    {callStatus === 'Ringing' && "Status: Ringing"}
                    {callStatus === 'Connected' && "Call Connected"}
                    {callStatus === 'AI Speaking' && "AI Agent Speaking"}
                    {callStatus === 'Customer Speaking' && "Customer Speaking"}
                    {callStatus === 'Ended' && "Call Ended"}
                    {callStatus === 'Failed' && "Call Failed"}
                    {callStatus === 'Analyzing' && "Status: Analyzing"}
                  </p>
                </div>
              </div>

              <div className="card p-6 bg-white/5 border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <BrainCircuit className="text-blue-400" size={16} />
                  Real-time Coaching
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  {isCallActive 
                    ? "The AI Agent is now lead-qualifying. It will ask about budget, location, and timeline automatically."
                    : "Enter a phone number to start the AI lead qualification process."}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-emerald-900 text-white border-none">
             <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <PhoneCall size={16} />
                Dialer Tips
              </h4>
              <ul className="text-xs space-y-3 text-emerald-100/80">
                <li>• Always use country codes (+91)</li>
                <li>• Ensure the AI Agent is "Active"</li>
                <li>• Transcripts appear after first 10s of speech</li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

export default LiveCallAnalyzer;
