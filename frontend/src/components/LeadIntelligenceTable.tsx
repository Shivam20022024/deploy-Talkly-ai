import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Phone,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { CallInteraction } from '../types';
import { api } from '../services/api';

interface LeadIntelligenceTableProps {
  interactions: CallInteraction[];
  onSelectCall: (id: string) => void;
}

const LeadIntelligenceTable: React.FC<LeadIntelligenceTableProps> = ({ interactions, onSelectCall }) => {
  const [callingId, setCallingId] = useState<string | null>(null);

  const handleCallLead = async (callId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    let phone = prompt("Enter phone number (with + and country code, e.g. +91XXXXXXXXXX):");
    if (!phone) return;

    // Clean the number
    phone = phone.trim();
    
    // Auto-fix for Indian numbers if they forget the +91
    if (phone.length === 10 && !phone.startsWith('+')) {
      phone = `+91${phone}`;
    } else if (!phone.startsWith('+')) {
      alert("Please include the '+' and country code (e.g., +91 for India).");
      return;
    }

    setCallingId(callId);
    try {
      await api.triggerCall(phone, callId);
      alert(`AI Call initiated to ${phone} via AI Sales Agent!`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to trigger call: ${err.message}`);
    } finally {
      setCallingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Lead Intelligence</h2>
          <p className="text-secondary">Track buyer intent and conversion probability across all conversations</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline py-2 flex items-center gap-2">
              <Filter size={16} />
              Filters
            </button>
            <button 
              className="btn btn-outline py-2 flex items-center gap-2"
              onClick={() => api.downloadOverallExcel()}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4">Lead / Customer</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Temperature</th>
                <th className="px-6 py-4">Intent Score</th>
                <th className="px-6 py-4">Conversion Prob.</th>
                <th className="px-6 py-4">Property Info</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {interactions.map((call) => (
                <tr 
                  key={call.id} 
                  onClick={() => onSelectCall(call.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {call.customerName || "Lead"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">#{call.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{call.language}</td>
                  <td className="px-6 py-4">
                    <span className={`badge badge-${String(call.leadTemperature || 'Warm').toLowerCase()}`}>
                      {call.leadTemperature || 'Warm'} Lead
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${call.intentScore}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{call.intentScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${call.conversionProbability}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{call.conversionProbability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-700">₹ {call.propertyRequirements?.budget || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400">📍 {call.propertyRequirements?.location || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleCallLead(call.id, e)}
                        disabled={callingId === call.id}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border-none cursor-pointer disabled:opacity-50"
                      >
                        {callingId === call.id ? <Loader2 className="animate-spin" size={16} /> : <Phone size={16} />}
                      </button>
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border-none cursor-pointer">
                        <MessageSquare size={16} />
                      </button>
                      <ChevronRight className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" size={18} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadIntelligenceTable;
