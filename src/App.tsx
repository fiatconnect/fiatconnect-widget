import React from 'react'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'

import { publicProvider } from 'wagmi/providers/public'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { celoAlfajores } from 'viem/chains'
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import SIWEConnectButton from './components/SIWEConnectButton'

const { chains, publicClient } = configureChains(
  [celoAlfajores],
  [publicProvider()],
)
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'ccf8cc7da29e8b1ed52a455b808f2699',
  chains,
})
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
          <header className="App-header">
            <ConnectButton />
            <SIWEConnectButton />
          </header>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
