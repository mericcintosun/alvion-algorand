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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 p-2 sm:p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-heading"
          style={{ color: '#001324' }}
        >
          Alvion AI Assistant
        </h1>

        {activeAddress && (
          <div className="text-left sm:text-right text-xs sm:text-sm">
            <div className="mb-1" style={{ color: '#6b7280' }}>Address:</div>
            <div className="font-mono text-sm sm:text-lg break-all sm:break-normal" style={{ color: '#2d2df1' }}>
              {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}
            </div>
            <div className="mt-1" style={{ color: '#6b7280' }}>Network: TestNet</div>
          </div>
        )}
      </div>

      {/* Command Area */}
      <div className="rounded-2xl p-4 sm:p-6 md:p-8 border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <CommandBox onCommandParsed={onCommandParsed} onPlanGenerated={onPlanGenerated} />
      </div>

      {/* Portfolio Section */}
      {activeAddress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <PortfolioCard address={activeAddress} />
          <PortfolioList address={activeAddress} />
        </div>
      )}

      {/* Example Commands */}
      <div className="rounded-2xl p-4 sm:p-6 border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 font-heading" style={{ color: '#2d2df1' }}>
          Example Commands
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="space-y-2 sm:space-y-3">
            <div className="font-semibold text-base sm:text-lg font-heading" style={{ color: '#001324' }}>
              Basics:
            </div>
            <ul className="space-y-1 sm:space-y-2" style={{ color: '#6b7280' }}>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2d2df1' }}></span>
                <span className="break-words">"Stake my ALGO"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2d2df1' }}></span>
                <span className="break-words">"Swap 0.5 ALGO to USDC"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2d2df1' }}></span>
                <span className="break-words">"Unstake ALGO"</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="font-semibold text-base sm:text-lg font-heading" style={{ color: '#001324' }}>
              Advanced:
            </div>
            <ul className="space-y-1 sm:space-y-2" style={{ color: '#6b7280' }}>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2d2df1' }}></span>
                <span className="break-words">"Make my portfolio 60% ALGO, 40% USDC"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2d2df1' }}></span>
                <span className="break-words">"Set risk limit to 3%"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2d2df1' }}></span>
                <span className="break-words">"Stake my ALGOs, keep risk under 5%"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIFlowPanel
