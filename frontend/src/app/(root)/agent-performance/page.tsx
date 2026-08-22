"use client";
import { fetchWithAuth } from '@/services/api';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  User, 
  MessageCircle, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  Sparkles,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

const BarChart = dynamic(() => import("recharts").then((m) => ({ default: m.BarChart })), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer })), { ssr: false });
const LineChart = dynamic(() => import("recharts").then((m) => ({ default: m.LineChart })), { ssr: false });
const Line = dynamic(() => import("recharts").then((m) => ({ default: m.Line })), { ssr: false });

function ChartFallback() {
  return <div className="h-[250px] w-full animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />;
}

export default function AgentPerformancePage() {
  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetchWithAuth(`${apiUrl}/api/v1/calls?limit=200`);
        if (res.ok) {
          const data = await res.json();
          setCalls(data);
        }
      } catch (error) {
        console.error("Failed to fetch calls:", error);
      }
    };
    fetchCalls();
  }, []);

  const stats = useMemo(() => {
    if (calls.length === 0) return null;

    const validPerformances = calls
      .map(c => c.analysis?.agent_performance)
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
    calls.forEach(c => {
      const name = c.agent_name || "AI Agent";
      if (!agentMap[name]) agentMap[name] = { conversion: 0, count: 0, closing: 0 };
      agentMap[name].count++;
      if (c.analysis?.lead_temperature?.includes("Hot")) agentMap[name].conversion++;
      agentMap[name].closing += c.analysis?.agent_performance?.closingStrength || 0;
    });

    const agentData = Object.entries(agentMap).map(([name, data]) => ({
      name,
      conversion: Math.round((data.conversion / data.count) * 100) || 0,
      calls: data.count,
      avgClosing: (data.closing / data.count).toFixed(1)
    }));

    const bestPerformer = agentData.length > 0 
      ? agentData.reduce((prev, current) => (prev.conversion > current.conversion) ? prev : current).name 
      : "N/A";
      
    // Performance Trend (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const performanceTrend = last7Days.map(date => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const callsOnDay = calls.filter(c => {
        if (!c.created_at) return false;
        const callDate = new Date(c.created_at);
        return callDate.toDateString() === date.toDateString();
      });
      
      let hotCount = 0;
      callsOnDay.forEach(c => {
        if (c.analysis?.lead_temperature?.includes("Hot")) hotCount++;
      });
      
      const conv = callsOnDay.length > 0 ? Math.round((hotCount / callsOnDay.length) * 100) : 0;
      return { day: dayName, conversion: conv };
    });
    
    // Insights
    const insights = calls
      .filter(c => c.analysis?.agent_performance)
      .slice(0, 5)
      .map((c, i) => {
        const perf = c.analysis.agent_performance;
        const isPositive = perf.closingStrength >= 7;
        let insightMsg = "";
        
        if (isPositive) {
          insightMsg = "Excellent call control and value-stacking leading to a solid closing score.";
        } else if (perf.talkRatio > 0.7) {
          insightMsg = "Talk ratio is too high. Agent needs to ask more open-ended questions.";
        } else {
          insightMsg = "Missed opportunity in handling objections effectively.";
        }
        
        return {
          id: c.call_id || `call_${i}`,
          agent: c.agent_name || "AI Agent",
          type: isPositive ? "positive" : "warning",
          insight: insightMsg,
          score: isPositive ? `+${perf.closingStrength}%` : `-${10 - perf.closingStrength}%`
        };
      });

    return {
      avgTalkRatio: `${Math.round(avgTalkRatio * 100)}:${100 - Math.round(avgTalkRatio * 100)}`,
      avgClosing: `${avgClosing.toFixed(1)}/10`,
      avgObjection: `${Math.round((avgObjection / 10) * 100)}%`,
      bestPerformer,
      agentData,
      performanceTrend,
      insights
    };
  }, [calls]);

  const cards = [
    { label: 'Avg Talk Ratio', value: stats?.avgTalkRatio || '0:0', icon: MessageCircle },
    { label: 'Closing Strength', value: stats?.avgClosing || '0/10', icon: Zap },
    { label: 'Objection Handling', value: stats?.avgObjection || '0%', icon: ShieldCheck },
    { label: 'Top Performer', value: stats?.bestPerformer || 'N/A', icon: User },
  ];

  const handleDownloadReport = () => {
    if (!stats || !stats.agentData || stats.agentData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = ["Agent Name", "Total Calls", "Conversion (%)", "Avg Closing Strength"];
    const csvContent = [
      headers.join(","),
      ...stats.agentData.map((row: any) => 
        [row.name, row.calls, row.conversion, row.avgClosing].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agent_performance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 min-h-full bg-gray-50 dark:bg-transparent text-gray-900 dark:text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Agent Performance</h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">AI-driven coaching and performance metrics for your sales team.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white text-[13px] font-semibold rounded-lg border border-gray-200 dark:border-white/5 transition-colors shadow-sm dark:shadow-none"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] flex flex-col justify-between hover:border-gray-300 dark:hover:border-white/10 transition-colors">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-theme-200 bg-gradient-to-br from-theme-100 to-theme-50 text-theme-600 dark:border-brand-primary/10 dark:from-brand-primary/15 dark:to-brand-muted/10 dark:text-brand-primary">
              <card.icon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
              <p className="bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 bg-clip-text text-2xl font-bold text-transparent dark:from-brand-primary dark:to-brand-grad-3">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lead Quality by Agent (Bar Chart) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-theme-600 dark:text-brand-primary" />
                Lead Quality by Agent
              </h3>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">Percentage of leads successfully qualified as 'Hot'</p>
            </div>
          </div>
          
          <Suspense fallback={<ChartFallback />}>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.agentData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}} 
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} 
                    contentStyle={{
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '12px',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Bar 
                    dataKey="conversion" 
                    name="Hot Lead %" 
                    fill="var(--brand-primary)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={32}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

        {/* Performance Distribution (Line Chart) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-theme-600 dark:text-brand-primary" />
                Performance Distribution
              </h3>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">Team conversion trends over the last 7 days</p>
            </div>
          </div>
          
          <Suspense fallback={<ChartFallback />}>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.performanceTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '12px',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke="var(--brand-grad-1)" 
                    strokeWidth={3} 
                    dot={{r: 5, fill: 'var(--brand-grad-1)', strokeWidth: 2, stroke: 'var(--bg-dark-surface)'}} 
                    activeDot={{r: 8}}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

      </div>

      {/* AI Coaching Insights */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-theme-600 dark:text-brand-primary" />
            Recent AI Coaching Insights
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {stats?.insights?.map((insight, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors flex items-start gap-4 group">
              <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
                insight.type === 'positive' 
                  ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400'
              }`}>
                {insight.type === 'positive' ? <TrendingUp className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">{insight.agent}</span>
                    <span className="text-[12px] text-gray-500 font-mono bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">{insight.id}</span>
                  </div>
                  <span className={`text-[13px] font-bold ${
                    insight.type === 'positive' ? 'text-green-500 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'
                  }`}>
                    {insight.score} Intent Impact
                  </span>
                </div>
                <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
                  {insight.insight}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center pr-2">
                <Link href={`/lead-intelligence/${insight.id}`} className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors block">
                   <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

