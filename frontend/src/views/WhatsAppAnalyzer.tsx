import React, { useState } from 'react';
import { 
  Mic, 
  Upload, 
  FileAudio, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const WhatsAppAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Automatically use logged-in user details instead of prompting
      const response = await api.uploadAudio(
        file, 
        user?.name || "AI Agent",
        user?.id,
        user?.email
      );
      setResult(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to process voice note. Please check your connection.";
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
          <Mic className="text-blue-600" size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Voice Note Intelligence</h2>
        <p className="text-secondary">Transform your client voice notes into structured business intelligence</p>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: FileAudio, title: 'Upload Audio', desc: 'Supports .opus, .mp3, .m4a and other standard voice note formats.' },
              { icon: Sparkles, title: 'AI Extraction', desc: 'Extract budget, location, and intent automatically.' },
              { icon: ShieldCheck, title: 'CRM Ready', desc: 'Export insights directly to your sales pipeline.' },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="inline-flex p-2 bg-slate-50 rounded-lg mb-3">
                  <item.icon className="text-primary" size={20} />
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="card p-12 border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all">
            <div className="flex flex-col items-center">
              {isUploading ? (
                <>
                  <Loader2 className="text-primary animate-spin mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">AI is Analyzing...</h3>
                  <p className="text-slate-500">Transcribing and extracting lead intelligence from your voice note.</p>
                </>
              ) : (
                <>
                  <Upload className="text-slate-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">Select Voice Note</h3>
                  <p className="text-slate-500 mb-6 text-center">Upload a client voice note for AI-powered analysis, or click to browse</p>
                  <input type="file" className="hidden" id="wa-upload" onChange={handleFileUpload} accept="audio/*" />
                  <label htmlFor="wa-upload" className="btn btn-primary cursor-pointer px-8">
                    Upload File
                  </label>
                  {error && <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>}
                  <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Supports .opus, .aac, .m4a, .mp3, .wav</p>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-1">Analysis Complete!</h3>
          <p className="text-slate-500 mb-8">Real-time intelligence has been extracted successfully.</p>
          
          <div className="w-full bg-white rounded-xl border border-emerald-100 p-6 mb-8 text-left shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <span className={`badge badge-${(result.analysis?.lead_temperature || 'Warm').toLowerCase()}`}>
                {result.analysis?.lead_temperature || 'Warm'} Lead
              </span>
              <span className="text-xs font-bold text-slate-400">{result.analysis?.intent_score || 0}% Intent</span>
            </div>
            <p className="text-sm font-medium text-slate-900 mb-4 bg-slate-50 p-4 rounded-lg">
              {result.summary || "No summary available."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 font-bold uppercase text-[9px] mb-1">Budget</p>
                <p className="font-bold text-sm">{result.analysis?.property_requirements?.budget || 'Not mentioned'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 font-bold uppercase text-[9px] mb-1">Location</p>
                <p className="font-bold text-sm">{result.analysis?.property_requirements?.location || 'Not mentioned'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setResult(null)}
              className="btn btn-outline px-8"
            >
              Analyze Another
            </button>
            <button className="btn btn-primary px-8">
              Export to CRM
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 card p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Sparkles className="text-blue-400" size={24} />
          </div>
          <div>
            <h4 className="font-bold">Real-time AI Processing</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAnalyzer;
