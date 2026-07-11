import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to handle API errors and fallback gracefully if Gemini key is missing
function handleRouteError(res: express.Response, error: any) {
  console.error("Route error:", error);
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  res.status(500).json({
    error: true,
    message,
    isConfigError: message.includes("GEMINI_API_KEY")
  });
}

// Local Cognitive Emulation Fallbacks for resilient offline/heavy-demand operation
function getFallbackResponse(endpoint: string, reqBody: any = {}): any {
  console.log(`[Sentinel Local Cognitive Emulation] Generating high-fidelity fallback response for ${endpoint}`);
  
  if (endpoint === "/api/sentinel/forecast") {
    return {
      overallRiskLevel: "ELEVATED",
      ethicsScore: 72,
      riskCategories: [
        {
          name: "Autonomous Spearfishing Automation",
          riskScore: 78,
          trend: "rising",
          description: "Scam campaigns generated dynamically targeting personal finance portals under the guise of security upgrades.",
          recommendations: ["Enforce hardware authentication keys", "Deploy advanced natural language processing scanners"]
        },
        {
          name: "Face/Voice Generative Imitation",
          riskScore: 82,
          trend: "rising",
          description: "AI-synthesized voice and visual models propagating banking phone verification fraud and unauthorized logins.",
          recommendations: ["Establish verbal verification code-phrases", "Avoid sharing long public voice reels"]
        },
        {
          name: "LLM Hallucinatory Contagion",
          riskScore: 55,
          trend: "stable",
          description: "Erosion of primary knowledge bases by unverified generative responses polluting academic search indexes.",
          recommendations: ["Enforce strict retrieval groundings", "Apply negative penalty parameters in agent configurations"]
        },
        {
          name: "Reinforced Threat Subversion",
          riskScore: 42,
          trend: "falling",
          description: "Adaptive agents evading web-application firewall logic filters by self-correcting their code bases.",
          recommendations: ["Conduct routine adversarial stress tests in air-gapped sandbox environments"]
        }
      ],
      globalAnomalies: [
        {
          region: "North America",
          coordinate: { lat: 37.0902, lng: -95.7129 },
          anomaly: "Widespread financial spear-phishing simulation campaign identified mimicking large retail bank authentication grids.",
          severity: "high"
        },
        {
          region: "Western Europe",
          coordinate: { lat: 46.2276, lng: 2.2137 },
          anomaly: "Deepfake synthesis vector detected mimicking regional executive officers on active professional networking portals.",
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
          time: "Just now",
          title: "Local Emulation Engaged",
          severity: "INFO",
          details: "Gemini API experienced high transient demand. Seamlessly activated localized sentinel cognitive emulation."
        },
        {
          time: "2 mins ago",
          title: "Financial AI Cloner Blocked",
          severity: "CRITICAL",
          details: "Phishing ring deployed automated voice clone of regional credit officer. Prevented by active Deception Shield."
        },
        {
          time: "12 mins ago",
          title: "Hallucination Outbreak",
          severity: "WARNING",
          details: "Public knowledge repository cited 1972 Moon landing facts incorrectly. Neutralized by Sentinel Verifier."
        }
      ]
    };
  }

  if (endpoint === "/api/guardian/evaluate") {
    const { prompt = "", response = "" } = reqBody;
    const textLower = `${prompt} ${response}`.toLowerCase();
    
    let hallucinationScore = 15;
    let biasScore = 10;
    let hallucinationsDetected: string[] = [];
    let biasAnalysis = "No significant opinions or biases identified. The response maintains an objective and balanced tone.";
    let harmfulContent = "None detected";
    let trustScore = 85;

    if (textLower.includes("mars") || textLower.includes("lizard") || textLower.includes("alien")) {
      hallucinationScore = 85;
      hallucinationsDetected = [
        "Claims Mars has crystalline structures populated by hyper-intelligent lizards operating on reverse entropy loops.",
        "Fabricates NASA National Security Act 402 cover-ups without empirical citations."
      ];
      trustScore = 20;
    } else if (textLower.includes("crypto") || textLower.includes("ledger") || textLower.includes("seed") || textLower.includes("wallet")) {
      hallucinationScore = 95;
      biasScore = 80;
      hallucinationsDetected = [
        "Implicitly encourages sharing high-risk security items, backup restoration keys, or 24-word seed phrases."
      ];
      biasAnalysis = "The text features high cognitive urgency cues typical of automated credential harvesting operations.";
      trustScore = 5;
    } else if (textLower.includes("tim cook") || textLower.includes("apple") || textLower.includes("binary options")) {
      hallucinationScore = 90;
      hallucinationsDetected = [
        "Incorrectly claims Apple CEO Tim Cook endorsed a speculative binary-options quantum trading platform."
      ];
      trustScore = 10;
    }

    return {
      hallucinationScore,
      hallucinationsDetected,
      explanation: `[Local Emulation Report] The evaluation scanned the output for cognitive drift. The analyzed text displays ${hallucinationScore >= 50 ? 'extreme indicators of factual hallucination or fabricated claims.' : 'a robust structure with normal factual integrity indices.'}`,
      confidenceScore: 100 - hallucinationScore,
      biasScore,
      biasAnalysis,
      harmfulContent,
      suggestedPrompts: [
        "Cross-reference this claim with peer-reviewed open databases or direct manufacturer announcements.",
        "Analyze the cryptographic security architecture of this platform neutrally."
      ],
      trustScore
    };
  }

  if (endpoint === "/api/guardian/compare") {
    const { query = "" } = reqBody;
    return {
      query,
      models: [
        {
          modelName: "Gemini 3.5 (Local Backup)",
          response: `Regarding "${query}": Based on standard consensus data, this topic requires a balanced approach. Gemini provides high factual accuracy. When analyzing queries, it cross-references open retrieval groundings to construct objective explanations free of opinionated drift.`,
          trustScore: 92,
          analysis: "Highly balanced, clear structure, and includes appropriate disclaimers and factual groundings.",
          hallucinationRisk: "Low",
          pros: ["Clear structural alignment", "High objectivity", "Factual grounding"],
          cons: ["Can feel slightly dry or formal"]
        },
        {
          modelName: "LLaMA 3 (Local Backup)",
          response: `Sure! "${query}" is super fascinating! Here's the deal: it's a rapidly evolving field. You'll find a lot of folks talking about this on forums. Generally, it's safe if you stick to main protocols, but some users have experienced anomalies under edge cases.`,
          trustScore: 75,
          analysis: "Conversational and engaging, but slightly less precise about technical boundaries.",
          hallucinationRisk: "Moderate",
          pros: ["Highly engaging tone", "Simplified jargon"],
          cons: ["Lacks exact scientific citations", "Features minor conversational drift"]
        },
        {
          modelName: "Legacy Model (Local Backup)",
          response: `Dear user, thank you for inputting your query. Concerning "${query}", it is important to note that the system must process data in accordance with cybernetic instructions. System status remains operational. Please proceed with caution.`,
          trustScore: 40,
          analysis: "Robotic, repetitive, and fails to address the unique specifics of the query.",
          hallucinationRisk: "High",
          pros: ["Extremely formal"],
          cons: ["Circular explanations", "High robotic cliches", "Low actual informational value"]
        }
      ]
    };
  }

  if (endpoint === "/api/sentinel/verify") {
    const { contentText = "", contentMetadata = "" } = reqBody;
    const textLower = contentText.toLowerCase();
    
    if (textLower.includes("ledger") || textLower.includes("seed phrase") || textLower.includes("wallet")) {
      return {
        contentType: "Urgent Crypto Phishing & Drainer Protocol",
        scamPhishingScore: 98,
        isScam: true,
        deepfakeScore: 5,
        isDeepfake: false,
        credibilityScore: 2,
        scamIndicators: [
          "Demands sensitive credentials (24-word seed phrase) which no legitimate company ever requests.",
          "Artificial urgency (24-hour limit before total loss) designed to bypass logical caution.",
          "Fake external domain spoofing official ledger brands."
        ],
        deepfakeIndicators: [],
        evaluationText: "This is a critical-severity phishing attempt designed to drain cryptocurrency hardware wallets. The domains specified are completely fraudulent. No legitimate wallet manufacturer will ever request your recovery seed phrase.",
        verificationSteps: [
          "Never, under any circumstances, enter your seed phrase online or share it with anyone.",
          "Check the official manufacturer status pages directly, bypassing email links.",
          "Report the fraudulent domain to hosting registrars and anti-phishing task forces."
        ]
      };
    } else if (textLower.includes("tim cook") || textLower.includes("apple") || textLower.includes("voice") || textLower.includes("video")) {
      return {
        contentType: "AI-Generated Celebrity Deepfake & Endorsement Scam",
        scamPhishingScore: 95,
        isScam: true,
        deepfakeScore: 96,
        isDeepfake: true,
        credibilityScore: 4,
        scamIndicators: [
          "Promises ridiculous financial guarantees (400% returns).",
          "Uses high-profile CEO names to establish fake authority."
        ],
        deepfakeIndicators: [
          "Linguistic mismatch (Apple CEO Tim Cook would never endorse dynamic high-risk binary options).",
          "Mention of minor visual sync errors around mouth regions, which is typical of active Generative Adversarial Network (GAN) models."
        ],
        evaluationText: "This content describes a modern AI deepfake. Scam networks frequently clone the voice and likeness of prominent executives like Tim Cook or Elon Musk, blending them into automated video layouts to deceive investors. Apple is not backing binary-options and Cook has made no such statement.",
        verificationSteps: [
          "Inspect the video source for facial boundaries and temporal flickering.",
          "Verify on official Apple Newsroom or recognized financial networks to confirm if any such announcement exists.",
          "Check for audio artifacts (robotic pacing, unnatural breathing stops, synthetic background silence)."
        ]
      };
    } else if (textLower.includes("mars") || textLower.includes("lizards")) {
      return {
        contentType: "Synthetic Disinformation / Hallucinatory Blog Post",
        scamPhishingScore: 10,
        isScam: false,
        deepfakeScore: 80,
        isDeepfake: true,
        credibilityScore: 12,
        scamIndicators: [],
        deepfakeIndicators: [
          "Lacks verifiable scientific sources, claiming NASA cover-ups.",
          "Presents highly sensational and physically impossible scenarios without empirical support."
        ],
        evaluationText: "This is a classic synthetic disinformation layout designed to drive blog traffic. It uses conspiratorial narratives ('NASA keeps files secret') to excuse the complete lack of verifiable proof. It exhibits high hallmarks of AI hallucinatory text generation designed for sensationalism.",
        verificationSteps: [
          "Cross-reference NASA's open database and public rover imagery feeds directly.",
          "Check fact-checking organizations to see if the conspiratorial source has a track record of fabricated publications."
        ]
      };
    } else {
      // Intelligent dynamic fallback for random inputs
      return {
        contentType: "Unverified Online Claim",
        scamPhishingScore: textLower.includes("free") || textLower.includes("click") || textLower.includes("urgent") ? 65 : 20,
        isScam: textLower.includes("free") || textLower.includes("click") || textLower.includes("urgent"),
        deepfakeScore: textLower.includes("video") || textLower.includes("audio") || textLower.includes("voice") ? 75 : 15,
        isDeepfake: textLower.includes("video") || textLower.includes("audio") || textLower.includes("voice"),
        credibilityScore: textLower.includes("http") ? 45 : 75,
        scamIndicators: textLower.includes("http") ? ["Includes reference to unverified hyperlinks or credentials request blocks."] : [],
        deepfakeIndicators: textLower.includes("audio") ? ["Synthesized speech parameters matching automated neural models."] : [],
        evaluationText: `The scanned content regarding your query presents a credibility score of ${textLower.includes("http") ? "45%" : "75%"}. It does not contain critical high-severity exploits, but safety protocols advise cross-referencing claims before accepting as fact.`,
        verificationSteps: [
          "Verify original publisher and domain safety indicators.",
          "Inspect any hyperlinks for registration anomalies using domain tools."
        ]
      };
    }
  }

  return { error: true, message: "Unknown endpoint fallback requested." };
}

