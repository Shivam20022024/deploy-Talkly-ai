// src/services/api.ts
import { APIAnalysisResponse, CallFromAPI } from "../types";

const BASE = (import.meta.env as any).VITE_API_URL || "http://localhost:8000";

async function handleJSON(res: Response) {
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getAllCalls: async (limit = 200, skip = 0): Promise<CallFromAPI[]> => {
    const res = await fetch(`${BASE}/calls?limit=${limit}&skip=${skip}`);
    return handleJSON(res);
  },

  getCallById: async (callId: string): Promise<CallFromAPI> => {
    const res = await fetch(`${BASE}/calls/${encodeURIComponent(callId)}`);
    return handleJSON(res);
  },

  uploadAudio: async (file: File, agentName?: string, employeeId?: string, employeeEmail?: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    if (agentName) formData.append("agent_name", agentName);
    if (employeeId) formData.append("employee_id", employeeId);
    if (employeeEmail) formData.append("employee_email", employeeEmail);
    const res = await fetch(`${BASE}/process-audio`, {
      method: "POST",
      body: formData,
    });
    return handleJSON(res);
  },

  triggerCall: async (phoneNumber: string, leadId: string): Promise<any> => {
    const res = await fetch(`${BASE}/calls/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phoneNumber, lead_id: leadId }),
    });
    return handleJSON(res);
  },

  downloadOverallExcel: () => { window.open(`${BASE}/download/overall`, "_blank"); },
  downloadWeeklyCallsExcel: () => { window.open(`${BASE}/download/weekly-calls`, "_blank"); },
  downloadWeeklySalesExcel: () => { window.open(`${BASE}/download/weekly-sales`, "_blank"); },
};
