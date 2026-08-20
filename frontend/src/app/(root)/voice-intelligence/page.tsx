'use client';
import { fetchWithAuth } from '@/services/api';

import React, { useState } from 'react';
import {
  Upload,
  FileAudio,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  X,
  AudioLines,
  Bot,
  ThermometerSun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceIntelligencePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    // Fake progress bar while waiting for response since LLM takes time
    const timer = setInterval(() => {
      setProgress((prev) => {
        // Cap progress at 90% until the API returns
        if (prev >= 90) return 90;
        return prev + 5;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("agent_name", "AI Agent");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetchWithAuth(`${apiUrl}/api/v1/process-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setProgress(100);
      setResult(data);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process voice note. Please check your connection.");
    } finally {
      clearInterval(timer);
      setIsUploading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Voice Note Intelligence
            <span className="text-[10px] font-semibold bg-theme-100 dark:bg-brand-primary/20 text-theme-700 dark:text-brand-primary px-1.5 py-0.5 rounded uppercase tracking-wider ml-1">
              AI Powered
            </span>
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Upload raw customer voice notes to instantly transcribe and extract structured business intelligence.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FileAudio, title: 'Multi-Format Support', desc: 'Accepts .opus, .mp3, .m4a and .wav audio files.' },
                { icon: Sparkles, title: 'Contextual Extraction', desc: 'Identifies budget, timeline, and exact property needs.' },
                { icon: ShieldCheck, title: 'Actionable Insights', desc: 'Generates structured data ready for your CRM.' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-sm dark:shadow-none flex items-start gap-4">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Area Container */}
            <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-6 lg:p-10 flex flex-col items-center justify-center min-h-[400px] shadow-sm dark:shadow-none relative overflow-hidden group">
              {/* Decorative glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="w-full  border-2 border-dashed border-gray-200 dark:border-white/10 group-hover:border-theme-300 dark:group-hover:border-brand-primary/30 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] p-8 md:p-12 text-center transition-colors relative z-10">
                {isUploading ? (
                  <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-lg flex items-center justify-center mb-6 relative">
                      <Loader2 className="w-8 h-8 text-theme-600 dark:text-brand-primary animate-spin" />
                      <div className="absolute inset-0 border-2 border-theme-200 dark:border-brand-primary/30 rounded-2xl animate-ping opacity-20" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Analyzing Audio...</h3>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8">Transcribing and passing data through AI models.</p>

                    {/* Progress */}
                    <div className="w-full max-w-sm space-y-2.5">
                      <div className="flex justify-between items-center text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        <span>Extraction</span>
                        <span className="text-gray-900 dark:text-white">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-grad-1 to-brand-primary rounded-full shadow-[0_0_10px_rgba(219,183,242,0.3)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: "linear" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Upload className="w-7 h-7 text-gray-400 group-hover:text-theme-600 dark:group-hover:text-brand-primary transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Select Voice Note</h3>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Drag & drop your client's voice note here, or click to select a file from your computer.
                    </p>

                    <input
                      type="file"
                      className="hidden"
                      id="audio-upload"
                      onChange={handleFileUpload}
                      accept="audio/*"
                    />
                    <label
                      htmlFor="audio-upload"
                      className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-grad-1 text-white dark:text-bg-dark-card text-[13px] font-bold rounded-lg shadow-lg shadow-brand-grad-1/20 hover:shadow-brand-grad-1/40 transition-shadow w-auto"
                    >
                      <AudioLines className="w-4 h-4" /> Browse Files
                    </label>

                    {error && (
                      <p className="text-red-500 dark:text-red-400 text-[13px] mt-6 font-medium bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-2 rounded-lg">
                        {error}
                      </p>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 w-full max-w-xs">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                        Supported: .opus, .aac, .m4a, .mp3, .wav
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col w-full"
          >
            <div className="w-full bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm dark:shadow-none">

              {/* Result Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Extraction Complete
                    <span className="flex h-2 w-2 relative ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                    Voice note data successfully parsed and mapped.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-100 dark:border-green-500/20 hidden sm:block">
                    <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-200 dark:border-white/5 transition-colors"
                    title="Close Result"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-8">

                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Bot className="w-4 h-4" /> Source
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white">Voice Note</span>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <ThermometerSun className="w-4 h-4" /> Temperature
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border w-fit ${String(result?.analysis?.lead_temperature || '').includes('Hot')
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
                        : String(result?.analysis?.lead_temperature || '').includes('Warm')
                          ? 'bg-theme-50 dark:bg-brand-primary/10 text-theme-600 dark:text-brand-primary border-theme-100 dark:border-brand-primary/20'
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                      }`}>
                      <ThermometerSun className="w-3 h-3" /> {String(result?.analysis?.lead_temperature || 'Cold Lead')}
                    </span>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col gap-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Intent Score
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{Number(result?.analysis?.intent_score) || 0}%</span>
                      <div className="w-full h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-grad-1" style={{ width: `${Math.max(Number(result?.analysis?.intent_score) || 0, 2)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-primary" />
                    AI Summary
                  </h4>
                  <div className="p-5 rounded-xl bg-theme-50 dark:bg-brand-primary/[0.03] border border-theme-100 dark:border-brand-primary/10">
                    <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {result?.summary || "No summary available for this voice note."}
                    </p>
                  </div>
                </div>

                {/* Extracted Data Grid */}
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Extracted Requirements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Budget', value: result?.analysis?.property_requirements?.budget != null ? typeof result?.analysis?.property_requirements?.budget === 'object' ? JSON.stringify(result.analysis.property_requirements.budget) : String(result.analysis.property_requirements.budget) : 'N/A' },
                      { label: 'Location', value: result?.analysis?.property_requirements?.location != null ? typeof result?.analysis?.property_requirements?.location === 'object' ? JSON.stringify(result.analysis.property_requirements.location) : String(result.analysis.property_requirements.location) : 'N/A' },
                      { label: 'Property Type', value: (result?.analysis?.property_requirements?.type || result?.analysis?.property_requirements?.propertyType) != null ? String(result.analysis.property_requirements.type || result.analysis.property_requirements.propertyType) : 'N/A' },
                      { label: 'Timeline', value: result?.analysis?.property_requirements?.timeline != null ? String(result.analysis.property_requirements.timeline) : 'N/A' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white dark:bg-bg-dark-card/30 p-4 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col gap-1.5 shadow-sm dark:shadow-none">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">{item.label}</span>
                        <span className="text-[14px] font-bold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-3 justify-end items-center mt-2">
                <button
                  onClick={resetAnalysis}
                  className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white text-[13px] font-semibold rounded-lg border border-gray-200 dark:border-white/5 transition-colors shadow-sm dark:shadow-none"
                >
                  Analyze Another
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-grad-1 text-bg-dark-card text-[13px] font-bold rounded-lg shadow-lg shadow-brand-grad-1/20 hover:shadow-brand-grad-1/40 transition-shadow group">
                  Export to CRM
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

