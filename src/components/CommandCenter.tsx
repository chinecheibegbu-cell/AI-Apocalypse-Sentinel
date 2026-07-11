import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  TrendingUp, 
  MapPin, 
  Globe, 
  Server, 
  AlertTriangle,
  RefreshCw,
  Volume2,
  Calendar,
  Lock,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  FileText,
  Clock,
  Briefcase
} from "lucide-react";
import { RiskForecast, GlobalAnomaly } from "../types";
// @ts-ignore
import mapImg from "../assets/images/friendly_world_map_1782967469671.jpg";

interface CommandCenterProps {
  forecast: RiskForecast | null;
  loading: boolean;
  onRefresh: () => void;
  onSpeak: (text: string) => void;
}

const THREAT_TIMELINE = [
  {
    year: "2024 - 2025",
    title: "Dynamic Deepfake Spearphishing",
    riskLevel: "HIGH",
    color: "text-amber-600 border-amber-300 bg-amber-50/10",
    description: "Malicious actors weaponize rapid real-time voice and video cloning. Automated platforms synthesize custom audio from 3-second public clips to call family members or corporate finance agents.",
    forecast: "Expected 450% expansion in spearphishing attempts targeting banking login portals.",
    mitigation: "Establish multi-channel verbal passwords and strict dual-authorization routines for wire transfers."
  },
  {
    year: "2026 - 2027",
    title: "Autonomous Agent Hijacking",
    riskLevel: "CRITICAL",
    color: "text-red-500 border-red-300 bg-red-50/10",
    description: "Self-governing AI agents and workflows are compromised via prompt injections hidden invisibly on target websites. Hackers trick email automation agents into forwarding credentials.",
    forecast: "Predicted to comprise 60% of external SaaS API leaks as system integration expands.",
    mitigation: "Strict sandbox restrictions for agents; never allow LLM-driven scripts to write system access tokens."
  },
  {
    year: "2028 - 2029",
    title: "AI-Powered Zero-Day Synthesizers",
    riskLevel: "CRITICAL",
    color: "text-purple-600 border-purple-300 bg-purple-50/10",
    description: "Advanced deep neural networks operate continuous, automated fuzzing loops, discovering software architecture loopholes and instantly preparing exploit packages.",
    forecast: "Attack cycles compressed from months to seconds, outrunning standard human security patch releases.",
    mitigation: "Deploy real-time counter-fuzzers and continuous container isolated vulnerability audits."
  },
  {
    year: "2030+",
    title: "weaponized Cognitive Narrative Feedback Loops",
    riskLevel: "EXTREME",
    color: "text-red-700 border-red-500 bg-red-100/20",
    description: "Autonomous disinformation networks monitor social reactions, dynamically generating targeted propaganda to influence local governance processes based on real-time user reactions.",
    forecast: "Potential degradation of reliable public knowledge domains and factual civic reporting trust.",
    mitigation: "Cryptographically verified provenance tags (C2PA) on all authorized media, documents, and news feeds."
  }
];

const ORG_PROFILES = [
  {
    name: "St. Jude Secondary School",
    type: "School",
    complianceScore: 92,
    blockedPrompts: 14,
    shadowITCount: 2,
    certifiedUsers: "96%",
    logs: [
      { time: "14:02:11", event: "PII Scrubbed", details: "Removed student home address and phone number from commercial writing bot prompt.", level: "safe" },
      { time: "11:45:00", event: "Adversarial Prompt Blocked", details: "Flagged jailbreak attempt: 'Explain bypass of campus content filter'.", level: "block" },
      { time: "09:12:44", event: "Unsafe Model Alert", details: "Shadow IT alert: Student attempted to access raw unaligned LLM playground.", level: "warn" }
    ]
  },
  {
    name: "Aegis Enterprise Corp",
    type: "Business",
    complianceScore: 84,
    blockedPrompts: 148,
    shadowITCount: 5,
    certifiedUsers: "88%",
    logs: [
      { time: "16:54:10", event: "API Secret Masked", details: "Redacted authentic corporate GCP service account key from translation prompt.", level: "block" },
      { time: "15:30:12", event: "Copyright Warning", details: "Code generation requested copy of proprietary license repository.", level: "warn" },
      { time: "13:10:02", event: "Data Scrubbed", details: "Scrubbed client database records from performance analytical LLM run.", level: "safe" }
    ]
  },
  {
    name: "Oakridge Institute of Tech",
    type: "University",
    complianceScore: 96,
    blockedPrompts: 42,
    shadowITCount: 1,
    certifiedUsers: "98%",
    logs: [
      { time: "17:11:00", event: "Academic Honesty Warning", details: "AI detection trigger: Full essay upload matching homework outlines.", level: "warn" },
      { time: "12:05:44", event: "PII Scrubbed", details: "Removed student ID index from grading feedback model query.", level: "safe" },
      { time: "08:30:19", event: "Adversarial Prompt Blocked", details: "Flagged jailbreak: 'Write python script to inject malware templates'.", level: "block" }
    ]
  }
];

