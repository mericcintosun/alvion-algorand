import algosdk from 'algosdk'
import { useWallet } from '@txnlab/use-wallet-react'
import type { Plan, Command } from '../ai/agent'
import { stakeAlgoForXAlgo, unstakeXAlgo } from './folks'
import { swapFixedInput } from './tinyman'
import { setAllowedApps } from './guard'

export interface ExecutionResult {
  success: boolean
  txId?: string
  error?: string
}

export async function executePlan(
  plan: Plan,
  command: Command,
  sender: string,
  signer: algosdk.TransactionSigner,
): Promise<ExecutionResult> {
  try {
    let result: ExecutionResult = { success: false }
    console.log('Starting execution of plan with steps:', plan.steps.length)
    console.log('Command received:', command)
    console.log('Plan steps:', plan.steps)

    for (const step of plan.steps) {
      console.log(`Processing step: ${step.op}`, step.params)
      switch (step.op) {
        case 'SET_POLICY':
          // PolicyGuard'a risk limiti ayarla (şimdilik skip, ileride implement edilecek)
          console.log('Setting policy:', step.params)
          break

        case 'QUOTE':
          // Quote işlemi - sadece bilgi amaçlı, execution yok
          console.log('Quote:', step.params)
          break

        case 'STAKE':
          console.log('Processing STAKE operation:', step.params)
          if (step.params.proto === 'FOLKS') {
            try {
              const amount = parseAmount(step.params.amount || 'auto', sender)
              console.log(`Executing STAKE operation with amount: ${amount}`)
              console.log('Calling stakeAlgoForXAlgo with:', { sender, amountAlgo: amount, hasSigner: !!signer })

              const res = await stakeAlgoForXAlgo({
                sender,
                amountAlgo: amount,
                signer,
              })

              console.log('stakeAlgoForXAlgo returned:', res)
              result = { success: true, txId: res.txIDs?.[0] }
              console.log('STAKE operation completed successfully')
            } catch (stakeError) {
              console.error('STAKE operation failed:', stakeError)
              console.error('Error details:', {
                name: stakeError instanceof Error ? stakeError.name : 'Unknown',
                message: stakeError instanceof Error ? stakeError.message : 'Unknown error',
                stack: stakeError instanceof Error ? stakeError.stack : 'No stack trace',
              })
              result = {
                success: false,
                error: stakeError instanceof Error ? stakeError.message : 'STAKE operation failed',
              }
            }
          } else {
            console.log(`Unsupported protocol for STAKE: ${step.params.proto}`)
            result = { success: false, error: `Unsupported protocol: ${step.params.proto}` }
          }
          break

        case 'UNSTAKE':
          if (step.params.proto === 'FOLKS') {
            const amount = parseAmount(step.params.amount || 'auto', sender)
            const res = await unstakeXAlgo({
              sender,
              amountXAlgo: amount,
              signer,
            })
            result = { success: true, txId: res.txIDs?.[0] }
          }
          break

        case 'SWAP':
          if (step.params.proto === 'TINYMAN') {
            const amount = parseAmount(step.params.amount || 'auto', sender)
            const fromAssetId = getAssetId(step.params.from)
            const toAssetId = getAssetId(step.params.to)

            // Pool address - şimdilik placeholder, ileride dinamik olacak
            // TestNet için örnek pool adresleri (gerçek pool adreslerini kullanın)
            const poolAddr = step.params.poolAddr || 'POOL_ADDRESS_PLACEHOLDER'

            const res = await swapFixedInput({
              sender,
              fromAssetId,
              toAssetId,
              amountIn: amount,
              slippageBps: step.params.slippageBps || 50, // %0.5 default slippage
              poolAddr,
              signer,
            })
            result = { success: true, txId: res.txIDs?.[0] }
          }
          break

        case 'PREVIEW':
          // Preview işlemi - execution yok
          console.log('Preview completed')
          break

        default:
          console.warn('Unknown operation:', step.op)
      }

      console.log(`Step ${step.op} completed. Current result:`, result)
    }

    console.log('Plan execution completed. Final result:', result)
    return result
  } catch (error) {
    console.error('Execution error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Helper functions
function parseAmount(amountStr: string, sender: string): number {
  if (amountStr === 'auto') {
    // Auto amount - Folks Finance için daha yüksek miktar (1 ALGO)
    return 1_000_000 // 1 ALGO in microAlgos
  }

  // Parse amount string (e.g., "0.5 ALGO" -> 500000 microAlgos)
  const match = amountStr.match(/(\d+(?:\.\d+)?)\s*(ALGO|xALGO)?/i)
  if (match) {
    const value = parseFloat(match[1])
    return Math.floor(value * 1_000_000) // Convert to microAlgos
  }

  return 1_000_000 // Default fallback
}

function getAssetId(assetSymbol: string): number {
  const assetMap: Record<string, number> = {
    ALGO: 0,
    USDC: 10458941, // TestNet USDC ID - gerçek ID'yi güncelleyin
    USDT: 10458942, // TestNet USDT ID - gerçek ID'yi güncelleyin
    xALGO: Number(import.meta.env.VITE_FOLKS_XALGO_ASA_ID || '1134696561'),
  }

  return assetMap[assetSymbol.toUpperCase()] || 0
}

export async function setupAllowedApps(creatorAddr: string, signer: algosdk.TransactionSigner): Promise<ExecutionResult> {
  try {
    console.log('Setting up PolicyGuard allowed apps...')
    const res = await setAllowedApps({ creatorAddr, signer })
    console.log('PolicyGuard setup completed successfully')
    return { success: true, txId: res.txIds?.[0] }
  } catch (error) {
    console.error('Setup error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Setup failed',
    }
  }
}
