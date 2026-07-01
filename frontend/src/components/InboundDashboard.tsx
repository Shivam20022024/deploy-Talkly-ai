import React from 'react';
import { CallInteraction } from '../types';
import { PhoneIncoming, Clock, PhoneMissed, CheckCircle } from 'lucide-react';

interface InboundDashboardProps {
  interactions: CallInteraction[];
}

export default function InboundDashboard({ interactions }: InboundDashboardProps) {
  const inboundCalls = interactions.filter(i => i.direction === 'inbound');
  
  const totalCalls = inboundCalls.length;
  const activeCalls = inboundCalls.filter(i => i.status === 'Active' || i.status === 'Pending').length;
  const missedCalls = inboundCalls.filter(i => i.status === 'Failed').length;
  
  const analyzedCalls = inboundCalls.filter(i => i.status === 'Analyzed');
  const resolutionRate = totalCalls > 0 
    ? Math.round((analyzedCalls.length / totalCalls) * 100) 
    : 0;

  const avgDuration = inboundCalls.length > 0
    ? Math.round(inboundCalls.reduce((acc, curr) => acc + curr.durationSeconds, 0) / inboundCalls.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inbound AI Calls Overview</h2>
        <div className="badge badge-primary px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
          Live Tracking Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <PhoneIncoming size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Inbound</p>
              <h3 className="text-3xl font-bold">{totalCalls}</h3>
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <PhoneIncoming size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Calls</p>
              <h3 className="text-3xl font-bold">{activeCalls}</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <PhoneMissed size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Missed Calls</p>
              <h3 className="text-3xl font-bold">{missedCalls}</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Resolution Rate</p>
              <h3 className="text-3xl font-bold">{resolutionRate}%</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4">Recent Inbound Calls</h3>
        {inboundCalls.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">No inbound calls yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Language</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Intent</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {inboundCalls.slice(0, 10).map((call) => (
                  <tr key={call.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium">{call.customerName}</td>
                    <td className="py-3">{call.language || 'English'}</td>
                    <td className="py-3">{call.duration}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                        {call.intentLabel || 'Inquiry'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.status === 'Analyzed' ? 'bg-emerald-100 text-emerald-700' :
                        call.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
