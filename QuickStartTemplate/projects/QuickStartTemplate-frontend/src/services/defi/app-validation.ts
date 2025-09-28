import algosdk from 'algosdk'
import { getAlgodClient } from '../../utils/network/getAlgoClientConfigs'
import { getNetwork, getXAlgoDistributorAppId, getPolicyGuardAppId } from '../../config/folks'

const ALGOD = getAlgodClient()

/**
 * App ID'nin mevcut ağda var olup olmadığını kontrol eder
 * @param appId - Kontrol edilecek app ID
 * @throws Error if app doesn't exist on current network
 */
export async function assertAppExists(appId: number): Promise<void> {
  try {
    await ALGOD.getApplicationByID(appId).do()
    // eslint-disable-next-line no-console
    console.log(`✅ App ${appId} exists on ${getNetwork()}`)
  } catch (error) {
    const network = getNetwork()
    throw new Error(
      `❌ App ${appId} does not exist on ${network}. ` +
        `Please check VITE_ALGONET=${import.meta.env.VITE_ALGONET} and app ID configuration. ` +
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Tüm gerekli app'lerin mevcut ağda var olduğunu kontrol eder
 */
export async function validateAllApps(): Promise<void> {
  const network = getNetwork()
  // eslint-disable-next-line no-console
  console.log(`🔍 Validating apps on ${network}...`)

  // PolicyGuard app ID'sini kontrol et - network-aware config kullan
  const guardAppId = getPolicyGuardAppId()
  await assertAppExists(guardAppId)

  // Folks xALGO distributor app ID'sini kontrol et - network-aware config kullan
  const folksAppId = getXAlgoDistributorAppId()
  await assertAppExists(folksAppId)

  // eslint-disable-next-line no-console
  console.log(`✅ All required apps exist on ${network}`)
}
