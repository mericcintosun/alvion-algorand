// Home.tsx
// Main landing UI: shows navbar, hero text, and feature cards.
// This file only handles layout and modals — safe place to customize design.

import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { motion } from 'framer-motion'
import {
  AiOutlineSend,
  AiOutlineStar,
  AiOutlineDeploymentUnit,
  AiOutlineSecurityScan,
  AiOutlineRobot,
  AiOutlineThunderbolt,
  AiOutlineSync,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineDollarCircle,
  AiOutlineEye,
  AiOutlineRocket,
} from 'react-icons/ai'
import { BsArrowUpRightCircle, BsWallet2, BsShieldCheck, BsLightning } from 'react-icons/bs'

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
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#001324' }}>
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
      <header className="text-center py-8 sm:py-12 md:py-16 px-4 bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }}>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 font-serif-heading text-white"
          style={{ color: '#ffffff' }}
        >
          Alvion
        </h1>
        <h2
          className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold mb-6 sm:mb-8 font-heading text-white px-2 leading-tight"
          style={{ color: '#ffffff' }}
        >
          Alvion lets Web3 users manage DeFi simply and securely with natural language and AI-powered rebalancing.{' '}
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
            Alvion plans DeFi flows in natural language on Algorand, executes with a single confirmation, and continuously maintains
            portfolio allocation. It offers an agentic transaction experience aligned with Algorand's agentic commerce vision.
          </p>
        </div>
      </header>

      {/* ---------------- How It Works ---------------- */}
      <section className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 font-heading"
            style={{ color: '#001324' }}
          >
            How It Works
          </motion.h2>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border-2 group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#2d2df1' }}
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineRobot className="text-2xl sm:text-3xl" />
                </motion.div>
                <div className="flex-1">
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                    style={{ color: '#001324' }}
                  >
                    Natural Language Commands
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: '#6b7280' }}>
                    Describe your DeFi goals in plain English. Our AI understands complex instructions and translates them into executable
                    plans.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-4 p-3 rounded-xl border"
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e5e7eb' }}
                  >
                    <code className="text-xs sm:text-sm font-mono" style={{ color: '#2d2df1' }}>
                      "I want to stake my ALGOs and get xALGO tokens while maintaining liquidity."
                    </code>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-6 sm:p-8 rounded-3xl border group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineEye className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                  style={{ color: '#001324' }}
                >
                  AI Preview
                </h3>
                <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                  Alvion analyzes risks, calculates fees, and shows you exactly what will happen.
                </p>
              </div>
            </motion.div>

            {/* Step 3 - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-6 sm:p-8 rounded-3xl border group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineRocket className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                  style={{ color: '#001324' }}
                >
                  Execute
                </h3>
                <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                  One-click execution with atomic transactions. Your AI agent handles the rest.
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8"
            >
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#f0f9ff' }}
                >
                  <BsShieldCheck className="text-xl" style={{ color: '#2d2df1' }} />
                </motion.div>
                <h4 className="font-semibold mb-2 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  PolicyGuard
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Built-in safety limits
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ rotate: -10 }}
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#f0f9ff' }}
                >
                  <BsLightning className="text-xl" style={{ color: '#2d2df1' }} />
                </motion.div>
                <h4 className="font-semibold mb-2 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  Atomic Txs
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  All-or-nothing execution
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#f0f9ff' }}
                >
                  <AiOutlineSync className="text-xl" style={{ color: '#2d2df1' }} />
                </motion.div>
                <h4 className="font-semibold mb-2 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  Auto-Rebalance
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Continuous optimization
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Integrations ---------------- */}
      <section className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 font-heading"
            style={{ color: '#001324' }}
          >
            Integrations
          </motion.h2>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Folks Finance - Large Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border-2 group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#2d2df1' }}
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineStar className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                    style={{ color: '#001324' }}
                  >
                    Folks Finance
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: '#6b7280' }}>
                    Liquid staking protocol for ALGO. Stake your ALGOs and get xALGO tokens while maintaining liquidity.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#f0f9ff', color: '#2d2df1' }}
                    >
                      xALGO
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#f0f9ff', color: '#2d2df1' }}
                    >
                      Liquid Staking
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tinyman - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
              className="p-6 sm:p-8 rounded-3xl border group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineSend className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                  style={{ color: '#001324' }}
                >
                  Tinyman
                </h3>
                <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                  DEX aggregator that finds the best swap routes with optimal pricing.
                </p>
              </div>
            </motion.div>

            {/* Wallet - Medium Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
              className="p-6 sm:p-8 rounded-3xl border group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <BsWallet2 className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                  style={{ color: '#001324' }}
                >
                  Pera Wallet
                </h3>
                <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                  Secure wallet integration for transaction signing and management.
                </p>
              </div>
            </motion.div>

            {/* Protocol Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8"
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div whileHover={{ scale: 1.1 }} className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#2d2df1' }}>
                  2+
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  Protocols
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Integrated DeFi protocols
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div whileHover={{ scale: 1.1 }} className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#2d2df1' }}>
                  100%
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  Secure
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Audited smart contracts
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div whileHover={{ scale: 1.1 }} className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#2d2df1' }}>
                  &lt; 1s
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  Fast
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Transaction finality
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Why Alvion ---------------- */}
      <section className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 font-heading"
            style={{ color: '#001324' }}
          >
            Why Alvion?
          </motion.h2>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* AI Assistant - Large Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.3 } }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border-2 group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#2d2df1' }}
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 8 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineRobot className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                    style={{ color: '#001324' }}
                  >
                    AI-Powered DeFi
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: '#6b7280' }}>
                    Transform complex DeFi operations into simple natural language commands. Our AI understands context, manages risk, and
                    executes with precision.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <motion.span
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#f0f9ff', color: '#2d2df1' }}
                    >
                      Natural Language
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#f0f9ff', color: '#2d2df1' }}
                    >
                      Context Aware
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.3 } }}
              className="p-6 sm:p-8 rounded-3xl border group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -8 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineSecurityScan className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                  style={{ color: '#001324' }}
                >
                  Security-First
                </h3>
                <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                  PolicyGuard enforces strict limits on every transaction. Fully auditable on-chain.
                </p>
              </div>
            </motion.div>

            {/* Rebalancer - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.3 } }}
              className="p-6 sm:p-8 rounded-3xl border group cursor-pointer"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 8 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#2d2df1' }}
                >
                  <AiOutlineDeploymentUnit className="text-2xl sm:text-3xl text-white" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                  style={{ color: '#001324' }}
                >
                  Auto-Rebalancer
                </h3>
                <p className="text-sm sm:text-base" style={{ color: '#6b7280' }}>
                  Continuous portfolio optimization. Your AI agent maintains target allocations automatically.
                </p>
              </div>
            </motion.div>

            {/* Algorand - Full Width Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.3 } }}
              className="lg:col-span-4 p-6 sm:p-8 rounded-3xl border-2 group cursor-pointer"
              style={{ backgroundColor: '#2d2df1', borderColor: '#1e1eb8' }}
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -8 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <BsArrowUpRightCircle className="text-2xl sm:text-3xl" style={{ color: '#2d2df1' }} />
                </motion.div>
                <div className="flex-1">
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3 font-heading group-hover:scale-105 transition-transform duration-200"
                    style={{ color: '#ffffff' }}
                  >
                    Built on Algorand
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: '#e5e7eb' }}>
                    Fast, low-cost, and developer-friendly blockchain infrastructure. Algorand's pure proof-of-stake consensus ensures
                    security, scalability, and decentralization.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <motion.span
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#ffffff', color: '#2d2df1' }}
                    >
                      Pure PoS
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#ffffff', color: '#2d2df1' }}
                    >
                      Low Fees
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#ffffff', color: '#2d2df1' }}
                    >
                      Fast Finality
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8 mt-8"
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: '#2d2df1' }}
                >
                  <AiOutlineThunderbolt className="mx-auto" />
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  1-Click
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Complex DeFi in seconds
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: '#2d2df1' }}
                >
                  <AiOutlineClockCircle className="mx-auto" />
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  24/7
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Always-on optimization
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: '#2d2df1' }}
                >
                  <AiOutlineDollarCircle className="mx-auto" />
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  0.001 ALGO
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Ultra-low transaction costs
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                className="p-4 sm:p-6 rounded-2xl border text-center group cursor-pointer"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: '#2d2df1' }}
                >
                  <AiOutlineCheckCircle className="mx-auto" />
                </motion.div>
                <h4 className="font-semibold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: '#001324' }}>
                  100%
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                  Open-source & auditable
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- AI Flow Panel ---------------- */}
      <main className="flex-1 px-4 sm:px-6 pb-8 sm:pb-12">
        <AIFlowPanel />
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer
        className="mt-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-cover bg-center border-t"
        style={{ backgroundImage: 'url(/background.png)', borderColor: '#e5e7eb' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="flex items-center gap-2 sm:gap-3"></div>
            <div className="text-center sm:text-right">
              <p className="text-white text-sm sm:text-base" style={{ color: '#ffffff' }}>
                © {new Date().getFullYear()} Alvion • Manage DeFi with natural language.
              </p>
            </div>
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white"
              style={{ color: '#ffffff' }}
            >
              <a
                className="hover:underline transition-all duration-200 hover:text-blue-200"
                href="https://folks.finance/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Folks Finance
              </a>
              <a
                className="hover:underline transition-all duration-200 hover:text-blue-200"
                href="https://tinyman.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tinyman
              </a>
              <a
                className="hover:underline transition-all duration-200 hover:text-blue-200"
                href="https://perawallet.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pera Wallet
              </a>
              <a
                className="hover:underline transition-all duration-200 hover:text-blue-200"
                href="https://algorand.co/algokit"
                target="_blank"
                rel="noopener noreferrer"
              >
                AlgoKit
              </a>
            </div>
          </div>

          {/* Large Alvion Text */}
          <div className="text-center">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif-heading text-white "
              style={{ color: '#ffffff' }}
            >
              ALVION
            </h2>
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
