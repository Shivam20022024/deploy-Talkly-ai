import React from 'react';
import { CallInteraction } from '../types';
import { User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

interface HumanTransferPanelProps {
  call: CallInteraction | null;
  onAccept: () => void;
  onDecline: () => void;
}

export default function HumanTransferPanel({ call, onAccept, onDecline }: HumanTransferPanelProps) {
  if (!call) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={28} className="animate-pulse" />
            <h2 className="text-2xl font-bold">Incoming Call Transfer</h2>
          </div>
          <p className="text-orange-50 font-medium">AI requires human assistance for this customer.</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Customer Name</p>
              <div className="flex items-center gap-2">
                <User size={18} className="text-slate-400" />
                <p className="font-bold text-lg">{call.customerName}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Detected Language</p>
              <p className="font-bold text-lg">{call.language || 'English'}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Call Intent</p>
              <p className="font-bold">{call.intentLabel}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Customer Sentiment</p>
              <p className="font-bold capitalize">{call.sentiment}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-slate-500 font-medium mb-2">AI Summary Before Transfer</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-slate-700">{call.summary || 'Customer requested agent escalation.'}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Phone size={20} />
              Accept Call
            </button>
            <button 
              onClick={onDecline}
              className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition-all"
            >
              Send to Voicemail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
