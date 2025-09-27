export type Command = {
  intent: "STAKE_ALGO" | "UNSTAKE_ALGO" | "SWAP" | "REBALANCE" | "SET_RISK";
  riskLimitPct?: number | null;
  amount?: string | null;
  fromAsset?: string | null;
  toAsset?: string | null;
  targetAllocation?: { asset: string; pct: number }[] | null;
  notes?: string | null;
};

export type PlanStep = { 
  op: "QUOTE" | "STAKE" | "UNSTAKE" | "SWAP" | "SET_POLICY" | "PREVIEW"; 
  params: Record<string, any> 
};

export type Plan = { 
  steps: PlanStep[] 
};

const API = import.meta.env.VITE_AI_API_URL || "http://localhost:3001/ai";

export async function parse(text: string): Promise<Command> {
  const r = await fetch(`${API}/parse`, { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ text }) 
  });
  if (!r.ok) throw new Error(await r.text());
  const { command } = await r.json();
  return command;
}

export async function makePlan(command: Command): Promise<Plan> {
  const r = await fetch(`${API}/plan`, { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ command }) 
  });
  if (!r.ok) throw new Error(await r.text());
  const { plan } = await r.json();
  return plan;
}
