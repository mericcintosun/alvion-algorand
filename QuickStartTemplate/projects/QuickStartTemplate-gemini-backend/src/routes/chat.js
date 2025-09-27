// chat.js
// Chat API routes for Gemini integration

import express from "express";
import { generateText, streamText } from "../services/geminiService.js";

const router = express.Router();

// System prompt for Algorand/DeFi context
const SYSTEM_PROMPT = `You are an expert AI assistant specialized in Algorand blockchain and DeFi (Decentralized Finance). 

Your expertise includes:
- Algorand blockchain technology and architecture
- DeFi protocols, yield farming, and liquidity provision
- Smart contracts and Algorand Standard Assets (ASAs)
- NFTs on Algorand
- Wallet management and transaction optimization
- Risk management in DeFi
- Turkish language support for Turkish users

Guidelines:
- Provide accurate, helpful information about Algorand and DeFi
- Be concise but thorough in explanations
- Use examples when helpful
- If asked about non-blockchain topics, politely redirect to Algorand/DeFi subjects
- Support both English and Turkish queries
- Always prioritize user security and best practices
- When discussing financial advice, emphasize that this is educational content only

Current context: You're helping users with Alvion, a DeFi application built on Algorand.`;

// Regular chat endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string",
      });
    }

    // Build conversation context
    let fullPrompt = message;

    if (conversationHistory.length > 0) {
      const historyContext = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      fullPrompt = `Previous conversation:\n${historyContext}\n\nCurrent message: ${message}`;
    }

    const response = await generateText({
      prompt: fullPrompt,
      system: SYSTEM_PROMPT,
    });

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate response",
      details: error.message,
    });
  }
});

// Streaming chat endpoint
router.post("/chat/stream", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string",
      });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    // Build conversation context
    let fullPrompt = message;

    if (conversationHistory.length > 0) {
      const historyContext = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      fullPrompt = `Previous conversation:\n${historyContext}\n\nCurrent message: ${message}`;
    }

    try {
      for await (const chunk of streamText({
        prompt: fullPrompt,
        system: SYSTEM_PROMPT,
      })) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      res.write(`data: [DONE]\n\n`);
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      res.write(
        `data: ${JSON.stringify({
          error: "Streaming failed",
          content: "Sorry, I encountered an error while streaming the response.",
        })}\n\n`
      );
    }

    res.end();
  } catch (error) {
    console.error("Stream chat API error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start streaming response",
      details: error.message,
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Gemini chat API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
