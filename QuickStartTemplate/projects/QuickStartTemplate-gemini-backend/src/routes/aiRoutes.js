import { Router } from "express";
import { parseWithGemini } from "../services/geminiService.js";
import { CommandSchema, PlanSchema } from "../services/commandSchema.js";
import { planFromCommand } from "../services/planner.js";

const r = Router();

// English natural language -> Command JSON
r.post("/parse", async (req, res) => {
  const { text } = req.body;
  try {
    const command = await parseWithGemini(text, CommandSchema);
    res.json({ command });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Komut -> Plan JSON (şimdilik backend tarafında deterministik)
r.post("/plan", async (req, res) => {
  try {
    const plan = planFromCommand(req.body.command);
    res.json({ plan });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Health check endpoint
r.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ai-command-parser" });
});

export default r;
