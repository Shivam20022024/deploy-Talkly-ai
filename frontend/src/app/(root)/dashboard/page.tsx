import React from 'react';
import Link from 'next/link';
import { 
  PhoneCall, Flame, Target, Percent, TrendingUp, BarChart3, 
  ThermometerSun, Clock, Globe, Tag, CheckCircle2, Mail, 
  Bot, User, ChevronRight, Activity, Sparkles, Phone, MessageSquare, Users, CalendarDays, ArrowUpRight, MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Monitor your agents, active calls, and lead qualification metrics.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white text-[13px] font-semibold rounded-lg border border-gray-200 dark:border-white/5 transition-colors shadow-sm dark:shadow-none">
            Export Report
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#DBB7F2] to-[#A392FF] text-[#181623] text-[13px] font-bold rounded-lg shadow-lg shadow-[#A392FF]/20 hover:shadow-[#A392FF]/40 transition-shadow">
            <Plus className="w-4 h-4" />
            New Agent
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={PhoneCall} label="Total Calls Analyzed" value="14,284" trend="+12.5%" />
        <MetricCard icon={Users} label="Active Agents" value="12" trend="+2" />
        <MetricCard icon={Target} label="Avg Lead Quality" value="85 / 100" trend="+4.2%" trendColor="text-green-600 dark:text-green-400" />
        <MetricCard icon={CalendarDays} label="Meetings Booked" value="1,482" trend="+18%" trendColor="text-green-600 dark:text-green-400" />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Sales Call Volume */}
        <div className="bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm dark:shadow-none">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DBB7F2]/10 dark:bg-[#DBB7F2]/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Call Volume</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Inbound vs Outbound activity</p>
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

            {[40, 60, 30, 80, 100, 50, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full group">
                <div className="flex-1 w-full flex justify-center items-end gap-1.5 sm:gap-2 pb-3">
                  {/* Outbound Bar */}
                  <div 
                    className="w-full max-w-[12px] sm:max-w-[16px] rounded-t-md bg-gray-200 dark:bg-white/10 group-hover:bg-gray-300 dark:group-hover:bg-white/20 transition-all duration-300 relative cursor-pointer"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-[#22222D] text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-gray-800 dark:border-white/10 z-20">
                      {Math.floor(h * 15)} Out
                    </div>
                  </div>
                  {/* Inbound Bar */}
                  <div 
                    className="w-full max-w-[12px] sm:max-w-[16px] rounded-t-md bg-gradient-to-t from-[#A392FF] to-[#DBB7F2] opacity-90 dark:opacity-80 group-hover:opacity-100 transition-all duration-300 relative cursor-pointer shadow-[0_0_10px_rgba(219,183,242,0.2)]"
                    style={{ height: `${h * 0.65}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-[#22222D] text-[#DBB7F2] text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-gray-800 dark:border-[#DBB7F2]/20 z-20">
                      {Math.floor((h * 0.65) * 15)} In
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-500 uppercase h-[20px] block group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-5 border-t border-gray-100 dark:border-white/5 relative z-10">
            <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400 font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/20" /> Outbound Calls
            </div>
            <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400 font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DBB7F2]" /> Inbound Calls
            </div>
          </div>
        </div>

        {/* Lead Temperature & Intelligence */}
        <div className="bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Lead Intelligence</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Temperature distribution and average intent</p>
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
                  <span className="text-[13px] font-bold text-orange-500 dark:text-orange-400">12% (1,714)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Warm Leads */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-[#DBB7F2]/10 border border-purple-100 dark:border-[#DBB7F2]/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(219,183,242,0.1)]">
                <Activity className="w-5 h-5 text-purple-600 dark:text-[#DBB7F2]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900 dark:text-white">Warm Leads</span>
                  <span className="text-[13px] font-bold text-purple-600 dark:text-[#DBB7F2]">45% (6,427)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#DBB7F2] rounded-full" style={{ width: '45%' }}></div>
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
                  <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400">43% (6,143)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '43%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls / Leads Table */}
      <div className="bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest Active Calls</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Real-time feed of AI agent interactions</p>
          </div>
          <Link href="/lead-intelligence" className="flex items-center gap-1 text-[13px] text-purple-600 dark:text-[#DBB7F2] font-semibold hover:text-purple-700 dark:hover:text-[#EDDBF9] transition-colors">
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
              <ActivityRow 
                id="call_1779052739265"
                leadType="Phone Lead"
                callId="#call_1779052739265"
                language="English/Hindi"
                temperature="Warm Lead"
                intentScore={0}
                conversionProb={0}
                budget="N/A"
                location="N/A"
                icon={Phone} 
              />
              <ActivityRow 
                id="chat_928374928"
                leadType="Website Chat"
                callId="#chat_928374928"
                language="English"
                temperature="Hot Lead"
                intentScore={85}
                conversionProb={75}
                budget="5.5 Cr"
                location="Mumbai"
                icon={MessageSquare} 
              />
              <ActivityRow 
                id="call_1779052745123"
                leadType="Phone Lead"
                callId="#call_1779052745123"
                language="Hindi"
                temperature="Cold Lead"
                intentScore={12}
                conversionProb={5}
                budget="80 L"
                location="Pune"
                icon={Phone} 
              />
              <ActivityRow 
                id="wa_99128374"
                leadType="WhatsApp Bot"
                callId="#wa_99128374"
                language="English"
                temperature="Warm Lead"
                intentScore={65}
                conversionProb={50}
                budget="1.2 Cr"
                location="Delhi NCR"
                icon={Bot} 
              />
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const MetricCard = ({ icon: Icon, label, value, trend, trendColor = "text-purple-600 dark:text-[#DBB7F2]", iconColor = "text-gray-500 dark:text-gray-300" }: any) => (
  <div className="bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">{label}</h4>
      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-center">
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
      <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
        <TrendingUp className="w-3 h-3" /> {trend}
      </div>
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
      <span className={`bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2.5 py-1.5 rounded text-[11px] font-semibold inline-flex items-center gap-1.5 ${
        temperature === 'Hot Lead' ? 'text-orange-600 dark:text-orange-400' :
        temperature === 'Warm Lead' ? 'text-purple-600 dark:text-[#DBB7F2]' : 'text-blue-600 dark:text-blue-400'
      }`}>
        <ThermometerSun className="w-3 h-3" /> {temperature}
      </span>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden w-16 hidden sm:block">
          <div className={`h-full rounded-full ${intentScore > 0 ? 'bg-gradient-to-r from-[#DBB7F2] to-[#A392FF]' : 'bg-gray-300 dark:bg-gray-600'}`} style={{ width: `${Math.max(intentScore, 2)}%` }}></div>
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
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 rounded bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <Link
          href={`/lead-intelligence/${id}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-purple-600 dark:text-[#DBB7F2] p-1.5 rounded bg-purple-50 dark:bg-[#DBB7F2]/10 border border-purple-100 dark:border-[#DBB7F2]/20 hover:bg-purple-600 hover:text-white dark:hover:bg-[#DBB7F2]/20 transition-colors group/btn"
        >
          <ArrowUpRight className="w-4 h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </td>
  </tr>
);

export function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default Dashboard;