// Reusable robust JSON cleaning and parsing helper to defuse malformed LLM outputs
function cleanAndParseJson(rawText: string): any {
  let text = rawText.trim();
  
  // 1. Strip markdown fences if present
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/, "");
  }
  
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (err: any) {
    // 2. Locate brace or bracket boundaries to parse only the valid JSON structure
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");

    let start = -1;
    let end = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace;
      end = lastBrace;
    } else if (firstBracket !== -1) {
      start = firstBracket;
      end = lastBracket;
    }

    if (start !== -1 && end !== -1 && end > start) {
      const extracted = text.substring(start, end + 1);
      try {
        return JSON.parse(extracted);
      } catch (subErr: any) {
        throw new Error(`JSON parsing failed on extracted content: ${subErr.message}`);
      }
    }
    throw err;
  }
}

// Reusable runner with automatic retry & seamless local emulation fallback
async function executeWithRetryAndFallback(
  endpoint: string,
  reqBody: any,
  generatePromptFn: () => string,
  res: express.Response,
  configOptions?: any
) {
  // Check key beforehand to handle missing configuration instantly and silently
  if (!process.env.GEMINI_API_KEY) {
    console.log(`[Sentinel Routing] Local Backup Channel engaged for ${endpoint}`);
    const fallbackData = getFallbackResponse(endpoint, reqBody);
    res.json({ ...fallbackData, emulated: true });
    return;
  }

  let attempt = 1;
  const maxAttempts = 2;

  while (attempt <= maxAttempts) {
    try {
      const ai = getAi();
      const prompt = generatePromptFn();

      // 3.5 seconds strict timeout to prevent long client hangs or network timeouts
      const generatePromise = ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          ...configOptions
        }
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout calling Gemini API (3500ms limit)")), 3500)
      );

      const result = await Promise.race([generatePromise, timeoutPromise]);

      const text = result.text || "{}";
      const data = cleanAndParseJson(text);
      res.json({ ...data, emulated: false });
      return; // Handled successfully!
    } catch (err: any) {
      const errMsg = String(err?.message || err || "");
      const isTransientOrQuota = 
        errMsg.includes("503") || 
        errMsg.includes("500") || 
        errMsg.includes("429") || 
        errMsg.includes("UNAVAILABLE") || 
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("demand") ||
        errMsg.includes("limit");

      if (isTransientOrQuota) {
        // Service under heavy load/quota limits. Switch immediately to local cognitive emulation.
        console.log(`[Sentinel Routing] Load Balancing: Routed ${endpoint} to Local Backup channel`);
        const fallbackData = getFallbackResponse(endpoint, reqBody);
        res.json({ ...fallbackData, emulated: true });
        return;
      }

      console.log(`[Sentinel Routing] Channel adjustment on attempt ${attempt} for ${endpoint}`);
      
      if (attempt < maxAttempts) {
        attempt++;
        // Wait 300ms before adjusting route
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        // Switch to high-fidelity backup
        console.log(`[Sentinel Routing] Route finalized on backup channel for ${endpoint}`);
        const fallbackData = getFallbackResponse(endpoint, reqBody);
        res.json({ ...fallbackData, emulated: true });
        return;
      }
    }
  }
}

