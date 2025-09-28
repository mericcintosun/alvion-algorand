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
    <div className="max-w-6xl mx-auto space-y-8 p-8" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-4xl font-bold font-serif-heading"
          style={{ color: '#001324' }}
        >
          Alvion AI Assistant
        </h1>

        {activeAddress && (
          <div className="text-right text-sm">
            <div className="mb-1" style={{ color: '#6b7280' }}>Address:</div>
            <div className="font-mono text-lg" style={{ color: '#2d2df1' }}>
              {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}
            </div>
            <div className="mt-1" style={{ color: '#6b7280' }}>Network: TestNet</div>
          </div>
        )}
      </div>

      {/* Command Area */}
      <div className="rounded-2xl p-8 shadow-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
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
      <div className="rounded-2xl p-6 shadow-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <h3 className="text-xl font-semibold mb-4 font-heading" style={{ color: '#2d2df1' }}>
          Example Commands
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="font-semibold text-lg font-heading" style={{ color: '#001324' }}>
              Basics:
            </div>
            <ul className="space-y-2" style={{ color: '#6b7280' }}>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d2df1' }}></span>
                "Stake my ALGO"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d2df1' }}></span>
                "Swap 0.5 ALGO to USDC"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d2df1' }}></span>
                "Unstake ALGO"
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="font-semibold text-lg font-heading" style={{ color: '#001324' }}>
              Advanced:
            </div>
            <ul className="space-y-2" style={{ color: '#6b7280' }}>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d2df1' }}></span>
                "Make my portfolio 60% ALGO, 40% USDC"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d2df1' }}></span>
                "Set risk limit to 3%"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d2df1' }}></span>
                "Stake my ALGOs, keep risk under 5%"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIFlowPanel
