import React, { useState } from "react";
import { parse, makePlan, Plan } from "@/services/ai/agent";
import PlanPreview from "./PlanPreview";
import { AiOutlineRobot, AiOutlineSend, AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CommandBox() {
  const [text, setText] = useState("ALGO'larımı faize bağla, riski %5'i aşma");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const cmd = await parse(text);
      const p = await makePlan(cmd);
      setPlan(p);
    } catch (error) {
      console.error("Error:", error);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <AiOutlineRobot className="text-2xl text-primary" />
        <h3 className="text-lg font-semibold">Alvion AI Asistan</h3>
      </div>
      
      <div className="space-y-3">
        <textarea 
          className="w-full border border-base-300 rounded-lg p-3 bg-base-100 text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" 
          rows={3} 
          value={text} 
          onChange={e => setText(e.target.value)}
          placeholder="Türkçe olarak ne yapmak istediğinizi yazın..."
        />
        
        <button 
          onClick={run} 
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-content font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <AiOutlineSend />
          )}
          <span>{loading ? "İşleniyor..." : "Komutu Çöz & Planla"}</span>
        </button>
      </div>
      
      {plan && <PlanPreview plan={plan} />}
      
      <div className="text-xs text-base-content/60 mt-4 p-3 bg-base-200 rounded-lg">
        <strong>Örnek komutlar:</strong><br/>
        • "ALGO'larımı faize bağla"<br/>
        • "0.5 ALGO'yu USDC'ye çevir"<br/>
        • "Portföyümü %60 ALGO, %40 USDC yap"<br/>
        • "Risk limitini %3 yap"
      </div>
    </div>
  );
}
