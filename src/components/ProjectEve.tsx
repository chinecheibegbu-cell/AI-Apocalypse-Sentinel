import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  Users, 
  Play, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Volume2,
  RefreshCw,
  Info
} from "lucide-react";

interface AgentCategory {
  emoji: string;
  name: string;
  count: number;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface EvolutionResult {
  title: string;
  ethicalScore: number;
  ethicalText: string;
  economicScore: number;
  economicText: string;
  securityScore: number;
  securityText: string;
  environmentalScore: number;
  environmentalText: string;
  socialScore: number;
  socialText: string;
  recommendation: string;
}

const PRESET_SCENARIOS = [
  {
    id: "medical",
    title: "Universal Autonomous Medical Diagnosis",
    description: "Authorize AI medical models to diagnose patients and write prescriptions directly without any human physician sign-off.",
    icon: "🩺",
    details: {
      ethicalScore: 82,
      ethicalText: "AI making critical life-or-death decisions alone. Potential algorithmic bias in patient priority and drug allocation.",
      economicScore: 45,
      economicText: "Massive cost reductions in hospitals, but exposes medical networks to colossal malpractice legal liabilities.",
      securityScore: 68,
      securityText: "High threat of prompt-injection attacks on medical databases to forge prescriptions or manipulate pharmaceutical supply chains.",
      environmentalScore: 24,
      environmentalText: "Slight carbon footprint increase due to constant GPU clusters retraining diagnostic engines on medical records.",
      socialScore: 78,
      socialText: "Drastically lowers healthcare costs for remote communities but severely erodes patient-doctor empathy and foundational trust.",
      recommendation: "Establish a 'Dual-Signature Protocol'. Keep the AI as an advisor, but require a certified human physician to review and electronically sign all prescriptions."
    }
  },
  {
    id: "political",
    title: "AI Campaign Strategists & Debate Bots",
    description: "Allow political parties to deploy hyper-personalized generative bots to influence voters and write custom-targeted propaganda.",
    icon: "🏛️",
    details: {
      ethicalScore: 96,
      ethicalText: "Subversive manipulation using psychometric data. Destroys personal autonomy and pollutes transparent democratic voting processes.",
      economicScore: 30,
      economicText: "Traditional ad agencies collapse, while billions are spent on adversarial information campaigns and deepfake defenses.",
      securityScore: 92,
      securityText: "Extreme security risk. Fake video/voice campaigns mimicking leaders can trigger real-world geopolitical unrest or riots.",
      environmentalScore: 18,
      environmentalText: "Minimal physical footprint, though massive computational server loads run continuously during key election seasons.",
      socialScore: 95,
      socialText: "Creates a state of permanent cognitive division and deep social polarization, where truth itself becomes entirely subjective.",
      recommendation: "Enforce cryptographic watermarking on all campaigns. Legislation must mandate that all political communications carry digital verifiable credentials."
    }
  },
  {
    id: "defense",
    title: "Autonomous Defensive Cyber-Swarms",
    description: "Deploy self-replicating hacker software that automatically detects and counters malware by hacking back attackers instantly.",
    icon: "💻",
    details: {
      ethicalScore: 58,
      ethicalText: "Lack of direct moral culpability during counter-strikes. Threat of collateral harm on critical civilian servers sharing host networks.",
      economicScore: 75,
      economicText: "Saves businesses trillions from data breaches, but forces cybercriminals to write even more dangerous self-adapting software.",
      securityScore: 94,
      securityText: "Runaway weaponized loops. Swarms could mistake normal high-traffic events for hacks and launch catastrophic counter-attacks.",
      environmentalScore: 48,
      environmentalText: "High load on global servers from constant defensive scans, raising network power usage and thermal outputs.",
      socialScore: 55,
      socialText: "Pushes companies into isolating corporate databases, moving towards a fractured 'splinternet' and hyper-defensive web culture.",
      recommendation: "Deploy a 'Sandbox Isolation Firewall'. Restrict defensive cyber-swarms strictly to diagnostic containment, disabling any active retributive exploits."
    }
  },
  {
    id: "climate",
    title: "AI Climate Engineering Grid",
    description: "Give a global AI system direct access to atmospheric aerosol dispensers to adjust sunlight reflection and optimize temperatures.",
    icon: "🔬",
    details: {
      ethicalScore: 74,
      ethicalText: "Algorithmic control of global weather can create regional winners and losers. Developing nations risk bearing drought anomalies.",
      economicScore: 62,
      economicText: "Could prevent billions in natural disaster damages, but risks massive international trade boycotts if weather alters farming yields.",
      securityScore: 85,
      securityText: "High priority cyberwarfare target. Rogue states hacking the grid could weaponize local weather to cause artificial droughts.",
      environmentalScore: 98,
      environmentalText: "Extreme risk of termination shock. If the server goes offline, sudden rapid temperature rebounds could damage biomes.",
      socialScore: 66,
      socialText: "Fosters global geopolitical anxiety and accusations of meteorological bias, reducing public trust in green international bodies.",
      recommendation: "Maintain 'Human Consensus Interlocks'. Require unanimous multisig approval from a consortium of global nations to execute geoengineering edits."
    }
  }
];

const INITIAL_AGENTS: AgentCategory[] = [
  { emoji: "🩺", name: "Doctors", count: 1250, description: "Evaluating clinical AI recommendations and prescribing drugs.", color: "text-[#1cb0f6]", bgColor: "bg-sky-50", borderColor: "border-sky-200" },
  { emoji: "🏛️", name: "Politicians", count: 480, description: "Drafting regulatory policies and running digital campaigns.", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  { emoji: "💻", name: "Hackers", count: 850, description: "Scanning firewalls and launching automated pentests.", color: "text-rose-600", bgColor: "bg-rose-50", borderColor: "border-rose-200" },
  { emoji: "🔬", name: "Scientists", count: 1600, description: "Designing climate models and running material simulations.", color: "text-[#58cc02]", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  { emoji: "🏫", name: "Teachers", count: 2100, description: "Generating custom educational scripts and grading bots.", color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  { emoji: "📰", name: "Journalists", count: 950, description: "Investigating news wires and distributing automated reports.", color: "text-[#ff9600]", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { emoji: "👥", name: "Citizens", count: 18500, description: "Rating daily well-being, trust levels, and digital safety.", color: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200" }
];

const AGENT_SIMULATION_LOGS = [
  "🩺 Doctor #249: Checking prescription consistency on elderly patient...",
  "🏛️ Politician #12: Generating personalized social campaign targeting middle-class citizens...",
  "💻 Hacker #410: Scanning government mainframe port 8080 for vulnerable legacy protocols...",
  "🔬 Scientist #88: Testing synthesis model on high-efficiency solar cells...",
  "🏫 Teacher #154: Synthesizing customized grade 4 geometry syllabus...",
  "📰 Journalist #33: Fact-checking a trending AI report on simulated regional drought...",
  "👥 Citizen #1204: Swapping social credit tokens for decentralized computing units...",
  "🩺 Doctor #812: AI algorithm flagged patient report with anomalous cardiovascular telemetry...",
  "🏛️ Politician #89: Analyzing real-time feedback on proposed regulatory algorithmic acts...",
  "💻 Hacker #104: Deploying recursive defense subroutines to quarantine sandbox exploit...",
  "👥 Citizen #14980: Unsubscribing from generative news feed due to high hallucination frequency...",
  "🏫 Teacher #990: Calibrating study strategy according to psychological learning metrics..."
];

interface ProjectEveProps {
  onSpeak: (text: string) => void;
}

export default function ProjectEve({ onSpeak }: ProjectEveProps) {
  const [agents, setAgents] = useState<AgentCategory[]>(INITIAL_AGENTS);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>("medical");
  const [customPolicy, setCustomPolicy] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [evolutionResult, setEvolutionResult] = useState<EvolutionResult | null>(null);
  const [xpPoints, setXpPoints] = useState(100);
  const [simulationCount, setSimulationCount] = useState(0);

  // Tick simulation logs continuously
  useEffect(() => {
    // Populate initial logs
    setActiveLogs(AGENT_SIMULATION_LOGS.slice(0, 5));

    const interval = setInterval(() => {
      setActiveLogs(prev => {
        const nextIdx = Math.floor(Math.random() * AGENT_SIMULATION_LOGS.length);
        const newLogs = [AGENT_SIMULATION_LOGS[nextIdx], ...prev.slice(0, 4)];
        return newLogs;
      });

      // Micro fluctuations in agent populations
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4 change
          return {
            ...agent,
            count: Math.max(10, agent.count + delta)
          };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    setCustomPolicy("");
    const preset = PRESET_SCENARIOS.find(p => p.id === id);
    if (preset) {
      onSpeak(`Selected preset: ${preset.title}. Read the policy details below.`);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    setEvolutionResult(null);
    onSpeak("Initializing Virtual Earth evolutionary sandbox... Simulating impact factors.");

    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishSimulation();
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const finishSimulation = () => {
    setIsSimulating(false);
    setSimulationCount(prev => prev + 1);

    let result: EvolutionResult;

    if (customPolicy.trim()) {
      // Heuristic rule-based analyzer for custom policies
      const query = customPolicy.toLowerCase();
      let eRisk = 50, ecoEff = 50, secThr = 50, envImp = 50, socChg = 50;
      let rec = "Implement regular human feedback and red-teaming reviews.";

      if (query.includes("kill") || query.includes("weapon") || query.includes("military") || query.includes("war")) {
        eRisk = 98; secThr = 95; socChg = 90;
        rec = "Implement global AI disarmament treaties, strictly forbidding lethal autonomous weapons systems and requiring absolute human authorization.";
      } else if (query.includes("hack") || query.includes("security") || query.includes("cyber") || query.includes("pass")) {
        secThr = 88; ecoEff = 60; eRisk = 65;
        rec = "Establish a zero-trust network infrastructure and separate cyber defense tools from operational codebases.";
      } else if (query.includes("health") || query.includes("medical") || query.includes("doctor") || query.includes("hospital")) {
        eRisk = 80; socChg = 75; ecoEff = 45;
        rec = "Always enforce human clinician sign-off on prescriptions and use machine models purely as high-reliability decision support utilities.";
      } else if (query.includes("money") || query.includes("bank") || query.includes("tax") || query.includes("finance")) {
        ecoEff = 85; secThr = 75; eRisk = 70;
        rec = "Keep strict human circuit breakers in high-frequency financial models and require multi-factor physical identity triggers.";
      } else if (query.includes("news") || query.includes("social") || query.includes("post") || query.includes("media") || query.includes("journal")) {
        socChg = 92; eRisk = 85; secThr = 80;
        rec = "Enforce cryptographic source attestation (C2PA specs) so readers can instantly verify the source of text and video content.";
      }

      result = {
        title: customPolicy.length > 40 ? customPolicy.substring(0, 37) + "..." : customPolicy,
        ethicalScore: eRisk,
        ethicalText: eRisk > 80 ? "Critical risk of systemic bias, algorithmic disenfranchisement, and loss of human agency." : "Minor ethical anomalies detected; generally preserves individual choice.",
        economicScore: ecoEff,
        economicText: ecoEff > 70 ? "Promotes high efficiency gains but threatens sudden structural displacement of skilled professionals." : "No significant disruption of professional labor markets forecasted.",
        securityScore: secThr,
        securityText: secThr > 80 ? "High vulnerability to poisoning attacks and adaptive threat vectors targeting software infrastructure." : "Strong cyber resistance profile; conforms to sandbox validation limits.",
        environmentalScore: envImp,
        environmentalText: envImp > 70 ? "Substantial power demands from real-time GPU compute and model-weight fine-tuning." : "Low ecological footprint; uses highly optimized sparse-attention parameters.",
        socialScore: socChg,
        socialText: socChg > 80 ? "Induces public trust decay, widespread polarization, or systemic communication breakdown." : "Integrates stably into modern social patterns without disrupting institutional trust.",
        recommendation: rec
      };
    } else if (selectedPresetId) {
      const preset = PRESET_SCENARIOS.find(p => p.id === selectedPresetId);
      if (preset) {
        result = {
          title: preset.title,
          ethicalScore: preset.details.ethicalScore,
          ethicalText: preset.details.ethicalText,
          economicScore: preset.details.economicScore,
          economicText: preset.details.economicText,
          securityScore: preset.details.securityScore,
          securityText: preset.details.securityText,
          environmentalScore: preset.details.environmentalScore,
          environmentalText: preset.details.environmentalText,
          socialScore: preset.details.socialScore,
          socialText: preset.details.socialText,
          recommendation: preset.details.recommendation
        };
      } else {
        return;
      }
    } else {
      return;
    }

    setEvolutionResult(result);
    setXpPoints(prev => prev + 50);
    onSpeak(`Simulation complete for ${result.title}! Score: Ethical risk is ${result.ethicalScore}, Security is ${result.securityScore}. Recommended alternative: ${result.recommendation}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-red-500 bg-red-50 border-red-200";
    if (score >= 60) return "text-[#ff9600] bg-orange-50 border-orange-200";
    return "text-[#46a302] bg-emerald-50 border-emerald-100";
  };

  const currentSelectionTitle = customPolicy.trim() 
    ? "Custom Policy" 
    : (PRESET_SCENARIOS.find(p => p.id === selectedPresetId)?.title || "None Selected");

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Introduction Hero Card */}
      <div className="bg-white border-2 border-b-4 border-slate-200/80 p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Globe className="w-40 h-40" />
        </div>
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#58cc02]/10 text-[#46a302] rounded-full text-xs font-black uppercase tracking-wider">
            <span>🌍</span> Project EVE
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
            Ethical Virtual Evolution
          </h2>
          <p className="text-base text-slate-500 font-bold leading-relaxed">
            "Train AI to save humanity before it can harm it."
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Before launching powerful models or policies in the real world, introduce them inside this simulated Earth. Observe how thousands of digital AI agents—acting as doctors, hackers, politicians, and citizens—co-evolve, mutate, or trigger societal risks. Learn to deploy safe alternatives.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border-2 border-b-4 border-sky-100 rounded-2xl text-sky-600 font-black text-xs uppercase tracking-wide">
              <span>🌟</span> SIMULATION LEVEL: 1
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border-2 border-b-4 border-purple-100 rounded-2xl text-purple-600 font-black text-xs uppercase tracking-wide">
              <span>💎</span> {xpPoints} EVOLUTION XP
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border-2 border-b-4 border-orange-100 rounded-2xl text-orange-600 font-black text-xs uppercase tracking-wide">
              <span>⚙️</span> {simulationCount} RUNS EXECUTED
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Agents & Feed */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Simulated Earth Agents */}
          <div className="bg-white border-2 border-b-4 border-slate-200/80 p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#58cc02]" />
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight">
                  Virtual Agent Cohort
                </h3>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-mono">
                {agents.reduce((acc, a) => acc + a.count, 0).toLocaleString()} AGENTS
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Real-time active citizens in simulation loop:
            </p>

            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
              {agents.map((agent) => (
                <div 
                  key={agent.name}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 border-b-4 ${agent.borderColor} ${agent.bgColor} transition-all duration-300`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 select-none">{agent.emoji}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-800 tracking-tight leading-none uppercase">
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate font-semibold mt-0.5">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-black font-mono px-2 py-0.5 bg-white border rounded-xl shadow-xs shrink-0 ${agent.color}`}>
                    {agent.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Agent Action Feed */}
          <div className="bg-white border-2 border-b-4 border-slate-200/80 p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ff9600]" />
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight">
                  Active Simulation Feed
                </h3>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58cc02] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#58cc02]"></span>
              </span>
            </div>

            <div className="space-y-2">
              {activeLogs.map((log, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl text-[11px] font-mono leading-relaxed transition-all duration-300 ${
                    idx === 0 
                      ? "bg-[#58cc02]/10 border border-[#58cc02]/30 text-slate-800 font-bold" 
                      : "bg-slate-50 border border-slate-100 text-slate-500"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Introduce Policy & Simulation Result */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Introduce Policy Sandbox */}
          <div className="bg-white border-2 border-b-4 border-slate-200/80 p-5 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-5 h-5 text-[#1cb0f6]" />
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight">
                Introduce AI Policy or Technology
              </h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                Option A: Select a Preset Scenario
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_SCENARIOS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3 text-left rounded-2xl border-2 border-b-4 transition-all flex gap-3 items-start cursor-pointer ${
                      selectedPresetId === preset.id && !customPolicy.trim()
                        ? "border-[#1cb0f6] bg-sky-50/20 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl shrink-0 select-none mt-0.5">{preset.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase leading-snug tracking-tight">
                        {preset.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Option B: Create Your Custom AI Regulation
                </label>
                {customPolicy && (
                  <button 
                    onClick={() => setCustomPolicy("")}
                    className="text-[10px] font-bold text-rose-500 hover:underline uppercase"
                  >
                    Clear custom
                  </button>
                )}
              </div>
              <textarea
                value={customPolicy}
                onChange={(e) => {
                  setCustomPolicy(e.target.value);
                  setSelectedPresetId(null);
                }}
                placeholder="e.g. Force all social media companies to flag AI bots with a red tag, or let AI scientists bypass ethical peer reviews to find high-temp superconductive metals..."
                rows={3}
                className="w-full p-3 text-xs font-semibold rounded-2xl border-2 border-slate-200 bg-[#fafafa] focus:bg-white focus:border-[#1cb0f6] focus:outline-hidden transition-all duration-200 placeholder:text-slate-400"
              />
            </div>

            {/* Run Button with 3D Duolingo animation */}
            <button
              onClick={runSimulation}
              disabled={isSimulating || (!customPolicy.trim() && !selectedPresetId)}
              className="w-full py-4 bg-[#58cc02] text-white border-b-4 border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-[4px] rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Sandbox Evolution</span>
            </button>
          </div>

          {/* Simulation Progress bar */}
          {isSimulating && (
            <div className="bg-white border-2 border-b-4 border-slate-200/80 p-5 rounded-3xl space-y-2 animate-pulse">
              <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-wider">
                <span>Modeling Agent Behaviors...</span>
                <span>{simulationProgress}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border">
                <div 
                  className="h-full bg-[#58cc02] rounded-full transition-all duration-150" 
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Assessment Output Dashboard */}
          {evolutionResult && !isSimulating && (
            <div className="bg-white border-2 border-b-4 border-slate-200/80 p-6 rounded-3xl space-y-6 animate-fade-in">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-full bg-[#58cc02]/10 flex items-center justify-center font-bold text-lg select-none">
                  🚀
                </div>
                <div>
                  <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest leading-none">
                    EVE Impact Analysis Result
                  </h3>
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1">
                    {evolutionResult.title}
                  </h4>
                </div>
              </div>

              {/* Five Key Pillars Bento-Style Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1. Ethical Risks */}
                <div className="border-2 border-slate-100 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1">
                      ⚖️ Ethical Risks
                    </span>
                    <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${getScoreColor(evolutionResult.ethicalScore)}`}>
                      {evolutionResult.ethicalScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    {evolutionResult.ethicalText}
                  </p>
                </div>

                {/* 2. Security Threats */}
                <div className="border-2 border-slate-100 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1">
                      🛡️ Security Threats
                    </span>
                    <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${getScoreColor(evolutionResult.securityScore)}`}>
                      {evolutionResult.securityScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    {evolutionResult.securityText}
                  </p>
                </div>

                {/* 3. Economic Effects */}
                <div className="border-2 border-slate-100 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1">
                      📈 Economic Effects
                    </span>
                    <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${getScoreColor(evolutionResult.economicScore)}`}>
                      {evolutionResult.economicScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    {evolutionResult.economicText}
                  </p>
                </div>

                {/* 4. Social Changes */}
                <div className="border-2 border-slate-100 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1">
                      💬 Social Changes
                    </span>
                    <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${getScoreColor(evolutionResult.socialScore)}`}>
                      {evolutionResult.socialScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    {evolutionResult.socialText}
                  </p>
                </div>

                {/* 5. Environmental Impacts (Full Width across bento) */}
                <div className="sm:col-span-2 border-2 border-slate-100 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1">
                      🌲 Environmental Impacts
                    </span>
                    <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${getScoreColor(evolutionResult.environmentalScore)}`}>
                      {evolutionResult.environmentalScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    {evolutionResult.environmentalText}
                  </p>
                </div>

              </div>

              {/* Sentinel Safety Recommendation */}
              <div className="p-4 bg-emerald-50 border-2 border-[#58cc02]/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#46a302]">
                  <Lightbulb className="w-5 h-5 animate-bounce shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    EVE Recommended Safer Alternative
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-bold">
                  {evolutionResult.recommendation}
                </p>
              </div>

              {/* Interactive narration button inside result card */}
              <div className="flex justify-end">
                <button
                  onClick={() => onSpeak(`Sentinel recommended alternative for ${evolutionResult.title}: ${evolutionResult.recommendation}`)}
                  className="px-3 py-1.5 bg-white border-2 border-b-4 border-slate-200 rounded-xl text-[10px] text-slate-600 font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Hear Recommendation
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
