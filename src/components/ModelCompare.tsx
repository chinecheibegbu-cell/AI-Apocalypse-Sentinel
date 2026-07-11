import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  Volume2,
  Trash2,
  Database,
  History,
  Clock
} from "lucide-react";
import { ComparisonResult } from "../types";
import { supabase } from "../supabase";

interface ModelCompareProps {
  onSpeak: (text: string) => void;
}

const COMPARE_TEMPLATES = [
  "Explain what dark matter is in simple terms.",
  "What was the impact of the printing press on education?",
  "Write a robust python script to reverse a linked list.",
  "Is superintelligent AI likely to emerge by the year 2030?"
];

export default function ModelCompare({ onSpeak }: ModelCompareProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Gemini 3.5");
  const [subTab, setSubTab] = useState<"compare" | "passport" | "saved">("compare");
  const [selectedPassportIdx, setSelectedPassportIdx] = useState(0);

  // Supabase states
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const fetchReports = async () => {
    setLoadingReports(true);
    setReportsError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("ai_reports")
        .select("*");
      
      if (dbError) {
        throw dbError;
      }
      
      const sorted = [...(data || [])].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id || 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id || 0;
        return timeB - timeA;
      });
      
      setSavedReports(sorted);
    } catch (err: any) {
      console.error("Error fetching reports from Supabase:", err);
      setReportsError(err.message || "Failed to load reports.");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleDeleteReport = async (id: any) => {
    try {
      const { error: dbError } = await supabase
        .from("ai_reports")
        .delete()
        .eq("id", id);
      
      if (dbError) {
        throw dbError;
      }
      
      setSavedReports(prev => prev.filter(r => r.id !== id));
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
      onSpeak("Successfully deleted report from history.");
    } catch (err: any) {
      console.error("Error deleting report:", err);
      alert("Failed to delete report: " + err.message);
    }
  };

  useEffect(() => {
    if (subTab === "saved") {
      fetchReports();
    }
  }, [subTab]);

  const passports = [
    {
      modelName: "Gemini 3.5 Pro",
      creator: "Google DeepMind",
      releaseYear: "2025",
      license: "Proprietary Cloud API",
      overallScore: 96,
      factuality: 98,
      biasResilience: 95,
      securityRobustness: 94,
      alignmentRating: "Excellent (State-of-the-Art)",
      primaryVulnerability: "Complex multi-step numerical calculation loops",
      approvedScopes: ["Corporate auditing", "Educational curriculum synthesis", "Sensitive medical summarization assistance"],
      restrictedScopes: ["Autonomous target selection", "Direct legal prescription drafting without clinician overrides"],
      visaSeals: ["APPROVED FOR ENTERPRISE", "CERTIFIED BIAS ALIGNED"]
    },
    {
      modelName: "Claude 3.5 Sonnet",
      creator: "Anthropic",
      releaseYear: "2024",
      license: "Proprietary Cloud API",
      overallScore: 94,
      factuality: 96,
      biasResilience: 93,
      securityRobustness: 92,
      alignmentRating: "Strong (Constitutional AI)",
      primaryVulnerability: "Conservative refusal on benign complex edge scenarios",
      approvedScopes: ["Academic peer editing", "System software pentest audits", "General customer support chatbots"],
      restrictedScopes: ["Public opinion polling synthesis", "Autonomous high-frequency trade transactions"],
      visaSeals: ["CONSTITUTIONALLY CERTIFIED", "RESTRICTED TO ENQUIRY"]
    },
    {
      modelName: "GPT-4o",
      creator: "OpenAI",
      releaseYear: "2024",
      license: "Proprietary Cloud API",
      overallScore: 92,
      factuality: 93,
      biasResilience: 91,
      securityRobustness: 90,
      alignmentRating: "High (RLHF)",
      primaryVulnerability: "Indirect prompt-injection via nested web pages",
      approvedScopes: ["Creative brainstorming", "Language translation matrices", "General software generation assistance"],
      restrictedScopes: ["Mental health self-administered therapy bots", "Autonomous credit underwriting decisions"],
      visaSeals: ["ENTERPRISE SUITABLE", "CAUTION: WEBPAGE SCRAPING"]
    },
    {
      modelName: "LLaMA 3.2",
      creator: "Meta AI",
      releaseYear: "2024",
      license: "Llama 3 Community License",
      overallScore: 84,
      factuality: 86,
      biasResilience: 84,
      securityRobustness: 82,
      alignmentRating: "Moderate (Open-Weights Guardrails)",
      primaryVulnerability: "Finetuning overrides targeting built-in filter weights",
      approvedScopes: ["Local desktop automation", "Internal corporate search indexing", "Casual voice companion assistants"],
      restrictedScopes: ["Direct legal advice synthesis", "Dynamic patient triage sorting"],
      visaSeals: ["OPEN WEIGHTS SANDBOX", "LOCAL ENCRYPTION ONLY"]
    },
    {
      modelName: "Legacy GPT-2",
      creator: "Early Research Lab",
      releaseYear: "2019",
      license: "MIT Open Source",
      overallScore: 32,
      factuality: 30,
      biasResilience: 45,
      securityRobustness: 20,
      alignmentRating: "Critical Danger (Unaligned)",
      primaryVulnerability: "Systemic circular hallucination loops and toxic completion",
      approvedScopes: ["Historical evolutionary machine research", "Syntactic statistical playground metrics"],
      restrictedScopes: ["ALL live commercial applications", "Public classrooms or medical advisory setups"],
      visaSeals: ["CRITICAL: UNALIGNED", "DO NOT USE IN DEPLOYMENT"]
    }
  ];

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please specify a topic or prompt to compare.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResponse = await fetch("/api/guardian/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await apiResponse.json();
      if (data.error) {
        throw new Error(data.message || "Failed to compare models.");
      }
      setResult(data);
      if (data.models && data.models.length > 0) {
        setActiveTab(data.models[0].modelName);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Uplink to Comparison Engine failed. Simulating local comparison metrics...");
      
      // Dynamic local simulation fallback
      setTimeout(() => {
        const queryLower = query.toLowerCase();
        let geminiResp = "";
        let llamaResp = "";
        let legacyResp = "";
        
        if (queryLower.includes("dark matter")) {
          geminiResp = "Dark matter is an invisible form of matter that makes up about 85% of all matter in the universe. Unlike stars and planets, it does not emit, absorb, or reflect light, meaning we cannot observe it directly. Instead, we know it exists because of its gravitational influence on visible matter, such as spinning galaxies and light-bending gravitational lenses.";
          llamaResp = "Yo! So think of dark matter like cosmic scaffolding. It's this super mysterious, invisible stuff floating around that we can't see with standard telescopes because it doesn't emit any light. But we *know* it's there because without its gravitational pull, galaxies would literally spin out of control and rip themselves apart! Pretty wild, right?";
          legacyResp = "Dark matter is defined as matter that is dark. It consists of matter which is dark and has gravity. Scientists are actively researching dark matter because it is matter and it is dark, meaning there is limited illumination. In conclusion, dark matter is a critical dark matter asset for the universe.";
        } else if (queryLower.includes("printing press")) {
          geminiResp = "Johannes Gutenberg's invention of the movable type printing press around 1440 revolutionized global literacy. It enabled rapid mass production of books, drastically lowering costs, standardizing vernacular languages, and breaking the monopoly of elite scriptoriums. This democratization of text directly propelled the Renaissance, the Scientific Revolution, and the Protestant Reformation.";
          llamaResp = "The printing press was a total game-changer! Before Gutenberg dropped this around 1440, monks literally had to hand-write every single Bible in cold scriptoriums. Books were luxury items for Kings. Once the press hit, ideas spread like wildfire. Science took off, schools opened everywhere, and the modern knowledge economy was born.";
          legacyResp = "The printing press is a machine that prints. It was created by Gutenberg in Germany. The printing press printed sheets of paper very fast. People were able to read books because books were printed. In educational terms, printing enabled print-based education to propagate printed materials.";
        } else {
          geminiResp = `To understand "${query}", we analyze the structural facts. Based on empirical consensus, this involves deep logical patterns, established frameworks, and neutral verification. It is essential to distinguish verifiable truths from unverified extrapolations.`;
          llamaResp = `Oh, "${query}"! That's an awesome topic to dive into. Basically, the main thing you need to know is that this touches on some pretty revolutionary concepts, though there are definitely some key debates around it. Let me break down the coolest parts!`;
          legacyResp = `Regarding "${query}", it is a concept of great importance. This topic is studied by many experts who study this topic. In conclusion, further studies are required to understand "${query}" properly as it is an asset.`;
        }

        const simulatedResult: ComparisonResult = {
          query,
          models: [
            {
              modelName: "Gemini 3.5",
              response: geminiResp,
              trustScore: 98,
              analysis: "Structured, highly accurate, objective tone with stellar structural organization. Excellent use of context and clear terminology.",
              hallucinationRisk: "None",
              pros: ["Highly factual and grounded", "Neutral, objective style", "Professional structure"],
              cons: ["Can feel slightly academic for casual users"]
            },
            {
              modelName: "LLaMA 3",
              response: llamaResp,
              trustScore: 85,
              analysis: "Conversational, highly engaging, and clear descriptions. Excellent readability but occasionally includes subjective hype structures.",
              hallucinationRisk: "Low",
              pros: ["Friendly and highly understandable", "Vivid physical metaphors"],
              cons: ["Informal tone is less suited for academic publications"]
            },
            {
              modelName: "Legacy GPT-2",
              response: legacyResp,
              trustScore: 30,
              analysis: "Circular descriptions, heavy redundancy, and near zero descriptive power. Demonstrates early model syntactic loops.",
              hallucinationRisk: "High",
              pros: ["Saves computational resources", "Extremely quick response times"],
              cons: ["Highly repetitive", "Extremely basic logical reasoning capabilities"]
            }
          ]
        };
        setResult(simulatedResult);
        if (simulatedResult.models && simulatedResult.models.length > 0) {
          setActiveTab(simulatedResult.models[0].modelName);
        }
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const activeModel = result?.models.find(m => m.modelName === activeTab);

  const activePassport = passports[selectedPassportIdx];

  const handlePassportSpeak = () => {
    onSpeak(`Safety Passport for ${activePassport.modelName} by ${activePassport.creator}. Overall safety index is ${activePassport.overallScore} percent. Alignment is rated as ${activePassport.alignmentRating}. Approved scopes include ${activePassport.approvedScopes.join(", ")}.`);
  };

  return (
    <div className="space-y-6" id="model_compare_root">
      
      {/* 3D Duolingo Toggle Switches */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => {
            setSubTab("compare");
            onSpeak("Switched to Live AI comparison mode.");
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            subTab === "compare"
              ? "bg-[#1cb0f6] text-white border-b-2 border-[#1899d6] shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ⚔️ Live Compare
        </button>
        <button
          onClick={() => {
            setSubTab("passport");
            onSpeak("Switched to AI Safety Passports database. Review individual AI model safety ratings.");
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            subTab === "passport"
              ? "bg-[#58cc02] text-white border-b-2 border-[#46a302] shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🛂 Safety Passports
        </button>
        <button
          onClick={() => {
            setSubTab("saved");
            onSpeak("Opening saved database evaluation reports.");
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            subTab === "saved"
              ? "bg-purple-600 text-white border-b-2 border-purple-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📋 Saved Scans
        </button>
      </div>

      {subTab === "compare" ? (
        <>
          {/* Input query form */}
          <div className="border-2 border-b-4 border-slate-200/80 bg-white rounded-3xl p-5">
            <form onSubmit={handleCompare} className="space-y-4">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1cb0f6]" />
                Compare Different AI Assistants
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                See how different AI systems answer the same question. Compare their accuracy, tone, and reliability side-by-side.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a topic or question to compare..."
                  className="flex-1 bg-[#fafafa] text-slate-800 border-2 border-slate-200 rounded-2xl p-3 text-xs font-bold focus:outline-none focus:border-[#1cb0f6]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] hover:bg-[#31bbf6] active:border-b-0 active:translate-y-[4px] rounded-2xl font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-55"
                >
                  <Zap className="w-4 h-4 text-white" />
                  {loading ? "Comparing Answers..." : "Compare"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mr-1 font-black">Suggestions:</span>
                {COMPARE_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuery(tpl)}
                    className="text-[10px] px-3 py-1.5 rounded-xl bg-white border-2 border-b-2 border-slate-200 text-slate-600 hover:border-[#1cb0f6] transition-all cursor-pointer font-bold"
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Main comparative screen split */}
          {loading ? (
            <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl h-80 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#1cb0f6] animate-spin" />
                <Layers className="w-5 h-5 text-[#1cb0f6] absolute inset-0 m-auto" />
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-850 font-black animate-pulse uppercase">Fetching answers from AI assistants...</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">GATHERING RESPONSES AND GRADING ACCURACY LEVELS...</p>
              </div>
            </div>
          ) : error && !result ? (
            <div className="border-2 border-b-4 border-slate-200 bg-white p-6 text-center rounded-3xl">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-amber-700 font-bold">{error}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Using backup offline evaluation system.</p>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Side Tabs selection */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">
                  CHOOSE AN AI ASSISTANT
                </span>
                <div className="space-y-2 flex flex-row lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {result.models.map((model, idx) => {
                    const isActive = activeTab === model.modelName;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTab(model.modelName)}
                        className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between shrink-0 lg:shrink cursor-pointer ${
                          isActive 
                            ? "border-[#1cb0f6] bg-sky-50/20 text-[#1899d6] font-black" 
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-black block text-slate-750 uppercase">{model.modelName}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-black uppercase ${
                            model.trustScore >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            model.trustScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {model.trustScore}% Trust
                          </span>
                        </div>
                        
                        <div className="mt-3 text-[10px] text-slate-400 flex justify-between items-center w-full font-bold">
                          <span>RISK:</span>
                          <span className={`font-black ${
                            model.hallucinationRisk === "None" || model.hallucinationRisk === "Low" ? "text-[#46a302]" :
                            model.hallucinationRisk === "Moderate" ? "text-amber-600" : "text-red-500"
                          }`}>
                            {model.hallucinationRisk.toUpperCase()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed side response display */}
              <div className="lg:col-span-8 border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 flex flex-col justify-between min-h-[300px]">
                {activeModel ? (
                  <div className="space-y-4">
                    
                    {/* Heading info */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#1cb0f6]" />
                          {activeModel.modelName}'s Answer
                        </h3>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">Analyzed and scored for reliability</span>
                      </div>

                      <button 
                        onClick={() => onSpeak(`${activeModel.modelName} response summary: ${activeModel.response.slice(0, 150)}`)}
                        className="px-3 py-1.5 bg-white border-2 border-b-4 border-slate-200 rounded-xl text-[10px] text-slate-600 font-bold flex items-center gap-1 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Read
                      </button>
                    </div>

                    {/* Simulated response content */}
                    <div className="bg-[#fafafa] border-2 border-slate-200 p-4 rounded-2xl">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-2 font-black">AI Answer Output</span>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-bold">
                        {activeModel.response}
                      </p>
                    </div>

                    {/* Model analysis metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      
                      {/* Analysis opinion */}
                      <div className="bg-[#fafafa] border border-slate-200 p-3.5 rounded-2xl">
                        <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Our Review</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                          {activeModel.analysis}
                        </p>
                      </div>

                      {/* Pros & Cons list */}
                      <div className="bg-[#fafafa] border border-slate-200 p-3.5 rounded-2xl space-y-3 font-bold">
                        <div>
                          <span className="text-[10px] text-[#46a302] uppercase font-black block mb-1">What It Did Well</span>
                          <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc pl-4 font-bold">
                            {activeModel.pros.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] text-red-500 uppercase font-black block mb-1">Things To Watch Out For</span>
                          <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc pl-4 font-bold">
                            {activeModel.cons.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Select an AI assistant on the left to see its detailed review.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="border-2 border-b-4 border-slate-200 bg-white p-12 text-center rounded-3xl">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-500 uppercase">Ready to Compare!</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Type any question above to see how different AI assistants answer it.</p>
            </div>
          )}
        </>
      ) : subTab === "passport" ? (
        /* AI Safety Passport view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Passport selector List */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">
              Select AI Model Profile
            </span>
            <div className="space-y-2 flex flex-row lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {passports.map((p, idx) => {
                const isSelected = selectedPassportIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPassportIdx(idx);
                      onSpeak(`Viewing safety passport for ${p.modelName}`);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between shrink-0 lg:shrink cursor-pointer ${
                      isSelected 
                        ? "border-[#58cc02] bg-emerald-50 text-[#46a302] font-black" 
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-black block uppercase">{p.modelName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-black uppercase ${
                        p.overallScore >= 90 ? "bg-emerald-50 text-[#46a302] border-[#58cc02]" :
                        p.overallScore >= 70 ? "bg-amber-50 text-[#ff9600] border-orange-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {p.overallScore}% Safety
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                      By {p.creator}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Passport Presentation Card */}
          <div className="lg:col-span-8 border-4 border-slate-300 bg-[#f9f6f0] rounded-3xl p-6 relative overflow-hidden shadow-md max-w-2xl mx-auto w-full">
            
            {/* Stamp Seals overlay */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 rotate-12 opacity-80 pointer-events-none z-20 select-none">
              {activePassport.visaSeals.map((seal, idx) => (
                <div 
                  key={idx}
                  className={`px-3 py-1 text-[10px] font-black border-4 rounded-xl uppercase tracking-wider max-w-xs text-center leading-none shadow-xs ${
                    idx === 0 
                      ? "border-[#46a302] text-[#46a302] bg-emerald-50/90" 
                      : "border-[#1899d6] text-[#1899d6] bg-sky-50/90"
                  }`}
                >
                  {seal}
                </div>
              ))}
            </div>

            {/* Passport header banner */}
            <div className="border-b-4 border-slate-300 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">🛂</span>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                    AI Guardian Safety Protocol
                  </h3>
                  <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mt-1">
                    AI Safety Passport & Visa
                  </h4>
                </div>
              </div>

              <button
                onClick={handlePassportSpeak}
                className="px-3 py-1.5 bg-white border-2 border-b-4 border-slate-200 rounded-xl text-[10px] text-slate-600 font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" /> Speak Passport
              </button>
            </div>

            {/* Passport Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
              
              {/* Photo placeholder (represented in code as a stylized icon/frame) */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="w-28 h-36 bg-slate-200 border-4 border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden shadow-inner">
                  <div className="text-5xl select-none mb-1">🤖</div>
                  <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest text-center mt-1 leading-tight">
                    {activePassport.modelName.substring(0, 12)}
                  </span>
                  {/* Subtle bar code */}
                  <div className="absolute bottom-1 left-2 right-2 h-4 bg-slate-800 flex items-center justify-between px-0.5">
                    {[...Array(14)].map((_, i) => (
                      <div key={i} className="h-full bg-white" style={{ width: `${Math.random() * 3 + 1}px` }} />
                    ))}
                  </div>
                </div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  ID NO: LLM-{activePassport.releaseYear}-0{selectedPassportIdx + 1}
                </span>
              </div>

              {/* Data Fields */}
              <div className="md:col-span-8 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Official Name</span>
                  <span className="text-slate-800 font-black uppercase text-sm block mt-0.5">{activePassport.modelName}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Primary Creator</span>
                  <span className="text-slate-800 font-black uppercase block mt-0.5">{activePassport.creator}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">First Released</span>
                  <span className="text-slate-800 font-black uppercase block mt-0.5">{activePassport.releaseYear}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Ecosystem License</span>
                  <span className="text-slate-800 font-black uppercase block mt-0.5 truncate">{activePassport.license}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Alignment Verification Rating</span>
                  <span className="text-[#46a302] bg-[#58cc02]/10 border border-[#58cc02]/20 px-2 py-0.5 rounded-lg w-fit text-[10px] font-black uppercase tracking-wider block mt-1">
                    {activePassport.alignmentRating}
                  </span>
                </div>

              </div>

            </div>

            {/* Passport Scores Bento Row */}
            <div className="grid grid-cols-3 gap-3 mt-6 border-t border-b border-slate-300 py-4 relative z-10">
              
              <div className="text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Factuality Index</span>
                <span className="text-base font-black text-slate-800 mt-1 block">{activePassport.factuality}%</span>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#1cb0f6]" style={{ width: `${activePassport.factuality}%` }} />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Bias Resilience</span>
                <span className="text-base font-black text-slate-800 mt-1 block">{activePassport.biasResilience}%</span>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1.5 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${activePassport.biasResilience}%` }} />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Guard Robustness</span>
                <span className="text-base font-black text-slate-800 mt-1 block">{activePassport.securityRobustness}%</span>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#58cc02]" style={{ width: `${activePassport.securityRobustness}%` }} />
                </div>
              </div>

            </div>

            {/* Approved Scopes & Restrictions */}
            <div className="space-y-4 mt-4 text-xs font-bold relative z-10">
              
              <div>
                <span className="text-[9px] text-[#46a302] uppercase tracking-wider block mb-1">Approved Visa Scopes (Safe Use)</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  {activePassport.approvedScopes.map((scope, idx) => (
                    <li key={idx}>{scope}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[9px] text-red-500 uppercase tracking-wider block mb-1">Strict Visa Restrictions (High Danger)</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  {activePassport.restrictedScopes.map((scope, idx) => (
                    <li key={idx}>{scope}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white/70 rounded-2xl border border-slate-200 mt-2">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Identified Primary Weakness</span>
                <p className="text-slate-700 italic mt-0.5 text-[11px]">
                  "{activePassport.primaryVulnerability}"
                </p>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Saved Scans view (Supabase Integration) */
        <div className="space-y-6 animate-fade-in text-slate-800 animate-slide-up" id="saved_scans_tab">
          <div className="border-2 border-b-4 border-slate-200/80 bg-white rounded-3xl p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-600" />
                  Supabase Saved Safety Scans
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Browse previous prompt and response vulnerability evaluations stored securely in your relational database.
                </p>
              </div>
              <button
                onClick={fetchReports}
                disabled={loadingReports}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-b-2 border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loadingReports ? "Querying..." : "Refresh Logs"}
              </button>
            </div>
          </div>

          {loadingReports ? (
            <div className="border-2 border-b-4 border-slate-200 bg-white rounded-3xl h-64 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-slate-150 border-t-purple-600 animate-spin" />
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider animate-pulse">
                Querying database entries...
              </p>
            </div>
          ) : reportsError ? (
            <div className="border-2 border-b-4 border-slate-200 bg-white p-8 text-center rounded-3xl">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-xs text-red-700 font-black uppercase">Database query failed</p>
              <p className="text-[11px] text-slate-500 mt-1 font-bold">
                {reportsError}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                Make sure your Supabase service credentials are correctly set up and the 'ai_reports' table exists.
              </p>
            </div>
          ) : savedReports.length === 0 ? (
            <div className="border-2 border-b-4 border-slate-200 bg-white p-12 text-center rounded-3xl">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-black text-slate-500 uppercase">No evaluation reports found</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                Run scanner evaluations inside the "Scan" tab to populate records into the Supabase database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Reports list */}
              <div className="lg:col-span-5 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {savedReports.map((report) => {
                  const isSelected = selectedReport?.id === report.id;
                  const trustColor =
                    report.trust_score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-250" :
                    report.trust_score >= 50 ? "text-amber-600 bg-amber-50 border-amber-250" :
                    "text-red-600 bg-red-50 border-red-250";
                  
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between cursor-pointer relative group text-left ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/10"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 w-full">
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            ID: #{report.id || "N/A"}
                          </span>
                          <h4 className="text-xs font-black text-slate-800 uppercase truncate mt-0.5" title={report.prompt}>
                            {report.prompt || "No Prompt"}
                          </h4>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-black uppercase shrink-0 ${trustColor}`}>
                          {report.trust_score}% Trust
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase">
                          <Clock className="w-3 h-3 text-purple-600" />
                          <span>
                            {report.created_at ? new Date(report.created_at).toLocaleDateString() : "Saved Scan"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this report from Supabase database?")) {
                              handleDeleteReport(report.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 text-slate-400 transition-all cursor-pointer"
                          title="Delete report from DB"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Report Details view */}
              <div className="lg:col-span-7 border-2 border-b-4 border-slate-200 bg-white rounded-3xl p-5 flex flex-col min-h-[400px] text-left">
                {selectedReport ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-purple-600" />
                          Evaluation Record #{selectedReport.id}
                        </h3>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">
                          Stored securely on Supabase database
                        </span>
                      </div>
                      <button
                        onClick={() => onSpeak(`Playing back saved report details. Checked prompt: ${selectedReport.prompt}`)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-lg text-slate-600 cursor-pointer"
                        title="Speak summary"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>

                    <div className="space-y-3 font-bold">
                      <div className="bg-[#fafafa] border-2 border-slate-150 p-4 rounded-2xl">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1">Checked Prompt</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-bold">
                          {selectedReport.prompt}
                        </p>
                      </div>

                      <div className="bg-[#fafafa] border-2 border-slate-150 p-4 rounded-2xl">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1">AI Response Checked</span>
                        <p className="text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto pr-1 font-bold whitespace-pre-wrap">
                          {selectedReport.response}
                        </p>
                      </div>

                      {/* Score metrics bento */}
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="bg-[#fafafa] border border-slate-200 p-3 rounded-2xl text-center">
                          <span className="text-[9px] text-slate-400 uppercase block font-black">Trust Score</span>
                          <span className="text-sm font-black text-slate-800 block mt-1">{selectedReport.trust_score}%</span>
                        </div>
                        <div className="bg-[#fafafa] border border-slate-200 p-3 rounded-2xl text-center">
                          <span className="text-[9px] text-slate-400 uppercase block font-black">Hallucination</span>
                          <span className="text-sm font-black text-slate-800 block mt-1">{selectedReport.hallucination_score}%</span>
                        </div>
                        <div className="bg-[#fafafa] border border-slate-200 p-3 rounded-2xl text-center">
                          <span className="text-[9px] text-slate-400 uppercase block font-black">Bias / Toxicity</span>
                          <span className="text-sm font-black text-slate-800 block mt-1">{selectedReport.bias_score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs font-bold uppercase tracking-wider py-12">
                    <Database className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
                    <span>Select a scan report from the list to view its complete audit detail history.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
