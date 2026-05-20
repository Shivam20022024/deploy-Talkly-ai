'use client';

import React, { useState, useMemo } from 'react';
import { 
  Phone, MessageSquare, Bot, ArrowUpRight, Search, Filter, 
  Download, MoreHorizontal, ThermometerSun, ChevronLeft, ChevronRight,
  X, ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const ALL_LEADS = [
  { id: "call_1779052739265", leadType: "Phone Lead", leadName: "Rahul Sharma", contact: "+91 98765 43210", agent: "Nina (Sales)", language: "English/Hindi", temperature: "Warm Lead", intentScore: 85, conversionProb: 75, budget: "N/A", location: "N/A", icon: Phone },
  { id: "chat_928374928", leadType: "Website Chat", leadName: "Priya Patel", contact: "priya@example.com", agent: "Support Bot", language: "English", temperature: "Hot Lead", intentScore: 95, conversionProb: 80, budget: "5.5 Cr", location: "Bangalore", icon: MessageSquare },
  { id: "call_1779052745123", leadType: "Phone Lead", leadName: "Amit Kumar", contact: "+91 91234 56789", agent: "Nina (Sales)", language: "Hindi", temperature: "Cold Lead", intentScore: 12, conversionProb: 5, budget: "80 L", location: "Pune", icon: Phone },
  { id: "wa_99128374", leadType: "WhatsApp Bot", leadName: "Sneha Reddy", contact: "+91 99887 76655", agent: "WhatsApp Assistant", language: "English", temperature: "Warm Lead", intentScore: 55, conversionProb: 50, budget: "1.2 Cr", location: "Delhi NCR", icon: Bot },
  { id: "call_1779052799999", leadType: "Phone Lead", leadName: "Vikram Singh", contact: "+91 90000 11111", agent: "Nina (Sales)", language: "English", temperature: "Hot Lead", intentScore: 92, conversionProb: 88, budget: "3.0 Cr", location: "Hyderabad", icon: Phone },
  { id: "call_1779052788888", leadType: "Phone Lead", leadName: "Anjali Desai", contact: "+91 88888 22222", agent: "Nina (Support)", language: "Hindi/Gujarati", temperature: "Cold Lead", intentScore: 20, conversionProb: 15, budget: "N/A", location: "Ahmedabad", icon: Phone },
  { id: "call_1779052711111", leadType: "Phone Lead", leadName: "Ravi Mehta", contact: "+91 77777 33333", agent: "Nina (Sales)", language: "English", temperature: "Hot Lead", intentScore: 88, conversionProb: 70, budget: "2.5 Cr", location: "Mumbai", icon: Phone },
  { id: "chat_928374111", leadType: "Website Chat", leadName: "Kavya Nair", contact: "kavya@example.com", agent: "Support Bot", language: "English/Malayalam", temperature: "Warm Lead", intentScore: 60, conversionProb: 45, budget: "90 L", location: "Kochi", icon: MessageSquare },
  { id: "wa_99128222", leadType: "WhatsApp Bot", leadName: "Suresh Pillai", contact: "+91 66666 44444", agent: "WhatsApp Assistant", language: "Hindi", temperature: "Cold Lead", intentScore: 8, conversionProb: 3, budget: "N/A", location: "N/A", icon: Bot },
  { id: "call_1779052700000", leadType: "Phone Lead", leadName: "Deepika Rao", contact: "+91 55555 55555", agent: "Nina (Sales)", language: "English/Telugu", temperature: "Hot Lead", intentScore: 97, conversionProb: 92, budget: "4.8 Cr", location: "Chennai", icon: Phone },
  { id: "call_1779052766666", leadType: "Phone Lead", leadName: "Manish Gupta", contact: "+91 44444 66666", agent: "Nina (Support)", language: "Hindi", temperature: "Warm Lead", intentScore: 48, conversionProb: 35, budget: "1.8 Cr", location: "Jaipur", icon: Phone },
  { id: "chat_928374999", leadType: "Website Chat", leadName: "Meera Thomas", contact: "meera@example.com", agent: "Support Bot", language: "English", temperature: "Cold Lead", intentScore: 15, conversionProb: 8, budget: "N/A", location: "Kolkata", icon: MessageSquare },
];

const ITEMS_PER_PAGE = 8;
const AGENTS = ['All Agents', 'Nina (Sales)', 'Nina (Support)', 'Support Bot', 'WhatsApp Assistant'];
const TEMPERATURES = ['Any Temperature', 'Hot Lead', 'Warm Lead', 'Cold Lead'];

export default function LeadIntelligencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('All Agents');
  const [selectedTemp, setSelectedTemp] = useState('Any Temperature');
  const [currentPage, setCurrentPage] = useState(1);
  const [agentOpen, setAgentOpen] = useState(false);
  const [tempOpen, setTempOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState<string | null>(null);

  // Filtered data
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ALL_LEADS.filter(lead => {
      const matchSearch = !q || lead.leadName.toLowerCase().includes(q) || lead.id.includes(q) || lead.contact.includes(q);
      const matchAgent = selectedAgent === 'All Agents' || lead.agent === selectedAgent;
      const matchTemp = selectedTemp === 'Any Temperature' || lead.temperature === selectedTemp;
      return matchSearch && matchAgent && matchTemp;
    });
  }, [searchQuery, selectedAgent, selectedTemp]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSearch = (val: string) => { setSearchQuery(val); setCurrentPage(1); };
  const handleAgent = (val: string) => { setSelectedAgent(val); setAgentOpen(false); setCurrentPage(1); };
  const handleTemp = (val: string) => { setSelectedTemp(val); setTempOpen(false); setCurrentPage(1); };
  const clearFilters = () => { setSearchQuery(''); setSelectedAgent('All Agents'); setSelectedTemp('Any Temperature'); setCurrentPage(1); };

  const hasActiveFilters = searchQuery || selectedAgent !== 'All Agents' || selectedTemp !== 'Any Temperature';

  // CSV Export
  const handleExport = () => {
    const headers = ['Lead Name', 'ID', 'Contact', 'Agent', 'Language', 'Temperature', 'Intent Score', 'Conv. Prob.', 'Budget', 'Location'];
    const rows = filtered.map(l => [l.leadName, l.id, l.contact, l.agent, l.language, l.temperature, l.intentScore + '%', l.conversionProb + '%', l.budget, l.location]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-5" onClick={() => { setAgentOpen(false); setTempOpen(false); setMoreOpen(null); }}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Lead Intelligence</h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Track buyer intent and conversion probability across all conversations.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white text-[13px] font-semibold rounded-lg border border-gray-200 dark:border-white/5 transition-colors shadow-sm dark:shadow-none"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-lg text-[13px] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-300 dark:focus:border-[#DBB7F2]/40 transition-colors"
            placeholder="Search by name, ID, or phone..."
          />
          {searchQuery && (
            <button onClick={() => handleSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
          
          {/* Agent Filter */}
          <div className="relative">
            <button
              onClick={() => { setAgentOpen(v => !v); setTempOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${selectedAgent !== 'All Agents' ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 border-purple-200 dark:border-[#DBB7F2]/30 text-purple-700 dark:text-[#DBB7F2]' : 'bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              <Filter className="w-3.5 h-3.5" /> {selectedAgent} <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>
            {agentOpen && (
              <div className="absolute top-full mt-1 left-0 z-50 w-48 bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-1 overflow-hidden">
                {AGENTS.map(a => (
                  <button key={a} onClick={() => handleAgent(a)} className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${selectedAgent === a ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 text-purple-700 dark:text-[#DBB7F2] font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Temperature Filter */}
          <div className="relative">
            <button
              onClick={() => { setTempOpen(v => !v); setAgentOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${selectedTemp !== 'Any Temperature' ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 border-purple-200 dark:border-[#DBB7F2]/30 text-purple-700 dark:text-[#DBB7F2]' : 'bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              <ThermometerSun className="w-3.5 h-3.5" /> {selectedTemp} <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>
            {tempOpen && (
              <div className="absolute top-full mt-1 left-0 z-50 w-44 bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-1 overflow-hidden">
                {TEMPERATURES.map(t => (
                  <button key={t} onClick={() => handleTemp(t)} className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${selectedTemp === t ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 text-purple-700 dark:text-[#DBB7F2] font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20 transition-colors whitespace-nowrap">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-[13px] text-gray-500 dark:text-gray-400 px-1">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> lead{filtered.length !== 1 ? 's' : ''}
        {hasActiveFilters && <span> matching your filters</span>}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#15121D] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[1000px]">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/5">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider">Lead / Customer</th>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider">Language</th>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider">Temperature</th>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider">Intent Score</th>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider">Conversion Prob.</th>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider">Property Info</th>
                <th className="px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No leads found</p>
                      <p className="text-[13px] text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
                      <button onClick={clearFilters} className="mt-2 text-[13px] font-semibold text-purple-600 dark:text-[#DBB7F2] hover:underline">Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Lead / Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                        <lead.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-[#DBB7F2] transition-colors" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block leading-tight">{lead.leadName}</span>
                        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">#{lead.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="px-5 py-4">
                    <span className="text-[13px] text-gray-700 dark:text-gray-300 font-medium">{lead.language}</span>
                  </td>

                  {/* Temperature */}
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1.5 border ${
                      lead.temperature === 'Hot Lead' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
                      : lead.temperature === 'Warm Lead' ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 text-purple-600 dark:text-[#DBB7F2] border-purple-100 dark:border-[#DBB7F2]/20'
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                    }`}>
                      <ThermometerSun className="w-3 h-3" /> {lead.temperature}
                    </span>
                  </td>

                  {/* Intent Score */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5 w-28">
                      <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intentScore}%</span>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#DBB7F2] to-[#A392FF]" style={{ width: `${Math.max(lead.intentScore, 2)}%` }} />
                      </div>
                    </div>
                  </td>

                  {/* Conversion Prob. */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5 w-28">
                      <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.conversionProb}%</span>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-500 dark:bg-green-400" style={{ width: `${Math.max(lead.conversionProb, 2)}%` }} />
                      </div>
                    </div>
                  </td>

                  {/* Property Info */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5 text-[12px]">
                      <span className="text-gray-700 dark:text-gray-300"><span className="text-gray-400 dark:text-gray-500">₹</span> {lead.budget}</span>
                      <span className="text-gray-400 dark:text-gray-500">📍 {lead.location}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setMoreOpen(moreOpen === lead.id ? null : lead.id)}
                          className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                          title="More Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {moreOpen === lead.id && (
                          <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-[#1C1829] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-1 z-50">
                            <button className="w-full text-left px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Add Note</button>
                            <button className="w-full text-left px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Send Email</button>
                            <button className="w-full text-left px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Schedule Call</button>
                            <div className="my-1 border-t border-gray-100 dark:border-white/5" />
                            <button className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Archive Lead</button>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/lead-intelligence/${lead.id}`}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-purple-600 dark:text-[#DBB7F2] px-3 py-2 rounded-lg bg-purple-50 dark:bg-[#DBB7F2]/10 border border-purple-100 dark:border-[#DBB7F2]/20 hover:bg-purple-600 hover:text-white dark:hover:bg-[#DBB7F2]/20 transition-colors group/btn"
                      >
                        View <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
            <span className="text-gray-500 dark:text-gray-400">
              Showing <strong className="text-gray-900 dark:text-white">{(safePage - 1) * ITEMS_PER_PAGE + 1}</strong>–<strong className="text-gray-900 dark:text-white">{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong className="text-gray-900 dark:text-white">{filtered.length}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pageNumbers.map(n => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${safePage === n ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 text-purple-600 dark:text-[#DBB7F2] font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
