import React from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import CommandBox from './ai/CommandBox'
import PlanPreview from './ai/PlanPreview'
import PortfolioCard from './portfolio/PortfolioCard'
import PortfolioList from './portfolio/PortfolioList'
import type { Command, Plan } from '@/services/ai/agent'

interface AIFlowPanelProps {
  onCommandParsed?: (command: Command) => void
  onPlanGenerated?: (plan: Plan) => void
}

const AIFlowPanel: React.FC<AIFlowPanelProps> = ({ onCommandParsed, onPlanGenerated }) => {
  const { activeAddress } = useWallet()

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8" style={{ backgroundColor: '#242424', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r"
          style={{ backgroundImage: 'linear-gradient(to right, #f95001, #08c2b4)' }}
        >
          Alvion AI Asistan
        </h1>

        {activeAddress && (
          <div className="text-right text-sm">
            <div className="text-gray-400 mb-1">Adres:</div>
            <div className="font-mono text-lg" style={{ color: '#08c2b4' }}>
              {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}
            </div>
            <div className="text-gray-400 mt-1">Ağ: TestNet</div>
          </div>
        )}
      </div>

      {/* Command Area */}
      <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}>
        <CommandBox onCommandParsed={onCommandParsed} onPlanGenerated={onPlanGenerated} />
      </div>

      {/* Portfolio Section */}
      {activeAddress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioCard address={activeAddress} />
          <PortfolioList address={activeAddress} />
        </div>
      )}

      {/* Example Commands */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}>
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#08c2b4' }}>
          Örnek Komutlar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="font-semibold text-lg" style={{ color: '#f95001' }}>
              Temel İşlemler:
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#08c2b4' }}></span>
                "ALGO'larımı faize bağla"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#08c2b4' }}></span>
                "0.5 ALGO'yu USDC'ye çevir"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#08c2b4' }}></span>
                "Faizden ALGO çek"
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="font-semibold text-lg" style={{ color: '#f95001' }}>
              Gelişmiş:
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5a0c6e' }}></span>
                "Portföyümü %60 ALGO, %40 USDC yap"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5a0c6e' }}></span>
                "Risk limitini %3 yap"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5a0c6e' }}></span>
                "ALGO'larımı faize bağla, riski %5'i aşma"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIFlowPanel
