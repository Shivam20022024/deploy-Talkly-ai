"use client";
import { fetchWithAuth } from '@/services/api';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PhoneCall, Flame, Target, Percent, TrendingUp, BarChart3,
  ThermometerSun, Clock, Globe, Tag, CheckCircle2, Mail,
  Bot, User, ChevronRight, Activity, Sparkles, Phone, MessageSquare, Users, CalendarDays, ArrowUpRight, MoreHorizontal, Plus, Download
} from 'lucide-react';

const Dashboard = () => {
  const [calls, setCalls] = useState<any[]>([]);
  const [overallData, setOverallData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'overall' | 'month' | 'week'>('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        // Increased limit to 10000 to ensure all calls are fetched and calculated
        const res = await fetchWithAuth(`${apiUrl}/api/v1/calls?limit=10000`);
        if (res.ok) {
          const data = await res.json();
          setCalls(data);
        }
        
        const overallRes = await fetchWithAuth(`${apiUrl}/api/v1/analytics/overall`);
        if (overallRes.ok) {
          const data = await overallRes.json();
          setOverallData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch calls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  // Compute current week calls
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  const startOfWeek = getStartOfWeek(new Date());

  const getStartOfMonth = (d: Date) => {
    const date = new Date(d);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  const startOfMonth = getStartOfMonth(new Date());

  const filteredCalls = calls.filter((c: any) => {
    if (timeRange === 'overall') return true; // not used for top metrics, but safe
    const callDate = new Date(c.created_at);
    if (timeRange === 'week') return callDate >= startOfWeek;
    if (timeRange === 'month') return callDate >= startOfMonth;
    return true;
  });

  // Compute Metrics
  const totalCalls = filteredCalls.length;

  const validIntentScores = filteredCalls.map((c: any) => c.analysis?.intent_score).filter((s) => typeof s === 'number');
  const avgBuyerIntent = validIntentScores.length > 0
    ? Math.round(validIntentScores.reduce((a, b) => a + b, 0) / validIntentScores.length)
    : 0;

  const validConvProbs = filteredCalls.map((c: any) => c.analysis?.conversion_probability).filter((s) => typeof s === 'number');
  const avgConvProb = validConvProbs.length > 0
    ? Math.round(validConvProbs.reduce((a, b) => a + b, 0) / validConvProbs.length)
    : 0;

  // Lead Intelligence
  const hotLeads = filteredCalls.filter((c: any) => c.analysis?.lead_temperature?.includes('Hot')).length;
  const warmLeads = filteredCalls.filter((c: any) => c.analysis?.lead_temperature?.includes('Warm')).length;
  const coldLeads = filteredCalls.filter((c: any) => c.analysis?.lead_temperature?.includes('Cold')).length;
  const totalAnalyzed = hotLeads + warmLeads + coldLeads || 1; // avoid div by 0

  const hotPct = Math.round((hotLeads / totalAnalyzed) * 100) || 0;
  const warmPct = Math.round((warmLeads / totalAnalyzed) * 100) || 0;
  const coldPct = Math.round((coldLeads / totalAnalyzed) * 100) || 0;

  // Display Variables (fallback to overallData if timeRange === 'overall')
  const displayTotalCalls = timeRange === 'overall' ? (overallData?.total_calls || 0) : totalCalls;
  const displayAvgBuyerIntent = timeRange === 'overall' ? (overallData?.average_buyer_intent || 0) : avgBuyerIntent;
  const displayAvgConvProb = timeRange === 'overall' ? (overallData?.average_conversion_probability || 0) : avgConvProb;

  const displayHotLeads = timeRange === 'overall' ? (overallData?.hot_leads || 0) : hotLeads;
  const displayWarmLeads = timeRange === 'overall' ? (overallData?.warm_leads || 0) : warmLeads;
  const displayColdLeads = timeRange === 'overall' ? (overallData?.cold_leads || 0) : coldLeads;
  const displayTotalLeads = timeRange === 'overall' ? Math.max((overallData?.total_leads || 1), 1) : totalAnalyzed;

  const displayHotPct = timeRange === 'overall' ? Math.round((displayHotLeads / displayTotalLeads) * 100) || 0 : hotPct;
  const displayWarmPct = timeRange === 'overall' ? Math.round((displayWarmLeads / displayTotalLeads) * 100) || 0 : warmPct;
  const displayColdPct = timeRange === 'overall' ? Math.round((displayColdLeads / displayTotalLeads) * 100) || 0 : coldPct;

  // Chart Data calculation (Current Week: Mon-Sun)
  const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const chartData = currentWeekDays.map(date => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const callsOnDay = calls.filter(c => {
      if (!c.created_at) return false;
      const callDate = new Date(c.created_at);
      return callDate.toDateString() === date.toDateString();
    });

    let inbound = 0;
    let outbound = 0;
    callsOnDay.forEach(c => {
      if (c.direction === 'inbound') inbound++;
      else outbound++;
    });

    return {
      day: dayName,
      inbound,
      outbound,
      total: inbound + outbound
    };
  });

  const maxDailyCalls = Math.max(...chartData.map(d => d.total), 10); // scale up to at least 10 for visual effect

  const exportToCSV = () => {
    // Basic CSV headers
    const headers = ['Date', 'Call ID', 'Direction', 'Customer Name', 'Customer Phone', 'Agent', 'Status', 'Intent Score', 'Lead Temperature', 'Summary'];
    
    // Map rows
    const rows = filteredCalls.map(c => {
      const summary = (c.analysis?.summary || '').replace(/"/g, '""'); // Escape quotes for CSV
      return [
        new Date(c.created_at).toLocaleString().replace(/,/g, ''),
        c.call_id || '',
        c.direction || '',
        c.customer_name || c.analysis?.customer_name || c.customer?.name || '',
        c.customer?.phone_number || c.customer_id || c.to_number || c.phone || '',
        c.agent?.name || c.agent_name || '',
        c.status || '',
        c.analysis?.intent_score || '',
        c.analysis?.lead_temperature || '',
        summary
      ].map(field => `"${field}"`).join(','); // Wrap every field in quotes to handle commas in text
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `talkly-calls-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Monitor your agents, active calls, and lead qualification metrics.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as 'overall' | 'month' | 'week')}
            className="px-4 py-2 bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="overall">Overall (All Time)</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Dynamic Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={PhoneCall} label="Total Sales Calls" value={displayTotalCalls.toLocaleString()} trend={timeRange === 'week' ? "+12.5%" : timeRange === 'month' ? "This month" : "All time"} trendColor={timeRange !== 'week' ? "text-gray-500" : undefined} />
        <MetricCard icon={Flame} label="Hot Leads" value={displayHotLeads.toString()} trend={timeRange === 'week' ? "+2" : timeRange === 'month' ? "This month" : "All time"} trendColor={timeRange !== 'week' ? "text-gray-500" : undefined} />
        <MetricCard icon={Target} label="Avg Buyer Intent" value={`${displayAvgBuyerIntent}%`} trend={timeRange === 'week' ? "+4.2%" : timeRange === 'month' ? "This month" : "All time"} trendColor={timeRange !== 'week' ? "text-gray-500" : "text-green-600 dark:text-green-400"} />
        <MetricCard icon={Percent} label="Conv. Probability" value={`${displayAvgConvProb}%`} trend={timeRange === 'week' ? "+18%" : timeRange === 'month' ? "This month" : "All time"} trendColor={timeRange !== 'week' ? "text-gray-500" : "text-green-600 dark:text-green-400"} />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {timeRange !== 'overall' ? (
          /* Weekly Sales Call Volume */
          <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm dark:shadow-none">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Weekly Sales Call Volume</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Daily total call activity</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex items-end justify-between h-[200px] gap-2 sm:gap-4 mt-auto w-full relative z-10">
              {/* Y-axis grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-[28px] pointer-events-none">
                {[0, 1, 2, 3].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-gray-100 dark:bg-white/[0.03]" />
                ))}
              </div>

              {chartData.map((data, i) => {
                const height = Math.max((data.total / maxDailyCalls) * 100, 2);
                
                return (
                <div key={i} className="flex-1 flex flex-col items-center h-full group">
                  <div className="flex-1 w-full flex justify-center items-end gap-1.5 sm:gap-2 pb-3">
                    {/* Total Calls Bar */}
                    <div
                      className="w-full max-w-[20px] sm:max-w-[24px] rounded-t-md bg-gradient-to-t from-brand-grad-1 to-brand-primary opacity-90 dark:opacity-80 group-hover:opacity-100 transition-all duration-300 relative cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-bg-dark-card text-brand-primary text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-gray-800 dark:border-brand-primary/20 z-20">
                        {data.total} Calls
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 uppercase h-[20px] block group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {data.day}
                  </span>
                </div>
              )})}
            </div>
          </div>
        ) : (
          /* Overall Averages & Volume */
          <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Overall Averages & Volume</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Historical intent and volume metrics</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium mb-1">Avg Buyer Intent</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{overallData?.average_buyer_intent || 0}%</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium mb-1">Avg Conversion</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{overallData?.average_conversion_probability || 0}%</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium mb-1">Inbound Calls</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{(overallData?.inbound_calls || 0).toLocaleString()}</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium mb-1">Outbound Calls</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{(overallData?.outbound_calls || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Lead Intelligence */}
        <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{timeRange === 'overall' ? 'Overall Lead Intelligence' : 'Lead Intelligence'}</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Temperature distribution</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
              <ThermometerSun className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Hot Leads */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900 dark:text-white">Hot Leads</span>
                  <span className="text-[13px] font-bold text-orange-500 dark:text-orange-400">
                    {displayHotPct}% ({displayHotLeads})
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${displayHotPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Warm Leads */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-theme-50 dark:bg-brand-primary/10 border border-theme-100 dark:border-brand-primary/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Activity className="w-5 h-5 text-theme-600 dark:text-brand-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900 dark:text-white">Warm Leads</span>
                  <span className="text-[13px] font-bold text-theme-600 dark:text-brand-primary">
                    {displayWarmPct}% ({displayWarmLeads})
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full" style={{ width: `${displayWarmPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Cold Leads */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900 dark:text-white">Cold Leads</span>
                  <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400">
                    {displayColdPct}% ({displayColdLeads})
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${displayColdPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Space for the table */}

      {/* Recent Calls / Leads Table */}
      <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest Active Calls</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Real-time feed of AI agent interactions</p>
          </div>
          <Link href="/lead-intelligence" className="flex items-center gap-1 text-[13px] text-theme-600 dark:text-brand-primary font-semibold hover:text-theme-700 dark:hover:text-brand-grad-3 transition-colors">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-white/5 whitespace-nowrap">
              <tr>
                <th className="px-5 py-4 font-medium">Lead / Customer</th>
                <th className="px-5 py-4 font-medium">Language</th>
                <th className="px-5 py-4 font-medium">Temperature</th>
                <th className="px-5 py-4 font-medium">Intent Score</th>
                <th className="px-5 py-4 font-medium">Conversion Prob.</th>
                <th className="px-5 py-4 font-medium">Property Info</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-gray-600 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">Loading calls...</td>
                </tr>
              ) : calls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">No calls found.</td>
                </tr>
              ) : (
                calls.slice(0, 10).map((call: any) => (
                  <ActivityRow
                    key={call.call_id || call._id}
                    id={call.call_id || call._id}
                    leadType={call.customer_name || 'Phone Lead'}
                    callId={`#${call.call_id || 'unknown'}`}
                    language={call.language || call.analysis?.language_detected || 'English'}
                    temperature={call.analysis?.lead_temperature?.includes('Hot') ? 'Hot Lead' : call.analysis?.lead_temperature?.includes('Warm') ? 'Warm Lead' : 'Cold Lead'}
                    intentScore={call.analysis?.intent_score || 0}
                    conversionProb={call.analysis?.conversion_probability || 0}
                    budget={call.analysis?.property_requirements?.budget || 'N/A'}
                    location={call.analysis?.property_requirements?.location || 'N/A'}
                    icon={Phone}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const MetricCard = ({ icon: Icon, label, value, trend, trendColor = "text-theme-600 dark:text-brand-primary", iconColor = "text-gray-500 dark:text-gray-300" }: any) => (
  <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">{label}</h4>
      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-center">
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendingUp className="w-3 h-3" /> {trend}
        </div>
      )}
    </div>
  </div>
);

const ActivityRow = ({ id, leadType, callId, language, temperature, intentScore, conversionProb, budget, location, icon: Icon }: any) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </div>
        <div>
          <span className="font-semibold text-gray-900 dark:text-white block">{leadType}</span>
          <span className="text-[11px] font-mono text-gray-500">{callId}</span>
        </div>
      </div>
    </td>
    <td className="px-5 py-4 font-medium text-gray-600 dark:text-gray-400">{language}</td>
    <td className="px-5 py-4">
      <span className={`bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2.5 py-1.5 rounded text-[11px] font-semibold inline-flex items-center gap-1.5 ${temperature === 'Hot Lead' ? 'text-orange-600 dark:text-orange-400' :
        temperature === 'Warm Lead' ? 'text-theme-600 dark:text-brand-primary' : 'text-blue-600 dark:text-blue-400'
        }`}>
        <ThermometerSun className="w-3 h-3" /> {temperature}
      </span>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden w-16 hidden sm:block">
          <div className={`h-full rounded-full ${intentScore > 0 ? 'bg-gradient-to-r from-brand-primary to-brand-grad-1' : 'bg-gray-300 dark:bg-gray-600'}`} style={{ width: `${Math.max(intentScore, 2)}%` }}></div>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-[12px]">{intentScore}%</span>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden w-16 hidden sm:block">
          <div className={`h-full rounded-full ${conversionProb > 0 ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} style={{ width: `${Math.max(conversionProb, 2)}%` }}></div>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-[12px]">{conversionProb}%</span>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className="flex flex-col gap-1 text-[12px] font-medium text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1.5"><span className="text-gray-400 dark:text-gray-500 opacity-70">₹</span> {budget}</div>
        <div className="flex items-center gap-1.5"><span className="text-gray-400 dark:text-gray-500 opacity-70">📍</span> {location}</div>
      </div>
    </td>
    <td className="px-5 py-4 text-right">
      <div className="flex items-center justify-end gap-2">
        {/* More options button removed */}
        <Link
          href={`/lead-intelligence/${id}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-theme-600 dark:text-brand-primary p-1.5 rounded bg-theme-50 dark:bg-brand-primary/10 border border-theme-100 dark:border-brand-primary/20 hover:bg-theme-600 hover:text-white dark:hover:bg-brand-primary/20 transition-colors group/btn"
        >
          <ArrowUpRight className="w-4 h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </td>
  </tr>
);

export default Dashboard;
