import React, { useState, useEffect, useRef } from "react";
import { 
  Lightbulb, 
  X, 
  Send, 
  Trash2, 
  Volume2, 
  ArrowDown, 
  ShieldAlert,
  Terminal,
  RefreshCw
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
  emulated?: boolean;
}

interface ChatbotProps {
  onSpeak?: (text: string) => void;
}

export default function Chatbot({ onSpeak }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmulated, setIsEmulated] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested starting prompts
  const suggestions = [
    { label: "🛡️ Spot Phishing", prompt: "How can I spot advanced AI phishing emails?" },
    { label: "🗣️ Voice Clones", prompt: "What are the telltale signs of a synthetic voice clone?" },
    { label: "🤖 AI Hallucinations", prompt: "Why do AI models make up facts (hallucinate)?" },
    { label: "🧠 Project EVE", prompt: "Tell me how multi-agent ethical AI simulations work!" }
  ];

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sentinel_chatbot_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map string dates back to Date objects
        const hydrated = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(hydrated);
      } else {
        // Initial greeting message
        const welcome: Message = {
          id: "welcome",
          role: "model",
          text: "Greetings, Officer! I am your Sentinel AI Companion. Ask me anything about AI risk prevention, safety audits, deepfakes, or Project EVE. How can I assist you today?",
          timestamp: new Date()
        };
        setMessages([welcome]);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  // Save chat history to localStorage
  const saveHistory = (newMessages: Message[]) => {
    try {
      localStorage.setItem("sentinel_chatbot_history", JSON.stringify(newMessages));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      text: textToSend.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);
    setInputValue("");
    setLoading(true);

    try {
      // Map history into expected backend format [{ role: 'user' | 'model', text: '...' }]
      const apiHistory = updatedMessages.slice(0, -1).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: apiHistory
        })
      });

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        text: data.text || "I apologize, but I received an empty response.",
        timestamp: new Date(),
        emulated: data.emulated
      };

      if (data.emulated) {
        setIsEmulated(true);
      } else {
        setIsEmulated(false);
      }

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);

      // Trigger text-to-speech if active
      if (onSpeak && assistantMsg.text) {
        // Strip markdown before speaking for a cleaner vocal experience
        const cleanSpeech = assistantMsg.text
          .replace(/[*#`_]/g, "")
          .replace(/\[Local Emulation Mode\]/g, "")
          .substring(0, 150);
        onSpeak(cleanSpeech);
      }

    } catch (err: any) {
      console.error("Error communicating with chat endpoint:", err);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        text: "System communication latency detected. I was unable to connect to the active server route. Please make sure your dev server is active and the endpoint is responding.",
        timestamp: new Date()
      };
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your chat history?")) {
      const welcome: Message = {
        id: "welcome",
        role: "model",
        text: "Logs purged. Chat reset successfully. Ask me anything about AI risks and defense strategies!",
        timestamp: new Date()
      };
      setMessages([welcome]);
      localStorage.removeItem("sentinel_chatbot_history");
      if (onSpeak) {
        onSpeak("Chat history cleared.");
      }
    }
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (Sits securely above bottom nav bar: bottom-20) */}
      <div className="fixed bottom-20 right-4 md:right-8 z-40 animate-fade-in" id="chatbot_fab_container">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (onSpeak) {
              onSpeak(isOpen ? "Closing companion chat." : "Opening companion chat. Ask me anything!");
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-b-4 transition-all hover:scale-105 active:scale-95 cursor-pointer relative group ${
            isOpen 
              ? "bg-[#ff4b4b] border-red-800 text-white" 
              : "bg-amber-50 border-amber-500 hover:bg-amber-150 text-amber-600 shadow-lg shadow-amber-200/50"
          }`}
          id="chatbot_fab_trigger"
          title="Open AI Companion"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Lightbulb className="w-6 h-6 text-amber-500 fill-yellow-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* EXPANDED CHAT PANEL */}
      {isOpen && (
        <div 
          className="fixed bottom-36 right-4 md:right-8 z-40 w-[92vw] sm:w-[420px] max-h-[500px] h-[80vh] bg-white border-2 border-b-4 border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up text-slate-800"
          id="chatbot_panel"
        >
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200 shadow-xs">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-yellow-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight flex items-center gap-1.5">
                  Companion Core
                  <span className="w-2 h-2 rounded-full bg-[#58cc02]" title="Active status" />
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Powered by Gemini 3.5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                title="Reset log history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa] scrollbar-thin scrollbar-thumb-slate-200">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2 animate-fade-in`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-250 flex items-center justify-center shrink-0 mt-0.5 shadow-xs select-none">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-yellow-400" />
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`p-3 rounded-2xl border-2 text-xs font-bold leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-[#1cb0f6]/5 border-[#1cb0f6]/25 text-slate-800 rounded-tr-none"
                          : "bg-white border-slate-200 text-slate-700 rounded-tl-none shadow-xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.emulated && (
                      <span className="text-[9px] text-amber-600 font-black uppercase mt-1 flex items-center gap-1 self-start">
                        <Terminal className="w-2.5 h-2.5" /> Local Cognitive Emulation Active
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 mt-1 self-end font-medium">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-start gap-2 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-250 flex items-center justify-center shrink-0 mt-0.5 shadow-xs select-none">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-yellow-400" />
                </div>
                <div className="bg-white border-2 border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs font-bold text-slate-400 flex items-center gap-1.5 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1cb0f6]" />
                  <span>Sentinel scanning options...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Predefined prompt suggestions */}
          {messages.length <= 2 && !loading && (
            <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.prompt)}
                  className="text-[10px] px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-250 hover:border-slate-300 text-slate-600 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Form Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Query Companion AI core..."
              disabled={loading}
              className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-[#1cb0f6] focus:bg-white text-xs font-bold p-2.5 rounded-xl outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className={`p-2.5 rounded-xl border-b-4 flex items-center justify-center transition-all cursor-pointer ${
                inputValue.trim() && !loading
                  ? "bg-[#1cb0f6] border-[#1899d6] text-white active:border-b-0 active:translate-y-[4px]"
                  : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
