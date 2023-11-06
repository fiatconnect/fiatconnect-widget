import {
  AuthRequestBody,
  PostFiatAccountRequestBody,
} from '@fiatconnect/fiatconnect-types'
import { generateNonce, SiweMessage } from 'siwe'
import { getAddress } from 'ethers'
import {
  FiatConnectClientConfig,
  LoginParams,
} from '@fiatconnect/fiatconnect-sdk'
import { createSiweConfig } from '@fiatconnect/fiatconnect-sdk/dist/fiat-connect-client'
import { fiatConnectNetworkToChainId } from './constants'
import { ProviderIds } from './types'

export function addFiatAccount(
  params: PostFiatAccountRequestBody,
  clientConfig: FiatConnectClientConfig,
) {
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
  clientConfig: FiatConnectClientConfig,
  params?: LoginParams,
) {
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
    address: getAddress(siweConfig.accountAddress),
    statement: siweConfig.statement,
    uri: siweConfig.loginUrl,
    version: siweConfig.version,
    chainId: fiatConnectNetworkToChainId[clientConfig.network],
    nonce: generateNonce(),
    issuedAt: issuedAt.toISOString(),
    expirationTime: expirationTime.toISOString(),
  })
  const message = siweMessage.prepareMessage()
  const body: AuthRequestBody = {
    message,
    signature: await signingFunction(message),
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (clientConfig.apiKey) {
    headers['Authorization'] = `Bearer ${clientConfig.apiKey}`
  }

  return await fetch(siweConfig.loginUrl, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
  })
}

export const providerIdToBaseUrl: Record<ProviderIds, string> = {
  [ProviderIds.Bitmama]:
    'https://quiet-castle-48076-f4c3da6faaae.herokuapp.com/https://cico-staging.bitmama.io', // todo do something smarter than hardcoding this CORS proxy in (like ask Bitmama to allow CORS)
  [ProviderIds.TestProvider]:
    'https://mock-fc-provider-dot-celo-mobile-alfajores.appspot.com',
}
