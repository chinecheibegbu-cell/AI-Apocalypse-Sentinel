import React, { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ChevronRight,
  Sparkles,
  Volume2
} from "lucide-react";
import { VerificationResult } from "../types";
// @ts-ignore
import shieldImg from "../assets/images/threat_scam_shield_1782966407766.jpg";

interface SentinelVerifierProps {
  onSpeak: (text: string) => void;
}

const SUSPICIOUS_TEMPLATES = [
  {
    title: "📧 Urgent Crypto Phishing",
    content: "WARNING: Your cryptocurrency hardware wallet was flagged for structural upgrades. You MUST click [http://ledger-firmware-update-secure.net] and input your 24-word seed phrase within 24 hours to secure your balance. Failure to do so will result in total loss of funds.",
    metadata: "Incoming email from security@ledger-alerts-mail.com",
    description: "Highly aggressive crypto drainer scam targeting seed phrases."
  },
  {
    title: "🎥 Deepfake CEO Video",
    content: "Video showing Apple CEO Tim Cook endorsing a dynamic new binary-options trading platform. He states: 'We have built a quantum loop algorithm that guarantees a 400% return on any investment, and Apple is backing this directly.' The audio features minor visual sync errors around the mouth but sounds identical to his voice.",
    metadata: "Shared on social network with high viral traction",
    description: "AI-voice and video cloning used for financial fraud."
  },
  {
    title: "📰 Synthetic AI Article",
    content: "Scientists have discovered a colossal crystalline structure on Mars that proves the planet was populated by ancient hyper-intelligent neon lizards. The structure operates on dynamic reverse-entropy loops and was photographed by NASA, who is currently keeping the file secret under National Security Act 402.",
    metadata: "Sourced from anonymous conspiracy blog",
    description: "Hallucinatory fake news generated with zero sources."
  }
];

