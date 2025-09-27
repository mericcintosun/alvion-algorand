import React, { useEffect, useState } from 'react'
import { getPortfolio, type Holding } from '@/services/portfolio/portfolio'
import { AiOutlineLoading3Quarters, AiOutlineWallet } from 'react-icons/ai'

export default function PortfolioCard({ address }: { address: string }) {
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
          <span>Portföy yükleniyor...</span>
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
          <AiOutlineWallet className="mx-auto text-2xl mb-2" />
          <div>Portföy bulunamadı</div>
        </div>
      </div>
    )
  }

  const total = data.reduce((s, h) => s + (h.id === 0 ? h.amount : h.amount), 0) // basit toplam (fiat yok)

  return (
    <div className="rounded-xl p-6 shadow-lg space-y-4" style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}>
      <div className="flex items-center gap-3 font-bold text-lg" style={{ color: '#08c2b4' }}>
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#08c2b4' }}>
          <AiOutlineWallet className="text-white" />
        </div>
        <span>Portföy</span>
      </div>

      <ul className="space-y-3">
        {data.map((h) => (
          <li key={h.id} className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#404040' }}>
            <div className="flex flex-col">
              <span className="font-semibold text-white">{h.name}</span>
              {h.unitName && <span className="text-sm text-gray-400">({h.unitName})</span>}
            </div>
            <div className="text-right">
              <span className="font-bold text-lg" style={{ color: '#f95001' }}>
                {h.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: h.decimals > 6 ? 6 : h.decimals,
                })}
              </span>
              {h.id !== 0 && <div className="text-xs text-gray-400">ID: {h.id}</div>}
            </div>
          </li>
        ))}
      </ul>

      <div className="text-sm text-gray-400 pt-3 border-t" style={{ borderColor: '#555555' }}>
        Toplam varlık sayısı: <span className="font-semibold text-white">{data.length}</span> | Toplam (adet bazlı):{' '}
        <span className="font-semibold" style={{ color: '#f95001' }}>
          {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  )
}
