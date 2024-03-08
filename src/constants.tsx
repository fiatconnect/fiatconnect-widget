import React from 'react'
import {
  CryptoType,
  FiatAccountSchema,
  FiatType,
  Network,
} from '@fiatconnect/fiatconnect-types'
import { celo, celoAlfajores } from 'viem/chains'
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

export const cryptoTypeToAddress: Record<
  Network,
  Partial<Record<CryptoType, string>>
> = {
  [Network.Mainnet]: {
    [CryptoType.cUSD]: '0x765de816845861e75a25fca122bb6898b8b1282a',
    [CryptoType.cEUR]: '0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73',
    [CryptoType.cREAL]: '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787',
    [CryptoType.CELO]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  },
  [Network.Alfajores]: {
    [CryptoType.cUSD]: '0x874069fa1eb16d44d622f2e0ca25eea172369bc1',
    [CryptoType.cEUR]: '0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f',
    [CryptoType.cREAL]: '0xE4D517785D091D3c54818832dB6094bcc2744545',
    [CryptoType.CELO]: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
  },
}
