import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { PolicyGuardFactory } from '../artifacts/policy_guard/PolicyGuardClient'

// Policy Guard deployment configuration
export async function deploy() {
  console.log('=== Deploying PolicyGuard ===')

  const algorand = AlgorandClient.fromEnvironment()
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')

  const factory = algorand.client.getTypedAppFactory(PolicyGuardFactory, {
    defaultSender: deployer.addr,
  })

  // Deploy with initial parameters
  const { appClient, result } = await factory.deploy({ 
    onUpdate: 'append', 
    onSchemaBreak: 'append',
    // Initial parameters for init method
    method: 'init',
    methodArgs: [
      200_000, // maxFee: 0.2 ALGO
      1_000_000_000, // maxAmount: 1000 ALGO
      50 // maxSlipBps: 0.5%
    ]
  })

  // If app was just created fund the app account
  if (['create', 'replace'].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    })
  }

  console.log(`PolicyGuard deployed at app ID: ${appClient.appId}`)
  console.log(`PolicyGuard app address: ${appClient.appAddress}`)

  // Set allowed apps (you can modify these with actual app IDs)
  try {
    await appClient.send.setAllowedApps({
      args: {
        folksDeposit: 0, // Replace with actual Folks Finance deposit app ID
        folksStaking: 0, // Replace with actual Folks Finance staking app ID
        tinymanRouter: 0, // Replace with actual Tinyman router app ID
        tinymanPool: 0, // Replace with actual Tinyman pool app ID
      }
    })
    console.log('Allowed apps set successfully')
  } catch (error) {
    console.log('Note: Allowed apps not set (using default values)')
  }

  return { appClient, result }
}

