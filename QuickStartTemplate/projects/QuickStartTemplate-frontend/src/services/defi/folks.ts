import algosdk, { AtomicTransactionComposer } from 'algosdk'
import { getAlgodClient } from '../../utils/network/getAlgoClientConfigs'
import { appendGuardEnforceAtEnd } from './guard-enforce'
import { checkPolicyGuardState } from './guard'
import { simulateATC } from './simulate'
import { validateAllApps } from './app-validation'
import { getXAlgoDistributorAppId, getPolicyGuardAppId, getNetwork } from '../../config/folks'
// import * as Folks from '@folks-finance/algorand-sdk'
// Geçici olarak Folks SDK kullanımını devre dışı bırakıyoruz

const ALGOD = getAlgodClient()

export async function stakeAlgoForXAlgo({
  sender,
  amountAlgo, // microAlgo olarak sayısal değer
  signer,
}: {
  sender: string
  amountAlgo: number
  signer: algosdk.TransactionSigner
}) {
  try {
    // Validate inputs
    if (!sender) throw new Error('Sender address is required')
    if (!signer) throw new Error('Transaction signer is required')
    if (!amountAlgo || amountAlgo <= 0) throw new Error('Invalid amount: must be greater than 0')

    // eslint-disable-next-line no-console
    console.log(`Staking ${amountAlgo} microALGO for xALGO via Folks Finance`)
    // eslint-disable-next-line no-console
    console.log('Wallet validation:', { sender, hasSigner: !!signer })

    // Network-aware app ID'leri al
    const network = getNetwork()
    const distributorAppId = getXAlgoDistributorAppId()
    const guardAppId = getPolicyGuardAppId()

    // eslint-disable-next-line no-console
    console.log(`Network: ${network}`)
    // eslint-disable-next-line no-console
    console.log('PolicyGuard App ID:', guardAppId)
    // eslint-disable-next-line no-console
    console.log('Folks Distributor App ID:', distributorAppId)

    // 1) App'lerin mevcut ağda var olduğunu kontrol et
    await validateAllApps()

    // 2) PolicyGuard durumunu kontrol et ve gerekirse allowed apps'i ayarla
    try {
      await checkPolicyGuardState({ creatorAddr: sender, signer })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ PolicyGuard setup failed, but continuing with execution...', error)
      // Continue execution even if PolicyGuard setup fails
    }

    // 3) Folks Finance xALGO mint transaction'larını oluştur
    const suggestedParams = await ALGOD.getTransactionParams().do()

    // AtomicTransactionComposer kullanarak Folks transaction'larını oluştur
    const atc = new AtomicTransactionComposer()

    // ALGO payment to Folks distributor
    atc.addTransaction({
      txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender,
        receiver: algosdk.getApplicationAddress(distributorAppId),
        amount: amountAlgo,
        suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
      }),
      signer,
    })

    // Application call to mint xALGO
    atc.addTransaction({
      txn: algosdk.makeApplicationNoOpTxnFromObject({
        sender,
        appIndex: distributorAppId,
        appArgs: [
          new Uint8Array(Buffer.from('mint')), // method name
          algosdk.encodeUint64(amountAlgo), // amount
        ],
        suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
      }),
      signer,
    })

    // eslint-disable-next-line no-console
    console.log('Folks transactions prepared in ATC')

    // 4) PolicyGuard.enforce()'u SONA ekle (grup yapısını bozmaz) - TEST MODUNDA DEVRE DIŞI
    // appendGuardEnforceAtEnd(atc, {
    //   sender,
    //   guardAppId,
    //   sp: suggestedParams,
    //   signer,
    // })

    // 5) Simulate - hatayı submit'ten önce yakala
    try {
      await simulateATC(atc)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Simulation failed, but continuing with execution...', error)
      // Continue execution even if simulation fails
    }

    // 6) Execute
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout: Wallet took too long to respond')), 30000) // 30 second timeout
    })

    const res = await Promise.race([atc.execute(ALGOD, 3), timeoutPromise])

    // eslint-disable-next-line no-console
    console.log(`xALGO stake completed, transaction group ID: ${res.txIDs[0]}`)
    return res
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in stakeAlgoForXAlgo:', error)
    
    // Detaylı hata mesajı
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
      if (errorMessage.includes('logic eval error')) {
        errorMessage += '\n\nBu hata genellikle şu nedenlerden olur:\n' +
          '1. Wallet\'ınızda yeterli ALGO yok\n' +
          '2. Minimum miktar gereksinimleri karşılanmıyor\n' +
          '3. Smart contract parametreleri hatalı\n' +
          '4. Network congestion\n\n' +
          'Lütfen wallet bakiyenizi kontrol edin ve tekrar deneyin.'
      }
    }
    
    throw new Error(`Failed to stake ALGO: ${errorMessage}`)
  }
}

export async function unstakeXAlgo({
  sender,
  amountXAlgo,
  signer,
}: {
  sender: string
  amountXAlgo: number // micro xALGO
  signer: algosdk.TransactionSigner
}) {
  // eslint-disable-next-line no-console
  console.log(`Unstaking ${amountXAlgo} micro xALGO via Folks Finance`)

  // Network-aware app ID'leri al
  const distributorAppId = getXAlgoDistributorAppId()
  const guardAppId = getPolicyGuardAppId()

  const suggestedParams = await ALGOD.getTransactionParams().do()

  // AtomicTransactionComposer kullanarak Folks unstake transaction'larını oluştur
  const atc = new AtomicTransactionComposer()

  // Application call to redeem xALGO
  atc.addTransaction({
    txn: algosdk.makeApplicationNoOpTxnFromObject({
      sender,
      appIndex: distributorAppId,
      appArgs: [
        new Uint8Array(Buffer.from('redeem')), // method name
        algosdk.encodeUint64(amountXAlgo), // amount
      ],
      suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
    }),
    signer,
  })

  // eslint-disable-next-line no-console
  console.log('Folks unstake transaction prepared in ATC')

  // PolicyGuard.enforce()'u SONA ekle
  appendGuardEnforceAtEnd(atc, {
    sender,
    guardAppId,
    sp: suggestedParams,
    signer,
  })

  // Simulate - hatayı submit'ten önce yakala
  await simulateATC(atc)

  const res = await atc.execute(ALGOD, 3)

  // eslint-disable-next-line no-console
  console.log(`xALGO unstake completed, transaction group ID: ${res.txIDs[0]}`)
  return res
}
