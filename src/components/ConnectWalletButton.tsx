import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from 'styled-components'
import { Button } from '../styles'

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
          <ButtonContainer
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    style={{ backgroundColor: '#5987ff' }}
                    type="button"
                  >
                    Connect Your Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    style={{ backgroundColor: '#e38580' }}
                    type="button"
                  >
                    Wrong network
                  </Button>
                )
              }

              return (
                <Button
                  onClick={openAccountModal}
                  style={{ backgroundColor: '#bacdff' }}
                  type="button"
                >
                  Connected to {account.displayName}
                </Button>
              )
            })()}
          </ButtonContainer>
        )
      }}
    </ConnectButton.Custom>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
`

export default ConnectWalletButton
