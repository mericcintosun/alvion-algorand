import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../utils/config.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export async function generateText({ prompt, system }) {
  const model = genAI.getGenerativeModel({
    model: config.gemini.model || "gemini-1.5-flash",
  });

  const res = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: config.gemini.temperature,
      maxOutputTokens: config.gemini.maxOutputTokens,
      responseMimeType: "text/plain",
    },
    systemInstruction: system,
  });
  return res.response.text();
}

export async function* streamText({ prompt, system }) {
  const model = genAI.getGenerativeModel({
    model: config.gemini.model || "gemini-1.5-flash",
  });

  const stream = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: config.gemini.temperature,
      maxOutputTokens: config.gemini.maxOutputTokens,
      responseMimeType: "text/plain",
    },
    systemInstruction: system,
  });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}

// Structured output için yeni fonksiyon
export async function parseWithGemini(text, responseSchema) {
  console.log("[DEBUG] responseSchema being sent:", JSON.stringify(responseSchema, null, 2));

  const model = genAI.getGenerativeModel({
    model: config.gemini.model || "gemini-1.5-flash",
  });

  const systemInstruction = `You are a DeFi assistant. You understand user commands in English and convert them to structured JSON format.

Supported intents:
- STAKE_ALGO: Stake ALGO (Folks Finance xALGO)
- UNSTAKE_ALGO: Unstake ALGO
- SWAP: Token swap (Tinyman)
- REBALANCE: Portfolio rebalancing
- SET_RISK: Set risk limits

Examples:
- "Stake my ALGO" → {intent: "STAKE_ALGO"}
- "Stake my ALGO, don't exceed 0.5% slippage" → {intent: "STAKE_ALGO", riskLimitPct: 0.5}
- "Swap 0.5 ALGO to USDC" → {intent: "SWAP", fromAsset: "ALGO", toAsset: "USDC", amount: "0.5 ALGO"}
- "Rebalance my portfolio to 60% ALGO, 40% USDC" → {intent: "REBALANCE", targetAllocation: [{asset: "ALGO", pct: 60}, {asset: "USDC", pct: 40}]}`;

  const res = await model.generateContent({
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema, // <-- model JSON döndürür (schema'ya göre)
    },
    systemInstruction,
  });

  const out = res.response.text();
  return JSON.parse(out);
}
