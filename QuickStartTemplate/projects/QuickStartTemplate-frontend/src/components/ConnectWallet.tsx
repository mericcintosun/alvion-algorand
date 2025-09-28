// ConnectWallet.tsx
// Modal for selecting and connecting a wallet provider (Pera, Defly, KMD, etc).
// Uses @txnlab/use-wallet-react to manage multiple wallet options.
// 🔹 You don’t need to change logic in this file — it “just works”.
// 🔹 Safe place to redesign the modal UI if you want a different look.

import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import { BsWallet2, BsCheckCircleFill } from 'react-icons/bs'
import Account from './Account'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  // Detect KMD (LocalNet dev wallet) since it has no icon
  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${openModal ? 'modal-open' : ''}`}
    >
      <div className="modal-box rounded-2xl shadow-xl border p-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 font-heading" style={{ color: '#001324' }}>
          <div className="text-3xl" style={{ color: '#2d2df1' }}><BsWallet2 /></div>
          Select a Wallet
        </h3>

        <div className="space-y-4">
          {activeAddress && (
            <>
              <Account />
              <div className="h-px bg-neutral-700 my-4" />
            </>
          )}

          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 transform active:scale-95 border focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: '#f8fafc',
                  borderColor: '#e5e7eb',
                  color: '#001324',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                }}
                key={`provider-${wallet.id}`}
                onClick={() => {
                  return wallet.connect()
                }}
              >
                {!isKmd(wallet) && (
                  <img
                    alt={`wallet_icon_${wallet.id}`}
                    src={wallet.metadata.icon}
                    className="w-8 h-8 object-contain rounded-md"
                  />
                )}
                <span className="font-semibold text-lg flex-1 text-left">
                  {isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}
                </span>
                {wallet.isActive && (
                  <div className="text-xl" style={{ color: '#2d2df1' }}><BsCheckCircleFill /></div>
                )}
              </button>
            ))}
        </div>

        <div className="modal-action mt-6">
          <button
            data-test-id="close-wallet-modal"
            className="btn w-full sm:w-auto flex-1 rounded-2xl border-2"
            style={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#2d2df1', 
              color: '#2d2df1' 
            }}
            onClick={() => {
              closeModal()
            }}
          >
            Close
          </button>
          {activeAddress && (
            <button
              className="btn w-full sm:w-auto flex-1 rounded-2xl text-white"
              style={{ backgroundColor: '#dc2626' }}
              data-test-id="logout"
              onClick={async () => {
                if (wallets) {
                  const activeWallet = wallets.find((w) => w.isActive)
                  if (activeWallet) {
                    await activeWallet.disconnect()
                  } else {
                    localStorage.removeItem('@txnlab/use-wallet:v3')
                    window.location.reload()
                  }
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default ConnectWallet