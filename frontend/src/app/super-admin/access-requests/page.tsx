'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, CheckCircle2, XCircle, Clock, 
  Building, User, Mail, Phone, Globe, Briefcase, Users, MessageSquare, ChevronRight, X
} from 'lucide-react';

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total_companies: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('talkly_user_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/access-requests/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('talkly_user_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/access-requests?status=${filter}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [filter, search]);

  const handleApprove = async (id: str) => {
    if (!window.confirm("Approve access for this company?")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('talkly_user_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/access-requests/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSelectedRequest(null);
        fetchStats();
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.detail || "Approval failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem('talkly_user_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/access-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        setIsRejectModalOpen(false);
        setSelectedRequest(null);
        setRejectReason('');
        fetchStats();
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.detail || "Rejection failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-theme-500" />
            Access Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage company registration requests</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-theme-100 dark:bg-brand-primary/20 flex items-center justify-center text-theme-600 dark:text-brand-primary">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Companies</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_companies}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-bg-dark-card rounded-2xl p-4 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex bg-gray-100 dark:bg-black/20 rounded-lg p-1 w-full md:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-white dark:bg-bg-dark-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-theme-500 transition-colors" />
          <input
            type="text"
            placeholder="Search company or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-theme-500/20 focus:border-theme-500 transition-all dark:text-white"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-bg-dark-card rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No requests found.</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{req.company_name}</div>
                      <div className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{req.contact_name}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{req.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border
                        ${req.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : ''}
                        ${req.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : ''}
                        ${req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : ''}
                      `}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-theme-600 dark:text-brand-primary bg-theme-50 dark:bg-brand-primary/10 rounded-lg hover:bg-theme-100 dark:hover:bg-brand-primary/20 transition-colors"
                      >
                        View <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && !isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h3>
                <button onClick={() => setSelectedRequest(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Name</label>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-900 dark:text-white font-medium">
                      <Building className="w-4 h-4 text-gray-400" /> {selectedRequest.company_name}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Person</label>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-900 dark:text-white font-medium">
                      <User className="w-4 h-4 text-gray-400" /> {selectedRequest.contact_name}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Work Email</label>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-900 dark:text-white font-medium">
                      <Mail className="w-4 h-4 text-gray-400" /> {selectedRequest.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-900 dark:text-white font-medium">
                      <Phone className="w-4 h-4 text-gray-400" /> {selectedRequest.phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</label>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-900 dark:text-white font-medium">
                      <Briefcase className="w-4 h-4 text-gray-400" /> {selectedRequest.industry}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Size</label>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-900 dark:text-white font-medium">
                      <Users className="w-4 h-4 text-gray-400" /> {selectedRequest.company_size}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</label>
                  <div className="flex items-center gap-2 mt-1.5 text-theme-600 dark:text-brand-primary font-medium hover:underline cursor-pointer">
                    <Globe className="w-4 h-4" /> {selectedRequest.website}
                  </div>
                </div>

                {selectedRequest.use_case && (
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" /> Use Case
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedRequest.use_case}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'PENDING' && (
                <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Reject Request
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-theme-500 to-theme-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-theme-500/25 hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {actionLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    Approve & Provision Account
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isRejectModalOpen && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative w-full max-w-md bg-white dark:bg-bg-dark-card rounded-2xl shadow-2xl p-6"
             >
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reject Access Request</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please provide a reason for rejecting this request. This will be stored internally.</p>
               <textarea 
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Invalid company details..."
                  className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
               ></textarea>
               <div className="flex justify-end gap-3">
                 <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Cancel</button>
                 <button 
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50"
                 >
                   Confirm Rejection
                 </button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
