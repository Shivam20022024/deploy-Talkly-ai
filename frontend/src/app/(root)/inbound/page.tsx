'use client';

import React, { useEffect, useState } from 'react';
import { PhoneIncoming, Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Phone, ThermometerSun, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function InboundPage() {
  const [calls, setCalls] = useState([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    avgDuration: '0m',
    missedCalls: 0
  });

  useEffect(() => {
    const fetchInboundCalls = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/inbound/calls`);
        if (res.ok) {
          const data = await res.json();
          setCalls(data.calls || []);
          
          const inbound = data.calls || [];
          setStats({
            totalCalls: inbound.length,
            activeCalls: inbound.filter((c: any) => c.status === 'Active').length,
            avgDuration: '2m 15s', // Placeholder 
            missedCalls: 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch inbound calls", err);
      }
    };
    
    fetchInboundCalls();
    const interval = setInterval(fetchInboundCalls, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <PhoneIncoming className="h-6 w-6 text-brand-primary" />
            Inbound Calls
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage incoming AI conversations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Inbound"
          value={stats.totalCalls.toString()}
          icon={Users}
          trend="+15%"
        />
        <MetricCard
          label="Active Calls"
          value={stats.activeCalls.toString()}
          icon={PhoneIncoming}
          trend="+2"
        />
        <MetricCard
          label="Avg Duration"
          value={stats.avgDuration}
          icon={Clock}
          trend="-30s"
          trendColor="text-red-500"
        />
        <MetricCard
          label="Missed Calls"
          value={stats.missedCalls.toString()}
          icon={AlertCircle}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Inbound Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-white/5 whitespace-nowrap">
              <tr>
                <th className="px-5 py-4 font-medium">Inbound Caller</th>
                <th className="px-5 py-4 font-medium">Language</th>
                <th className="px-5 py-4 font-medium">Temperature</th>
                <th className="px-5 py-4 font-medium">Intent Score</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-gray-600 dark:text-gray-300">
              {calls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">No calls found.</td>
                </tr>
              ) : (
                calls.slice(0, 10).map((call: any) => (
                  <ActivityRow
                    key={call.call_id || call._id}
                    id={call.call_id || call._id}
                    leadType={call.customer_name || 'Inbound Caller'}
                    callId={`#${call.call_id || 'unknown'}`}
                    language={call.language || call.analysis?.language_detected || 'English'}
                    temperature={call.analysis?.lead_temperature?.includes('Hot') ? 'Hot Lead' : call.analysis?.lead_temperature?.includes('Warm') ? 'Warm Lead' : 'Cold Lead'}
                    intentScore={call.analysis?.intent_score || 0}
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

function ActivityRow({ id, leadType, callId, language, temperature, intentScore, icon: Icon }: any) {
  return (
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
        temperature === 'Warm Lead' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
        <ThermometerSun className="w-3 h-3" /> {temperature}
      </span>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden w-16 hidden sm:block">
          <div className={`h-full rounded-full ${intentScore > 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`} style={{ width: `${Math.max(intentScore, 2)}%` }}></div>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-[12px]">{intentScore}%</span>
      </div>
    </td>
    <td className="px-5 py-4 text-right">
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/lead-intelligence/${id}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 dark:text-blue-400 p-1.5 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 hover:bg-blue-600 hover:text-white transition-colors group/btn"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </td>
  </tr>
  );
}

function MetricCard({ icon: Icon, label, value, trend, trendColor = "text-theme-600 dark:text-brand-primary", iconColor = "text-gray-500 dark:text-gray-300" }: any) {
  return (
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
}
