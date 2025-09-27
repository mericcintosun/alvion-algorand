import React from "react";
import type { Plan } from "@/services/ai/agent";

export default function PlanPreview({ plan }: { plan: Plan }) {
  return (
    <div className="border border-base-300 rounded-lg p-4 bg-base-200">
      <div className="font-semibold mb-3 text-primary flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        İşlem Önizleme
      </div>
      <ol className="space-y-2 list-decimal list-inside">
        {plan.steps.map((s, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold mr-2 text-base-content">
              {s.op === "QUOTE" && "💰 Fiyat Sorgula"}
              {s.op === "STAKE" && "🔒 Stake Et"}
              {s.op === "UNSTAKE" && "🔓 Unstake Et"}
              {s.op === "SWAP" && "🔄 Swap Yap"}
              {s.op === "SET_POLICY" && "🛡️ Politika Ayarla"}
              {s.op === "PREVIEW" && "👁️ Önizleme"}
            </span>
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1">
              {JSON.stringify(s.params, null, 2)}
            </code>
          </li>
        ))}
      </ol>
    </div>
  );
}
