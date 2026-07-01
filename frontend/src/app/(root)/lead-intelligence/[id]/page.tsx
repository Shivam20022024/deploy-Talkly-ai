'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Brain, Phone, Mail, Calendar, MapPin, 
  Clock, DollarSign, Target, Sparkles, Building, PlayCircle, FastForward, MoreHorizontal,
  X, Send, Loader2, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LeadDetailView() {
  const params = useParams();
  const [callData, setCallData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Email Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Follow up regarding your property search");
  const [emailBody, setEmailBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    
    const fetchCall = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/calls/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCallData(data);
          
          // Fetch timeline if we have a customer ID
          const customerId = data.customer_id;
          if (customerId) {
            const timelineRes = await fetch(`${apiUrl}/api/v1/customers/${encodeURIComponent(customerId)}/timeline`);
            if (timelineRes.ok) {
              const timelineJson = await timelineRes.json();
              if (timelineJson.status === "success") {
                setTimelineData(timelineJson.data);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch call details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCall();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-center text-gray-500">
        Loading lead details...
      </div>
    );
  }

  if (!callData) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-center text-gray-500">
        Lead not found.
      </div>
    );
  }

  const rawTranscript = callData.transcript || "";
  let transcriptArray: {role: string, text: string}[] = [];
  
  if (Array.isArray(rawTranscript)) {
     transcriptArray = rawTranscript;
  } else if (typeof rawTranscript === "string") {
     const lines = rawTranscript.split("\n");
     let currentRole = "Agent";
     let currentText = "";
     
     lines.forEach((line) => {
        const lowerLine = line.toLowerCase().trim();
        if (lowerLine.startsWith("agent:") || lowerLine.startsWith("ai:")) {
           if (currentText) transcriptArray.push({ role: currentRole, text: currentText.trim() });
           currentRole = "Agent";
           currentText = line.substring(line.indexOf(":") + 1).trim();
        } else if (lowerLine.startsWith("customer:") || lowerLine.startsWith("user:") || lowerLine.startsWith("human:")) {
           if (currentText) transcriptArray.push({ role: currentRole, text: currentText.trim() });
           currentRole = "Customer";
           currentText = line.substring(line.indexOf(":") + 1).trim();
        } else {
           if (line.trim()) {
              currentText += (currentText ? " " : "") + line.trim();
           }
        }
     });
     if (currentText) transcriptArray.push({ role: currentRole, text: currentText.trim() });
  }

  if (transcriptArray.length === 0) {
      transcriptArray = [{ role: 'Agent', text: 'No transcript available for this call.' }];
  }

  const lead = {
    id: callData.call_id || callData._id,
    customer_id: callData.customer_id || "Unknown",
    date: callData.created_at ? new Date(callData.created_at).toLocaleString() : "Unknown Date",
    duration: callData.duration || "N/A",
    language: callData.language || callData.analysis?.language_detected || "English",
    temperature: callData.analysis?.lead_temperature || "Cold Lead",
    aiSummary: callData.analysis?.summary || "No summary available.",
    recommendedEmail: callData.analysis?.follow_up_recommendations?.[0]?.draft || "No draft available.",
    intelligence: {
      intent: callData.analysis?.lead_score || callData.analysis?.intent_score || 0,
      conversion: callData.analysis?.conversion_probability || 0,
      requirements: {
        budget: callData.analysis?.property_requirements?.budget || "N/A",
        location: callData.analysis?.property_requirements?.location || "N/A",
        type: callData.analysis?.property_requirements?.propertyType || callData.analysis?.property_requirements?.type || "N/A",
        timeline: callData.analysis?.property_requirements?.timeline || "N/A"
      }
    },
    context: "This lead was captured via an AI Phone Agent. Intelligence scores update automatically once the conversation concludes.",
    transcript: transcriptArray
  };

  const handleOpenEmailModal = () => {
    setEmailBody(lead.recommendedEmail);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/calls/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          body: emailBody
        })
      });
      if (res.ok) {
        alert("Email sent successfully!");
        setIsEmailModalOpen(false);
      } else {
        alert("Failed to send email");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation */}
      <Link href="/lead-intelligence" className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Lead Intelligence
      </Link>

      {/* Header Metrics */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">{lead.date}</span>
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">{lead.duration}</span>
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">{lead.language}</span>
        <span className="text-[13px] font-semibold text-theme-600 dark:text-brand-primary bg-theme-50 dark:bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-theme-100 dark:border-brand-primary/20">{lead.temperature}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Transcripts & Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Call Summary */}
          <div className="bg-white dark:bg-bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-100 dark:bg-brand-primary/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-theme-50 dark:bg-brand-primary/10 border border-theme-100 dark:border-brand-primary/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-theme-600 dark:text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Call Summary</h3>
            </div>
            <p className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 relative z-10">
              {lead.aiSummary}
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white dark:bg-bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Recommended Follow-Up</h3>
                <p className="text-[14px] text-gray-600 dark:text-gray-300 italic">
                  "{lead.recommendedEmail}"
                </p>
              </div>
              <div className="flex-shrink-0 flex items-end gap-3">
                <button 
                  onClick={handleOpenEmailModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-grad-1 text-bg-dark-card px-5 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-brand-grad-1/20 hover:shadow-brand-grad-1/40 transition-shadow"
                >
                  <Mail className="w-4 h-4" /> Send Email
                </button>
                <a 
                  href={`https://web.whatsapp.com/send?phone=${String(lead.customer_id).replace(/\D/g, '')}&text=${encodeURIComponent(lead.recommendedEmail)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-white dark:bg-bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Live Transcript</h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                  <PlayCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {lead.transcript.map((msg, i) => (
                <div key={i} className={`flex w-full ${msg.role === 'Agent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'Agent' ? 'items-start' : 'items-end'}`}>
                    <span className="text-[11px] font-semibold text-gray-500 mb-1 px-1">
                      {msg.role}
                    </span>
                    <div className={`p-4 rounded-2xl text-[14px] leading-relaxed ${
                      msg.role === 'Agent' 
                        ? 'bg-theme-50 dark:bg-brand-primary/10 text-gray-900 dark:text-gray-200 rounded-tl-sm border border-theme-100 dark:border-brand-primary/10' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-tr-sm border border-gray-200 dark:border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-theme-600 dark:text-brand-primary" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Intelligence</h3>
            </div>

            <div className="space-y-8">
              {/* Lead Score */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead Score</h4>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{lead.intelligence.intent}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-grad-1" 
                    style={{ width: `${lead.intelligence.intent}%` }}
                  />
                </div>
              </div>

              {/* Conversion Probability */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion Prob.</h4>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{lead.intelligence.conversion}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-green-500 dark:bg-green-400" 
                    style={{ width: `${lead.intelligence.conversion}%` }}
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              {/* Property Requirements */}
              <div>
                <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Extracted Requirements</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Budget</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.budget}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Location</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.location}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Type</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.type}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Timeline</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Live Context Alert */}
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                <h4 className="text-[12px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Live Context</h4>
                <p className="text-[13px] text-blue-600 dark:text-blue-300/80 leading-relaxed">
                  {lead.context}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Timeline */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Timeline</h3>
        <div className="bg-white dark:bg-bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
          {timelineData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No timeline data available.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {timelineData.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                      {new Date(item.date).toLocaleString()}
                    </span>
                    <div className="mt-1 flex gap-2">
                       <span className="px-2 py-0.5 text-[11px] bg-theme-50 dark:bg-brand-primary/10 text-theme-600 dark:text-brand-primary rounded font-semibold uppercase">{item.direction}</span>
                       <span className="px-2 py-0.5 text-[11px] bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded font-semibold uppercase">{item.status}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-theme-600 dark:text-brand-primary" />
                      <span className="font-bold text-gray-900 dark:text-white">Call Interaction</span>
                    </div>
                    <p className="text-[14px] text-gray-600 dark:text-gray-300">
                      {item.summary || "No summary available."}
                    </p>
                    {item.action_items && item.action_items.length > 0 && (
                      <div className="mt-2">
                        <span className="text-[12px] font-bold text-gray-900 dark:text-white">Action Items: </span>
                        <span className="text-[13px] text-gray-600 dark:text-gray-400">{item.action_items.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-bg-dark-surface w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-theme-600 dark:text-brand-primary" /> Send Email
              </h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">To</label>
                <input 
                  type="email" 
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl text-[14px] text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 dark:focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl text-[14px] text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 dark:focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Message</label>
                <textarea 
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl text-[14px] text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 dark:focus:border-brand-primary outline-none transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="px-5 py-2.5 text-[13px] font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendEmail}
                disabled={isSending || !emailTo}
                className="flex items-center gap-2 px-5 py-2.5 bg-theme-600 dark:bg-brand-primary text-white dark:text-bg-dark-base text-[13px] font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-theme-700 dark:hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.3);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
