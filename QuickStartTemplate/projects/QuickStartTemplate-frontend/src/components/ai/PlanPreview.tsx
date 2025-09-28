import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import type { Plan, Command } from '@/services/ai/agent'
import { executePlan, setupAllowedApps } from '@/services/defi/executor'
import { AiOutlineCaretRight, AiOutlineLoading3Quarters, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'

interface PlanPreviewProps {
  plan: Plan
  command?: Command
}

export default function PlanPreview({ plan, command }: PlanPreviewProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ success: boolean; txId?: string; error?: string } | null>(null)
  const { activeAddress, transactionSigner, signTransactions } = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  const handleExecute = async () => {
    console.log('Execution check:', {
      activeAddress,
      signer: !!transactionSigner,
      signTransactions: !!signTransactions,
      command: !!command,
    })

    if (!activeAddress) {
      enqueueSnackbar('Wallet adresi bulunamadı', { variant: 'error' })
      return
    }

    // signer veya signTransactions'dan birini kullan
    const walletSigner = transactionSigner || signTransactions
    if (!walletSigner) {
      enqueueSnackbar("Wallet imza fonksiyonu bulunamadı. Lütfen wallet'ı yeniden bağlayın.", { variant: 'error' })
      return
    }

    if (!command) {
      enqueueSnackbar('Komut bulunamadı', { variant: 'error' })
      return
    }

    setIsExecuting(true)
    setExecutionResult(null)

    try {
      // İlk önce allowed apps'i ayarla (PolicyGuard için gerekli)
      console.log('Setting up allowed apps...')
      const setupResult = await setupAllowedApps(activeAddress, walletSigner)
      if (!setupResult.success) {
        console.error('Failed to setup allowed apps:', setupResult.error)
        enqueueSnackbar(`Allowed apps setup failed: ${setupResult.error}`, { variant: 'error' })
      } else {
        console.log('Allowed apps setup successful')
      }

      // Plan'ı execute et
      console.log('Executing plan...')
      const result = await executePlan(plan, command, activeAddress, walletSigner)
      console.log('Execution result:', result)
      setExecutionResult(result)

      if (result.success) {
        enqueueSnackbar('İşlem başarıyla tamamlandı!', { variant: 'success' })
      } else {
        enqueueSnackbar(`İşlem hatası: ${result.error || 'Bilinmeyen hata'}`, { variant: 'error' })
      }
    } catch (error) {
      console.error('Execution error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      setExecutionResult({ success: false, error: errorMessage })
      enqueueSnackbar(`Execution hatası: ${errorMessage}`, { variant: 'error' })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}>
      <div className="font-bold mb-4 text-lg flex items-center justify-between">
        <div className="flex items-center gap-3" style={{ color: '#08c2b4' }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#08c2b4' }}></div>
          İşlem Önizleme
        </div>

        {command && activeAddress && (
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: isExecuting ? '#666' : '#08c2b4' }}
          >
            {isExecuting ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                <span>Çalıştırılıyor...</span>
              </>
            ) : (
              <>
                <AiOutlineCaretRight />
                <span>İşlemi Çalıştır</span>
              </>
            )}
          </button>
        )}
      </div>

      {executionResult && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            executionResult.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'
          }`}
        >
          {executionResult.success ? (
            <>
              <AiOutlineCheck className="text-green-400 text-xl" />
              <div>
                <div className="text-green-400 font-semibold">İşlem Başarılı!</div>
                {executionResult.txId && (
                  <div className="text-sm text-gray-300 font-mono">
                    TX: {executionResult.txId.slice(0, 8)}...{executionResult.txId.slice(-8)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <AiOutlineClose className="text-red-400 text-xl" />
              <div>
                <div className="text-red-400 font-semibold">İşlem Hatası</div>
                <div className="text-sm text-gray-300">{executionResult.error}</div>
              </div>
            </>
          )}
        </div>
      )}

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
                {s.op === 'STAKE' && '🔒 ALGO Stake Et'}
                {s.op === 'UNSTAKE' && '🔓 ALGO Unstake Et'}
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
