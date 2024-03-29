import { FiatConnectClientConfig } from '@fiatconnect/fiatconnect-sdk'
import { useAccount, useNetwork } from 'wagmi'
import { chainIdToFiatConnectNetwork } from './constants'
import { useSearchParams } from 'react-router-dom'
import { ProviderIds, providerIdToBaseUrl } from './providerConfig'

export function useFiatConnectConfig(): FiatConnectClientConfig | undefined {
  const account = useAccount()
  const network = useNetwork()
  const [searchParams] = useSearchParams()
  const apiKey = searchParams.get('apiKey')
  const providerId =
    (searchParams.get('providerId') as ProviderIds) ?? undefined

  if (
    !account.address ||
    network?.chain?.unsupported ||
    !network.chain ||
    !providerId
  ) {
    return
  }

  const baseUrl = providerIdToBaseUrl[providerId]
  const fiatConnectNetwork = chainIdToFiatConnectNetwork[network.chain.id]
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
