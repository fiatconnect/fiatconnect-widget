import { Network } from '@fiatconnect/fiatconnect-types'
import { celo, celoAlfajores } from 'viem/chains'
import { ProviderIds } from './types'

export const fiatConnectNetworkToChainId: Record<Network, number> = {
  [Network.Mainnet]: celo.id,
  [Network.Alfajores]: celoAlfajores.id,
}

export const chainIdToFiatConnectNetwork: Record<number, Network> =
  Object.entries(fiatConnectNetworkToChainId).reduce(
    (acc, [network, id]) => ({
      ...acc,
      [id]: network,
    }),
    {},
  )

export const providerIdToProviderName: Record<ProviderIds, string> = {
  [ProviderIds.Bitmama]: 'Bitmama'
}
