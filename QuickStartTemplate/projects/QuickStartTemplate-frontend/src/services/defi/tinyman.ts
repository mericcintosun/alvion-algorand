import algosdk, { AtomicTransactionComposer } from 'algosdk'
import { getAlgodClient } from '../../utils/network/getAlgoClientConfigs'
import { appendGuardEnforceAtEnd } from './guard-enforce'
import { simulateATC } from './simulate'
import { getTinymanValidatorAppId, getPolicyGuardAppId } from '../../config/folks'

const ALGOD = getAlgodClient()

/**
 * Basit "fixed-input" swap (ALGO<->ASA veya ASA<->ASA):
 * - poolAddr: V2 pool hesabı (LoSig-derived). İlk entegrasyonda ENV ile verip çalıştır,
 *   sonra dokümandaki template'ten adres türetmeyi ekle.
 */
export async function swapFixedInput({
  sender,
  fromAssetId,
  toAssetId,
  amountIn,
  slippageBps,
  poolAddr,
  signer,
}: {
  sender: string
  fromAssetId: number // 0 = ALGO
  toAssetId: number
  amountIn: number // micro-units
  slippageBps: number // örn 50 = %0.5
  poolAddr: string
  signer: algosdk.TransactionSigner
}) {
  // eslint-disable-next-line no-console
  console.log(`Swapping ${amountIn} units of asset ${fromAssetId} to asset ${toAssetId} via Tinyman V2`)

  const sp = await ALGOD.getTransactionParams().do()

  // 1) Havuz state -> kaba çıktı tahmini (quote) & minOut
  const { minOut, quotedOut } = await getMinOutQuote({ fromAssetId, toAssetId, amountIn, slippageBps, poolAddr })
  // eslint-disable-next-line no-console
  console.log(`Quote: ${quotedOut} output, minimum: ${minOut} (${slippageBps / 100}% slippage)`)

  // 2) Input transfer -> pool
  const payOrAxfer =
    fromAssetId === 0
      ? algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender,
          receiver: poolAddr,
          amount: amountIn,
          suggestedParams: sp,
        })
      : algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          sender,
          receiver: poolAddr,
          amount: amountIn,
          assetIndex: fromAssetId,
          suggestedParams: sp,
        })

  // 3) Validator AppCall (["swap","fixed-input", min_output_amount])
  const tinymanValidator = getTinymanValidatorAppId()
  const appArgs = [new Uint8Array(Buffer.from('swap')), new Uint8Array(Buffer.from('fixed-input')), algosdk.encodeUint64(minOut)]
  const appCall = algosdk.makeApplicationNoOpTxnFromObject({
    sender,
    appIndex: tinymanValidator,
    appArgs,
    foreignAssets: [fromAssetId, toAssetId].filter((id) => id !== 0),
    accounts: [poolAddr],
    suggestedParams: { ...sp, fee: 2000, flatFee: true }, // Tinyman dokümanı 2*min_fee önerir
  })

  // 4) AtomicTransactionComposer kullanarak Tinyman transaction'larını oluştur
  const atc = new AtomicTransactionComposer()

  // Input transfer
  atc.addTransaction({
    txn: payOrAxfer,
    signer,
  })

  // Validator AppCall
  atc.addTransaction({
    txn: appCall,
    signer,
  })

  // 5) Guard enforce'i SONA ekle
  appendGuardEnforceAtEnd(atc, {
    sender,
    guardAppId: getPolicyGuardAppId(),
    sp,
    signer,
  })

  // 6) Simulate - hatayı submit'ten önce yakala
  try {
    await simulateATC(atc)
  } catch (simError) {
    // eslint-disable-next-line no-console
    console.warn('Simulation failed, but continuing with submission:', simError)
  }

  // 7) Execute
  const res = await atc.execute(ALGOD, 3)

  // eslint-disable-next-line no-console
  console.log(`Tinyman swap completed, transaction group ID: ${res.txIDs[0]}`)
  return res
}

/**
 * Basit minOut hesaplayıcı (ilk sürüm - placeholder)
 * İleride Tinyman pool state'ini okuyup gerçek CPM hesaplaması yapılacak
 */
async function getMinOutQuote({
  fromAssetId,
  toAssetId,
  amountIn,
  slippageBps,
  poolAddr,
}: {
  fromAssetId: number
  toAssetId: number
  amountIn: number
  slippageBps: number
  poolAddr: string
}) {
  // eslint-disable-next-line no-console
  console.log(`Getting quote for swap: ${fromAssetId} -> ${toAssetId}, amount: ${amountIn}, pool: ${poolAddr}`)

  // TODO: Indexer ile pool local state çek -> rezervleri bul -> CPM formülü ile gerçek quote
  // (Gerçekte Tinyman dokümanındaki state alanlarını okuyup ücretleri de uygula.)
  // Burayı ilk aşamada sabit/kaba tahminle geçip, sonra state-parsing ekleyin.
  const quotedOut = Math.floor(amountIn * 0.99) // placeholder - %1 spread
  const minOut = Math.floor(quotedOut * (1 - slippageBps / 10_000))

  // eslint-disable-next-line no-console
  console.log(`Quote calculation: ${amountIn} -> ${quotedOut} (estimated), min: ${minOut}`)
  return { minOut, quotedOut }
}
