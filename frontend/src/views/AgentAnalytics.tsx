import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { User, MessageCircle, Zap, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { CallInteraction } from '../types';

interface AgentAnalyticsProps {
  interactions: CallInteraction[];
}

const AgentAnalytics: React.FC<AgentAnalyticsProps> = ({ interactions }) => {
  const stats = useMemo(() => {
    if (interactions.length === 0) return null;

    const validPerformances = interactions
      .map(i => i.agentPerformance)
      .filter(p => p && (p.talkRatio !== undefined || p.closingStrength !== undefined));

    const avgTalkRatio = validPerformances.length > 0
      ? validPerformances.reduce((acc, p) => acc + (p?.talkRatio || 0.5), 0) / validPerformances.length
      : 0.5;

    const avgClosing = validPerformances.length > 0
      ? validPerformances.reduce((acc, p) => acc + (p?.closingStrength || 0), 0) / validPerformances.length
      : 0;

    const avgObjection = validPerformances.length > 0
      ? validPerformances.reduce((acc, p) => acc + (p?.objectionHandlingScore || 0), 0) / validPerformances.length
      : 0;

    // Group by Agent
    const agentMap: Record<string, { conversion: number; count: number; closing: number }> = {};
    interactions.forEach(i => {
      const name = i.agentName || "AI Agent";
      if (!agentMap[name]) agentMap[name] = { conversion: 0, count: 0, closing: 0 };
      agentMap[name].count++;
      if (i.leadTemperature === "Hot") agentMap[name].conversion++;
      agentMap[name].closing += i.agentPerformance?.closingStrength || 0;
    });

    const agentData = Object.entries(agentMap).map(([name, data]) => ({
      name,
      conversion: Math.round((data.conversion / data.count) * 100),
      calls: data.count,
      avgClosing: (data.closing / data.count).toFixed(1)
    }));

    const bestPerformer = agentData.length > 0 
      ? agentData.reduce((prev, current) => (prev.conversion > current.conversion) ? prev : current).name 
      : "N/A";

    return {
      avgTalkRatio: `${Math.round(avgTalkRatio * 100)}:${100 - Math.round(avgTalkRatio * 100)}`,
      avgClosing: `${avgClosing.toFixed(1)}/10`,
      avgObjection: `${Math.round((avgObjection / 10) * 100)}%`,
      bestPerformer,
      agentData
    };
  }, [interactions]);

  if (!stats) {
    return (
      <div className="p-20 text-center card">
         <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
         <h3 className="text-xl font-bold">No Agent Data Available</h3>
         <p className="text-secondary">Process some calls first to see real-time performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Agent Performance</h2>
        <p className="text-secondary">AI-driven coaching and performance metrics for your sales team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Avg Talk Ratio', value: stats.avgTalkRatio, icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Closing Strength', value: stats.avgClosing, icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Objection Handling', value: stats.avgObjection, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Best Performer', value: stats.bestPerformer, icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="card p-6 border-none shadow-lg shadow-slate-200/50 hover:scale-105 transition-transform">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6 border-none shadow-xl shadow-slate-200/50">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Lead Quality by Agent
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.agentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="conversion" name="Hot Lead %" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 border-none shadow-xl shadow-slate-200/50">
          <h4 className="text-lg font-bold mb-6">Performance Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.agentData.length > 1 ? stats.agentData : [
                { name: 'Mon', conversion: 40 },
                { name: 'Tue', conversion: 55 },
                { name: 'Wed', conversion: 48 },
                { name: 'Thu', conversion: 70 },
                { name: 'Fri', conversion: 65 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="conversion" stroke="#8b5cf6" strokeWidth={3} dot={{r: 6, fill: '#8b5cf6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card border-none shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-100">
          <h4 className="font-bold flex items-center gap-2">
            <SparklesIcon size={18} className="text-blue-500" />
            AI Coaching Insights
          </h4>
        </div>
        <div className="p-6 space-y-4">
          {interactions.slice(0, 3).map((call, idx) => (
            <div key={idx} className={`flex gap-4 p-4 rounded-xl border ${idx % 2 === 0 ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`w-8 h-8 ${idx % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'} text-white rounded-full flex items-center justify-center shrink-0`}>
                {idx % 2 === 0 ? '✨' : '📈'}
              </div>
              <div>
                <p className={`text-sm font-bold ${idx % 2 === 0 ? 'text-blue-900' : 'text-emerald-900'} mb-1`}>
                  {call.id ? `Coaching for Call ID: ${call.id}` : "Coaching Session Analysis"}
                </p>
                <p className={`text-sm ${idx % 2 === 0 ? 'text-blue-800' : 'text-emerald-800'} opacity-80`}>
                  {call.agentPerformance?.talkRatio && call.agentPerformance.talkRatio > 0.7 
                    ? "Agent is talking too much. Encourage more active listening to uncover deeper pain points."
                    : "Good balance of conversation. The objection regarding budget was handled well using the value-stacking technique."}
                </p>
              </div>
            </div>
          ))}
          {interactions.length === 0 && (
             <p className="text-sm text-slate-400 italic">No coaching insights available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ size, className }: { size?: number, className?: string }) => (
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

export default AgentAnalytics;