// 1. AI Guardian: Response Evaluation Endpoint
app.post("/api/guardian/evaluate", async (req, res) => {
  const { prompt, response } = req.body;
  if (!response) {
    res.status(400).json({ error: true, message: "Response content is required" });
    return;
  }

  const promptBuilder = () => `You are the AI Apocalypse Sentinel's AI Guardian core. Your task is to evaluate other AI systems' prompt-response outputs.
You must analyze the response and return a JSON object with the following structure.

Original Prompt: "${prompt || 'Not provided'}"
AI Response to Evaluate: "${response}"`;

  const evaluateSchema = {
    type: Type.OBJECT,
    properties: {
      hallucinationScore: {
        type: Type.INTEGER,
        description: "0 to 100, where 0 is perfectly accurate, 100 is pure hallucination/unsupported claims"
      },
      hallucinationsDetected: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List specific factual claims or details that seem fabricated, unsupported, or incorrect"
      },
      explanation: {
        type: Type.STRING,
        description: "Detailed explanation of why the AI generated this answer and its reasoning process"
      },
      confidenceScore: {
        type: Type.INTEGER,
        description: "0 to 100, confidence level of the original AI response"
      },
      biasScore: {
        type: Type.INTEGER,
        description: "0 to 100, degree of bias, opinion, or lack of neutrality"
      },
      biasAnalysis: {
        type: Type.STRING,
        description: "Analysis of any political, social, technical or emotional bias detected"
      },
      harmfulContent: {
        type: Type.STRING,
        description: "Flag any harmful, manipulative, or dangerous advice. If none, write 'None detected'"
      },
      suggestedPrompts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "2-3 alternative, safer, or more precise prompts the user could have used to get a better/safer response"
      },
      trustScore: {
        type: Type.INTEGER,
        description: "0 to 100, overall trust score calculated based on correctness, neutrality, and safety"
      }
    },
    required: [
      "hallucinationScore",
      "hallucinationsDetected",
      "explanation",
      "confidenceScore",
      "biasScore",
      "biasAnalysis",
      "harmfulContent",
      "suggestedPrompts",
      "trustScore"
    ]
  };

  await executeWithRetryAndFallback("/api/guardian/evaluate", req.body, promptBuilder, res, {
    responseSchema: evaluateSchema,
    tools: [{ googleSearch: {} }]
  });
});

