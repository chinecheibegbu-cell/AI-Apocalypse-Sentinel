export interface EvaluationResult {
  hallucinationScore: number;
  hallucinationsDetected: string[];
  explanation: string;
  confidenceScore: number;
  biasScore: number;
  biasAnalysis: string;
  harmfulContent: string;
  suggestedPrompts: string[];
  trustScore: number;
}

export interface ModelComparisonItem {
  modelName: string;
  response: string;
  trustScore: number;
  analysis: string;
  hallucinationRisk: "None" | "Low" | "Moderate" | "High";
  pros: string[];
  cons: string[];
}

export interface ComparisonResult {
  query: string;
  models: ModelComparisonItem[];
}

export interface VerificationResult {
  contentType: string;
  scamPhishingScore: number;
  isScam: boolean;
  deepfakeScore: number;
  isDeepfake: boolean;
  credibilityScore: number;
  scamIndicators: string[];
  deepfakeIndicators: string[];
  evaluationText: string;
  verificationSteps: string[];
}

export interface RiskCategory {
  name: string;
  riskScore: number;
  trend: "rising" | "stable" | "falling";
  description: string;
  recommendations: string[];
}

export interface GlobalAnomaly {
  region: string;
  coordinate: { lat: number; lng: number };
  anomaly: string;
  severity: "high" | "medium" | "low";
}

export interface LiveIncident {
  time: string;
  title: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  details: string;
}

export interface RiskForecast {
  overallRiskLevel: "CRITICAL" | "ELEVATED" | "MODERATE" | "LOW";
  ethicsScore: number;
  riskCategories: RiskCategory[];
  globalAnomalies: GlobalAnomaly[];
  liveIncidents: LiveIncident[];
  emulated?: boolean;
}

export interface SimScenario {
  id: string;
  title: string;
  type: "phishing" | "deepfake" | "bias";
  content: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  sourceHint: string;
}
