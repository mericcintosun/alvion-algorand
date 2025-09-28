// Home.tsx
// Main landing UI: shows navbar, hero text, and feature cards.
// This file only handles layout and modals — safe place to customize design.

import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { AiOutlineSend, AiOutlineStar, AiOutlineDeploymentUnit, AiOutlineSecurityScan, AiOutlineRobot } from 'react-icons/ai'
import { BsArrowUpRightCircle, BsWallet2 } from 'react-icons/bs'

// Frontend modals
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'

// Smart contract demo modal (backend app calls)
import AppCalls from './components/AppCalls'
import PolicyGuard from './components/PolicyGuard'

// AI ChatBot
import ChatBot from './components/ChatBot'

// AI Flow Panel
import AIFlowPanel from './components/AIFlowPanel'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)
  const [openAppCallsModal, setOpenAppCallsModal] = useState<boolean>(false)
  const [openPolicyGuardModal, setOpenPolicyGuardModal] = useState<boolean>(false)
  const [openChatBotModal, setOpenChatBotModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff', color: '#001324' }}>
      {/* ---------------- Navbar ---------------- */}
      <nav
        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0"
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center">
          <img src="/logo.svg" alt="Alvion" className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28" />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
            style={{ backgroundColor: '#2d2df1' }}
            onClick={() => setOpenChatBotModal(true)}
          >
            <div className="text-base sm:text-lg">
              <AiOutlineRobot />
            </div>
            <span className="hidden xs:inline">AI Assistant</span>
            <span className="xs:hidden">AI</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
            style={{ backgroundColor: '#2d2df1' }}
            onClick={() => setOpenWalletModal(true)}
          >
            <div className="text-base sm:text-lg">
              <BsWallet2 />
            </div>
            <span className="hidden sm:inline">{activeAddress ? 'Wallet Connected' : 'Connect Wallet'}</span>
            <span className="sm:hidden">{activeAddress ? 'Connected' : 'Connect'}</span>
          </button>
        </div>
      </nav>

      {/* ---------------- Hero Section ---------------- */}
      <header
        className="text-center py-8 sm:py-12 md:py-16 px-4 bg-cover bg-center"
        style={{ backgroundImage: 'url(/background.png)' }}
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 font-serif-heading text-white"
          style={{ color: '#ffffff' }}
        >
          Alvion
        </h1>
        <h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 sm:mb-8 font-heading text-white px-2 leading-tight"
          style={{ color: '#ffffff' }}
        >
          AI-powered DeFi management with natural language commands and automated rebalancing.
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <button
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:opacity-90 w-full sm:w-auto"
            style={{ backgroundColor: '#2d2df1' }}
            onClick={() => setOpenWalletModal(true)}
          >
            Connect Wallet (Pera)
          </button>
        </div>
        <div className="mt-8 sm:mt-12 max-w-3xl mx-auto px-4">
          <p className="text-xs sm:text-sm text-white leading-relaxed" style={{ color: '#ffffff' }}>
            Alvion plans DeFi flows in natural language on Algorand, executes with a single confirmation, and continuously maintains portfolio allocation.
            It offers an agentic transaction experience aligned with Algorand's agentic commerce vision.
          </p>
        </div>
      </header>

      {/* ---------------- How It Works ---------------- */}
      <section className="py-8 sm:py-12 md:py-16 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 font-heading" style={{ color: '#001324' }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-2xl font-bold text-white" style={{ backgroundColor: '#2d2df1' }}>
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Write a command</h3>
              <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                e.g. "Swap 0.5 ALGO to USDC", "Make my portfolio 60% ALGO / 40% USDC".
              </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-2xl font-bold text-white" style={{ backgroundColor: '#2d2df1' }}>
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Preview</h3>
              <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                Alvion plans steps with slippage/fee and risk indicators.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-2xl font-bold text-white" style={{ backgroundColor: '#2d2df1' }}>
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Confirm</h3>
              <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                Execute with one signature; the agent makes small rebalancing moves when you drift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Integrations ---------------- */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 font-heading" style={{ color: '#001324' }}>
            Integrations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-6 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <AiOutlineStar />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Liquid Staking</h3>
              <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                xALGO, Folks Finance — Stay liquid while staking ALGO.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <AiOutlineSend />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Swap Router</h3>
              <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                Tinyman — Finds the best route in one tx, optimized price/yield.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-2xl border sm:col-span-2 lg:col-span-1" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <BsWallet2 />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Wallet</h3>
              <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                Connect and sign with Pera Wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Why Alvion ---------------- */}
      <section className="py-8 sm:py-12 md:py-16 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 font-heading" style={{ color: '#001324' }}>
            Why Alvion?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <AiOutlineRobot />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Natural Language → Execution</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                Execute complex DeFi flows with a single sentence.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <AiOutlineDeploymentUnit />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Agentic Rebalancer</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                The AI agent guards your target allocation.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <AiOutlineSecurityScan />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Security-First</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                PolicyGuard frames every move; fully auditable on-chain.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: '#2d2df1' }}>
                <BsArrowUpRightCircle />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 font-heading" style={{ color: '#001324' }}>Built on Algorand</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                Fast, low-cost, developer-friendly infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- AI Flow Panel ---------------- */}
      <main className="flex-1 px-4 sm:px-6 pb-8 sm:pb-12">
        <AIFlowPanel />
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer
        className="mt-auto px-4 sm:px-6 py-6 sm:py-10 bg-cover bg-center border-t"
        style={{ backgroundImage: 'url(/background.png)', borderColor: '#e5e7eb' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.svg" alt="Alvion" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="font-semibold font-serif-heading text-white text-sm sm:text-base" style={{ color: '#ffffff' }}>Alvion</span>
          </div>
          <div className="text-xs sm:text-sm text-white text-center" style={{ color: '#ffffff' }}>
            © {new Date().getFullYear()} Alvion • Manage DeFi with natural language.
          </div>
           <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white" style={{ color: '#ffffff' }}>
             <a className="hover:underline transition-all duration-200 hover:text-blue-200" href="https://folks.finance/" target="_blank" rel="noopener noreferrer">Folks Finance</a>
             <a className="hover:underline transition-all duration-200 hover:text-blue-200" href="https://tinyman.org/" target="_blank" rel="noopener noreferrer">Tinyman</a>
             <a className="hover:underline transition-all duration-200 hover:text-blue-200" href="https://perawallet.app/" target="_blank" rel="noopener noreferrer">Pera Wallet</a>
             <a className="hover:underline transition-all duration-200 hover:text-blue-200" href="https://algorand.co/algokit" target="_blank" rel="noopener noreferrer">AlgoKit</a>
           </div>
        </div>
      </footer>

      {/* ---------------- Modals ---------------- */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
      <AppCalls openModal={openAppCallsModal} setModalState={setOpenAppCallsModal} />
      <PolicyGuard openModal={openPolicyGuardModal} setModalState={setOpenPolicyGuardModal} />
      <ChatBot openModal={openChatBotModal} setModalState={setOpenChatBotModal} />
    </div>
  )
}

export default Home
