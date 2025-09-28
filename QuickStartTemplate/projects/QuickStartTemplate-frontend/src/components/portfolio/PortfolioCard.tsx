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
      <div className="p-4 border rounded-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
          <AiOutlineLoading3Quarters className="animate-spin" />
          <span>Portföy yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border rounded-2xl" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
        <div className="text-sm" style={{ color: '#dc2626' }}>❌ {error}</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 border rounded-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="text-center" style={{ color: '#6b7280' }}>
          <AiOutlineWallet className="mx-auto text-2xl mb-2" />
          <div>Portföy bulunamadı</div>
        </div>
      </div>
    )
  }

  const total = data.reduce((s, h) => s + (h.id === 0 ? h.amount : h.amount), 0) // basit toplam (fiat yok)

  return (
    <div className="rounded-2xl p-6 shadow-lg space-y-4 border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
      <div className="flex items-center gap-3 font-bold text-lg font-heading" style={{ color: '#2d2df1' }}>
        <div className="p-2 rounded-2xl" style={{ backgroundColor: '#2d2df1' }}>
          <AiOutlineWallet className="text-white" />
        </div>
        <span>Portfolio</span>
      </div>

      <ul className="space-y-3">
        {data.map((h) => (
          <li key={h.id} className="flex justify-between items-center p-4 rounded-2xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e5e7eb' }}>
            <div className="flex flex-col">
              <span className="font-semibold" style={{ color: '#001324' }}>{h.name}</span>
              {h.unitName && <span className="text-sm" style={{ color: '#6b7280' }}>({h.unitName})</span>}
            </div>
            <div className="text-right">
              <span className="font-bold text-lg" style={{ color: '#2d2df1' }}>
                {h.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: h.decimals > 6 ? 6 : h.decimals,
                })}
              </span>
              {h.id !== 0 && <div className="text-xs" style={{ color: '#6b7280' }}>ID: {h.id}</div>}
            </div>
          </li>
        ))}
      </ul>

      <div className="text-sm pt-3 border-t" style={{ color: '#6b7280', borderColor: '#e5e7eb' }}>
        Total assets: <span className="font-semibold" style={{ color: '#001324' }}>{data.length}</span> | Total (units):{' '}
        <span className="font-semibold" style={{ color: '#2d2df1' }}>
          {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  )
}
