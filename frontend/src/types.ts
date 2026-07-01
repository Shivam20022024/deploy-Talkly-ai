export type LeadTemperature = "Hot" | "Warm" | "Cold";

export interface PropertyRequirements {
  budget?: string;
  location?: string;
  propertyType?: string;
  timeline?: string;
  loanRequired?: boolean;
  investmentPurpose?: "Self-Use" | "Investment" | "N/A";
}

export interface Objection {
  type: string;
  severity: "High" | "Medium" | "Low";
  content: string;
}

export interface FollowUpRecommendation {
  type: "WhatsApp" | "Email" | "Callback" | "Meeting";
  content: string;
  draft?: string;
  priority: "High" | "Medium" | "Low";
}

export interface CallInteraction {
  id: string;
  customerId?: string;
  customerName?: string;
  agentName: string;
  date: string;
  duration: string;
  durationSeconds?: number;
  sentiment: string;
  sentimentConfidence?: number;
  emotion?: string;
  tags: string[];
  summary: string;
  transcript: string;
  language: string;
  languageConfidence?: number;
  englishTranslation?: string;
  
  // AI Intelligence
  leadTemperature: LeadTemperature;
  intentScore: number; // 0-100
  intentLabel?: string;
  conversionProbability: number; // 0-100
  propertyRequirements: PropertyRequirements;
  objections: Objection[];
  followUpRecommendations: FollowUpRecommendation[];
  actionItems: string[];
  
  // Agent Analytics
  agentPerformance?: {
    talkRatio: number; // 0-1
    interruptionCount: number;
    closingStrength: number;
    objectionHandlingScore: number;
  };
  
  status: "Analyzed" | "Pending" | "Failed" | "Active";
  direction?: "inbound" | "outbound" | "unknown";
  analysis?: {
    action_items?: string[];
  };
  converted?: boolean;
}

export interface CallFromAPI {
  call_id: string;
  customer_id?: string;
  duration_seconds?: number;
  duration?: string;
  sentiment?: string;
  emotion?: string;
  summary?: string;
  language?: string;
  customer_name?: string;
  agent_name?: string;
  transcript?: string;
  status?: string;
  analysis?: {
    customer_name?: string;
    lead_temperature?: LeadTemperature;
    intent_score?: number;
    intent_label?: string;
    conversion_probability?: number;
    property_requirements?: PropertyRequirements;
    objections?: Objection[];
    follow_up_recommendations?: FollowUpRecommendation[];
    action_items?: string[];
    language_detected?: string;
    english_translation?: string;
    agent_performance?: any;
    [k: string]: any;
  };
  created_at?: string;
  direction?: string;
}

export type ViewState = 
  | "DASHBOARD" 
  | "LEADS" 
  | "WHATSAPP_ANALYZER" 
  | "LIVE_CALL" 
  | "AGENT_ANALYTICS"
  | "CALL_DETAIL"
  | "LANDING"
  | "LOGIN"
  | "PHONE_NUMBERS"
  | "INBOUND_DASHBOARD"
  | "LANGUAGE_ANALYTICS"
  | "ANALYTICS";
