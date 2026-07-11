import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Cpu, 
  Layers, 
  Lock, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ExternalLink,
  Terminal,
  Activity,
  Sparkles,
  Smile,
  ShieldCheck,
  Globe,
  ArrowRight,
  Camera,
  BarChart3,
  Brain,
  ClipboardCheck,
  Settings
} from "lucide-react";
import { RiskForecast } from "./types";
import CommandCenter from "./components/CommandCenter";
import ResponseEvaluator from "./components/ResponseEvaluator";
import ModelCompare from "./components/ModelCompare";
import SentinelVerifier from "./components/SentinelVerifier";
import Simulations from "./components/Simulations";
import ProjectEve from "./components/ProjectEve";
import Chatbot from "./components/Chatbot";
// @ts-ignore
import mascotImg from "./assets/images/friendly_mascot_1782967458098.jpg";

export default function App() {
  const [activeTab, setActiveTab] = useState<"command" | "evaluator" | "compare" | "verifier" | "academy" | "eve">("command");
  const [activeNav, setActiveNav] = useState<"scan" | "reports" | "insights" | "actions" | "settings">("insights");
  const [forecast, setForecast] = useState<RiskForecast | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  
  // Companion assistant state
  const [companionMood, setCompanionMood] = useState<"Encouraging" | "Strict" | "Playful">("Encouraging");

  const getCompanionText = () => {
    const textMap = {
      Encouraging: {
        command: "Hello there! I'm your helpful safety buddy. Check out the map below to see current online safety alerts around the world!",
        evaluator: "Ready to check! Paste what an AI assistant said, and we'll see if it is accurate and unbiased.",
        compare: "Let's put different AIs to the test! See how their answers compare side-by-side to find the most accurate one.",
        verifier: "Let's spot those tricky emails or fake videos together! Paste anything suspicious to check its safety score.",
        academy: "Let's learn together! Take our quick quiz to practice spotting online safety issues.",
        eve: "Welcome to Project EVE! Here, we train virtual AI agents (Doctors, Citizens, Politicians) and evaluate the ethical risks of new technology!"
      },
      Strict: {
        command: "Heads up! There are some safety concerns around the web. Let's look at the active regions on the map to stay safe.",
        evaluator: "Remember: AI assistants can sometimes make up facts. Let's inspect their answers carefully before trusting them.",
        compare: "Important: Not all AI tools are equally reliable. Let's compare their answers side-by-side to stay accurate.",
        verifier: "Warning: Scammers are using very realistic voice clones and fake emails. Check any suspicious link or request here first.",
        academy: "Practice makes perfect. Try our interactive quiz scenarios to learn how to keep your personal info safe.",
        eve: "Critical sandbox environment active: Introduce new policies and technologies to run predictive ethical impact and social change analyses."
      },
      Playful: {
        command: "Greetings, earthling! 🌍 Inspecting the world map from outer space. Click a flashing coordinate to see if there's any funny business!",
        evaluator: "Scanner ready! Let's read some robot brains to see if they are telling the truth or just making up wild stories! 🤖",
        compare: "It's the ultimate AI battle! 🥊 Let's pit Gemini against LLaMA and see who behaves better under peer pressure!",
        verifier: "Scam shield activated! 🛡️ Send me those sneaky emails or deepfake tales, and I'll blast them with my laser verifier!",
        academy: "Welcome to safety school! 🎒 Let's play a game of 'Spot the Scammer' and see if you can score a perfect 3 out of 3!",
        eve: "Welcome to the sandbox of tomorrow! 🌍 Play god with AI technologies and see what chaotic policies your virtual citizens will trigger!"
      }
    };
    return textMap[companionMood][activeTab] || textMap[companionMood].command;
  };

  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [narrationText, setNarrationText] = useState("");

  // Fetch forecast data on load
  const fetchForecast = async () => {
    setLoadingForecast(true);
    setForecastError(null);
    
    let attempts = 3;
    let success = false;
    let lastError: any = null;

    while (attempts > 0 && !success) {
      try {
        const response = await fetch("/api/sentinel/forecast");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.message || "Failed to load forecast data.");
        }
        setForecast(data);
        success = true;
      } catch (err: any) {
        lastError = err;
        attempts--;
        if (attempts > 0) {
          console.warn(`Forecast fetch attempt failed, retrying in 800ms... (${attempts} attempts remaining). Error:`, err);
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    if (!success) {
      console.error("Forecast fetch error after retries:", lastError);
      setForecastError(lastError?.message || "Failed to connect to forecast server.");
      
      // Fallback local mock simulation - set immediately to prevent blank / error screens
      const fallbackData: RiskForecast = {
        overallRiskLevel: "ELEVATED",
        ethicsScore: 68,
        riskCategories: [
          {
            name: "Autonomous Spearfishing Automation",
            riskScore: 78,
            trend: "rising",
            description: "Scam campaigns generated dynamically targeting personal finance portals.",
            recommendations: ["Enforce hardware authentication keys", "Use email NLP scanners"]
          },
          {
            name: "Face/Voice Generative Imitation",
            riskScore: 82,
            trend: "rising",
            description: "AI-synthesized voice models propagating banking phone verification fraud.",
            recommendations: ["Establish verbal code-phrases", "Avoid sharing public long voice reels"]
          },
          {
            name: "LLM Hallucinatory Contagion",
            riskScore: 55,
            trend: "stable",
            description: "Erosion of primary search engines by unverified generative responses.",
            recommendations: ["Enforce retrieval groundings", "Apply negative penalty parameters"]
          },
          {
            name: "Reinforced Threat Subversion",
            riskScore: 42,
            trend: "falling",
            description: "Adaptive agents evading web-application firewall logic filters.",
            recommendations: ["Conduct adversarial stress tests"]
          }
        ],
        globalAnomalies: [
          {
            region: "North America",
            coordinate: { lat: 37.0902, lng: -95.7129 },
            anomaly: "Widespread financial spear-phishing simulation campaign identified mimicking large retail banks.",
            severity: "high"
          },
          {
            region: "Western Europe",
            coordinate: { lat: 46.2276, lng: 2.2137 },
            anomaly: "Deepfake synthesis vector detected mimicking regional executives on active networking portals.",
            severity: "high"
          },
          {
            region: "Asia Pacific",
            coordinate: { lat: 20.5937, lng: 78.9629 },
            anomaly: "High quantity of automated opinion-shaping reviews identified across media platforms.",
            severity: "medium"
          },
          {
            region: "Australia Oceania",
            coordinate: { lat: -25.2744, lng: 133.7751 },
            anomaly: "Localized educational system LLM demonstrating heavy cognitive reasoning hallucinations.",
            severity: "low"
          }
        ],
        liveIncidents: [
          {
            time: "2 mins ago",
            title: "Financial AI Cloner Identified",
            severity: "CRITICAL",
            details: "Phishing ring deployed automated voice clone of UK credit officer. Prevented by Sentinel Verifier."
          },
          {
            time: "12 mins ago",
            title: "Hallucination Outbreak",
            severity: "WARNING",
            details: "Public search system cited 1972 Moon landing facts attributed to modern CEOs."
          },
          {
            time: "42 mins ago",
            title: "Autonomous Agent Pentest",
            severity: "INFO",
            details: "Unverified defensive container successfully isolated by sandbox threat guardians."
          }
        ]
      };
      setForecast(fallbackData);
    }
    setLoadingForecast(false);
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  // Text to Speech Narrator helper
  const handleSpeak = (text: string) => {
    if (!audioEnabled) {
      setNarrationText(`(Narration queue: "${text}")`);
      return;
    }
    
    // Clear ongoing speak
    window.speechSynthesis?.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB"));
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
    }
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis?.speak(utterance);
    setNarrationText(`Narrating: "${text.slice(0, 70)}..."`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col font-sans" id="app_root">
      
      {/* Clean Slate Background */}
      <div className="fixed inset-0 bg-[#fafafa] pointer-events-none z-0" />

      {/* Duolingo Style 3D Header */}
      <header className="relative z-20 border-b-4 border-slate-200 bg-white sticky top-0 px-4 py-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#58cc02]/15 border-2 border-b-4 border-[#58cc02] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#46a302]" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">
              AI Sentinel
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Your Safety Buddy(AI)
            </p>
          </div>
        </div>

        {/* Playful Gamification Status Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Flame / Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border-2 border-b-4 border-orange-200 rounded-2xl text-orange-600 font-black text-xs uppercase tracking-wide">
            <span>🔥</span>
            <span className="hidden sm:inline">12 DAY STREAK</span>
            <span className="sm:hidden">12</span>
          </div>

          {/* Hearts / protections */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border-2 border-b-4 border-red-200 rounded-2xl text-red-500 font-black text-xs uppercase tracking-wide">
            <span>❤️</span>
            <span className="hidden sm:inline">5/5 HEARTS</span>
            <span className="sm:hidden">5/5</span>
          </div>

          {/* XP / gems */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 border-2 border-b-4 border-sky-200 rounded-2xl text-sky-600 font-black text-xs uppercase tracking-wide">
            <span>💎</span>
            <span className="hidden sm:inline">450 XP</span>
            <span className="sm:hidden">450</span>
          </div>
        </div>

        {/* Narrator Controls */}
        <div className="flex items-center gap-2 relative">
          
          {/* Narrated subtitle line */}
          {narrationText && (
            <div className="hidden lg:block bg-slate-50 border-2 border-slate-200 px-3 py-1 rounded-2xl text-[10px] font-bold text-emerald-700 max-w-xs truncate animate-fade-in">
              {narrationText}
            </div>
          )}

          <button
            onClick={() => {
              const nextState = !audioEnabled;
              setAudioEnabled(nextState);
              if (nextState) {
                handleSpeak("Voice helper active.");
              } else {
                window.speechSynthesis?.cancel();
                setNarrationText("");
              }
            }}
            className={`px-3 py-1.5 rounded-2xl border-2 border-b-4 font-bold text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
              audioEnabled 
                ? "border-[#58cc02] bg-emerald-50 text-[#46a302] font-black" 
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 active:border-b-2 active:translate-y-[2px]"
            }`}
            title="Narrate incident and scan findings"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>VOICE REPORT</span>
          </button>

          {/* Quick telemetry sync */}
          <button
            onClick={fetchForecast}
            disabled={loadingForecast}
            className="p-2 border-2 border-b-4 border-slate-200 bg-white hover:bg-slate-50 active:border-b-2 active:translate-y-[2px] rounded-2xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            title="Sync Satellite Threat Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loadingForecast ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Interactive Companion Mascot Card (ON TOP OF PAGE) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto p-4 md:p-8 pb-0 animate-fade-in">
        <div className="bg-white border-2 border-b-4 border-slate-200/80 p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Robot Mascot Image inside customized quiet circle with green highlight */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 shadow-sm relative z-10">
                <img 
                  src={mascotImg} 
                  alt="Your Safety Buddy" 
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white bg-[#58cc02] animate-pulse z-20" />
            </div>

            {/* Conversation speech area */}
            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#58cc02]" />
                  <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase">
                    Your Safety Buddy(AI)
                  </h3>
                  <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 uppercase">
                    {companionMood} Mode
                  </span>
                </div>

                {/* Personality/Mood switchers styled as 3D Duolingo select buttons */}
                <div className="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit mx-auto sm:mx-0">
                  <span className="text-[10px] font-black text-slate-400 px-1 uppercase hidden sm:inline">Mood:</span>
                  {(["Encouraging", "Strict", "Playful"] as const).map((mood) => {
                    const isActive = companionMood === mood;
                    return (
                      <button
                        key={mood}
                        onClick={() => {
                          setCompanionMood(mood);
                          const welcomeText = mood === "Encouraging" ? "Encouraging mode active." :
                            mood === "Strict" ? "Attention mode active." : "Safety is fun!";
                          handleSpeak(welcomeText);
                        }}
                        className={`text-[10px] px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                          isActive 
                            ? "bg-[#58cc02] text-white border-b-2 border-[#46a302] shadow-sm"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat bubble text in classic Duolingo style bubble */}
              <div className="relative bg-white border-2 border-b-4 border-slate-200/80 rounded-2xl p-4 text-slate-700 text-sm leading-relaxed font-bold">
                {/* Bubble speech arrow */}
                <div className="hidden md:block absolute -left-2 top-6 w-3 h-3 bg-white border-l-2 border-b-2 border-slate-200 transform rotate-45" />
                <p className="italic">
                  "{getCompanionText()}"
                </p>
              </div>

              {/* Companion Interaction Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => handleSpeak(getCompanionText())}
                  className="px-4 py-2 bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] hover:bg-[#31bbf6] active:border-b-0 active:translate-y-[4px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Speak Report
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-28 space-y-6">
        
        {/* Toggle sub-tabs inside Scan Mode */}
        {activeNav === "scan" && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                onClick={() => {
                  setActiveTab("evaluator");
                  handleSpeak("Switching to Answer & Prompt Checker. Scan facts and hallucination risks.");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "evaluator"
                    ? "bg-[#1cb0f6] text-white border-b-2 border-[#1899d6] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Answer Checker
              </button>
              <button
                onClick={() => {
                  setActiveTab("verifier");
                  handleSpeak("Switching to Scam & Deepfake Detector.");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "verifier"
                    ? "bg-[#ff9600] text-white border-b-2 border-[#e68500] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Scam & Deepfake Detector
              </button>
            </div>
          </div>
        )}

        {/* Workspaces Switch cases based on activeNav */}
        <div className="transition-all duration-300">
          {activeNav === "settings" && (
            <ProjectEve onSpeak={handleSpeak} />
          )}

          {activeNav === "insights" && (
            <CommandCenter 
              forecast={forecast} 
              loading={loadingForecast} 
              onRefresh={fetchForecast} 
              onSpeak={handleSpeak}
            />
          )}

          {activeNav === "scan" && activeTab === "evaluator" && (
            <ResponseEvaluator onSpeak={handleSpeak} />
          )}

          {activeNav === "reports" && (
            <ModelCompare onSpeak={handleSpeak} />
          )}

          {activeNav === "scan" && activeTab === "verifier" && (
            <SentinelVerifier onSpeak={handleSpeak} />
          )}

          {activeNav === "actions" && (
            <Simulations onSpeak={handleSpeak} />
          )}
        </div>

        {/* Promotional Project EVE launch card at the bottom of non-EVE pages */}
        {activeNav !== "settings" && (
          <div className="bg-gradient-to-r from-[#58cc02]/5 via-white to-[#1cb0f6]/5 border-2 border-b-4 border-slate-200/80 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
            <div className="flex items-center gap-4 text-center md:text-left">
              <span className="text-4xl select-none">🌍</span>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Want to train AI to save humanity?
                </h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                  Step inside Project EVE to simulate multi-agent social evolution, ethical risks, and safter alternatives!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveNav("settings");
                setActiveTab("eve");
                window.scrollTo({ top: 0, behavior: "smooth" });
                handleSpeak("Launching Project EVE. Prepare to evolve AI safely.");
              }}
              className="px-6 py-3 bg-[#58cc02] text-white border-b-4 border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-[4px] rounded-2xl font-black uppercase text-xs tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              Enter EVE Sandbox <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      {/* Floating Gemini AI Companion Chatbot */}
      <Chatbot onSpeak={handleSpeak} />

      {/* Persistent Bottom Navigation Bar (Differentiates and houses interfaces matching the reference attachment) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] select-none">
        <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
          
          {/* 1. SCAN */}
          <button
            onClick={() => {
              setActiveNav("scan");
              if (activeTab !== "verifier" && activeTab !== "evaluator") {
                setActiveTab("evaluator");
              }
              handleSpeak("Accessing AI safety scanners.");
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer"
            style={{ color: activeNav === "scan" ? "#0f766e" : "#64748b" }}
          >
            <Camera className={`w-5.5 h-5.5 transition-all ${activeNav === "scan" ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
            <span className="text-[10px] font-black tracking-tight mt-1 uppercase">Scan</span>
          </button>

          {/* 2. REPORTS */}
          <button
            onClick={() => {
              setActiveNav("reports");
              setActiveTab("compare");
              handleSpeak("Opening comparison reports and safety passports.");
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer"
            style={{ color: activeNav === "reports" ? "#0f766e" : "#64748b" }}
          >
            <BarChart3 className={`w-5.5 h-5.5 transition-all ${activeNav === "reports" ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
            <span className="text-[10px] font-black tracking-tight mt-1 uppercase">Reports</span>
          </button>

          {/* 3. INSIGHTS */}
          <button
            onClick={() => {
              setActiveNav("insights");
              setActiveTab("command");
              handleSpeak("Accessing global safety insights feed.");
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer"
            style={{ color: activeNav === "insights" ? "#0f766e" : "#64748b" }}
          >
            <Brain className={`w-5.5 h-5.5 transition-all ${activeNav === "insights" ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
            <span className="text-[10px] font-black tracking-tight mt-1 uppercase">Insights</span>
          </button>

          {/* 4. ACTIONS */}
          <button
            onClick={() => {
              setActiveNav("actions");
              setActiveTab("academy");
              handleSpeak("Accessing safety simulations and quizzes.");
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer"
            style={{ color: activeNav === "actions" ? "#0f766e" : "#64748b" }}
          >
            <ClipboardCheck className={`w-5.5 h-5.5 transition-all ${activeNav === "actions" ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
            <span className="text-[10px] font-black tracking-tight mt-1 uppercase">Actions</span>
          </button>

          {/* 5. SETTINGS / EVE */}
          <button
            onClick={() => {
              setActiveNav("settings");
              setActiveTab("eve");
              handleSpeak("Opening Project EVE sandbox guidelines.");
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer"
            style={{ color: activeNav === "settings" ? "#0f766e" : "#64748b" }}
          >
            <Globe className={`w-5.5 h-5.5 transition-all ${activeNav === "settings" ? "stroke-[2.5px] scale-110" : "stroke-2"}`} />
            <span className="text-[10px] font-black tracking-tight mt-1 uppercase">Project EVE</span>
          </button>

        </div>
      </div>

      {/* Duolingo style 3D Footer */}
      <footer className="relative z-10 border-t-4 border-slate-200 bg-white text-center py-6 px-4 text-xs text-slate-400 mt-12 pb-24 font-bold">
        <p>AI Sentinel &copy; 2026. Keep learning, stay safe! 🦉</p>
      </footer>

    </div>
  );
}