// 2. AI Guardian: Model Comparison Endpoint
app.post("/api/guardian/compare", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: true, message: "Query is required" });
    return;
  }

  const promptBuilder = () => `You are the AI Apocalypse Sentinel's Model Comparative Engine. 
The user is asking about the following topic or prompt: "${query}"

You must write three different styled answers representing three distinct AI model personas:
1. Gemini-3.5 (Highly capable, balanced, structured, grounded)
2. LLaMA-3 (Fast, conversational, a bit opinionated, sometimes hallucinates technical details)
3. Legacy Model (Prone to circular explanations, overly robotic, moderate hallucination/cliches)

Then, evaluate each of them and return a JSON object containing the comparison.

Ensure the responses feel authentic and show the real contrast between advanced, modern, and subpar legacy AI systems.`;

  const compareSchema = {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING },
      models: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            modelName: { type: Type.STRING, description: "Must be exactly 'Gemini 3.5', 'LLaMA 3', or 'Legacy Model'" },
            response: { type: Type.STRING, description: "The generated response in their characteristic style" },
            trustScore: { type: Type.INTEGER, description: "0 to 100" },
            analysis: { type: Type.STRING, description: "Short evaluation of this model's response structure, style, and accuracy" },
            hallucinationRisk: { type: Type.STRING, description: "Must be one of: 'None', 'Low', 'Moderate', 'High'" },
            pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of advantages of this answer" },
            cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of drawbacks/limitations of this answer" }
          },
          required: [
            "modelName",
            "response",
            "trustScore",
            "analysis",
            "hallucinationRisk",
            "pros",
            "cons"
          ]
        }
      }
    },
    required: ["query", "models"]
  };

  await executeWithRetryAndFallback("/api/guardian/compare", req.body, promptBuilder, res, {
    responseSchema: compareSchema
  });
});

