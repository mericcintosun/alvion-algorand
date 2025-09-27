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
import CommandBox from './components/ai/CommandBox'

// Portfolio components
import PortfolioCard from './components/portfolio/PortfolioCard'
import PortfolioList from './components/portfolio/PortfolioList'

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
    <div className="min-h-screen bg-neutral-900 text-gray-100 flex flex-col">
      {/* ---------------- Navbar ---------------- */}
      <nav className="w-full bg-neutral-800 border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          Algorand dApp Gateway
        </h1>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm font-semibold text-white transition"
            onClick={() => setOpenChatBotModal(true)}
          >
            <div className="text-lg">
              <AiOutlineRobot />
            </div>
            <span>AI Assistant</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm font-semibold text-gray-100 transition"
            onClick={() => setOpenWalletModal(true)}
          >
            <div className="text-lg text-cyan-400">
              <BsWallet2 />
            </div>
            <span>{activeAddress ? 'Wallet Connected' : 'Connect Wallet'}</span>
          </button>
        </div>
      </nav>

      {/* ---------------- Hero Section ---------------- */}
      <header className="text-center py-10 px-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 mb-4">
          Explore Algorand on TestNet
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          This project demonstrates the core building blocks of an Algorand dApp. Connect your wallet, send transactions, mint NFTs, create
          tokens, and try out contract interactions — all from a simple interface.
        </p>
      </header>

      {/* ---------------- Features Grid ---------------- */}
      <main className="flex-1 px-6 pb-12">
        {/* AI Command Box - Always visible */}
        <div className="max-w-4xl mx-auto mb-8">
          <CommandBox />
        </div>

        {/* Portfolio Section - Show when wallet connected */}
        {activeAddress && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioCard address={activeAddress} />
              <PortfolioList address={activeAddress} />
            </div>
          </div>
        )}

        {activeAddress ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Send Payment */}
            <div className="p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-cyan-500 transition">
              <div className="text-4xl mb-3 text-green-400">
                <AiOutlineSend />
              </div>
              <h3 className="text-lg font-semibold mb-2">Send Payment</h3>
              <p className="text-sm text-gray-400 mb-4">
                Try sending 1 ALGO to any address on TestNet. This helps you understand wallet transactions.
              </p>
              <button
                className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                onClick={() => setOpenPaymentModal(true)}
              >
                Open
              </button>
            </div>

            {/* Mint NFT */}
            <div className="p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-pink-500 transition">
              <div className="text-4xl mb-3 text-pink-400">
                <AiOutlineStar />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mint NFT</h3>
              <p className="text-sm text-gray-400 mb-4">
                Upload an image and mint it as an NFT on Algorand with IPFS metadata stored via Pinata.
              </p>
              <button
                className="w-full py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition"
                onClick={() => setOpenMintModal(true)}
              >
                Open
              </button>
            </div>

            {/* Create Token */}
            <div className="p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-purple-500 transition">
              <div className="text-4xl mb-3 text-purple-400">
                <BsArrowUpRightCircle />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Token (ASA)</h3>
              <p className="text-sm text-gray-400 mb-4">
                Spin up your own Algorand Standard Asset (ASA) in seconds. Perfect for testing token creation.
              </p>
              <button
                className="w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition"
                onClick={() => setOpenTokenModal(true)}
              >
                Open
              </button>
            </div>

            {/* Contract Interactions */}
            <div className="p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-amber-500 transition">
              <div className="text-4xl mb-3 text-amber-400">
                <AiOutlineDeploymentUnit />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contract Interactions</h3>
              <p className="text-sm text-gray-400 mb-4">
                Interact with a simple Algorand smart contract to see how stateful dApps work on chain.
              </p>
              <button
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition"
                onClick={() => setOpenAppCallsModal(true)}
              >
                Open
              </button>
            </div>

            {/* Policy Guard */}
            <div className="p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-red-500 transition">
              <div className="text-4xl mb-3 text-red-400">
                <AiOutlineSecurityScan />
              </div>
              <h3 className="text-lg font-semibold mb-2">Policy Guard</h3>
              <p className="text-sm text-gray-400 mb-4">
                Deploy and manage security policies for transaction groups with fee limits, amount controls, and app restrictions.
              </p>
              <button
                className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                onClick={() => setOpenPolicyGuardModal(true)}
              >
                Open
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            <p>⚡ Connect your wallet first to unlock the features below.</p>
          </div>
        )}
      </main>

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
