import algosdk from 'algosdk'
import { getAlgodClient } from '../../utils/network/getAlgoClientConfigs'
import { getPolicyGuardAppId } from '../../config/folks'

const ALGOD = getAlgodClient()

/**
 * PolicyGuard.enforce() çağrısını transaction grubunun başına ekler
 * Bu readonly bir işlemdir ama assert'lar execution sırasında grubu fail ettirir
 *
 * @param sender - Transaction gönderen adres
 * @param group - Mevcut transaction grubu
 * @returns PolicyGuard.enforce() ile genişletilmiş yeni grup
 */
export async function addGuardEnforce({ sender, group }: { sender: string; group: algosdk.Transaction[] }): Promise<algosdk.Transaction[]> {
  const guardAppId = getPolicyGuardAppId()

  // Validate that we have a valid app ID
  if (!guardAppId || guardAppId === 0) {
    throw new Error(`Invalid PolicyGuard App ID: ${guardAppId}. Please check VITE_POLICY_GUARD_APP_ID environment variable.`)
  }

  const sp = await ALGOD.getTransactionParams().do()

  // Basit enforce transaction oluştur
  const enforceTxn = algosdk.makeApplicationNoOpTxnFromObject({
    sender,
    appIndex: guardAppId,
    appArgs: [], // enforce method - argüman gerektirmez
    suggestedParams: { ...sp, fee: 1000, flatFee: true },
  })

  const newGroup = [enforceTxn, ...group]
  algosdk.assignGroupID(newGroup)

  // eslint-disable-next-line no-console
  console.log(`Added PolicyGuard.enforce() (App ID: ${guardAppId}) to group with ${newGroup.length} transactions`)
  return newGroup
}

/**
 * PolicyGuard.enforce() çağrısını AtomicTransactionComposer'ın sonuna ekler
 * Bu yöntem Folks Finance gibi protokollerin grup yapısını bozmaz
 *
 * @param atc - AtomicTransactionComposer instance
 * @param params - Guard enforce parametreleri
 * @returns ATC with guard enforce added at the end
 */
export function appendGuardEnforceAtEnd(
  atc: algosdk.AtomicTransactionComposer,
  {
    sender,
    guardAppId,
    sp,
    signer,
  }: {
    sender: string
    guardAppId: number
    sp: algosdk.SuggestedParams
    signer: algosdk.TransactionSigner
  },
): algosdk.AtomicTransactionComposer {
  // ABI method tanımı (ARC-56)
  const enforce = new algosdk.ABIMethod({
    name: 'enforce',
    args: [],
    returns: { type: 'void' },
  })

  atc.addMethodCall({
    appID: guardAppId,
    method: enforce,
    methodArgs: [],
    sender,
    suggestedParams: { ...sp, flatFee: true, fee: 1000 },
    signer,
    // not: foreignApps/foreignAssets gerek yok
  })

  // eslint-disable-next-line no-console
  console.log(`Added PolicyGuard.enforce() (App ID: ${guardAppId}) to end of transaction group`)
  return atc
}