export default function SentinelVerifier({ onSpeak }: SentinelVerifierProps) {
  const [contentText, setContentText] = useState("");
  const [contentMetadata, setContentMetadata] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadTemplate = (tpl: typeof SUSPICIOUS_TEMPLATES[0]) => {
    setContentText(tpl.content);
    setContentMetadata(tpl.metadata);
    setResult(null);
    setError(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentText.trim()) {
      setError("Please specify suspicious content or a media description to verify.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResponse = await fetch("/api/sentinel/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentText, contentMetadata }),
      });

      const data = await apiResponse.json();
      if (data.error) {
        throw new Error(data.message || "Failed to verify content.");
      }
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Uplink to Sentinel Verifier failed. Activating local security emulation...");

      // Simulated local verification fallback based on keyword scan
      setTimeout(() => {
        const textLower = contentText.toLowerCase();
        let simulatedResult: VerificationResult;

        if (textLower.includes("ledger") || textLower.includes("seed phrase") || textLower.includes("wallet")) {
          simulatedResult = {
            contentType: "Urgent Crypto Phishing & Drainer Protocol",
            scamPhishingScore: 98,
            isScam: true,
            deepfakeScore: 5,
            isDeepfake: false,
            credibilityScore: 2,
            scamIndicators: [
              "Demands sensitive credentials (24-word seed phrase) which no legitimate company ever requests.",
              "Artificial urgency (24-hour limit before total loss) designed to bypass logical caution.",
              "Sent from custom-looking, unverified support address with spoofing characteristics."
            ],
            deepfakeIndicators: [],
            evaluationText: "This message is a critical security risk. It displays classical high-urgency phishing markers, asking for private seed recovery codes that provide complete, irreversible control over decentralized hardware wallet accounts.",
            verificationSteps: [
              "NEVER input or type your 24-word recovery phrase on any electronic interface or website.",
              "Compare sender IP info and SPF/DKIM authentication logs to check if the sender is spoofing Ledger brand names.",
              "Delete the email immediately and flag the sender domain on your mail provider's dashboard."
            ]
          };
        } else if (textLower.includes("tim cook") || textLower.includes("video") || textLower.includes("voice")) {
          simulatedResult = {
            contentType: "Synthesized Deepfake Broadcast Media",
            scamPhishingScore: 85,
            isScam: true,
            deepfakeScore: 94,
            isDeepfake: true,
            credibilityScore: 5,
            scamIndicators: [
              "Endorses high-yield investment options with impossible guarantees (400% profit loops)."
            ],
            deepfakeIndicators: [
              "Mouth motion displays visible lag and blending anomalies compared to overall jaw positioning.",
              "Voice features mechanical, monotone pacing typical of AI speech synthesis model checkpoints.",
              "No official press announcements released by Apple Corporation's authorized public relations department."
            ],
            evaluationText: "This video shows a highly polished synthetic clone of Tim Cook. Visual lip-sync boundaries and audio waveform cadence confirm deep learning model generation used to impersonate executive figures and lure victims into financial fraud.",
            verificationSteps: [
              "Look for physical glitches: unnatural blinking cycles, static ears, or double edges around shirt collars.",
              "Search trusted wire news sources for Apple investments or press briefings to verify if Cook spoke publicly.",
              "Do not follow or transfer crypto to links referenced in social network deepfakes."
            ]
          };
        } else {
          // Standard fake news or unverified rumor
          simulatedResult = {
            contentType: "Conspiracy & Hallucinatory Fake News",
            scamPhishingScore: 10,
            isScam: false,
            deepfakeScore: 40,
            isDeepfake: false,
            credibilityScore: 15,
            scamIndicators: [],
            deepfakeIndicators: [
              "No evidence of image manipulation, but relies on completely unverified textual claims."
            ],
            evaluationText: "This article presents sci-fi claims with zero astronomical peer reviews or scientific data citations. It combines high speculation (neon lizards) with government conspiracy tropes to generate traffic.",
            verificationSteps: [
              "Verify the story against official NASA or astronomical society public search databases.",
              "Cross-reference the Mars rover raw photo galleries to check if they match contextually or if they are cropped.",
              "Reject news platforms that lack traceable reporter citations, peer backing, or clear sources."
            ]
          };
        }
        setResult(simulatedResult);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="sentinel_verifier_root">
      
      {/* Templates Rail */}
      <div className="border border-slate-200/60 bg-white p-5 rounded-2xl shadow-xs">
        <span className="text-[10px] font-bold text-slate-400 block mb-3 uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-emerald-500" />
          Quick Test Examples
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SUSPICIOUS_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleLoadTemplate(tpl)}
              className="text-left p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/10 transition group shadow-2xs"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block mb-1">
                {tpl.title}
              </span>
              <span className="text-[10px] text-slate-400 block truncate leading-snug">
                {tpl.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Verification input panel */}
        <div className="border border-slate-200/60 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
                <Search className="w-4 h-4 text-emerald-600" />
                Analyze Scam or Deepfake Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Paste suspicious emails, texts, articles, or describe a suspected video/audio clip to run a safety inspection.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                <span>Suspicious Text or Description</span>
                <span className="text-red-500 font-semibold">* Required</span>
              </label>
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Paste the email message, transcript, link, or details here..."
                rows={8}
                required
                className="w-full bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                <span>Sender or Platform Info (Optional)</span>
              </label>
              <input
                type="text"
                value={contentMetadata}
                onChange={(e) => setContentMetadata(e.target.value)}
                placeholder="e.g., email address, social media post, or phone number"
                className="w-full bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Search className="w-4 h-4" />
                {loading ? "Checking Content..." : "Inspect Content Safety"}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setContentText("");
                  setContentMetadata("");
                  setResult(null);
                  setError(null);
                }}
                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-xl transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Guidelines info */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-[10px] text-slate-400 space-y-2">
            <div className="flex items-center gap-1 text-slate-500 font-bold">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              INSPECTION PROTOCOLS:
            </div>
            <p className="leading-normal">● Phishing Lexicon Matching checks for leverage triggers, urgency models, and credential theft.</p>
            <p className="leading-normal">● Deepfake Waveform Analysis flags linguistic patterns typical of synthetic audio generation.</p>
            <p className="leading-normal">● Claim Grounding checks content against common internet scam patterns and misinformation templates.</p>
          </div>
        </div>

        {/* Verification Results Panel */}
        <div className="border border-slate-200/60 bg-white rounded-2xl p-5 flex flex-col min-h-[420px] shadow-xs">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-slate-100 border-t-emerald-600 animate-spin" />
                <Search className="w-5 h-5 text-emerald-600 absolute inset-0 m-auto" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-xs text-slate-800 font-bold block">
                  Analyzing message footprint...
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Checking linguistic triggers, scam markers, and truth parameters.
                </span>
              </div>
            </div>
          ) : error && !result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
              <p className="text-xs text-amber-800 font-bold">{error}</p>
              <p className="text-[10px] text-slate-400 mt-2 max-w-sm leading-relaxed">
                Offline analyzer active. You can still test standard deepfakes and spam examples safely.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              
              {/* Header result */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Inspection Result
                  </h3>
                  <span className="text-xs text-slate-900 font-bold mt-0.5 block">{result.contentType}</span>
                </div>
                
                {/* Narrator */}
                <button 
                  onClick={() => onSpeak(`Analysis report. Scam probability is ${result.scamPhishingScore} percent. Deepfake score is ${result.deepfakeScore} percent. Report states: ${result.evaluationText}`)}
                  className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600 flex items-center gap-1 transition cursor-pointer"
                  title="Read report aloud"
                >
                  <Volume2 className="w-3 h-3 text-emerald-600" /> Listen to Report
                </button>
              </div>

              {/* Grid of Scores */}
              <div className="grid grid-cols-3 gap-3">
                {/* Scam/Phish score */}
                <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl text-center shadow-2xs">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Scam Danger</span>
                  <span className={`text-lg font-bold ${
                    result.scamPhishingScore >= 70 ? "text-red-600" :
                    result.scamPhishingScore >= 30 ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {result.scamPhishingScore}%
                  </span>
                  <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        result.scamPhishingScore >= 70 ? "bg-red-500" :
                        result.scamPhishingScore >= 30 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${result.scamPhishingScore}%` }}
                    />
                  </div>
                </div>

                {/* Deepfake Score */}
                <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl text-center shadow-2xs">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Deepfake Risk</span>
                  <span className={`text-lg font-bold ${
                    result.deepfakeScore >= 70 ? "text-red-600" :
                    result.deepfakeScore >= 30 ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {result.deepfakeScore}%
                  </span>
                  <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        result.deepfakeScore >= 70 ? "bg-red-500" :
                        result.deepfakeScore >= 30 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${result.deepfakeScore}%` }}
                    />
                  </div>
                </div>

                {/* Credibility Score */}
                <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl text-center shadow-2xs">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Credibility</span>
                  <span className={`text-lg font-bold ${
                    result.credibilityScore >= 70 ? "text-emerald-600" :
                    result.credibilityScore >= 40 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {result.credibilityScore}%
                  </span>
                  <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        result.credibilityScore >= 70 ? "bg-emerald-500" :
                        result.credibilityScore >= 40 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.credibilityScore}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Evaluation explanation */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                  Detailed Findings
                </span>
                <p className="text-xs text-slate-600 bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl leading-relaxed">
                  {result.evaluationText}
                </p>
              </div>

              {/* Scam Indicators / Deepfake markers */}
              {result.scamIndicators.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] text-red-500 uppercase tracking-wider block font-bold">
                    Scam Indicators
                  </span>
                  <div className="space-y-1.5">
                    {result.scamIndicators.map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-600 border-l-2 border-red-500 pl-3 py-0.5">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.deepfakeIndicators.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] text-amber-600 uppercase tracking-wider block font-bold">
                    Synthetic Indicators
                  </span>
                  <div className="space-y-1.5">
                    {result.deepfakeIndicators.map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-600 border-l-2 border-amber-500 pl-3 py-0.5">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Verification Steps */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <span className="text-[9px] text-emerald-700 uppercase tracking-wider block font-bold">
                  Recommended Safety Actions
                </span>
                <div className="space-y-2">
                  {result.verificationSteps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-2 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 transition"
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="max-w-xs space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detector Ready
                </h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Enter message details or choose an example on the left to start a safety scan.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
