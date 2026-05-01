export interface Persona {
  id: string;
  name: string;
  occupation: string;
  bio?: string;
  goals: string[];
  painPoints: string[];
  motivations: string[];
  avatar?: string;
  researchContext?: string;
  embedding?: number[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  techSavviness: "low" | "medium" | "high";
  location: string;
  age: number;
  quote: string;
  income: string;
  education: string;
}

export interface PersonaFormData {
  researchContext: string;
  targetSegment?: string;
  productCategory?: string;
  count?: number;
  customAttributes?: string;
}

export interface DebateMessage {
  id: string;
  personaId: string;
  personaName: string;
  content: string;
  round: number;
  timestamp: string;
}

export interface DebateConfig {
  topic: string;
  personaIds: string[];
  rounds: number;
  focusArea?: string;
  moderatorEnabled?: boolean;
}

export type StreamEvent = 
  | { type: "start" }
  | { type: "error"; error: string }
  | { type: "message_start"; personaId: string; personaName: string; round: number }
  | { type: "message_chunk"; personaId: string; personaName: string; chunk: string; round: number }
  | { type: "message_end"; personaId: string; personaName: string; message: DebateMessage; round: number }
  | { type: "round_end"; round: number }
  | { type: "debate_end"; summary: string };

export interface Insight {
  id: string;
  title: string;
  description: string;
  score: number;
  category: "opportunity" | "risk" | "trend" | "recommendation" | "segment" | "feature";
  confidence: "high" | "medium" | "low";
  priority: number;
  evidence?: string[];
  affectedPersonas?: string[];
}

export interface MarketInsightReport {
  id: string;
  researchQuestion: string;
  personaIds: string[];
  debateIds?: string[];
  insights: Insight[];
  summary: string;
  generatedAt: string;
}