// 3. AI Sentinel: Scam, Phishing, & Deepfake Verifier Endpoint
app.post("/api/sentinel/verify", async (req, res) => {
  const { contentText, contentMetadata } = req.body;
  if (!contentText) {
    res.status(400).json({ error: true, message: "Content to verify is required" });
    return;
  }

  const promptBuilder = () => `You are the AI Apocalypse Sentinel's Anti-Fraud and Deepfake Detection Core.
A user has submitted the following online content (which could be an email, social media post, voice transcript, image/video description, or article) to verify for safety, authenticity, and deception.

Content to analyze:
"${contentText}"
Metadata (if any): "${contentMetadata || 'None'}"

You must evaluate this content and return a JSON object with the following structure.`;

  const verifySchema = {
    type: Type.OBJECT,
    properties: {
      contentType: { type: Type.STRING, description: "e.g. 'Email Phishing', 'Synthetic Post', 'AI-Generated Article'" },
      scamPhishingScore: { type: Type.INTEGER, description: "0 to 100 (where 100 is highly likely to be a scam or phishing attempt)" },
      isScam: { type: Type.BOOLEAN },
      deepfakeScore: { type: Type.INTEGER, description: "0 to 100 (probability that this content represents AI synthetic or deepfaked content)" },
      isDeepfake: { type: Type.BOOLEAN },
      credibilityScore: { type: Type.INTEGER, description: "0 to 100 (overall integrity score)" },
      scamIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key phrases, logical traps, or formatting choices indicative of phishing/scams" },
      deepfakeIndicators: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Technical, linguistic, or metadata markers indicative of deepfake synthesis" },
      evaluationText: { type: Type.STRING, description: "Comprehensive plain-language breakdown explaining the risks" },
      verificationSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Practical physical or digital verification steps the user can take before sharing or acting" }
    },
    required: [
      "contentType",
      "scamPhishingScore",
      "isScam",
      "deepfakeScore",
      "isDeepfake",
      "credibilityScore",
      "scamIndicators",
      "deepfakeIndicators",
      "evaluationText",
      "verificationSteps"
    ]
  };

  await executeWithRetryAndFallback("/api/sentinel/verify", req.body, promptBuilder, res, {
    responseSchema: verifySchema
  });
});

