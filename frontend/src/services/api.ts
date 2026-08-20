// src/services/api.ts
import { CallFromAPI } from "../types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const userStr = localStorage.getItem('talkly_user_token');
  const headers = new Headers(options.headers || {});
  
  if (userStr) {
    headers.set('Authorization', `Bearer ${userStr}`);
  }

  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('talkly_user');
      localStorage.removeItem('talkly_user_token');
      document.cookie = 'talkly_token=; path=/; max-age=0; samesite=lax';
      window.location.href = '/login';
    }
    return new Response(JSON.stringify({ detail: 'Unauthenticated' }), { status: res.status });
  }

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.detail || data.message || errorMsg;
    } catch (e) {
      // ignore JSON parse error on error responses
    }
    throw new Error(errorMsg);
  }
  return res;
}

async function handleJSON(res: Response) {
  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.detail || data.message || errorMsg;
    } catch (e) {
      // ignore JSON parse error on error responses
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {

  login: async (email: string, password: string): Promise<any> => {
    const res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleJSON(res);
  },
  
  register: async (company_name: string, name: string, email: string, password: string): Promise<any> => {
    const res = await fetch(`${BASE}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name, name, email, password }),
    });
    return handleJSON(res);
  },

  getAllCalls: async (limit = 200, skip = 0): Promise<CallFromAPI[]> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/calls?limit=${limit}&skip=${skip}`);
    return handleJSON(res);
  },

  getCallById: async (callId: string): Promise<CallFromAPI> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/calls/${encodeURIComponent(callId)}`);
    return handleJSON(res);
  },

  uploadAudio: async (file: File, agentName?: string, employeeId?: string, employeeEmail?: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    if (agentName) formData.append("agent_name", agentName);
    if (employeeId) formData.append("employee_id", employeeId);
    if (employeeEmail) formData.append("employee_email", employeeEmail);
    const res = await fetchWithAuth(`${BASE}/api/v1/process-audio`, {
      method: "POST",
      body: formData,
    });
    return handleJSON(res);
  },

  triggerCall: async (phoneNumber: string, leadId: string): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/calls/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phoneNumber, lead_id: leadId }),
    });
    return handleJSON(res);
  },

  downloadOverallExcel: async () => {
    const res = await fetchWithAuth(`${BASE}/download/overall`);
    if (!res.ok) throw new Error("Failed to download report");
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        throw new Error(json.message || "Failed to generate report (JSON returned)");
    }
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TalklyAI_RealEstate_Report.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
  downloadWeeklyCallsExcel: () => { window.open(`${BASE}/download/weekly-calls`, "_blank"); },
  downloadWeeklySalesExcel: () => { window.open(`${BASE}/download/weekly-sales`, "_blank"); },

  getInboundNumbers: async (): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/inbound/numbers`);
    return handleJSON(res);
  },
  purchaseNumber: async (areaCode: string): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/inbound/numbers/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area_code: areaCode }),
    });
    return handleJSON(res);
  },
  configureWebhook: async (number: string, webhookUrl: string): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/inbound/numbers/${encodeURIComponent(number)}/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhook_url: webhookUrl }),
    });
    return handleJSON(res);
  },
  transferCall: async (callId: string, destinationNumber: string): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/inbound/${encodeURIComponent(callId)}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination_number: destinationNumber }),
    });
    return handleJSON(res);
  },

  getWalletDashboard: async (): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/billing/wallet`);
    return handleJSON(res);
  },
  
  getTransactions: async (limit = 50, skip = 0): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/billing/transactions?limit=${limit}&skip=${skip}`);
    return handleJSON(res);
  },

  getUsage: async (limit = 50, skip = 0): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/billing/usage?limit=${limit}&skip=${skip}`);
    return handleJSON(res);
  },

  createOrder: async (amount: number, currency: string = "INR"): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/billing/wallet/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    });
    return handleJSON(res);
  },

  verifyPayment: async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<any> => {
    const res = await fetchWithAuth(`${BASE}/api/v1/billing/wallet/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
    });
    return handleJSON(res);
  },
};
