import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  TrendingUp, 
  Users, 
  Flame, 
  Target, 
  BarChart3, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CallInteraction } from '../types';
import { api } from '../services/api';

interface DashboardOverviewProps {
  interactions: CallInteraction[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ interactions }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [filterDirection, setFilterDirection] = useState<'all' | 'inbound' | 'outbound'>('all');

  const filteredInteractions = interactions.filter(i => 
    filterDirection === 'all' || (i.direction || 'outbound') === filterDirection
  );

  const hotLeads = filteredInteractions.filter(i => i.leadTemperature === 'Hot').length;
  const avgIntent = filteredInteractions.length > 0 
    ? Math.round(filteredInteractions.reduce((acc, i) => acc + i.intentScore, 0) / filteredInteractions.length) 
    : 0;
  const conversionRate = filteredInteractions.length > 0 
    ? Math.round(filteredInteractions.reduce((acc, i) => acc + i.conversionProbability, 0) / filteredInteractions.length) 
    : 0;

  const stats = [
    { label: 'Total Sales Calls', value: filteredInteractions.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%', up: true },
    { label: 'Hot Leads', value: hotLeads, icon: Flame, color: 'text-red-600', bg: 'bg-red-50', change: '+5%', up: true },
    { label: 'Avg Buyer Intent', value: `${avgIntent}%`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', change: '+8%', up: true },
    { label: 'Conv. Probability', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '-2%', up: false },
  ];

  const leadTempData = [
    { name: 'Hot', value: hotLeads, color: '#ef4444' },
    { name: 'Warm', value: filteredInteractions.filter(i => i.leadTemperature === 'Warm').length, color: '#f59e0b' },
    { name: 'Cold', value: filteredInteractions.filter(i => i.leadTemperature === 'Cold').length, color: '#3b82f6' },
  ];

  // Group interactions by day of week for the chart
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyCallsData = days.map(day => {
    const count = filteredInteractions.filter(i => {
      const date = new Date(i.date);
      return days[date.getDay()] === day;
    }).length;
    return { name: day, calls: count };
  });

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Generating report...", { id: "report-toast" });
      await api.downloadOverallExcel();
      toast.success("Report downloaded successfully!", { id: "report-toast" });
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report", { id: "report-toast" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Conversation Intelligence Summary</h2>
          <p className="text-slate-400">AI-powered intelligence and actionable insights from customer voice conversations</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center mr-2">
            <button 
              onClick={() => setFilterDirection('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterDirection === 'all' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All Calls
            </button>
            <button 
              onClick={() => setFilterDirection('inbound')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterDirection === 'inbound' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Inbound
            </button>
            <button 
              onClick={() => setFilterDirection('outbound')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterDirection === 'outbound' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Outbound
            </button>
          </div>
          <button className="btn btn-outline">Last 7 Days</button>
          <button 
            className="btn btn-primary flex items-center gap-2 disabled:opacity-70"
            onClick={handleDownloadReport}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating Report...
              </>
            ) : (
              "Download Report"
            )}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-secondary text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Weekly Sales Call Volume
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCallsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="calls" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            Lead Temperature Distribution
          </h4>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadTempData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadTempData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-6 pr-10">
              {leadTempData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{item.name}</span>
                    <span className="text-sm font-medium" style={{ color: '#6B7280' }}>{item.value} Leads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
