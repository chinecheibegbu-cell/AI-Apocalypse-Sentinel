import React, { useState } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  GraduationCap, 
  ArrowRight,
  RefreshCw,
  Volume2
} from "lucide-react";
import { SimScenario } from "../types";

interface SimulationsProps {
  onSpeak: (text: string) => void;
}

const EDUCATIONAL_SCENARIOS: SimScenario[] = [
  {
    id: "scen-1",
    title: "1. The Urgent Domain Redirect",
    type: "phishing",
    content: "You receive an urgent message on Slack from 'IT Support Helpdesk' containing this text:\n\n'CRITICAL: A regional network disruption was detected on your IP. You must authenticate immediately via our backup Okta connector [http://okta-login-security-portal.com] to prevent credentials suspension.'\n\nWhat is the most secure action to take?",
    options: [
      {
        text: "Click the link and authenticate immediately to prevent account suspension.",
        isCorrect: false,
        explanation: "Incorrect. Suspicious urgent language accompanied by non-standard domains like okta-login-security-portal.com are key traits of spear-phishing credential harvesting."
      },
      {
        text: "Ignore the message entirely and do nothing.",
        isCorrect: false,
        explanation: "Partially correct but incomplete. While you shouldn't click, simply ignoring it leaves your colleagues exposed. The threat must be actively reported."
      },
      {
        text: "Ignore the link. Contact your company's actual internal IT department via official verified channels to report the message.",
        isCorrect: true,
        explanation: "Correct! Standard corporate support units will never ask for urgent redirection to external domain registrations. Forwarding this to security prevents wider team exploits."
      }
    ],
    sourceHint: "Notice the domain suffix 'okta-login-security-portal.com'. Fake domains often pad brand words together."
  },
  {
    id: "scen-2",
    title: "2. The Celebrity Quantum Token",
    type: "deepfake",
    content: "A viral clip on social media features a famous tech pioneer speaking with a perfect voice matches. They state:\n\n'I am launching a specialized blockchain fund with guaranteed 5x returns. Connect your Web3 wallet to this portal immediately to claim your starting token.'\n\nThe video looks crisp, but their head stays centered perfectly, and their eyes blink very rarely (once in 30 seconds).\n\nWhat is the primary indicator of this being an AI synthetic clone?",
    options: [
      {
        text: "The guarantee of 5x returns.",
        isCorrect: false,
        explanation: "Incorrect. While 5x guarantees are a red-flag financial scam indicator, it is a psychological indicator rather than a structural/biological deepfake indicator."
      },
      {
        text: "The unnatural eye-blinking rate and restricted neck/head alignments.",
        isCorrect: true,
        explanation: "Correct! Early and mid-generation AI deepfake engines often struggle with human biological micro-movements, resulting in unnatural blinking, mouth synchronization errors, and floating outlines."
      },
      {
        text: "The sound level of their voice.",
        isCorrect: false,
        explanation: "Incorrect. Voice cloning algorithms can recreate authentic waveforms and spectral characteristics perfectly, making audio volume alone highly unreliable for deepfake detections."
      }
    ],
    sourceHint: "Look at the biological rhythms of the speaker. Smooth, static postures and low blinking counts are major synthesis markers."
  },
  {
    id: "scen-3",
    title: "3. The aligned automated defense prompt",
    type: "bias",
    content: "You are designing safety prompt filters for a public customer-support LLM chatbot. You notice that when users ask controversial questions about public policy, the bot tends to regurgitate heavily opinionated answers instead of keeping neutral stances.\n\nWhich prompt engineering technique represents the best mitigation strategy to enforce unbiased responses?",
    options: [
      {
        text: "Instruct the system: 'Do not discuss public policy, answer other things.'",
        isCorrect: false,
        explanation: "Incorrect. This causes severe context censorship and limits the helper's capabilities, leading to poor user satisfaction indices."
      },
      {
        text: "Inject a system prompt: 'You are a completely objective agent. Present balanced views on policy, detailing different viewpoints neutrally, avoiding loaded vocabulary, and stating when claims lack consensus.'",
        isCorrect: true,
        explanation: "Correct! Outlining precise boundaries, requiring multiple balanced viewpoints, and specifying grammatical tone constraints (avoiding loaded adjectives) effectively prevents LLM opinion cascades."
      },
      {
        text: "Let the model decide what is neutral by itself, as LLMs have built-in cognitive logic alignment filters anyway.",
        isCorrect: false,
        explanation: "Incorrect. Models operate on statistical probabilities of training tokens, which often include deep social, technical, or political biases unless strict system-prompt rails are actively declared."
      }
    ],
    sourceHint: "Enforce a positive system constitution requiring multiple neutral perspective weights rather than generic warnings."
  }
];

