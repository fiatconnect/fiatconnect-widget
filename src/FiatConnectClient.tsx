import {
  FiatConnectClient,
  FiatConnectClientConfig,
} from '@fiatconnect/fiatconnect-sdk'
import { Network } from '@fiatconnect/fiatconnect-types'

let client: FiatConnectClient | null = null

export function getFiatConnectClient(): FiatConnectClient {
  if (!client) {
    throw new Error(
      'No FiatConnect Client available. Have you created one first?',
    )
  }
  return client
}

export function createFiatConnectClient({
  baseUrl,
  network,
  accountAddress,
  apiKey,
  signingFunction,
}: FiatConnectClientConfig & {
  signingFunction: (message: string) => Promise<string>
}): FiatConnectClient {
  client = new FiatConnectClient(
    {
      baseUrl,
      network,
      accountAddress,
      apiKey,
    },
    signingFunction,
  )
  return client
}

export const chainIdToFiatConnectNetwork: Record<number, Network> = {
  [44787]: Network.Alfajores,
  [42220]: Network.Mainnet,
}

export const providerIdToBaseUrl: Record<string, string> = {
  bitmama: 'https://cico-staging.bitmama.io', // TODO(M1): get Bitmama to allow CORS
  'test-provider':
    'https://mock-fc-provider-dot-celo-mobile-alfajores.appspot.com',
}
