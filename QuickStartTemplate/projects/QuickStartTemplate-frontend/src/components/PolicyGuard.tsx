import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AiOutlineSecurityScan, AiOutlineLoading3Quarters, AiOutlineWarning, AiOutlineSetting } from 'react-icons/ai'
import { PolicyGuardFactory } from '../contracts/PolicyGuardClient'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface PolicyGuardInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const PolicyGuard = ({ openModal, setModalState }: PolicyGuardInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [deployLoading, setDeployLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [appId, setAppId] = useState<string>('')
  const [maxFee, setMaxFee] = useState<string>('200000')
  const [maxAmount, setMaxAmount] = useState<string>('1000000000')
  const [maxSlippage, setMaxSlippage] = useState<string>('50')
  const [folksDeposit, setFolksDeposit] = useState<string>('0')
  const [folksStaking, setFolksStaking] = useState<string>('0')
  const [tinymanRouter, setTinymanRouter] = useState<string>('0')
  const [tinymanPool, setTinymanPool] = useState<string>('0')
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  const deployPolicyGuard = async () => {
    setDeployLoading(true)

    try {
      const factory = new PolicyGuardFactory({
        defaultSender: activeAddress ?? undefined,
        algorand,
      })

      const deployResult = await factory.deploy({
        onSchemaBreak: OnSchemaBreak.AppendApp,
        onUpdate: OnUpdate.AppendApp,
        createParams: {
          method: 'init',
          args: [
            BigInt(maxFee),
            BigInt(maxAmount),
            BigInt(maxSlippage)
          ]
        }
      })

      if (deployResult) {
        const { appClient } = deployResult
        setAppId(appClient.appId.toString())
        enqueueSnackbar(`Policy Guard deployed successfully! App ID: ${appClient.appId}`, { variant: 'success' })
      }
    } catch (e: any) {
      enqueueSnackbar(`Error deploying Policy Guard: ${e.message}`, { variant: 'error' })
    } finally {
      setDeployLoading(false)
    }
  }

  const updatePolicy = async () => {
    if (!appId) {
      enqueueSnackbar('Please deploy or enter an App ID first', { variant: 'error' })
      return
    }

    setUpdateLoading(true)

    try {
      const factory = new PolicyGuardFactory({
        defaultSender: activeAddress ?? undefined,
        algorand,
      })

      const appClient = factory.getAppClientById({ appId: BigInt(parseInt(appId)) })
      
      await appClient.send.updatePolicy({
        args: {
          maxFee: BigInt(maxFee),
          maxAmount: BigInt(maxAmount),
          maxSlipBps: BigInt(maxSlippage)
        }
      })

      enqueueSnackbar('Policy updated successfully!', { variant: 'success' })
    } catch (e: any) {
      enqueueSnackbar(`Error updating policy: ${e.message}`, { variant: 'error' })
    } finally {
      setUpdateLoading(false)
    }
  }

  const setAllowedApps = async () => {
    if (!appId) {
      enqueueSnackbar('Please deploy or enter an App ID first', { variant: 'error' })
      return
    }

    setLoading(true)

    try {
      const factory = new PolicyGuardFactory({
        defaultSender: activeAddress ?? undefined,
        algorand,
      })

      const appClient = factory.getAppClientById({ appId: BigInt(parseInt(appId)) })
      
      await appClient.send.setAllowedApps({
        args: {
          folksDeposit: BigInt(parseInt(folksDeposit) || 0),
          folksStaking: BigInt(parseInt(folksStaking) || 0),
          tinymanRouter: BigInt(parseInt(tinymanRouter) || 0),
          tinymanPool: BigInt(parseInt(tinymanPool) || 0),
        }
      })

      enqueueSnackbar('Allowed apps updated successfully!', { variant: 'success' })
    } catch (e: any) {
      enqueueSnackbar(`Error setting allowed apps: ${e.message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const enforcePolicy = async () => {
    if (!appId) {
      enqueueSnackbar('Please deploy or enter an App ID first', { variant: 'error' })
      return
    }

    setLoading(true)

    try {
      const factory = new PolicyGuardFactory({
        defaultSender: activeAddress ?? undefined,
        algorand,
      })

      const appClient = factory.getAppClientById({ appId: BigInt(parseInt(appId)) })
      
      await appClient.send.enforce({ args: {} })

      enqueueSnackbar('Policy enforcement check completed successfully!', { variant: 'success' })
    } catch (e: any) {
      enqueueSnackbar(`Policy enforcement failed: ${e.message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog
      id="policyguard_modal"
      className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${openModal ? 'modal-open' : ''}`}
    >
      <div className="modal-box bg-neutral-800 text-gray-100 rounded-2xl shadow-xl border border-neutral-700 p-6 max-w-4xl">
        <h3 className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 mb-6">
          <div className="text-3xl"><AiOutlineSecurityScan /></div>
          Policy Guard Management
        </h3>

        <div className="bg-neutral-700 p-4 rounded-xl mb-6">
          <p className="flex items-center gap-2 text-sm text-gray-400">
            <div className="text-xl text-yellow-400"><AiOutlineWarning /></div>
            Policy Guard kontratı ile güvenlik politikalarını yönetin ve uygulayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deploy Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <div className="text-xl"><AiOutlineSetting /></div>
              Deploy Policy Guard
            </h4>
            
            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Max Fee (microAlgo)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  placeholder="200000"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Max Amount (microAlgo)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="1000000000"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Max Slippage (bps)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                  value={maxSlippage}
                  onChange={(e) => setMaxSlippage(e.target.value)}
                  placeholder="50"
                />
              </div>

              <button
                className="btn w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={deployPolicyGuard}
                disabled={deployLoading}
              >
                {deployLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin"><AiOutlineLoading3Quarters /></div>
                    Deploying...
                  </span>
                ) : (
                  'Deploy Policy Guard'
                )}
              </button>
            </div>
          </div>

          {/* App ID Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400">App ID</h4>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Policy Guard App ID</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Enter App ID or deploy to get one"
              />
            </div>

            <div className="space-y-2">
              <button
                className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={updatePolicy}
                disabled={updateLoading || !appId}
              >
                {updateLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin"><AiOutlineLoading3Quarters /></div>
                    Updating...
                  </span>
                ) : (
                  'Update Policy'
                )}
              </button>

              <button
                className="btn w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={enforcePolicy}
                disabled={loading || !appId}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin"><AiOutlineLoading3Quarters /></div>
                    Checking...
                  </span>
                ) : (
                  'Enforce Policy'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Allowed Apps Section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-orange-400">Allowed Applications</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Folks Deposit App ID</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                value={folksDeposit}
                onChange={(e) => setFolksDeposit(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Folks Staking App ID</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                value={folksStaking}
                onChange={(e) => setFolksStaking(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Tinyman Router App ID</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                value={tinymanRouter}
                onChange={(e) => setTinymanRouter(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Tinyman Pool App ID</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600"
                value={tinymanPool}
                onChange={(e) => setTinymanPool(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <button
            className="btn w-full bg-purple-500 hover:bg-purple-600 text-white"
            onClick={setAllowedApps}
            disabled={loading || !appId}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin"><AiOutlineLoading3Quarters /></div>
                Setting Apps...
              </span>
            ) : (
              'Set Allowed Apps'
            )}
          </button>
        </div>

        <div className="modal-action mt-6 flex flex-col-reverse sm:flex-row-reverse gap-3">
          <button
            type="button"
            className="btn w-full sm:w-auto bg-neutral-700 hover:bg-neutral-600 border-none text-gray-300 rounded-xl"
            onClick={() => setModalState(false)}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default PolicyGuard
