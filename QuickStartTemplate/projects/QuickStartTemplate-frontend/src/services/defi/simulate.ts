import algosdk from 'algosdk'
import { getAlgodClient } from '../../utils/network/getAlgoClientConfigs'

const ALGOD = getAlgodClient()

/**
 * AtomicTransactionComposer'ı simulate eder ve hata detaylarını gösterir
 * Bu fonksiyon "ApprovalProgram rejected" hatalarını debug etmek için kullanılır
 * algosdk v3 API kullanır
 *
 * @param atc - AtomicTransactionComposer instance
 * @returns Simulation result with detailed error information
 */
export async function simulateATC(atc: algosdk.AtomicTransactionComposer) {
  try {
    // eslint-disable-next-line no-console
    console.log('🔍 Simulating transaction group before submission...')

    // algosdk v3 API kullanarak simulate et
    const simReq = new algosdk.modelsv2.SimulateRequest({
      txnGroups: [], // Boş array - ATC kendi transaction'larını ekleyecek
      allowEmptySignatures: true,
      allowUnnamedResources: true,
      execTraceConfig: new algosdk.modelsv2.SimulateTraceConfig({ enable: true }),
    })

    const res = await atc.simulate(ALGOD, simReq)

    // Hangi tx fail etti, hangi AppID?
    const txnResults = res.simulateResponse?.txnGroups?.[0]?.txnResults || []
    let hasErrors = false

    txnResults.forEach((r: any, i: number) => {
      if (r.failureMessage) {
        hasErrors = true
        // eslint-disable-next-line no-console
        console.error(`❌ TX #${i} failed: ${r.failureMessage}`)
        // eslint-disable-next-line no-console
        console.error(`   App ID: ${r.appCallMessages?.[0]?.appId || 'N/A'}`)
        // eslint-disable-next-line no-console
        console.error(`   Details:`, r)
      } else {
        // eslint-disable-next-line no-console
        console.log(`✅ TX #${i} passed simulation`)
      }
    })

    if (!hasErrors) {
      // eslint-disable-next-line no-console
      console.log('✅ All transactions passed simulation - ready to submit!')
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Simulation failed - do not submit!')
    }

    return res
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Simulation error:', error)
    // Simulation başarısız olsa bile devam et (fallback)
    // eslint-disable-next-line no-console
    console.warn('Continuing without simulation...')
    return null
  }
}
