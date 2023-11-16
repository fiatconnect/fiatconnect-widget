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

export const fiatTypeToSymbol: Record<FiatType, string> = {
  [FiatType.USD]: '$',
  [FiatType.EUR]: '€',
  [FiatType.BRL]: 'R$',
  [FiatType.GNF]: 'FG',
  [FiatType.INR]: '₹',
  [FiatType.NGN]: '₦',
  [FiatType.GHS]: 'GH₵',
  [FiatType.KES]: 'KSh',
  [FiatType.ZAR]: 'R',
  [FiatType.PHP]: '₱',
  [FiatType.UGX]: 'USh',
  [FiatType.GBP]: '£',
  [FiatType.XOF]: 'CFA',
  [FiatType.RWF]: 'RF',
  [FiatType.CNY]: '¥',
  [FiatType.XAF]: 'FCFA',
  [FiatType.ARS]: '$',
  [FiatType.BOB]: 'Bs.',
  [FiatType.CLP]: '$',
  [FiatType.COP]: '$',
  [FiatType.FKP]: '£',
  [FiatType.GYD]: '$',
  [FiatType.PYG]: '₲',
  [FiatType.PEN]: 'S/',
  [FiatType.SRD]: '$',
  [FiatType.UYU]: '$U',
  [FiatType.VES]: 'Bs.',
  [FiatType.MXN]: '$',
  [FiatType.PAB]: 'B/.',
}
