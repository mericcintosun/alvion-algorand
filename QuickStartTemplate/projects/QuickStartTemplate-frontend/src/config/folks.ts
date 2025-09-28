/**
 * Folks Finance App ID'leri - Network-aware configuration
 * MainNet ve TestNet için doğru app ID'leri
 */

export const FOLKS_IDS = {
  mainnet: {
    xalgoDistributorAppId: 1134695678, // MainNet xALGO Distributor
  },
  testnet: {
    xalgoDistributorAppId: 730430673, // TestNet xALGO Distributor (Immunefi audit scope)
  },
} as const

export function getNetwork() {
  return (import.meta.env.VITE_ALGONET ?? 'testnet') as 'mainnet' | 'testnet'
}

export function getXAlgoDistributorAppId() {
  return FOLKS_IDS[getNetwork()].xalgoDistributorAppId
}

export function getPolicyGuardAppId() {
  return Number(import.meta.env.VITE_POLICY_GUARD_APP_ID || '746499797')
}

export function getTinymanValidatorAppId() {
  return Number(import.meta.env.VITE_TINYMAN_V2_VALIDATOR_APP_ID || '148607000')
}
