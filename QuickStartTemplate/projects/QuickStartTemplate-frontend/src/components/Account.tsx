import { useWallet } from '@txnlab/use-wallet-react'
import { useMemo } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const Account = () => {
  const { activeAddress } = useWallet()
  const algoConfig = getAlgodConfigFromViteEnvironment()

  const networkName = useMemo(() => {
    return algoConfig.network === '' ? 'localnet' : algoConfig.network.toLocaleLowerCase()
  }, [algoConfig.network])

  return (
    <div className="p-4 rounded-2xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e5e7eb' }}>
      <a 
        className="text-xl font-semibold block mb-2 hover:underline" 
        target="_blank" 
        href={`https://lora.algokit.io/${networkName}/account/${activeAddress}/`}
        style={{ color: '#2d2df1' }}
      >
        Address: {ellipseAddress(activeAddress)}
      </a>
      <div className="text-lg" style={{ color: '#6b7280' }}>Network: {networkName}</div>
    </div>
  )
}

export default Account
