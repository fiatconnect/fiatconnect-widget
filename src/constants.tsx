import React from 'react'
import {
  Network,
  FiatAccountSchema,
  FiatType,
  CryptoType,
} from '@fiatconnect/fiatconnect-types'
import { celo, celoAlfajores } from 'viem/chains'
import { ProviderIds } from './types'
import USDIcon from './icons/fiat/USDIcon'
import CELO from './images/crypto/CELO.png'

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
  [ProviderIds.Bitmama]: 'Bitmama',
  [ProviderIds.TestProvider]: 'Test Provider',
}

export const fiatAccountSchemaToPaymentMethod: Record<
  FiatAccountSchema,
  string
> = {
  [FiatAccountSchema.AccountNumber]: 'Account Number',
  [FiatAccountSchema.MobileMoney]: 'Mobile Money',
  [FiatAccountSchema.DuniaWallet]: 'Dunia Wallet',
  [FiatAccountSchema.IBANNumber]: 'IBAN Number',
  [FiatAccountSchema.IFSCAccount]: 'IFSC Account',
  [FiatAccountSchema.PIXAccount]: 'PIX Account',
}

export const fiatTypeToImage: Partial<Record<FiatType, JSX.Element>> = {
  [FiatType.USD]: USDIcon,
}

export const cryptoTypeToImage: Partial<Record<CryptoType, JSX.Element>> = {
  [CryptoType.CELO]: <img src={CELO} id="TokenIcon" />,
}
