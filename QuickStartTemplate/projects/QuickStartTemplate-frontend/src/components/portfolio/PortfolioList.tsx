import React, { useEffect, useState } from 'react'
import { getPortfolio, type Holding } from '@/services/portfolio/portfolio'
import { AiOutlineLoading3Quarters, AiOutlinePieChart } from 'react-icons/ai'

export default function PortfolioList({ address }: { address: string }) {
  const [data, setData] = useState<Holding[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPortfolio(address)
      .then(setData)
      .catch((err) => {
        console.error('Portfolio fetch error:', err)
        setError(err.message || 'Portföy bilgileri alınamadı')
      })
      .finally(() => setLoading(false))
  }, [address])

  if (loading) {
    return (
      <div className="p-4 border border-base-300 rounded-lg bg-base-200">
        <div className="flex items-center gap-2 text-base-content/60">
          <AiOutlineLoading3Quarters className="animate-spin" />
          <span>Portföy dağılımı yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="text-red-600 dark:text-red-400 text-sm">❌ {error}</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 border border-base-300 rounded-lg bg-base-200">
        <div className="text-base-content/60 text-center">
          <AiOutlinePieChart className="mx-auto text-2xl mb-2" />
          <div>Portföy dağılımı bulunamadı</div>
        </div>
      </div>
    )
  }

  // ALGO'yu temel birim olarak kullan (basit yaklaşım)
  const algoTotal = data.find((h) => h.id === 0)?.amount || 0
  const totalValue = data.reduce((sum, h) => {
    // Basit yaklaşım: ALGO'yu 1:1, diğerlerini 0.1:1 olarak varsay
    return sum + (h.id === 0 ? h.amount : h.amount * 0.1)
  }, 0)

  const holdingsWithPercentage = data
    .map((h) => ({
      ...h,
      percentage: totalValue > 0 ? ((h.id === 0 ? h.amount : h.amount * 0.1) / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="rounded-xl p-6 shadow-lg space-y-4" style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}>
      <div className="flex items-center gap-3 font-bold text-lg" style={{ color: '#08c2b4' }}>
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#08c2b4' }}>
          <AiOutlinePieChart className="text-white" />
        </div>
        <span>Portföy Dağılımı</span>
      </div>

      <div className="space-y-4">
        {holdingsWithPercentage.map((h) => (
          <div key={h.id} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-white">
                {h.name} {h.unitName && `(${h.unitName})`}
              </span>
              <span className="font-bold text-lg" style={{ color: '#f95001' }}>
                {h.percentage.toFixed(1)}%
              </span>
            </div>

            <div className="w-full rounded-full h-3" style={{ backgroundColor: '#404040' }}>
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(h.percentage, 100)}%`,
                  background: 'linear-gradient(90deg, #f95001, #08c2b4)',
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {h.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: h.decimals > 6 ? 6 : h.decimals,
                })}
              </span>
              {h.id !== 0 && <span>ID: {h.id}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400 pt-3 border-t" style={{ borderColor: '#555555' }}>
        Toplam varlık sayısı: <span className="font-semibold text-white">{data.length}</span> | Toplam değer (ALGO bazlı):{' '}
        <span className="font-semibold" style={{ color: '#f95001' }}>
          {totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  )
}
