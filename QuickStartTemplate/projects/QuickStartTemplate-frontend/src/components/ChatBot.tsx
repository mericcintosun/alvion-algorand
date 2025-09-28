// ChatBot.tsx
// AI-powered chat component integrated with Gemini backend
// Matches the existing Alvion design system

import React, { useState, useRef, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useWallet } from '@txnlab/use-wallet-react'
import { AiOutlineSend, AiOutlineLoading3Quarters, AiOutlineRobot, AiOutlineUser, AiOutlineWallet } from 'react-icons/ai'
import { askGemini, askGeminiStream, testBackendConnection } from '../services/api/geminiApi'
import { parse, makePlan, type Command, type Plan } from '../services/ai/agent'
import { executePlan, setupAllowedApps } from '../services/defi/executor'

interface ChatBotProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatBot = ({ openModal, setModalState }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Hello! I'm your Algorand & DeFi assistant. I can help you with blockchain concepts, smart contracts, NFTs, tokens, and DeFi transactions. You can ask me to stake ALGO, swap tokens, or manage your portfolio. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [backendConnected, setBackendConnected] = useState(false)
  const [isExecutingDeFi, setIsExecutingDeFi] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, transactionSigner } = useWallet()

  // Test backend connection on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const connected = await testBackendConnection()
      setBackendConnected(connected)
      if (!connected) {
        enqueueSnackbar('Backend server not connected. Please start the Gemini backend.', { variant: 'warning' })
      }
    }
    checkBackend()
  }, [enqueueSnackbar])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check if message contains DeFi commands
  const isDeFiCommand = (message: string): boolean => {
    const defiKeywords = [
      'stake',
      'faize',
      'faiz',
      'bağla',
      'bağlay',
      'unstake',
      'çek',
      'çıkar',
      'swap',
      'çevir',
      'değiştir',
      'rebalance',
      'denge',
      'dengel',
      'algo',
      'usdc',
      'usdt',
      'xalgo',
    ]
    const lowerMessage = message.toLowerCase()
    return defiKeywords.some((keyword) => lowerMessage.includes(keyword))
  }

  // Execute DeFi command
  const executeDeFiCommand = async (message: string) => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar("Wallet bağlantısı gerekli. Lütfen wallet'ı bağlayın.", { variant: 'error' })
      return
    }

    setIsExecutingDeFi(true)

    try {
      // İlk önce allowed apps'i ayarla (PolicyGuard için gerekli)
      console.log('Setting up allowed apps for ChatBot...')
      const setupResult = await setupAllowedApps(activeAddress, transactionSigner)
      if (!setupResult.success) {
        console.error('Failed to setup allowed apps:', setupResult.error)
      } else {
        console.log('Allowed apps setup successful for ChatBot')
      }

      // Parse command
      const command = await parse(message)

      // Generate plan
      const plan = await makePlan(command)

      // Execute plan
      const result = await executePlan(plan, command, activeAddress, transactionSigner)

      if (result.success) {
        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: `✅ İşlem başarıyla tamamlandı!\n\nTransaction ID: ${result.txId}\n\nİşlem detayları:\n- Komut: ${command.intent}\n- Miktar: ${command.amount || 'auto'}\n- Protokol: ${command.intent.includes('STAKE') ? 'Folks Finance' : 'N/A'}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, successMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: `❌ İşlem hatası: ${result.error}\n\nLütfen tekrar deneyin veya farklı bir komut kullanın.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `❌ DeFi komut işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}\n\nLütfen tekrar deneyin.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsExecutingDeFi(false)
    }
  }

  const handleSendMessage = async (useStream = false) => {
    if (!inputMessage.trim() || isLoading || isStreaming || isExecutingDeFi) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageText = inputMessage.trim()
    setInputMessage('')

    // Check if it's a DeFi command
    if (isDeFiCommand(messageText)) {
      await executeDeFiCommand(messageText)
      return
    }

    // Handle regular chat
    if (!backendConnected) {
      enqueueSnackbar('Backend server not connected', { variant: 'error' })
      return
    }

    if (useStream) {
      setIsStreaming(true)
      await handleStreamingResponse(messageText)
    } else {
      setIsLoading(true)
      await handleRegularResponse(messageText)
    }
  }

  const handleRegularResponse = async (message: string) => {
    try {
      const response = await askGemini(message)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      enqueueSnackbar(`Error: ${error instanceof Error ? error.message : 'Failed to get response'}`, { variant: 'error' })
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStreamingResponse = async (message: string) => {
    try {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      for await (const chunk of askGeminiStream(message)) {
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage && lastMessage.type === 'assistant' && lastMessage.id === assistantMessage.id) {
            lastMessage.content += chunk
          }
          return newMessages
        })
      }
    } catch (error) {
      enqueueSnackbar(`Streaming error: ${error instanceof Error ? error.message : 'Failed to stream response'}`, { variant: 'error' })
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.type === 'assistant') {
          lastMessage.content = 'Sorry, I encountered an error while streaming. Please try again.'
        }
        return newMessages
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content:
          "Hello! I'm your Algorand & DeFi assistant. I can help you with blockchain concepts, smart contracts, NFTs, tokens, and more. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-base-100 text-base-content rounded-lg shadow-xl border border-base-300 p-6 max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-primary">
                <AiOutlineRobot className="text-3xl" />
                AI Assistant
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}
                  title={backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
                />
                {activeAddress && (
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <AiOutlineWallet />
                    <span>Wallet Connected</span>
                  </div>
                )}
                <button onClick={clearChat} className="text-sm text-base-content/60 hover:text-primary transition-colors">
                  Clear Chat
                </button>
                <button onClick={() => setModalState(false)} className="text-base-content/60 hover:text-primary transition-colors">
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'assistant' && <AiOutlineRobot className="text-lg mt-1 flex-shrink-0" />}
                      {message.type === 'user' && <AiOutlineUser className="text-lg mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {isStreaming && message.type === 'assistant' && messages[messages.length - 1]?.id === message.id && (
                          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-base-300 pt-4">
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Algorand, DeFi, smart contracts, NFTs... or try '1 algo stake et'"
                  className="flex-1 p-3 bg-base-200 text-base-content border border-base-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-lg resize-none"
                  rows={2}
                  disabled={isLoading || isStreaming}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSendMessage(false)}
                    disabled={!inputMessage.trim() || isLoading || isStreaming || isExecutingDeFi}
                    className="btn btn-primary text-white rounded-lg border-none font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading || isExecutingDeFi ? <AiOutlineLoading3Quarters className="animate-spin" /> : <AiOutlineSend />}
                  </button>
                  <button
                    onClick={() => handleSendMessage(true)}
                    disabled={!inputMessage.trim() || isLoading || isStreaming || isExecutingDeFi}
                    className="btn btn-secondary text-white rounded-lg border-none font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {isStreaming ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Stream'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-base-content/60 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
