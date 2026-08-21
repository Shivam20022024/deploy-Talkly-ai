'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await api.getSuperAdminUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Users</h1>
        <p className="text-slate-500 mt-1">View all users across all tenants.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-slate-400">Loading...</td></tr>
            ) : users.map(u => (
              <tr key={u.user_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{u.name}</div>
                  <div className="text-sm text-slate-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'COMPANY_ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{u.company_name || 'N/A'}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{u.company_id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
