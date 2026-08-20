// @ts-nocheck
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import LeadIntelligenceTable from "./components/LeadIntelligenceTable";
import CallAnalysisDetail from "./components/CallAnalysisDetail";
import WhatsAppAnalyzer from "./views/WhatsAppAnalyzer";
import LiveCallAnalyzer from "./views/LiveCallAnalyzer";
import AgentAnalytics from "./views/AgentAnalytics";
import LandingPage from "./views/LandingPage";
import LoginPage from "./views/LoginPage";
import PhoneNumberManagement from "./views/PhoneNumberManagement";
import BillingDashboard from "./views/BillingDashboard";
import InboundDashboard from "./components/InboundDashboard";
import LanguageAnalytics from "./components/LanguageAnalytics";
import HumanTransferPanel from "./components/HumanTransferPanel";
import { ViewState, CallInteraction, CallFromAPI } from "./types";
import { api } from "./services/api";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

function formatDuration(seconds?: number): string {
  if (typeof seconds !== "number" || Number.isNaN(seconds) || seconds <= 0) {
    return "0s";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function mapApiCallToInteraction(apiCall: any): CallInteraction {
  if (!apiCall) return {} as any;
  const analysis = apiCall.analysis || {};
  
  return {
    id: apiCall.call_id || `temp_${Math.random()}`,
    customerName: String(apiCall.customer_name || analysis.customer_name || "Lead"),
    agentName: String(apiCall.agent_name || analysis.agent_name || "AI Agent"),
    date: apiCall.created_at || new Date().toISOString(),
    duration: formatDuration(apiCall.duration_seconds),
    durationSeconds: Number(apiCall.duration_seconds || 0) || 0,
    sentiment: String(apiCall.sentiment || analysis.sentiment || "Neutral"),
    emotion: String(apiCall.emotion || "Neutral"),
    tags: Array.isArray(apiCall.tags) ? apiCall.tags : (Array.isArray(analysis.key_points) ? analysis.key_points : []),
    summary: String(apiCall.summary || analysis.call_summary || analysis.summary || "No summary available"),
    transcript: String(apiCall.transcript || ""),
    language: String(apiCall.language || analysis.language_detected || "English"),
    
    // AI Intelligence
    leadTemperature: String(analysis.lead_temperature || apiCall.lead_temperature || "Warm") as "Hot" | "Warm" | "Cold",
    intentScore: Number(analysis.intent_score || apiCall.intent_score || 0) || 0,
    intentLabel: String(analysis.intent_label || "General Inquiry"),
    conversionProbability: Number(analysis.conversion_probability || apiCall.conversion_probability || 0) || 0,
    propertyRequirements: {
      budget: String(analysis.property_requirements?.budget || apiCall.property_requirements?.budget || "N/A"),
      location: String(analysis.property_requirements?.location || apiCall.property_requirements?.location || "N/A"),
      propertyType: String(analysis.property_requirements?.propertyType || apiCall.property_requirements?.propertyType || "N/A"),
      timeline: String(analysis.property_requirements?.timeline || apiCall.property_requirements?.timeline || "N/A"),
      loanRequired: !!(analysis.property_requirements?.loanRequired || apiCall.property_requirements?.loanRequired)
    },
    objections: Array.isArray(analysis.objections) ? analysis.objections : [],
    followUpRecommendations: Array.isArray(analysis.follow_up_recommendations) ? analysis.follow_up_recommendations : [],
    actionItems: Array.isArray(analysis.action_items) ? analysis.action_items : [],
    
    agentPerformance: {
      talkRatio: Number(analysis.agent_performance?.talkRatio || apiCall.agent_performance?.talkRatio || 0.5) || 0.5,
      interruptionCount: Number(analysis.agent_performance?.interruptionCount || apiCall.agent_performance?.interruptionCount || 0) || 0,
      closingStrength: Number(analysis.agent_performance?.closingStrength || apiCall.agent_performance?.closingStrength || 0) || 0,
      objectionHandlingScore: Number(analysis.agent_performance?.objectionHandlingScore || apiCall.agent_performance?.objectionHandlingScore || 0) || 0
    },
    
    status: String(apiCall.status || "Pending") as "Analyzed" | "Pending" | "Failed",
    direction: (apiCall.direction ? String(apiCall.direction).toLowerCase() : "outbound") as "inbound" | "outbound" | "unknown"
  };
}

function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>("LANDING");
  const [interactions, setInteractions] = useState<CallInteraction[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCalls = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const apiData = await api.getAllCalls();
      if (Array.isArray(apiData)) {
        const mapped = apiData.map(mapApiCallToInteraction);
        setInteractions(mapped);
      } else {
        setInteractions([]);
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) setError("Failed to load real-time call data. Please ensure the backend is running.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
    
    // Poll for updates silently every 10 seconds to show live transcripts and analysis
    const interval = setInterval(() => loadCalls(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (view: ViewState) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentView(view);
    if (view !== 'CALL_DETAIL') {
      setSelectedCallId(null);
    }
  };

  const handleSelectCall = (id: string) => {
    setSelectedCallId(id);
    setCurrentView('CALL_DETAIL');
  };

  const renderView = () => {
    if (loading && interactions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary font-medium">Loading Real Data...</p>
        </div>
      );
    }

    if (error && interactions.length === 0) {
      return (
        <div className="card p-12 text-center max-w-2xl mx-auto mt-20">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Connection Error</h3>
          <p className="text-secondary mb-6">{error}</p>
          <button onClick={() => loadCalls()} className="btn btn-primary">Retry Connection</button>
        </div>
      );
    }

    const selectedCall = interactions.find(i => i.id === selectedCallId) || interactions[0];

    const renderEmptyState = () => (
      <div className="card p-20 text-center max-w-2xl mx-auto mt-20">
        <div className="text-slate-300 mb-6 text-6xl">🎙️</div>
        <h3 className="text-2xl font-bold mb-2">No Calls Found</h3>
        <p className="text-secondary mb-8">Start recording or upload your first sales call to see AI insights.</p>
        <button onClick={() => navigateTo('LIVE_CALL')} className="btn btn-primary px-8">Start First Call</button>
      </div>
    );

    switch (currentView) {
      case "DASHBOARD":
        return interactions.length > 0 ? <DashboardOverview interactions={interactions} /> : renderEmptyState();
      case "LEADS":
        return interactions.length > 0 ? <LeadIntelligenceTable interactions={interactions} onSelectCall={handleSelectCall} /> : renderEmptyState();
      case "WHATSAPP_ANALYZER":
        return <WhatsAppAnalyzer />;
      case "LIVE_CALL":
        return <LiveCallAnalyzer />;
      case "CALL_DETAIL":
        return <CallAnalysisDetail call={selectedCall} onBack={() => navigateTo('LEADS')} />;
      case "AGENT_ANALYTICS":
        return <AgentAnalytics interactions={interactions} />;
      case "INBOUND_DASHBOARD":
        return <InboundDashboard interactions={interactions} />;
      case "LANGUAGE_ANALYTICS":
        return <LanguageAnalytics interactions={interactions} />;
      case "PHONE_NUMBERS":
        return <PhoneNumberManagement />;
      case "BILLING":
        return <BillingDashboard />;
      case "LANDING":
        return <LandingPage onStart={() => navigateTo('LOGIN')} />;
      case "LOGIN":
        return <LoginPage onLoginSuccess={() => navigateTo('DASHBOARD')} />;
      default:
        return <DashboardOverview interactions={interactions} />;
    }
  };

  if (currentView === 'LANDING') {
    return <LandingPage onStart={() => navigateTo('LOGIN')} />;
  }

  if (currentView === 'LOGIN') {
    return <LoginPage onLoginSuccess={() => navigateTo('DASHBOARD')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <Sidebar currentView={currentView === 'CALL_DETAIL' ? 'LEADS' : currentView} onNavigate={navigateTo} />
      
      <main className="main-content">
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Ask AI: 'Show leads interested in 3BHK'..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">✨</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold">{user?.name || "Admin Panel"}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role || "Real-time Data"}</span>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=2563eb&color=fff`} alt="Profile" />
            </div>
          </div>
        </header>

        {renderView()}

        <HumanTransferPanel 
          call={interactions.find(i => i.status === 'Active' && i.intentLabel?.toLowerCase().includes('human')) || null}
          onAccept={() => console.log('Accepted call')}
          onDecline={() => console.log('Declined call')}
        />
      </main>
    </div>
  );
}

export default App;
