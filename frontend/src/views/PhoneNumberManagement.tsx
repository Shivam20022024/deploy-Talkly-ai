import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Phone, Plus, Settings, CheckCircle2, Loader2, Link2 } from 'lucide-react';

interface PhoneNumber {
  number: string;
  status: string;
  webhook_url: string;
}

const PhoneNumberManagement: React.FC = () => {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [areaCode, setAreaCode] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const loadNumbers = async () => {
    try {
      setLoading(true);
      const res = await api.getInboundNumbers();
      if (res.status === 'success') {
        setNumbers(res.numbers);
      }
    } catch {
      toast.error('Failed to load phone numbers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    loadNumbers();
  }, []);



  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPurchasing(true);
      const res = await api.purchaseNumber(areaCode);
      if (res.status === 'success') {
        toast.success(`Purchased number: ${res.number}`);
        setAreaCode('');
        loadNumbers();
      }
    } catch {
      toast.error('Failed to purchase number');
    } finally {
      setPurchasing(false);
    }
  };

  const handleConfigureWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNumber) return;
    try {
      const res = await api.configureWebhook(selectedNumber, webhookUrl);
      if (res.status === 'success') {
        toast.success('Webhook configured successfully');
        setSelectedNumber(null);
        setWebhookUrl('');
        loadNumbers();
      } else {
        toast.error(res.message || 'Failed to configure webhook');
      }
    } catch {
      toast.error('Failed to configure webhook');
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Inbound Phone Numbers</h2>
        <p className="text-slate-400">Manage your telephony integration for inbound AI agents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 md:col-span-1 border-primary/20">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="text-primary" size={20} /> Purchase New Number
          </h3>
          <form onSubmit={handlePurchase} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Area Code (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. 415" 
                className="input" 
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
                maxLength={3}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full flex justify-center items-center gap-2"
              disabled={purchasing}
            >
              {purchasing ? <Loader2 className="animate-spin" size={18} /> : <Phone size={18} />}
              Buy Number
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Note: This is a simulation. A mock number will be generated.
            </p>
          </form>
        </div>

        <div className="card p-6 md:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Phone className="text-primary" size={20} /> Active Numbers
          </h3>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : numbers.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Phone className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-medium">No numbers configured yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {numbers.map((num) => (
                <div key={num.number} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{num.number}</span>
                        <span className="badge badge-success text-[10px]"><CheckCircle2 size={10} className="mr-1" /> ACTIVE</span>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Link2 size={14} /> 
                        {num.webhook_url ? (
                          <span className="truncate max-w-[200px] inline-block align-bottom">{num.webhook_url}</span>
                        ) : (
                          <span className="text-orange-500">Not configured</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSelectedNumber(num.number);
                      setWebhookUrl(num.webhook_url || '');
                    }}
                    className="btn btn-outline text-sm py-1.5 px-3 whitespace-nowrap"
                  >
                    <Settings size={16} className="mr-2" />
                    Configure
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Webhook Configuration Modal */}
      {selectedNumber && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold mb-1">Configure Webhook</h3>
              <p className="text-sm text-slate-500">For number: {selectedNumber}</p>
            </div>
            
            <form onSubmit={handleConfigureWebhook} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Inbound Webhook URL
                </label>
                <input 
                  type="url" 
                  placeholder="https://your-domain.com/api/v1/inbound/webhook" 
                  className="input font-mono text-sm" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Point this to your ngrok URL + /api/v1/inbound/webhook
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setSelectedNumber(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberManagement;
