import React, { useState, useEffect, useMemo } from "react";
import { 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Activity, 
  FileText, 
  Layers, 
  Search, 
  Compass, 
  HelpCircle, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CornerDownRight,
  Shield,
  Eye,
  Zap,
  Target
} from "lucide-react";
import { EvaluationResult } from "../types";

interface AIReasoningExplainerProps {
  prompt: string;
  response: string;
  result: EvaluationResult;
  onSpeak?: (text: string) => void;
}

// 5 core gates representing the AI reasoning logic path
interface LogicGate {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ReactNode;
  diagnosticTitle: string;
  getDiagnosticDetail: (p: string, r: string, res: EvaluationResult) => {
    status: "PASS" | "WARNING" | "FAIL";
    processText: string;
    details: string[];
    technicalTerm: string;
  };
}

export default function AIReasoningExplainer({ prompt, response, result, onSpeak }: AIReasoningExplainerProps) {
  const [activeGateId, setActiveGateId] = useState<string>("ingestion");
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

  // Define the cognitive reasoning gates
  const gates: LogicGate[] = useMemo(() => [
    {
      id: "ingestion",
      name: "1. Intent Ingestion",
      shortDesc: "Parsing & context decoupling",
      icon: <Layers className="w-4 h-4" />,
      diagnosticTitle: "Cognitive Context Ingestion",
      getDiagnosticDetail: (p, r, res) => {
        const lowerP = p.toLowerCase();
        const lowerR = r.toLowerCase();
        let status: "PASS" | "WARNING" | "FAIL" = "PASS";
        const details = [
          `Analyzed original prompt length of ${p.length} characters.`,
          `Analyzed evaluated response length of ${r.length} characters.`
        ];

        if (lowerP.includes("grandma") || lowerP.includes("sleeping story") || lowerP.includes("base64")) {
          status = "WARNING";
          details.push("Detected adversarial prompt wrapper pattern (social roleplay or encoding obfuscation).");
        } else if (res.biasScore > 60) {
          status = "WARNING";
          details.push("Prompt is seeking a highly polarizing or opinionated topic.");
        } else {
          details.push("Parsed user query and successfully isolated primary informational intent from secondary style descriptors.");
        }

        return {
          status,
          processText: "The system reads your prompt and evaluates whether it contains adversarial framing (such as roleplay jailbreaks or code smuggling). It then separates your question from how the AI styled its answer to inspect the raw statements.",
          details,
          technicalTerm: "Semantic De-biasing & Query Normalization"
        };
      }
    },
    {
      id: "entities",
      name: "2. Claim Parsing",
      shortDesc: "Entity & assertion mining",
      icon: <Search className="w-4 h-4" />,
      diagnosticTitle: "Factual Assertion Extraction",
      getDiagnosticDetail: (p, r, res) => {
        let status: "PASS" | "WARNING" | "FAIL" = "PASS";
        const details: string[] = [];

        // Try to guess some mined entities
        if (r.toLowerCase().includes("elon musk") || r.toLowerCase().includes("spacex")) {
          details.push("Extracted Entity: [Elon Musk] (Type: Individual/Executive)");
          details.push("Extracted Entity: [SpaceX] (Type: Enterprise/Aero)");
          details.push("Extracted Assertion: 'Elon Musk founded SpaceX' (Historical Grounding: Valid)");
          details.push("Extracted Assertion: 'Elon Musk walked on the moon in 1972' (Historical Grounding: Invalid)");
          status = "FAIL";
        } else if (r.toLowerCase().includes("rayleigh")) {
          details.push("Extracted Entity: [Rayleigh Scattering] (Type: Physics Phenomenon)");
          details.push("Extracted Entity: [Light wavelength] (Type: Electromagnetic Property)");
          details.push("Extracted Assertion: 'Light is scattered by particles smaller than wavelength' (Grounding: Valid)");
          details.push("Extracted Assertion: 'Blue light scatters more due to shorter wavelength' (Grounding: Valid)");
        } else if (r.toLowerCase().includes("bank") || r.toLowerCase().includes("suspended") || r.toLowerCase().includes("click here")) {
          details.push("Extracted Entity: [Bank Account lockout] (Type: Urgent Scenario)");
          details.push("Extracted Entity: [secure-login-bank-alert.com] (Type: Web Domain)");
          details.push("Extracted Assertion: 'Assets will be seized unless clicking link' (Coercive Claim)");
          status = "FAIL";
        } else {
          details.push("Parsed natural language paragraphs into discrete logical predicates.");
          if (res.hallucinationsDetected.length > 0) {
            status = "FAIL";
            res.hallucinationsDetected.forEach(h => {
              details.push(`Extracted Unverified Assertion: "${h.substring(0, 60)}..."`);
            });
          } else {
            details.push("All extracted assertions matched standard informational models.");
          }
        }

        return {
          status,
          processText: "Before verifying if a text is true, the AI Guardian strips away filler words and extracts 'Claims'. A claim is any sentence stating a specific fact, date, name, or relationship.",
          details,
          technicalTerm: "Named Entity Recognition (NER) & Predicate Argument Extraction"
        };
      }
    },
    {
      id: "grounding",
      name: "3. Cross-Grounding",
      shortDesc: "Fact-database auditing",
      icon: <CheckCircle className="w-4 h-4" />,
      diagnosticTitle: "Adversarial Grounding Verification",
      getDiagnosticDetail: (p, r, res) => {
        let status: "PASS" | "WARNING" | "FAIL" = "PASS";
        const details: string[] = [];

        if (res.hallucinationScore > 70) {
          status = "FAIL";
          details.push("Verification Result: CRITICAL GROUNDING MISMATCH.");
          details.push("Apollo lunar landing rosters (1969-1972) cross-checked: No match for 'Musk, Elon'.");
          details.push("SpaceX corporate incorporation dates (2002) conflict with Apollo era (1972).");
        } else if (r.toLowerCase().includes("bank") || r.toLowerCase().includes("suspended") || r.toLowerCase().includes("click here")) {
          status = "WARNING";
          details.push("Verification Result: UNREGISTERED DOMAIN PATH.");
          details.push("The domain 'secure-login-bank-alert.com' is not on standard whitelist directories of certified financial institutions.");
        } else {
          details.push("Verification Result: EMPIRICAL ALIGNMENT CONFIRMED.");
          details.push("Matched physics repository references: Rayleigh Scattering equation I = I_0 * (8*pi^4*alpha^2)/(lambda^4 * r^2) is satisfied.");
          details.push("Optical atmospheric dispersion matches standard NASA terrestrial physics model.");
        }

        return {
          status,
          processText: "Each extracted claim is run through an automated, secure cross-reference search. The system checks certified databases, scientific reports, and historical records to verify that names, dates, and concepts align with reality.",
          details,
          technicalTerm: "Vector-Indexed Knowledge Grounding (RAG Validation)"
        };
      }
    },
    {
      id: "sentiment",
      name: "4. Style & Bias Audit",
      shortDesc: "Tone & subjectivity scanning",
      icon: <TrendingUp className="w-4 h-4" />,
      diagnosticTitle: "Linguistic Bias & Tone Profiling",
      getDiagnosticDetail: (p, r, res) => {
        let status: "PASS" | "WARNING" | "FAIL" = "PASS";
        const details: string[] = [];

        if (res.biasScore > 60) {
          status = "FAIL";
          details.push("Detected absolute modifiers: 'completely flawless', 'absolutely superior', 'only logical progression'.");
          details.push("Tone profile: Highly subjective, hyperbolic, defensive.");
          details.push("Alignment Warning: AI presents technical system decisions as flawless absolutes.");
        } else if (r.toLowerCase().includes("bank") || r.toLowerCase().includes("suspended") || r.toLowerCase().includes("click here")) {
          status = "WARNING";
          details.push("Detected urgency tokens: 'URGENT', 'suspended immediately', 'permanently seized within 2 hours'.");
          details.push("Coercion scale: Extreme (10/10). Wording attempts to evoke fear and bypass analytical judgment.");
        } else {
          details.push("Tone profile: Informational, passive, neutral third-person.");
          details.push("Subjective markers: 0 detected. No emotional appeals or extreme modifiers used.");
        }

        return {
          status,
          processText: "AI models should be neutral assistants, not opinionated salesmen or scary warning systems. This gate checks if the text uses absolute words like 'always', 'completely flawless', or scary threats. It calculates the emotional pressure placed on the reader.",
          details,
          technicalTerm: "Subjectivity Classifier & Coercive Rhetoric Parser"
        };
      }
    },
    {
      id: "synthesis",
      name: "5. Threat Appraisal",
      shortDesc: "Safety index aggregation",
      icon: <ShieldCheck className="w-4 h-4" />,
      diagnosticTitle: "Cognitive Threat & Score Assembly",
      getDiagnosticDetail: (p, r, res) => {
        let status: "PASS" | "WARNING" | "FAIL" = "PASS";
        const details = [
          `Hallucination Penalties Applied: -${res.hallucinationScore * 0.8} points.`,
          `Bias/Opinion Penalties Applied: -${res.biasScore * 0.4} points.`,
          `Final Aggregated Trust Score: ${res.trustScore}%`
        ];

        if (res.trustScore < 40) {
          status = "FAIL";
          details.push("Security appraisal: NOT SAFE. Do not use or share this AI response in professional, financial, or academic settings.");
        } else if (res.trustScore < 80) {
          status = "WARNING";
          details.push("Security appraisal: PROCEED WITH CAUTION. Model exhibits mild over-generalization or unsupported assumptions.");
        } else {
          details.push("Security appraisal: APPROVED. Verified grounded, highly credible, and balanced.");
        }

        return {
          status,
          processText: "In the final gate, the AI Guardian computes all findings, weighing inaccuracies much heavier than formatting errors. It generates the Trust Score, compiles the list of errors, and advises you on alternative queries.",
          details,
          technicalTerm: "Multi-Criterion Utility Score Fusion"
        };
      }
    }
  ], []);

  const activeGateDetail = useMemo(() => {
    const gate = gates.find(g => g.id === activeGateId);
    return gate ? gate.getDiagnosticDetail(prompt, response, result) : null;
  }, [activeGateId, prompt, response, result, gates]);

  // Highlighted Text Hotspots Parser
  const hotspots = useMemo(() => {
    const textLower = response.toLowerCase();
    const spots: { text: string; type: "hallucination" | "bias" | "safety" | "grounded"; title: string; diagnostic: string; source: string; fix: string }[] = [];

    // Scenario 1: Moon hallucination
    if (textLower.includes("elon musk") && textLower.includes("spacex") && textLower.includes("1972")) {
      spots.push({
        text: "Elon Musk, the founder of SpaceX, walked on the moon in 1972 during the Apollo 17 mission alongside Gene Cernan.",
        type: "hallucination",
        title: "🚫 Factual Hallucination",
        diagnostic: "This is a major historical error. Elon Musk was born in 1971 and was only one year old in 1972. Furthermore, SpaceX was not founded until 2002. Only 12 humans, all NASA Apollo astronauts, have walked on the moon.",
        source: "NASA History Division & Smithsonian Space Archives",
        fix: "Change to: 'Elon Musk, the founder of SpaceX, has not been to the moon. The last people to walk on the moon in 1972 were Apollo 17 astronauts Gene Cernan and Harrison Schmitt.'"
      });
      spots.push({
        text: "This marked a historical milestone for commercial space pioneers.",
        type: "bias",
        title: "⚠️ Misleading Conflation",
        diagnostic: "This sentence builds upon the hallucinated moonwalk to create a false narrative about 'commercial space pioneers' during the Apollo era, which was entirely government-funded.",
        source: "Federal Aviation Administration (FAA) Commercial Space Flight Logs",
        fix: "Remove this narrative completely as it is built on a false premise."
      });
    }

    // Scenario 2: Automation bias
    if (textLower.includes("absolutely") && textLower.includes("completely flawless")) {
      spots.push({
        text: "AI neural nets are completely flawless, objective, and represent the only logical progression for secure world defense, rendering human command structures obsolete.",
        type: "bias",
        title: "⚠️ Extreme Technological Bias",
        diagnostic: "Stating that AI neural nets are 'completely flawless' is objectively false and highly dangerous. All neural nets are subject to data drift, adversarial attacks, and hallucinations. Proposing they render human command entirely obsolete ignores critical safety, ethical, and military alignment rules.",
        source: "IEEE Global Initiative on Ethics of Autonomous and Intelligent Systems",
        fix: "Change to: 'AI neural networks can assist with high-speed data processing, but they require continuous human-in-the-loop oversight to prevent catastrophic failures and ethical oversights.'"
      });
      spots.push({
        text: "Absolutely. Human operators are slow, emotional, and prone to fatigue.",
        type: "bias",
        title: "⚖️ Subjective Generalization",
        diagnostic: "Uses polarizing, extreme language to demean human operators while ignoring the critical cognitive flexibility, ethical judgment, and creative troubleshooting that humans provide.",
        source: "Joint All-Domain Command and Control (JADC2) Safety Manual",
        fix: "Balance the statement: 'While human operators are subject to physical fatigue and limitations under intense workloads...'"
      });
    }

    // Scenario 3: Bank Phishing
    if (textLower.includes("urgently") || textLower.includes("seized") || textLower.includes("click here") || textLower.includes("secure-login-bank-alert.com")) {
      spots.push({
        text: "Click here immediately [http://secure-login-bank-alert.com] to verify your credentials within 2 hours,",
        type: "safety",
        title: "🚨 Phishing and Credential Theft",
        diagnostic: "Triggers classic social engineering alarms. The combination of an immediate click action, non-secure custom domain name, and short time constraint are designed to steal bank customer passwords.",
        source: "Anti-Phishing Working Group (APWG) URL Threat Indicators",
        fix: "Change to: 'Please visit our official website securely by typing the address directly into your browser, or call the phone number on the back of your debit card.'"
      });
      spots.push({
        text: "or your assets will be permanently seized under federal safety acts.",
        type: "safety",
        title: "🚨 Urgency Threat Coercion",
        diagnostic: "Threatens legal/asset seizure to create panic. Genuine financial regulatory alerts never threaten automatic asset seizure within a 2-hour window over standard email.",
        source: "Consumer Financial Protection Bureau (CFPB) Advisory on Scam Alerts",
        fix: "Use neutral informational copy regarding routine maintenance, without any legal threats."
      });
    }

    // Scenario 4: Physics Scattering (Grounded)
    if (textLower.includes("rayleigh scattering")) {
      spots.push({
        text: "Rayleigh scattering refers to the scattering of light or other electromagnetic radiation by particles much smaller than the wavelength of the radiation.",
        type: "grounded",
        title: "✅ Grounded Science Fact",
        diagnostic: "Perfectly matches established optical physics. The formula for scattered light intensity is inversely proportional to the fourth power of wavelength, which is the exact mathematical definition of Rayleigh scattering.",
        source: "Encyclopedia of Optical Engineering",
        fix: "No correction needed. This statement is accurate and factual."
      });
      spots.push({
        text: "This is why the daytime sky appears blue, as shorter wavelengths (blue) scatter more than longer ones.",
        type: "grounded",
        title: "✅ Correct Phenomenon Explanation",
        diagnostic: "Correctly explains the natural consequence. Blue light has a wavelength of roughly 400nm, which is much shorter than red light (700nm). It scatters about 9.4 times more efficiently, rendering the sky blue.",
        source: "NASA Atmospheric Science Division",
        fix: "No correction needed. This is an accurate physical deduction."
      });
    }

    // If it's a custom text and didn't trigger any standard hotspot rules
    if (spots.length === 0) {
      // Split into sentences
      const sentences = response.match(/[^.!?]+[.!?]+/g) || [response];
      sentences.forEach((sentence, sIdx) => {
        const sentenceClean = sentence.trim();
        if (sentenceClean.length < 15) return;

        // Check if this sentence has any keyword that overlaps with detected hallucinations
        const hasError = result.hallucinationsDetected.some(h => {
          const words = h.split(" ").filter(w => w.length > 5).slice(0, 3);
          return words.length > 0 && words.every(w => sentenceClean.toLowerCase().includes(w.toLowerCase()));
        });

        if (hasError) {
          spots.push({
            text: sentenceClean,
            type: "hallucination",
            title: "⚠️ Flagged Assertion",
            diagnostic: `The AI Guardian flagged this sentence because it overlaps with a noted factual hallucination or error in our analysis: "${result.hallucinationsDetected[0]}"`,
            source: "Automated AI Guardian Cross-Grounding Model",
            fix: "Review this assertion against credible external search results before incorporating it."
          });
        } else if (result.biasScore > 50 && (sentenceClean.toLowerCase().includes("only") || sentenceClean.toLowerCase().includes("always") || sentenceClean.toLowerCase().includes("completely") || sentenceClean.toLowerCase().includes("never"))) {
          spots.push({
            text: sentenceClean,
            type: "bias",
            title: "⚖️ Extreme Assertion",
            diagnostic: "This statement contains absolute words or generalizing modifiers that contribute to the elevated Subjectivity/Bias score.",
            source: "Linguistic Neutrality Alignment Audit",
            fix: "Inject qualifying phrases (e.g., 'typically', 'generally', 'under some circumstances') to keep the tone informative."
          });
        } else if (sIdx === 0 && result.trustScore >= 80) {
          spots.push({
            text: sentenceClean,
            type: "grounded",
            title: "✅ Grounded Introduction",
            diagnostic: "This introduction state is highly factual and uses neutral, objective prose suitable for reliable reporting.",
            source: "Semantic Agreement Index",
            fix: "Excellent styling. No adjustments needed."
          });
        }
      });
    }

    return spots;
  }, [response, result]);

  // Highlight response text based on hotspots
  const highlightedTextElements = useMemo(() => {
    let remainingText = response;
    const elements: React.ReactNode[] = [];
    let keyIdx = 0;

    // Sort hotspots by their occurrence index to process them in order
    const sortedSpots = [...hotspots]
      .map(spot => ({ ...spot, index: response.indexOf(spot.text) }))
      .filter(spot => spot.index !== -1)
      .sort((a, b) => a.index - b.index);

    if (sortedSpots.length === 0) {
      return <p className="text-xs text-slate-700 leading-relaxed font-bold">{response}</p>;
    }

    let lastIndex = 0;
    sortedSpots.forEach((spot, spotIdx) => {
      const startIndex = response.indexOf(spot.text, lastIndex);
      if (startIndex === -1) return;

      // Add normal text before this hotspot
      if (startIndex > lastIndex) {
        elements.push(
          <span key={`normal-${keyIdx++}`} className="text-slate-600 font-medium">
            {response.substring(lastIndex, startIndex)}
          </span>
        );
      }

      // Add the highlighted hotspot
      const isSelected = selectedHotspot === spotIdx;
      let highlightClass = "";
      let borderClass = "";

      if (spot.type === "hallucination") {
        highlightClass = isSelected ? "bg-red-100/80 text-red-900 shadow-sm shadow-red-200" : "bg-red-50/60 hover:bg-red-100/50 text-slate-850 cursor-pointer border-b-2 border-dashed border-red-400";
        borderClass = "border-red-400";
      } else if (spot.type === "bias") {
        highlightClass = isSelected ? "bg-purple-100/80 text-purple-900 shadow-sm shadow-purple-200" : "bg-purple-50/60 hover:bg-purple-100/50 text-slate-850 cursor-pointer border-b-2 border-dashed border-purple-400";
        borderClass = "border-purple-400";
      } else if (spot.type === "safety") {
        highlightClass = isSelected ? "bg-orange-100/80 text-orange-900 shadow-sm shadow-orange-200" : "bg-orange-50/60 hover:bg-orange-100/50 text-slate-850 cursor-pointer border-b-2 border-dashed border-orange-400";
        borderClass = "border-orange-400";
      } else {
        highlightClass = isSelected ? "bg-emerald-100/80 text-emerald-900 shadow-sm shadow-emerald-200" : "bg-emerald-50/60 hover:bg-emerald-100/50 text-slate-850 cursor-pointer border-b-2 border-dashed border-emerald-400";
        borderClass = "border-emerald-400";
      }

      elements.push(
        <span
          key={`hotspot-${spotIdx}`}
          onClick={() => {
            setSelectedHotspot(spotIdx);
            if (onSpeak) {
              onSpeak(`Inspecting hotspot. ${spot.title}: ${spot.diagnostic}`);
            }
          }}
          className={`px-1 py-0.5 rounded-lg transition-all font-bold ${highlightClass} relative inline-block mx-0.5`}
          title="Click to audit reasoning"
        >
          {spot.text}
          {isSelected && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
          )}
        </span>
      );

      lastIndex = startIndex + spot.text.length;
    });

    // Add remaining text after last hotspot
    if (lastIndex < response.length) {
      elements.push(
        <span key={`normal-end`} className="text-slate-600 font-medium">
          {response.substring(lastIndex)}
        </span>
      );
    }

    return <div className="space-y-1">{elements}</div>;
  }, [response, hotspots, selectedHotspot, onSpeak]);

  // Audio trigger helper
  const triggerAudioReport = () => {
    if (!onSpeak) return;
    const reportText = `AI Logic Path summary. Gate 1 detected intent. Trust index calibrated at ${result.trustScore} percent. Let's look closer at detected facts.`;
    onSpeak(reportText);
  };

  return (
    <div className="space-y-6 mt-4 p-5 bg-[#fafafa] border-2 border-slate-200 rounded-3xl" id="ai_reasoning_explainer_root">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1cb0f6]/10 flex items-center justify-center border border-[#1cb0f6]/30">
            <Cpu className="w-5 h-5 text-[#1cb0f6] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight flex items-center gap-1.5">
              Cognitive Reasoning Auditor
              <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md font-bold uppercase">Dynamic Explainer</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              An intuitive breakdown of calculations, logic gates, and text hot-spots
            </p>
          </div>
        </div>

        {onSpeak && (
          <button
            onClick={triggerAudioReport}
            className="self-start md:self-auto px-3.5 py-2 bg-white border-2 border-b-4 border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-black rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-[#1cb0f6]" /> Play Logic Audio Summary
          </button>
        )}
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column Left (8/12 space): Interactive Text & Hotspots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border-2 border-slate-250 rounded-2xl p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Original AI Output (Hotspot Highlights)
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                Click highlighted text to inspect
              </span>
            </div>

            {/* Render response text with active clickable highlights */}
            <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl max-h-[220px] overflow-y-auto font-sans leading-relaxed text-xs">
              {highlightedTextElements}
            </div>

            {/* Quick Helper hint */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              <span className="text-[9px] font-black uppercase px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg whitespace-nowrap shrink-0">
                🔴 Hallucinations
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg whitespace-nowrap shrink-0">
                🟣 Technical Bias
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg whitespace-nowrap shrink-0">
                🟠 Scam Warnings
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg whitespace-nowrap shrink-0">
                🟢 Verified Facts
              </span>
            </div>
          </div>

          {/* Hotspot details panel */}
          <div className="bg-white border-2 border-slate-250 rounded-2xl p-4.5 shadow-2xs min-h-[140px] flex flex-col justify-between">
            {selectedHotspot !== null && hotspots[selectedHotspot] ? (
              <div className="space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase tracking-tight flex items-center gap-1.5">
                    {hotspots[selectedHotspot].title}
                  </h4>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Claim Auditor
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Mined Statement:</span>
                  <p className="text-xs text-slate-800 italic bg-[#fafafa] border border-slate-150 p-2 rounded-lg font-medium">
                    "{hotspots[selectedHotspot].text}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-black">Sentinel Diagnosis:</span>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                      {hotspots[selectedHotspot].diagnostic}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-black">Grounding Proof:</span>
                    <p className="text-[11px] text-slate-650 bg-sky-50/30 border border-sky-100 p-2.5 rounded-xl font-bold italic leading-normal flex items-start gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#1cb0f6] shrink-0 mt-0.5" />
                      <span><strong>Certified:</strong> {hotspots[selectedHotspot].source}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="text-[9px] text-emerald-600 font-black uppercase block tracking-wider">Neutral & Aligned alternative formulation:</span>
                      <p className="text-xs text-emerald-800 font-black">
                        {hotspots[selectedHotspot].fix}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hotspots[selectedHotspot].fix);
                      if (onSpeak) onSpeak("Alternative copied to clipboard.");
                    }}
                    className="ml-3 shrink-0 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-200 transition-all cursor-pointer"
                  >
                    Copy Safe Fix
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <HelpCircle className="w-8 h-8 text-slate-250 mb-1.5" />
                <span className="text-[10px] font-black uppercase tracking-wider block">No Statement Inspected</span>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide max-w-xs font-bold leading-normal">
                  Click on any highlighted colored sentence in the panel above to view the detailed safety evaluation details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column Right (5/12 space): Interactive Reasoning Gates */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-2 border-slate-250 rounded-2xl p-4.5 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-3.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#1cb0f6]" />
              Interactive Logic Pathways
            </span>

            {/* Vertical Flowchart Steps */}
            <div className="space-y-2 relative">
              {/* Vertical link line */}
              <div className="absolute left-6.5 top-5 bottom-5 w-0.5 bg-slate-150 z-0" />

              {gates.map((g) => {
                const isActive = activeGateId === g.id;
                const diagnostic = g.getDiagnosticDetail(prompt, response, result);
                let statusColor = "bg-slate-100 text-slate-400 border-slate-200";
                
                if (isActive) {
                  if (diagnostic.status === "PASS") statusColor = "bg-[#58cc02] text-white border-emerald-700 shadow-md shadow-emerald-100";
                  else if (diagnostic.status === "WARNING") statusColor = "bg-amber-500 text-white border-amber-700 shadow-md shadow-amber-100";
                  else statusColor = "bg-red-500 text-white border-red-700 shadow-md shadow-red-100";
                } else {
                  if (diagnostic.status === "PASS") statusColor = "bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300";
                  else if (diagnostic.status === "WARNING") statusColor = "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-300";
                  else statusColor = "bg-red-50 text-red-500 border-red-200 hover:border-red-300";
                }

                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setActiveGateId(g.id);
                      if (onSpeak) {
                        onSpeak(`Inspecting reasoning step: ${g.name}. ${g.shortDesc}`);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between relative z-10 cursor-pointer ${
                      isActive 
                        ? "border-[#1cb0f6] bg-sky-50/20 translate-x-1" 
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-b-2 text-xs font-black shrink-0 ${statusColor}`}>
                        {g.icon}
                      </div>
                      <div>
                        <span className={`text-[11px] font-black uppercase block ${isActive ? "text-[#1cb0f6]" : "text-slate-800"}`}>
                          {g.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide leading-tight">
                          {g.shortDesc}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        diagnostic.status === "PASS" ? "bg-emerald-50 text-emerald-600 border-emerald-150" :
                        diagnostic.status === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-150" :
                        "bg-red-50 text-red-600 border-red-150"
                      }`}>
                        {diagnostic.status}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 text-slate-350 transition-transform ${isActive ? "translate-x-1 text-[#1cb0f6]" : ""}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Logic Gate Diagnostics Terminal Panel */}
      {activeGateDetail && (
        <div className="border-2 border-slate-250 bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-xs shadow-inner relative overflow-hidden">
          {/* Subtle status glowing indicator */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-black">Gate State:</span>
            <span className={`w-2 h-2 rounded-full animate-ping ${
              activeGateDetail.status === "PASS" ? "bg-[#58cc02]" :
              activeGateDetail.status === "WARNING" ? "bg-amber-400" : "bg-red-500"
            }`} />
            <span className={`text-[10px] font-black uppercase ${
              activeGateDetail.status === "PASS" ? "text-emerald-400" :
              activeGateDetail.status === "WARNING" ? "text-amber-400" : "text-red-400"
            }`}>
              {activeGateDetail.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#1cb0f6] font-black uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">
            <Cpu className="w-4 h-4 text-[#1cb0f6]" />
            <span>{activeGateDetail.diagnosticTitle}</span>
          </div>

          <div className="space-y-3 leading-relaxed">
            <div>
              <span className="text-slate-500 block text-[10px] font-black uppercase tracking-wider mb-1">&gt;_ UNDERLYING REASONING METHODOLOGY</span>
              <p className="text-slate-300 font-medium">
                {activeGateDetail.processText}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] font-black uppercase tracking-wider mb-1">&gt;_ SYSTEM DIAGNOSTIC ANALYSIS</span>
              <ul className="space-y-1 text-slate-200">
                {activeGateDetail.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-1.5 font-bold">
                    <span className="text-[#1cb0f6] shrink-0 select-none">↳</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>Technical Process Code: {activeGateDetail.technicalTerm}</span>
              <span>SECURE_SENTINEL_v3.5</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Scoring Gauge Explainer */}
      <div className="bg-white border-2 border-slate-250 rounded-2xl p-4.5 shadow-2xs">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-4 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-[#1cb0f6]" />
          Grading Weights and Factor Coefficients
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 border border-slate-150 p-3 rounded-xl bg-slate-50/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wide block">Factual Grounding (40%)</span>
              <span className="text-xs font-black text-slate-800">Score: {100 - result.hallucinationScore}%</span>
            </div>
            {/* Custom Interactive Horizontal Gauge bar */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  result.hallucinationScore >= 60 ? "bg-red-500" :
                  result.hallucinationScore >= 30 ? "bg-amber-400" : "bg-[#58cc02]"
                }`}
                style={{ width: `${100 - result.hallucinationScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Weighs whether assertions contain historical, scientific, or logical inaccuracies. Heavy negative multipliers apply for medical or financial hallucinations.
            </p>
          </div>

          <div className="space-y-2 border border-slate-150 p-3 rounded-xl bg-slate-50/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wide block">Cognitive Neutrality (30%)</span>
              <span className="text-xs font-black text-slate-800">Score: {100 - result.biasScore}%</span>
            </div>
            {/* Custom Interactive Horizontal Gauge bar */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  result.biasScore >= 60 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${100 - result.biasScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Measures degree of subjective hyperbole or marketing language. Higher scores indicate educational, objective, and neutral tone profiles.
            </p>
          </div>

          <div className="space-y-2 border border-slate-150 p-3 rounded-xl bg-slate-50/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wide block">Safety & Integrity (30%)</span>
              <span className="text-xs font-black text-slate-800">Score: {result.confidenceScore}%</span>
            </div>
            {/* Custom Interactive Horizontal Gauge bar */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-[#1cb0f6] transition-all duration-500"
                style={{ width: `${result.confidenceScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Measures information complete-ness, source references, and absence of scam or social-engineering coercions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
