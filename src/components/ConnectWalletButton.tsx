import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from 'styled-components'
import { Button } from '../styles'

const ConnectWalletButtonAfterConnecting = styled.button`
  flex-grow: 1;
  display: flex;
  border: 0px;
  justify-content: center;
  align-items: center;
  background-color: #bacdff;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  height: 55px;
`

// Largely copy-pasted from here: https://www.rainbowkit.com/docs/custom-connect-button
function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            id="ConnectWalletButton-Wrapper"
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    style={{ flexGrow: 1 }}
                    onClick={openConnectModal}
                    type="button"
                    data-testid="connect-wallet-button"
                  >
                    Connect Your Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }

              return (
                <ConnectWalletButtonAfterConnecting
                  onClick={openAccountModal}
                  type="button"
                  data-testid="connected-wallet-button"
                >
                  Connected to {account.displayName}
                </ConnectWalletButtonAfterConnecting>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default ConnectWalletButton