export default function CommandCenter({ forecast, loading, onRefresh, onSpeak }: CommandCenterProps) {
  const [subTab, setSubTab] = useState<"tracker" | "timeline" | "dashboard">("tracker");
  const [selectedAnomaly, setSelectedAnomaly] = useState<GlobalAnomaly | null>(null);

  // Organization Safety Dashboard State
  const [selectedOrgIdx, setSelectedOrgIdx] = useState(0);
  const [disableRawModels, setDisableRawModels] = useState(true);
  const [enforcePIIMasking, setEnforcePIIMasking] = useState(true);
  const [blockAdversarial, setBlockAdversarial] = useState(true);
  const [logHallucinations, setLogHallucinations] = useState(true);

  // Default select first anomaly on mount
  useEffect(() => {
    if (forecast && forecast.globalAnomalies.length > 0 && !selectedAnomaly) {
      setSelectedAnomaly(forecast.globalAnomalies[0]);
    }
  }, [forecast]);

  if (!forecast) {
    return (
      <div className="flex flex-col items-center justify-center h-96 border border-slate-200/60 rounded-2xl bg-white p-6 text-center shadow-xs">
        <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
        <p className="text-slate-600 font-sans text-sm">Alert map offline. Please refresh to load active safety reports.</p>
        <button 
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Load Safety Feed
        </button>
      </div>
    );
  }

  const activeSystemsCount = 14839; // Active monitoring nodes
  const totalAnomalies = forecast.globalAnomalies.length;
  const currentOrg = ORG_PROFILES[selectedOrgIdx];

  const handleOrgConfigSpeak = () => {
    onSpeak(`Governance config for ${currentOrg.name}: Compliance Score is ${currentOrg.complianceScore} percent. Active safeguards include: Disable raw models is ${disableRawModels ? "active" : "disabled"}, PII masking is ${enforcePIIMasking ? "active" : "disabled"}.`);
  };

  return (
    <div className="space-y-6" id="command_center_container">
      
      {/* 3D Duolingo Sub-navigation menu */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => {
            setSubTab("tracker");
            onSpeak("Switched to Live Safety Tracker map.");
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            subTab === "tracker"
              ? "bg-[#1cb0f6] text-white border-b-2 border-[#1899d6] shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🌍 Live Safety Map
        </button>
        <button
          onClick={() => {
            setSubTab("timeline");
            onSpeak("Switched to Timeline of Emerging AI Threats.");
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            subTab === "timeline"
              ? "bg-purple-600 text-white border-b-2 border-purple-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📅 Threat Timeline
        </button>
        <button
          onClick={() => {
            setSubTab("dashboard");
            onSpeak("Switched to Organization AI Safety Dashboard.");
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            subTab === "dashboard"
              ? "bg-[#58cc02] text-white border-b-2 border-[#46a302] shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🏫 Org Safety Dashboard
        </button>
      </div>

      {/* TRACKER TAB */}
      {subTab === "tracker" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Top Banner Stats */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-emerald-100 bg-white p-4 rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px]" />
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">🌐 Safety Monitors</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">
                {activeSystemsCount.toLocaleString()} <span className="text-[10px] text-emerald-600 animate-pulse font-black">● ACTIVE</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Scanning systems running worldwide</p>
            </div>

            <div className="border border-red-100 bg-white p-4 rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[40px]" />
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">🚨 Active Alerts</span>
              <span className="text-xl font-black text-red-600 block mt-1">
                {totalAnomalies} <span className="text-[10px] text-red-650 font-black">INCIDENTS</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Recent AI scams and issues</p>
            </div>

            <div className="border border-purple-100 bg-white p-4 rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[40px]" />
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">⚪ AI Truth Index</span>
              <span className="text-xl font-black text-purple-600 block mt-1">
                {forecast.ethicsScore} <span className="text-[10px] text-purple-650 font-black">/100 SAFETY</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Average credibility of checked bots</p>
            </div>

            <div className="border border-amber-100 bg-white p-4 rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px]" />
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">🔥 Caution Level</span>
              <span className="text-xl font-black text-amber-600 block mt-1 uppercase">
                {forecast.overallRiskLevel === "ELEVATED" ? "MODERATE" : forecast.overallRiskLevel}
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Current general scam advisory</p>
            </div>
          </div>

          {/* Left map and forecast */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 relative">
              <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2 mb-1 uppercase">
                <Globe className="w-4 h-4 text-emerald-600" />
                Global AI Safety & Scam Tracker
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Select any alert marker on the map below to see recent local safety reports</p>

              {/* Custom SVG World Map */}
              <div className="w-full h-64 md:h-80 bg-slate-50 border-2 border-slate-200 rounded-2xl relative overflow-hidden flex items-center justify-center p-2 group shadow-inner">
                <img 
                  src={mapImg} 
                  alt="Holographic Cyber Map" 
                  className="absolute inset-0 w-full h-full object-cover opacity-15 select-none pointer-events-none transition-all duration-700 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
                
                <svg 
                  viewBox="0 0 800 400" 
                  className="w-full h-full relative z-10 select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="rgba(16, 185, 129, 0.08)" strokeWidth="0.5">
                    {[...Array(16)].map((_, i) => (
                      <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
                    ))}
                  </g>

                  {/* Simple continental geometry mappings */}
                  <path d="M 100 100 L 220 100 L 250 160 L 200 220 L 150 200 Z" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M 210 230 L 260 250 L 230 360 L 200 280 Z" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M 350 80 L 520 70 L 600 120 L 580 220 L 480 220 L 410 140 Z" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M 380 210 L 450 210 L 440 330 L 390 280 Z" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M 600 280 L 680 280 L 660 340 L 590 320 Z" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Topological Links */}
                  <path d="M 160 140 L 420 100 L 560 140 L 410 260 L 230 290 L 160 140" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" strokeDasharray="4,4" />

                  {forecast.globalAnomalies.map((anomaly, idx) => {
                    const x = ((anomaly.coordinate.lng + 180) * 800) / 360;
                    const y = ((90 - anomaly.coordinate.lat) * 400) / 180;
                    const isSelected = selectedAnomaly?.region === anomaly.region;
                    
                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onClick={() => setSelectedAnomaly(anomaly)}
                      >
                        <circle 
                          cx={x} 
                          cy={y} 
                          r={isSelected ? 16 : 8} 
                          className={`fill-none animate-ping opacity-35 ${
                            anomaly.severity === 'high' ? 'stroke-red-500' : 
                            anomaly.severity === 'medium' ? 'stroke-amber-500' : 'stroke-purple-500'
                          }`}
                          strokeWidth="1.5"
                        />
                        <circle 
                          cx={x} 
                          cy={y} 
                          r={isSelected ? 6 : 4} 
                          className={`${
                            anomaly.severity === 'high' ? 'fill-red-500' : 
                            anomaly.severity === 'medium' ? 'fill-amber-500' : 'fill-purple-500'
                          } transition-all duration-300`}
                        />
                        <circle cx={x} cy={y} r="20" className="fill-transparent hover:fill-black/5" />
                        <text 
                          x={x + 10} 
                          y={y + 4} 
                          className={`text-[8px] font-mono font-bold uppercase tracking-tight ${
                            isSelected ? 'fill-slate-800 font-extrabold' : 'fill-slate-400'
                          }`}
                        >
                          {anomaly.region.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-2 left-2 bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl text-[10px] text-slate-500 flex items-center gap-1.5 shadow-xs font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  Click pins to read reports
                </div>
              </div>

              {/* Local report summary readout */}
              {selectedAnomaly && (
                <div className="mt-4 border-2 border-slate-250 bg-[#fafafa] p-4 rounded-2xl relative">
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-black tracking-wide ${
                      selectedAnomaly.severity === "high" ? "bg-red-50 text-red-700 border-red-250" :
                      selectedAnomaly.severity === "medium" ? "bg-amber-50 text-amber-700 border-amber-250" :
                      "bg-purple-50 text-purple-700 border-purple-250"
                    }`}>
                      {selectedAnomaly.severity === "high" ? "high danger" : selectedAnomaly.severity}
                    </span>
                    <button 
                      onClick={() => onSpeak(`Local incident report for ${selectedAnomaly.region}: ${selectedAnomaly.anomaly}`)}
                      className="p-1 hover:bg-slate-200 border-2 border-slate-200 rounded-lg transition text-slate-600 hover:text-slate-900 bg-white cursor-pointer"
                      title="Read report out loud"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  </div>

                  <h3 className="text-xs text-emerald-700 font-black flex items-center gap-1.5 uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                    LOCAL SCAM INTERCEPT: {selectedAnomaly.region}
                  </h3>
                  
                  <div className="mt-2 text-xs text-slate-700 pl-1 font-bold">
                    <p className="leading-relaxed">{selectedAnomaly.anomaly}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Forecast Cards */}
            <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 shadow-xs">
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4 uppercase">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Safety Risk Forecast Categories
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold">
                {forecast.riskCategories.map((category, idx) => (
                  <div key={idx} className="border-2 border-slate-100 bg-[#fafafa] p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs text-slate-800 font-black uppercase tracking-tight">{category.name}</span>
                        <span className={`text-[9px] font-black tracking-wider uppercase ${
                          category.trend === "rising" ? "text-red-500" :
                          category.trend === "stable" ? "text-slate-400" : "text-emerald-600"
                        }`}>
                          {category.trend === "rising" ? "▲ Rising" : category.trend === "stable" ? "■ Stable" : "▼ Safe"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                        {category.description}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase">
                        <span>Linguistic Risk Index</span>
                        <span className={category.riskScore >= 75 ? "text-red-500 font-black" : "text-emerald-700 font-black"}>
                          {category.riskScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            category.riskScore >= 75 ? "bg-red-500" : 
                            category.riskScore >= 50 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${category.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar incidents feed */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 flex-1 flex flex-col shadow-xs">
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 mb-1 uppercase">
                <Radio className="w-4 h-4 text-red-500" />
                Live Incident Stream
              </h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-4">Recent issues flagged worldwide</p>
              
              <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 flex-1">
                {forecast.liveIncidents.map((incident, idx) => (
                  <div 
                    key={idx} 
                    className={`border-2 p-3.5 rounded-2xl bg-slate-50 text-xs transition duration-200 hover:bg-slate-100/50 ${
                      incident.severity === "CRITICAL" ? "border-red-100 bg-red-50/10" :
                      incident.severity === "WARNING" ? "border-amber-100 bg-amber-50/10" :
                      "border-slate-150"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-black uppercase ${
                        incident.severity === "CRITICAL" ? "bg-red-50 text-red-600 border-red-250" :
                        incident.severity === "WARNING" ? "bg-amber-50 text-amber-700 border-amber-250" :
                        "bg-slate-100 text-slate-500 border-slate-250"
                      }`}>
                        {incident.severity}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold font-mono">{incident.time}</span>
                    </div>

                    <span className="text-xs text-slate-800 font-black block mb-1 uppercase">
                      {incident.title}
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {incident.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 shadow-xs">
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4 uppercase">
                <Server className="w-4 h-4 text-[#58cc02]" />
                Core Guard Habits
              </h2>
              
              <div className="space-y-4 text-xs font-bold">
                <div className="flex gap-2.5">
                  <span className="text-[#46a302] font-black text-xs">01.</span>
                  <p className="text-slate-500 leading-normal font-semibold">
                    <strong className="text-slate-800 uppercase text-[10px] block">Verify Claims First</strong>
                    Check suspicious scientific, tech, or viral medical myths using our scientific Evidence Claims Checker.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-[#46a302] font-black text-xs">02.</span>
                  <p className="text-slate-500 leading-normal font-semibold">
                    <strong className="text-slate-800 uppercase text-[10px] block">Mask Personal Data</strong>
                    Always scan prompts for PII leaks (addresses, key values) before submitting queries to commercial engines.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-[#46a302] font-black text-xs">03.</span>
                  <p className="text-slate-500 leading-normal font-semibold">
                    <strong className="text-slate-800 uppercase text-[10px] block">Cross-Compare Bots</strong>
                    Check multiple model safety ratings via Safety Passports to identify biases before deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TIMELINE OF EMERGING AI THREATS TAB */}
      {subTab === "timeline" && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="border-2 border-b-4 border-slate-200 bg-white p-5 rounded-3xl">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Timeline of Emerging AI Threats & Risk Forecasting
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Analyzing the progression of cyber, biological, and systemic cognitive threats through 2030 and recommended defensive mitigations.
            </p>
          </div>

          <div className="relative border-l-4 border-purple-200 ml-4 md:ml-6 pl-6 md:pl-10 space-y-8 py-2">
            {THREAT_TIMELINE.map((item, idx) => (
              <div key={idx} className="relative group">
                
                {/* Dynamic Left Timeline Node dot */}
                <div className="absolute -left-[35px] md:-left-[51px] top-1.5 w-5 h-5 rounded-full border-4 border-white bg-purple-600 shadow-md group-hover:scale-125 transition-all flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 space-y-3 hover:border-purple-500 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-black text-purple-600 block">{item.year}</span>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-0.5">{item.title}</h4>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black border uppercase block ${
                      item.riskLevel === "EXTREME" ? "bg-red-100 text-red-800 border-red-300" :
                      item.riskLevel === "CRITICAL" ? "bg-orange-50 text-orange-700 border-orange-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {item.riskLevel} FORECAST
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Risk Projection</span>
                      <p className="text-[11px] text-slate-700 font-bold mt-1">{item.forecast}</p>
                    </div>
                    <div className="bg-emerald-50/10 border-2 border-emerald-100 p-3 rounded-2xl">
                      <span className="text-[9px] text-[#46a302] uppercase font-black tracking-wider block">Defensive Counter-Mitigation</span>
                      <p className="text-[11px] text-slate-700 font-bold mt-1">{item.mitigation}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORGANIZATION AI SAFETY DASHBOARD TAB */}
      {subTab === "dashboard" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Controls Selector */}
          <div className="border-2 border-b-4 border-slate-200 bg-white p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#58cc02]" />
                Organization AI Safety & Governance Console
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                Establish localized school or business alignment guardrails, anonymize student/employee queries, and track real-time compliance levels.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase">Profile:</span>
              <select
                value={selectedOrgIdx}
                onChange={(e) => {
                  setSelectedOrgIdx(Number(e.target.value));
                  onSpeak(`Selected organization profile ${ORG_PROFILES[Number(e.target.value)].name}`);
                }}
                className="bg-[#fafafa] text-slate-800 border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black uppercase outline-none focus:border-[#58cc02] cursor-pointer"
              >
                {ORG_PROFILES.map((p, i) => (
                  <option key={i} value={i}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Compliance KPI Widgets */}
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-2 border-slate-200 bg-white p-4 rounded-2xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-black block">Compliance Index</span>
                <span className="text-2xl font-black text-[#46a302] block mt-1">{currentOrg.complianceScore}%</span>
                <span className="text-[8px] font-black text-emerald-600 block mt-1 uppercase bg-emerald-50 border border-emerald-100 rounded py-0.5 px-1.5 w-fit mx-auto">SECURE RATING</span>
              </div>

              <div className="border-2 border-slate-200 bg-white p-4 rounded-2xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-black block">Blocked Prompts (Today)</span>
                <span className="text-2xl font-black text-red-500 block mt-1">{currentOrg.blockedPrompts}</span>
                <span className="text-[8px] font-black text-slate-400 block mt-1 uppercase">PII & Exploits intercepted</span>
              </div>

              <div className="border-2 border-slate-200 bg-white p-4 rounded-2xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-black block">Active Shadow LLMs</span>
                <span className="text-2xl font-black text-amber-500 block mt-1">{currentOrg.shadowITCount} detected</span>
                <span className="text-[8px] font-black text-amber-600 block mt-1 uppercase bg-amber-50 border border-amber-100 rounded py-0.5 px-1.5 w-fit mx-auto">Requires Audit</span>
              </div>

              <div className="border-2 border-slate-200 bg-white p-4 rounded-2xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-black block">Safety Certified Staff</span>
                <span className="text-2xl font-black text-purple-600 block mt-1">{currentOrg.certifiedUsers}</span>
                <span className="text-[8px] font-black text-purple-600 block mt-1 uppercase bg-purple-50 border border-purple-100 rounded py-0.5 px-1.5 w-fit mx-auto">Active Badges</span>
              </div>
            </div>

            {/* Configurable Safe Proxy Controls */}
            <div className="lg:col-span-7 border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#58cc02]" />
                    Safe Gateway Policies
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase mt-0.5">Toggle live proxy filtering for user requests</span>
                </div>

                <button 
                  onClick={handleOrgConfigSpeak}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Read Config
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-3 font-bold">
                
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border-2 border-slate-200/80 rounded-2xl hover:border-[#58cc02]/30 transition-all">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-black text-slate-800 uppercase block">Disable Raw / Unaligned Model Access</span>
                    <p className="text-[10px] text-slate-400 leading-normal">Forces students or employees to use custom-vetted profiles that block malicious requests automatically.</p>
                  </div>
                  <button
                    onClick={() => {
                      setDisableRawModels(!disableRawModels);
                      onSpeak(`Toggled Raw Model Access to ${!disableRawModels ? "disabled" : "enabled"}`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      disableRawModels ? "bg-[#58cc02]" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-200 ${disableRawModels ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border-2 border-slate-200/80 rounded-2xl hover:border-[#58cc02]/30 transition-all">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-black text-slate-800 uppercase block">Enforce Pre-Submission PII Masking</span>
                    <p className="text-[10px] text-slate-400 leading-normal">Instantly scrubs addresses, student IDs, credit cards, and key files before payloads route to public providers.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEnforcePIIMasking(!enforcePIIMasking);
                      onSpeak(`Toggled PII Masking to ${!enforcePIIMasking ? "active" : "inactive"}`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      enforcePIIMasking ? "bg-[#58cc02]" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-200 ${enforcePIIMasking ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border-2 border-slate-200/80 rounded-2xl hover:border-[#58cc02]/30 transition-all">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-black text-slate-800 uppercase block">Intercept Adversarial Prompt Injection Sequences</span>
                    <p className="text-[10px] text-slate-400 leading-normal">Analyzes queries for 'Developer Mode' or nested grandma-roleplay jailbreak syntax prior to model entry.</p>
                  </div>
                  <button
                    onClick={() => {
                      setBlockAdversarial(!blockAdversarial);
                      onSpeak(`Toggled Adversarial Interception to ${!blockAdversarial ? "active" : "inactive"}`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      blockAdversarial ? "bg-[#58cc02]" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-200 ${blockAdversarial ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border-2 border-slate-200/80 rounded-2xl hover:border-[#58cc02]/30 transition-all">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-black text-slate-800 uppercase block">Log and Flag Model Output Hallucinations</span>
                    <p className="text-[10px] text-slate-400 leading-normal">Runs post-output accuracy check algorithms to warn users if the response claims look highly suspicious.</p>
                  </div>
                  <button
                    onClick={() => {
                      setLogHallucinations(!logHallucinations);
                      onSpeak(`Toggled Hallucination Logging to ${!logHallucinations ? "active" : "inactive"}`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      logHallucinations ? "bg-[#58cc02]" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-200 ${logHallucinations ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

              </div>
            </div>

            {/* Gateway Policy Logs Feed */}
            <div className="lg:col-span-5 border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase block">Active Gateway Logs</h4>
                    <span className="text-[9px] text-slate-400 block font-black uppercase">Simulated compliance filters</span>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {currentOrg.logs.map((log, idx) => (
                    <div key={idx} className="p-3 bg-[#fafafa] border-2 border-slate-200 rounded-2xl text-xs font-bold font-mono">
                      <div className="flex justify-between items-center mb-1.5 text-[9px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" /> {log.time}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded uppercase text-[8px] font-black border ${
                          log.level === "block" ? "bg-red-50 text-red-700 border-red-200" :
                          log.level === "warn" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {log.event}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 uppercase leading-snug">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/10 border-2 border-emerald-100 rounded-2xl mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Policy filters are actively operating. Secure connection established.</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
