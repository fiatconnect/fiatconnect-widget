import { FiatConnectClientConfig } from '@fiatconnect/fiatconnect-sdk'
import { providerIdToBaseUrl } from './FiatConnectClient'
import { useAccount } from 'wagmi'
import { chainIdToFiatConnectNetwork } from './constants'
import { useSearchParams } from 'react-router-dom'
import { ProviderIds } from './types'

export function useFiatConnectConfig(): FiatConnectClientConfig | undefined {
  const account = useAccount()
  const [searchParams] = useSearchParams()
  const { chain } = useAccount()
  const apiKey = searchParams.get('apiKey')
  const providerId =
    (searchParams.get('providerId') as ProviderIds) ?? undefined

  if (
    !account.address ||
    !chain ||
    !providerId
  ) {
    return
  }

  const baseUrl = providerIdToBaseUrl[providerId]
  const fiatConnectNetwork = chainIdToFiatConnectNetwork[chain.id]
  if (!baseUrl || !fiatConnectNetwork) {
    return
  }
  return {
    baseUrl,
    network: fiatConnectNetwork,
    accountAddress: account.address,
    apiKey: apiKey ?? undefined,
  }
}
