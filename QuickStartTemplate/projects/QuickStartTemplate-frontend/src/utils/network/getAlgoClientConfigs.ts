import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'
import { Algodv2, Indexer } from 'algosdk'

export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  if (!import.meta.env.VITE_ALGOD_SERVER) {
    throw new Error('Attempt to get default algod configuration without specifying VITE_ALGOD_SERVER in the environment variables')
  }

  return {
    server: import.meta.env.VITE_ALGOD_SERVER,
    port: import.meta.env.VITE_ALGOD_PORT,
    token: import.meta.env.VITE_ALGOD_TOKEN,
    network: import.meta.env.VITE_ALGOD_NETWORK,
  }
}

export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig {
  if (!import.meta.env.VITE_INDEXER_SERVER) {
    throw new Error('Attempt to get default algod configuration without specifying VITE_INDEXER_SERVER in the environment variables')
  }

  return {
    server: import.meta.env.VITE_INDEXER_SERVER,
    port: import.meta.env.VITE_INDEXER_PORT,
    token: import.meta.env.VITE_INDEXER_TOKEN,
    network: import.meta.env.VITE_ALGOD_NETWORK,
  }
}

export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  if (!import.meta.env.VITE_KMD_SERVER) {
    throw new Error('Attempt to get default kmd configuration without specifying VITE_KMD_SERVER in the environment variables')
  }

  return {
    server: import.meta.env.VITE_KMD_SERVER,
    port: import.meta.env.VITE_KMD_PORT,
    token: import.meta.env.VITE_KMD_TOKEN,
    wallet: import.meta.env.VITE_KMD_WALLET,
    password: import.meta.env.VITE_KMD_PASSWORD,
  }
}

export function getAlgodClient(): Algodv2 {
  const config = getAlgodConfigFromViteEnvironment()
  return new Algodv2(String(config.token || ''), config.server, config.port)
}

export function getIndexerClient(): Indexer {
  const config = getIndexerConfigFromViteEnvironment()
  return new Indexer(String(config.token || ''), config.server, config.port)
}
