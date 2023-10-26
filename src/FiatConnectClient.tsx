import {
  FiatConnectClient,
  FiatConnectClientConfig,
} from '@fiatconnect/fiatconnect-sdk/dist/index-browser'
import {
  AuthRequestBody,
  Network,
  PostFiatAccountRequestBody,
} from '@fiatconnect/fiatconnect-types'
import { generateNonce, SiweMessage } from 'siwe'
import { ethers } from 'ethers'
import { LoginParams } from '@fiatconnect/fiatconnect-sdk/src/types'
import { createSiweConfig } from '@fiatconnect/fiatconnect-sdk/dist/fiat-connect-client'

let client: FiatConnectClient | null = null

let clientConfig: FiatConnectClientConfig | null = null

// let cookies: string | null = null

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
  clientConfig = {
    baseUrl,
    network,
    accountAddress,
    apiKey,
  }
  client = new FiatConnectClient(clientConfig, signingFunction)
  return client
}

// trying out sidestepping the sdk to see if cookie error still happens
export function addFiatAccount(
  // baseUrl: string,
  // apiKey: string,
  params: PostFiatAccountRequestBody,
) {
  if (!clientConfig || !client) throw new Error('no client config or client')
  // const cookies = client.getCookies()
  // eslint-disable-next-line no-console
  // console.log(`cookies: ${JSON.stringify(cookies)}`)
  return fetch(`${clientConfig.baseUrl}/accounts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientConfig.apiKey}`,
    },
    body: JSON.stringify(params),
  })
}

export async function login(
  signingFunction: (message: string) => Promise<string>,
  params?: LoginParams,
) {
  if (!clientConfig) {
    throw new Error('initialize clientConfig first')
  }
  const issuedAt = params?.issuedAt ?? new Date()

  const siweConfig = createSiweConfig(clientConfig)
  const expirationTime = new Date(
    issuedAt.getTime() + siweConfig.sessionDurationMs,
  )
  const siweMessage = new SiweMessage({
    domain: new URL(siweConfig.loginUrl).hostname,
    // Some SIWE validators compare this against the checksummed signing address,
    // and thus will always fail if this address is not checksummed. This coerces
    // non-checksummed addresses to be checksummed.
    address: ethers.utils.getAddress(siweConfig.accountAddress),
    statement: siweConfig.statement,
    uri: siweConfig.loginUrl,
    version: siweConfig.version,
    chainId: 44787, // todo get from config
    nonce: generateNonce(),
    issuedAt: issuedAt.toISOString(),
    expirationTime: expirationTime.toISOString(),
  })
  const message = siweMessage.prepareMessage()
  const body: AuthRequestBody = {
    message,
    signature: await signingFunction(message),
  }

  return await fetch(siweConfig.loginUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${clientConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const chainIdToFiatConnectNetwork: Record<number, Network> = {
  [44787]: Network.Alfajores,
  [42220]: Network.Mainnet,
}

export const providerIdToBaseUrl: Record<string, string> = {
  bitmama:
    'https://quiet-castle-48076-f4c3da6faaae.herokuapp.com/https://cico-staging.bitmama.io', // todo do something smarter than hardcoding this CORS proxy in (like ask Bitmama to allow CORS)
  'test-provider':
    'https://mock-fc-provider-dot-celo-mobile-alfajores.appspot.com',
}
