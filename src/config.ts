import { Chain } from 'viem'
import { Network } from '@fiatconnect/fiatconnect-types'
import { celo, celoAlfajores } from 'viem/chains'

const DEFAULT_WC_PROJECT_ID = 'ccf8cc7da29e8b1ed52a455b808f2699'
const DEFAULT_WC_APP_NAME = 'FiatConnect Widget'

export interface Config {
  walletConnect: {
    appName: string
    projectId: string
  }
  wagmi: {
    defaultChains: Chain[]
  }
  fiatConnectNetwork: Network
}

export function loadConfig(): Config {
  const appName = process.env.WALLET_CONNECT_APP_NAME ?? DEFAULT_WC_APP_NAME
  const projectId =
    process.env.WALLET_CONNECT_PROJECT_ID ?? DEFAULT_WC_PROJECT_ID
  const defaultChains =
    process.env.NETWORK_ENVIRONMENT === 'mainnet' ? [celo] : [celoAlfajores]
  const fiatConnectNetwork =
    process.env.NETWORK_ENVIRONMENT === 'mainnet'
      ? Network.Mainnet
      : Network.Alfajores
  return {
    walletConnect: {
      appName,
      projectId,
    },
    wagmi: {
      defaultChains,
    },
    fiatConnectNetwork,
  }
}
