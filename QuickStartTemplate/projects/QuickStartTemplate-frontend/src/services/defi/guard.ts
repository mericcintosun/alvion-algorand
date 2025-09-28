import algosdk from 'algosdk'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { PolicyGuardClient } from '../../contracts/PolicyGuard'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import { getXAlgoDistributorAppId, getTinymanValidatorAppId, getPolicyGuardAppId } from '../../config/folks'

export async function setAllowedApps({ creatorAddr, signer }: { creatorAddr: string; signer: algosdk.TransactionSigner }) {
  // eslint-disable-next-line no-console
  console.log('Setting allowed apps for PolicyGuard')

  // Network-aware app ID'leri kullan
  const guardAppId = BigInt(getPolicyGuardAppId())
  const folksDistributor = BigInt(getXAlgoDistributorAppId())
  const folksStaking = BigInt(0) // şimdilik yoksa 0 bırak
  const tinymanValidator = BigInt(getTinymanValidatorAppId())
  const tinymanPool = BigInt(0) // pool App yok; V2'de pool hesapları LogicSig, 0 geç

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })

  const guard = new PolicyGuardClient({
    appId: guardAppId,
    algorand,
  })

  // PolicyGuard client ile method call yap
  const result = await guard.send.setAllowedApps({
    sender: creatorAddr,
    signer,
    args: {
      folksDeposit: folksDistributor,
      folksStaking: folksStaking,
      tinymanRouter: tinymanValidator,
      tinymanPool: tinymanPool,
    },
  })

  return result
}

export async function checkPolicyGuardState({ creatorAddr, signer }: { creatorAddr: string; signer: algosdk.TransactionSigner }) {
  // eslint-disable-next-line no-console
  console.log('Checking PolicyGuard state...')

  // Network-aware app ID'leri kullan
  const guardAppId = BigInt(getPolicyGuardAppId())
  const folksDistributor = BigInt(getXAlgoDistributorAppId())

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })

  try {
    // PolicyGuard'ın global state'ini oku
    const appInfo = await algorand.client.algod.getApplicationByID(Number(guardAppId)).do()
    // eslint-disable-next-line no-console
    console.log('PolicyGuard global state:', appInfo.params.globalState)

    // Folks app ID'nin allowed apps'te olup olmadığını kontrol et
    const globalState = appInfo.params.globalState || []
    const folksAppInState = globalState.find((state) => {
      const key = Buffer.from(state.key).toString()
      return key === 'folks_dep' && Number(state.value.uint) === Number(folksDistributor)
    })

    if (folksAppInState) {
      // eslint-disable-next-line no-console
      console.log('✅ Folks app ID is properly configured in PolicyGuard')
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Folks app ID is NOT configured in PolicyGuard. Setting it now...')
      // setAllowedApps'i çağır
      await setAllowedApps({ creatorAddr, signer })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking PolicyGuard state:', error)
    // eslint-disable-next-line no-console
    console.log('Attempting to set allowed apps...')
    await setAllowedApps({ creatorAddr, signer })
  }
}
