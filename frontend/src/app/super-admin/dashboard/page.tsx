'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Building2, Users, PhoneCall, CheckCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.getSuperAdminDashboard();
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading platform overview...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load platform data.</div>;

  const statCards = [
    { label: "Total Companies", value: stats['Total Companies'], icon: Building2 },
    { label: "Active Companies", value: stats['Active Companies'], icon: CheckCircle, color: "text-green-500" },
    { label: "Total Users", value: stats['Total Users'], icon: Users },
    { label: "Total Calls", value: stats['Total Calls'], icon: PhoneCall, color: "text-blue-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
        <p className="text-slate-500 mt-1">Monitor the overall health and usage of TalklyAI across all tenants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color || 'text-slate-400'}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900">{s.value?.toLocaleString() || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
