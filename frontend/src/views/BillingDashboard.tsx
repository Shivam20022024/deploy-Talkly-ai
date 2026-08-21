import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const BillingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [usage, setUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(1000);
  const [initIntent, setInitIntent] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getWalletDashboard();
      setDashboardData(data);
      
      const txs = await api.getTransactions();
      setTransactions(txs);
      
      const usageRecords = await api.getUsage();
      setUsage(usageRecords);
    } catch (err: any) {
      toast.error(err.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Load Cashfree script
    if (!document.getElementById("cashfree-script")) {
      const script = document.createElement("script");
      script.id = "cashfree-script";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      document.body.appendChild(script);
    }
    
    // Check for intents from landing page
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const intent = params.get('intent');
      const amount = params.get('amount');
      const plan = params.get('plan');
      
      if (intent === 'buy_credits' || intent === 'subscribe') {
        setInitIntent(intent);
        setShowAddCredits(true);
        if (amount) setCreditAmount(Number(amount));
        
        // Clean URL to prevent re-triggering on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  const handleAddCredits = async () => {
    try {
      toast.loading("Initiating payment...");
      const res = await api.createOrder(creditAmount);
      
      toast.dismiss();
      
      if (!res.order || !res.order.id) {
        throw new Error("Failed to create order");
      }

      // Mock integration for when Razorpay is not fully configured (local dev)
      if (res.order.id.startsWith("mock_order")) {
        toast.success("Mock payment successful! Credits will be added via mock webhook.");
        setShowAddCredits(false);
        setTimeout(loadData, 2000);
        return;
      }

      // Real Cashfree integration
      if (!(window as any).Cashfree) {
        toast.error("Cashfree SDK failed to load. Please refresh.");
        return;
      }

      const cashfree = (window as any).Cashfree({
        mode: "sandbox" // Change to "production" for live
      });

      const checkoutOptions = {
        paymentSessionId: res.order.payment_session_id,
        redirectTarget: "_modal"
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          toast.error("Payment failed: " + result.error.message);
        }
        if (result.paymentDetails) {
          api.verifyPayment(res.order.id)
            .then(() => {
              toast.success("Payment successful!");
              setShowAddCredits(false);
              setTimeout(loadData, 2000); // Wait for processing
            })
            .catch(() => toast.error("Payment verification failed"));
        }
      });
      
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Payment initiation failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Billing & Wallet</h1>
        <button 
          onClick={() => setShowAddCredits(true)}
          className="btn btn-primary"
        >
          Add Credits
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg">
          <h3 className="text-white/80 font-medium mb-1">Current Balance</h3>
          <div className="text-4xl font-bold mb-4">
            ₹{dashboardData?.balance?.toFixed(2) || "0.00"}
          </div>
          <p className="text-sm text-white/80">
            Low balance threshold: ₹200.00
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-secondary font-medium mb-1">Current Plan</h3>
          <div className="text-2xl font-bold text-slate-800 mb-2">
            {dashboardData?.plan_name || "Pay-As-You-Go"}
          </div>
          <div className="text-sm text-slate-500 mb-2">
            Billing Period: {dashboardData?.billing_period || "Current Month"}
          </div>
          <button className="text-primary font-medium text-sm hover:underline">
            Upgrade Plan
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-secondary font-medium mb-1">Usage This Month</h3>
          <div className="text-2xl font-bold text-slate-800 mb-2">
            {dashboardData?.minutes_used || 0} <span className="text-lg text-slate-500 font-normal">/ {dashboardData?.minutes_included > 0 ? dashboardData.minutes_included : "∞"} min</span>
          </div>
          <div className="text-sm text-slate-500">
            Total spending: ₹{dashboardData?.total_spending?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No transactions found.</p>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-slate-800">{tx.description}</div>
                    <div className="text-xs text-slate-500">{new Date(tx.created_at).toLocaleString()}</div>
                  </div>
                  <div className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-800'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Usage</h3>
          {usage.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No usage recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {usage.slice(0, 5).map((u, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-slate-800 capitalize">{u.service_type.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-500">{new Date(u.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">₹{u.customer_cost.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{u.billed_minutes} min</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddCredits && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Credits to Wallet</h2>
            <p className="text-sm text-slate-500 mb-6">
              Recharge your wallet to continue using TalklyAI services seamlessly.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCreditAmount(amt)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                    creditAmount === amt 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Custom Amount (₹)</label>
              <input 
                type="number" 
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                min="100"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddCredits(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCredits}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-sm shadow-primary/30"
              >
                Pay ₹{creditAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingDashboard;
