import { getClients } from './indexer'
import { fetchAssetParams } from './assets'

export type Holding = {
  id: number // 0 = ALGO
  amountMicro: bigint
  amount: number // decimals normalize
  name: string
  unitName: string
  decimals: number
}

export async function getPortfolio(address: string): Promise<Holding[]> {
  const { indexer, algod } = getClients()
  const acc = await indexer.lookupAccountByID(address).do() // /v2/accounts/:addr
  const holdings: Holding[] = []

  // ALGO
  const algoMicro = BigInt(acc.account.amount || 0)
  holdings.push({
    id: 0,
    amountMicro: algoMicro,
    decimals: 6,
    amount: Number(algoMicro) / 1e6,
    name: 'Algorand',
    unitName: 'ALGO',
  })

  // ASA'lar
  const assets = acc.account.assets || []
  for (const a of assets) {
    const id = Number(a.assetId)
    if (!id || id === 0) continue // Skip invalid asset IDs

    try {
      const decimals = await fetchAssetParams(algod, id).then((x) => x.decimals)
      const nameUnit = await fetchAssetParams(algod, id)
      const micro = BigInt(a.amount || 0)
      holdings.push({
        id,
        amountMicro: micro,
        decimals,
        amount: Number(micro) / 10 ** decimals,
        name: nameUnit.name || `ASA ${id}`,
        unitName: nameUnit.unitName || '',
      })
    } catch (error) {
      console.warn(`Failed to fetch asset ${id}:`, error)
      // Add with basic info if asset fetch fails
      const micro = BigInt(a.amount || 0)
      holdings.push({
        id,
        amountMicro: micro,
        decimals: 0,
        amount: Number(micro),
        name: `ASA ${id}`,
        unitName: '',
      })
    }
  }
  return holdings
}
