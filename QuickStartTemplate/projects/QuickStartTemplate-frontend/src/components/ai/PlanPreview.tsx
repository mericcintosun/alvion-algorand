import React from 'react'
import type { Plan } from '@/services/ai/agent'

export default function PlanPreview({ plan }: { plan: Plan }) {
  return (
    <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}>
      <div className="font-bold mb-4 text-lg flex items-center gap-3" style={{ color: '#08c2b4' }}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#08c2b4' }}></div>
        İşlem Önizleme
      </div>
      <ol className="space-y-4">
        {plan.steps.map((s, i) => (
          <li key={i} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: '#404040' }}>
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#f95001' }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-2 text-white">
                {s.op === 'QUOTE' && '💰 Fiyat Sorgula'}
                {s.op === 'STAKE' && '🔒 Stake Et'}
                {s.op === 'UNSTAKE' && '🔓 Unstake Et'}
                {s.op === 'SWAP' && '🔄 Swap Yap'}
                {s.op === 'SET_POLICY' && '🛡️ Politika Ayarla'}
                {s.op === 'PREVIEW' && '👁️ Önizleme'}
              </div>
              <code className="text-sm bg-gray-800 text-gray-300 rounded-lg px-3 py-2 block whitespace-pre-wrap">
                {JSON.stringify(s.params, null, 2)}
              </code>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
