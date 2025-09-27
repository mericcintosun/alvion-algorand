import React, { useEffect, useState } from "react";
import { getPortfolio, type Holding } from "@/services/portfolio/portfolio";
import { AiOutlineLoading3Quarters, AiOutlinePieChart } from "react-icons/ai";

export default function PortfolioList({ address }: { address: string }) {
  const [data, setData] = useState<Holding[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPortfolio(address)
      .then(setData)
      .catch((err) => {
        console.error("Portfolio fetch error:", err);
        setError(err.message || "Portföy bilgileri alınamadı");
      })
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) {
    return (
      <div className="p-4 border border-base-300 rounded-lg bg-base-200">
        <div className="flex items-center gap-2 text-base-content/60">
          <AiOutlineLoading3Quarters className="animate-spin" />
          <span>Portföy dağılımı yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="text-red-600 dark:text-red-400 text-sm">
          ❌ {error}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 border border-base-300 rounded-lg bg-base-200">
        <div className="text-base-content/60 text-center">
          <AiOutlinePieChart className="mx-auto text-2xl mb-2" />
          <div>Portföy dağılımı bulunamadı</div>
        </div>
      </div>
    );
  }

  // ALGO'yu temel birim olarak kullan (basit yaklaşım)
  const algoTotal = data.find(h => h.id === 0)?.amount || 0;
  const totalValue = data.reduce((sum, h) => {
    // Basit yaklaşım: ALGO'yu 1:1, diğerlerini 0.1:1 olarak varsay
    return sum + (h.id === 0 ? h.amount : h.amount * 0.1);
  }, 0);

  const holdingsWithPercentage = data.map(h => ({
    ...h,
    percentage: totalValue > 0 ? ((h.id === 0 ? h.amount : h.amount * 0.1) / totalValue) * 100 : 0
  })).sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="p-4 border border-base-300 rounded-lg bg-base-200 space-y-3">
      <div className="flex items-center gap-2 font-semibold text-primary">
        <AiOutlinePieChart />
        <span>Portföy Dağılımı</span>
      </div>
      
      <div className="space-y-2">
        {holdingsWithPercentage.map(h => (
          <div key={h.id} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">
                {h.name} {h.unitName && `(${h.unitName})`}
              </span>
              <span className="font-semibold">
                {h.percentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(h.percentage, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-base-content/60">
              <span>
                {h.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: h.decimals > 6 ? 6 : h.decimals
                })}
              </span>
              {h.id !== 0 && (
                <span>ID: {h.id}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-base-content/60 pt-2 border-t border-base-300">
        Toplam varlık sayısı: {data.length} | 
        Toplam değer (ALGO bazlı): {totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}
