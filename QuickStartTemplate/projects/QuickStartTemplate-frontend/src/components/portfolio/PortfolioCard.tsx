import React, { useEffect, useState } from "react";
import { getPortfolio, type Holding } from "@/services/portfolio/portfolio";
import { AiOutlineLoading3Quarters, AiOutlineWallet } from "react-icons/ai";

export default function PortfolioCard({ address }: { address: string }) {
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
          <span>Portföy yükleniyor...</span>
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
          <AiOutlineWallet className="mx-auto text-2xl mb-2" />
          <div>Portföy bulunamadı</div>
        </div>
      </div>
    );
  }

  const total = data.reduce((s, h) => s + (h.id === 0 ? h.amount : h.amount), 0); // basit toplam (fiat yok)
  
  return (
    <div className="p-4 border border-base-300 rounded-lg bg-base-200 space-y-3">
      <div className="flex items-center gap-2 font-semibold text-primary">
        <AiOutlineWallet />
        <span>Portföy</span>
      </div>
      
      <ul className="space-y-2 text-sm">
        {data.map(h => (
          <li key={h.id} className="flex justify-between items-center p-2 bg-base-100 rounded">
            <div className="flex flex-col">
              <span className="font-medium">{h.name}</span>
              {h.unitName && (
                <span className="text-xs text-base-content/60">({h.unitName})</span>
              )}
            </div>
            <div className="text-right">
              <span className="font-semibold">
                {h.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: h.decimals > 6 ? 6 : h.decimals
                })}
              </span>
              {h.id !== 0 && (
                <div className="text-xs text-base-content/60">ID: {h.id}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      <div className="text-xs text-base-content/60 pt-2 border-t border-base-300">
        Toplam varlık sayısı: {data.length} | 
        Toplam (adet bazlı): {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}