export default function Simulations({ onSpeak }: SimulationsProps) {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [scenariosPlayed, setScenariosPlayed] = useState<string[]>([]);

  const scenario = EDUCATIONAL_SCENARIOS[activeScenarioIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIdx !== null) return; // Answer already locked
    setSelectedOptionIdx(idx);
    
    const option = scenario.options[idx];
    if (option.isCorrect) {
      setScore(prev => prev + 1);
    }

    if (!scenariosPlayed.includes(scenario.id)) {
      setScenariosPlayed(prev => [...prev, scenario.id]);
    }
  };

  const handleNext = () => {
    setSelectedOptionIdx(null);
    if (activeScenarioIdx < EDUCATIONAL_SCENARIOS.length - 1) {
      setActiveScenarioIdx(prev => prev + 1);
    } else {
      // Reset
      setActiveScenarioIdx(0);
      setScore(0);
      setScenariosPlayed([]);
    }
  };

  const handleReset = () => {
    setActiveScenarioIdx(0);
    setSelectedOptionIdx(null);
    setScore(0);
    setScenariosPlayed([]);
  };

  const currentOption = selectedOptionIdx !== null ? scenario.options[selectedOptionIdx] : null;

  return (
    <div className="space-y-6" id="simulations_root">
      
      <div className="border border-slate-200 bg-white rounded-xl p-5 font-mono shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              AI Safety Training Quiz
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Practice spotting online scams, deepfakes, and automated bias in a safe space.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded text-xs text-slate-700">
              Your Score: <span className="text-emerald-700 font-bold">{score}/{scenariosPlayed.length || 0}</span>
            </div>
            <button 
              onClick={handleReset}
              className="p-1 hover:bg-slate-100 border border-slate-200 rounded transition text-slate-450 hover:text-slate-800 bg-white"
              title="Reset simulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Tracker dots */}
        <div className="flex items-center gap-2 mb-6">
          {EDUCATIONAL_SCENARIOS.map((sc, i) => (
            <div 
              key={sc.id} 
              className={`h-1.5 flex-1 rounded-full ${
                i === activeScenarioIdx ? "bg-emerald-500" :
                scenariosPlayed.includes(sc.id) ? "bg-emerald-100 border border-emerald-200" : "bg-slate-100"
              }`}
            />
          ))}
        </div>

        {/* Playable Scenario Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main content prompt */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                scenario.type === "phishing" ? "bg-red-50 text-red-700 border-red-200" :
                scenario.type === "deepfake" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-purple-50 text-purple-700 border-purple-200"
              }`}>
                {scenario.type} case
              </span>
              <span className="text-xs text-slate-400">Scenario {activeScenarioIdx + 1} of {EDUCATIONAL_SCENARIOS.length}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800">
              {scenario.title}
            </h3>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg">
              <span className="text-[9px] text-slate-400 block uppercase mb-1 font-bold">EXAMPLE MESSAGE OR POST:</span>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {scenario.content}
              </p>
            </div>

            {/* Hint Callout */}
            {selectedOptionIdx === null && (
              <div className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-lg text-[11px] text-slate-500 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-700">Safety Tip:</strong> {scenario.sourceHint}</span>
              </div>
            )}
          </div>

          {/* Options Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">CHOOSE THE SAFEST OPTION</span>
              
              {scenario.options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const showCorrect = selectedOptionIdx !== null && opt.isCorrect;
                const showWrong = selectedOptionIdx !== null && isSelected && !opt.isCorrect;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={selectedOptionIdx !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 text-xs leading-relaxed transition-all duration-150 cursor-pointer ${
                      selectedOptionIdx === null 
                        ? "border-slate-200 bg-white hover:border-[#1cb0f6] hover:bg-sky-50/20 hover:text-slate-900"
                        : showCorrect 
                          ? "border-[#58cc02] bg-emerald-50 text-emerald-800"
                          : showWrong 
                            ? "border-red-400 bg-red-50 text-red-800"
                            : isSelected
                              ? "border-slate-300 bg-slate-100 text-slate-500"
                              : "border-slate-100 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border-2 shrink-0 ${
                        selectedOptionIdx === null 
                          ? "border-slate-200 bg-white text-slate-500"
                          : showCorrect 
                            ? "border-[#46a302] bg-[#58cc02] text-white"
                            : showWrong 
                              ? "border-red-400 bg-red-500 text-white"
                              : "border-slate-300 bg-slate-100 text-slate-400"
                      }`}>{String.fromCharCode(65 + idx)}</span>
                      <span className="font-bold">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Continue */}
            {selectedOptionIdx !== null && currentOption && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2 animate-fade-in">
                  {currentOption.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-[#46a302] shrink-0 mt-0.5 animate-bounce" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`text-xs font-bold block uppercase ${currentOption.isCorrect ? "text-[#46a302]" : "text-red-700"}`}>
                      {currentOption.isCorrect ? "Correct! Excellent spotting!" : "Watch out for this trick!"}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-semibold">
                      {currentOption.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onSpeak(`Feedback: ${currentOption.explanation}`)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border-2 border-b-4 border-slate-200 rounded-xl text-[10px] text-slate-600 font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Read Explanation
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-[#58cc02] text-white border-b-4 border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-[4px] rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {activeScenarioIdx < EDUCATIONAL_SCENARIOS.length - 1 ? "Next Question" : "Restart Quiz"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
