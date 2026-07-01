import React from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Share2,
  ExternalLink,
  Target,
  Flame,
  BrainCircuit,
  Languages,
  Sparkles,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { CallInteraction } from '../types';

interface CallAnalysisDetailProps {
  call: CallInteraction | undefined;
  onBack: () => void;
}

const CallAnalysisDetail: React.FC<CallAnalysisDetailProps> = ({ call, onBack }) => {
  if (!call) {
    return (
      <div className="p-20 text-center card">
        <h2 className="text-2xl font-bold mb-4">Lead Not Found</h2>
        <button onClick={onBack} className="btn btn-primary">Back to Leads</button>
      </div>
    );
  }

  const handleAction = (rec: any) => {
    const message = encodeURIComponent(rec.draft || rec.content);
    if (rec.type === 'WhatsApp') {
      window.open(`https://wa.me/?text=${message}`, '_blank');
    } else if (rec.type === 'Email') {
      window.open(`mailto:?subject=Property Inquiry&body=${message}`, '_blank');
    } else {
      alert(`Action: ${rec.content}`);
    }
  };

  const handleTransfer = async () => {
    let phone = prompt("Enter the phone number to transfer to (e.g. +1234567890):");
    if (!phone) return;
    try {
      const res = await api.transferCall(call.id, phone);
      if (res.status === 'success') {
        alert(`Transfer initiated to ${phone}`);
      } else {
        alert(res.message || 'Transfer failed');
      }
    } catch(err: any) {
      alert(`Transfer failed: ${err.message}`);
    }
  };

  const transcriptLines = (call.transcript || "").split('\n').filter(l => l.trim() !== "");
  const followUps = call.followUpRecommendations || [];
  const objections = call.objections || [];
  const actionItems = call.actionItems || [];

  return (
    <div className="animate-fade-in pb-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors group border-none bg-transparent cursor-pointer font-medium"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="card p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{call.customerName || "Lead"}</h2>
                <div className="flex gap-4 mt-1 text-sm text-secondary">
                  <span>{call.date ? new Date(call.date).toLocaleString() : "Real-time Call"}</span>
                  <span>•</span>
                  <span>{call.duration || "Live"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Languages size={14} />
                    {call.language || "English/Hindi"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${call.direction === 'inbound' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {call.direction === 'inbound' ? 'INBOUND' : 'OUTBOUND'}
                </span>
                <div className={`badge badge-${(call.leadTemperature || 'Warm').toLowerCase()}`}>
                  {call.leadTemperature || 'Warm'} Lead
                </div>
                {call.status === 'Active' && call.direction === 'inbound' && (
                  <button onClick={handleTransfer} className="btn btn-primary text-xs py-1 px-3 ml-2">
                    Transfer to Human
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <BrainCircuit size={14} />
                AI Call Summary
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {call.summary || (call.transcript ? "Summary is being generated..." : "Call in progress. Summary will appear after the call ends.")}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Transcript</h4>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {transcriptLines.length > 0 ? (
                  transcriptLines.map((line, i) => {
                    const parts = line.split(': ');
                    if (parts.length < 2) {
                      return (
                        <div key={i} className="flex justify-start">
                          <div className="max-w-[90%] p-3 rounded-2xl bg-slate-50 text-slate-800 border border-slate-100">
                             <p className="text-sm">{line}</p>
                          </div>
                        </div>
                      );
                    }
                    const speaker = parts[0];
                    const text = parts.slice(1).join(': ');
                    const isAgent = speaker.toLowerCase().includes('agent') || 
                                    speaker.toLowerCase().includes('assistant') || 
                                    speaker === 'Amit';
                    return (
                      <div key={i} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${isAgent ? 'bg-slate-100 text-slate-800 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                          <p className="text-[10px] font-bold opacity-60 mb-1 uppercase">{speaker}</p>
                          <p className="text-sm">{text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-slate-300 mx-auto mb-2" size={32} />
                    <p className="text-slate-400 italic text-sm">Waiting for conversation transcript...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              Recommended Follow-Up Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followUps.length > 0 ? (
                followUps.map((rec, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-primary/30 transition-colors bg-slate-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${rec.priority === 'High' ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{rec.type}</span>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(rec.draft || rec.content);
                          alert('Draft copied to clipboard!');
                        }}
                        className="text-primary hover:text-primary-hover p-1 border-none bg-transparent cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold mb-3">{rec.content}</p>
                    {rec.draft && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs italic text-slate-600">
                        "{rec.draft}"
                      </div>
                    )}
                    <button 
                      onClick={() => handleAction(rec)}
                      className="btn btn-primary w-full mt-4 text-xs py-2"
                    >
                      Send {rec.type}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-sm">Analysis pending...</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[380px] space-y-6">
          <div className="card p-6 bg-slate-900 text-white border-none shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-blue-400" size={20} />
              AI Intelligence
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 font-medium">Buyer Intent Score</span>
                  <span className="text-blue-400 font-bold">{call.intentScore || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${call.intentScore || 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 font-medium">Conversion Probability</span>
                  <span className="text-emerald-400 font-bold">{call.conversionProbability || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${call.conversionProbability || 0}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Property Requirements</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Budget</p>
                    <p className="text-sm font-bold">{call.propertyRequirements?.budget || 'Pending'}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Location</p>
                    <p className="text-sm font-bold">{call.propertyRequirements?.location || 'Pending'}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Type</p>
                    <p className="text-sm font-bold">{call.propertyRequirements?.propertyType || 'Pending'}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Timeline</p>
                    <p className="text-sm font-bold">{call.propertyRequirements?.timeline || 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Target size={16} className="text-primary" />
              Live Context
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "This lead was captured via an AI Phone Agent. Intelligence scores will update automatically once the conversation concludes."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallAnalysisDetail;