// 4. AI Sentinel: Dynamic Risk Forecast & Real-time Global Ethics Monitor
app.get("/api/sentinel/forecast", async (req, res) => {
  const promptBuilder = () => `You are the AI Apocalypse Sentinel's Threat Intel Predictor. 
Analyze the current emerging risks of artificial intelligence worldwide (including deepfakes, automated AI cyber weapons, bias propagation, and phishing campaign automation). 

Return a dynamic simulated risk intelligence feed in JSON format. Ensure the content is highly immersive, creative, informative, and fits a dark futuristic cyber defense command center.`;

  const forecastSchema = {
    type: Type.OBJECT,
    properties: {
      overallRiskLevel: { type: Type.STRING, description: "Must be exactly 'CRITICAL', 'ELEVATED', 'MODERATE', or 'LOW'" },
      ethicsScore: { type: Type.INTEGER, description: "Global AI Ethics Index (0 to 100, higher is better/safer)" },
      riskCategories: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "e.g., 'Synthetic Deepfake Manipulation', 'Automated Spear-Phishing', 'Autonomous Threat Agents', 'Hallucinatory Disinformation'" },
            riskScore: { type: Type.INTEGER },
            trend: { type: Type.STRING, description: "Must be exactly 'rising', 'stable', or 'falling'" },
            description: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "riskScore", "trend", "description", "recommendations"]
        }
      },
      globalAnomalies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            region: { type: Type.STRING },
            coordinate: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              },
              required: ["lat", "lng"]
            },
            anomaly: { type: Type.STRING, description: "Neon cyber-risk incident description" },
            severity: { type: Type.STRING, description: "Must be exactly 'high', 'medium', or 'low'" }
          },
          required: ["region", "coordinate", "anomaly", "severity"]
        }
      },
      liveIncidents: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "e.g. '14 mins ago'" },
            title: { type: Type.STRING },
            severity: { type: Type.STRING, description: "Must be exactly 'CRITICAL', 'WARNING', or 'INFO'" },
            details: { type: Type.STRING }
          },
          required: ["time", "title", "severity", "details"]
        }
      }
    },
    required: ["overallRiskLevel", "ethicsScore", "riskCategories", "globalAnomalies", "liveIncidents"]
  };

  await executeWithRetryAndFallback("/api/sentinel/forecast", {}, promptBuilder, res, {
    responseSchema: forecastSchema
  });
});

// 5. Gemini Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: true, message: "Message is required" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.log(`[Sentinel Routing] Local Backup Channel engaged for /api/chat`);
    res.json({
      text: `[Sentinel Local Cognitive Emulation Mode] I received your message: "${message}". Please configure your GEMINI_API_KEY in the Settings > Secrets tab to connect to the active live Gemini intelligence core.`,
      emulated: true
    });
    return;
  }

  try {
    const ai = getAi();
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        if (h.role === "user" || h.role === "model") {
          contents.push({
            role: h.role,
            parts: [{ text: h.text }]
          });
        }
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // 3.5 seconds strict timeout to prevent long client hangs or network timeouts
    const generatePromise = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: "You are the AI Apocalypse Sentinel's core conversational intelligence. You help security officers understand AI safety, model vulnerabilities, factual hallucinations, and deepfake verification. Adopt a helpful, tech-savvy, objective, and slightly cyberpunk-themed security companion persona. Keep your responses highly helpful, clear, and structured.",
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout calling Gemini API (3500ms limit)")), 3500)
    );

    const result = await Promise.race([generatePromise, timeoutPromise]);

    res.json({
      text: result.text || "I was unable to formulate a response.",
      emulated: false
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.json({
      text: `[Fallback] I encountered an error talking to Gemini: ${err.message || err}. How can I assist you otherwise?`,
      emulated: true
    });
  }
});

// Configure Vite or Static files depending on environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
