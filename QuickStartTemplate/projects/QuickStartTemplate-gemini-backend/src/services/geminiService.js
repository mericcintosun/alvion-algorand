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

  const systemInstruction = `Sen bir DeFi asistanısın. Kullanıcının Türkçe talimatlarını anlayıp yapılandırılmış JSON formatına çeviriyorsun.

Desteklenen intent'ler:
- STAKE_ALGO: ALGO'yu faize bağlama (Folks Finance xALGO)
- UNSTAKE_ALGO: Faizden ALGO çekme
- SWAP: Token değişimi (Tinyman)
- REBALANCE: Portföy dengeleme
- SET_RISK: Risk limiti belirleme

Örnekler:
- "ALGO'larımı faize bağla" → {intent: "STAKE_ALGO"}
- "ALGO'larımı faize bağla, riski %5'i aşma" → {intent: "STAKE_ALGO", riskLimitPct: 5}
- "0.5 ALGO'yu USDC'ye çevir" → {intent: "SWAP", fromAsset: "ALGO", toAsset: "USDC", amount: "0.5 ALGO"}
- "Portföyümü %60 ALGO, %40 USDC yap" → {intent: "REBALANCE", targetAllocation: [{asset: "ALGO", pct: 60}, {asset: "USDC", pct: 40}]}`;

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
