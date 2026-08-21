'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { impersonate } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    setLoading(true);
    try {
      const res = await api.getSuperAdminCompanies();
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(companyId: string, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.updateCompanyStatus(companyId, newStatus);
      await loadCompanies();
    } catch (e) {
      alert("Failed to update status");
    }
  }

  const handleImpersonate = (companyId: string) => {
    impersonate(companyId);
    router.push('/dashboard');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Companies</h1>
        <p className="text-slate-500 mt-1">Manage all tenants on the TalklyAI platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Users</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Calls</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">Loading...</td></tr>
            ) : companies.map(c => (
              <tr key={c.company_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{c.company_id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{c.stats?.users || 0}</td>
                <td className="px-6 py-4 text-slate-600">{c.stats?.calls || 0}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleImpersonate(c.company_id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View As
                  </button>
                  <button onClick={() => handleToggleStatus(c.company_id, c.status)} className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                    {c.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
