import React, { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { login } from '../FiatConnectClient'
import { useFiatConnectConfig } from '../hooks/useFiatConnectConfig'
import { ProviderIds } from '../types'
import { providerIdToProviderName } from '../constants'

interface Props {
  providerId: ProviderIds
  onLoginSuccess: () => any
  onError: (title: string, message: string) => void
}

function SIWEConnectButton({ providerId, onLoginSuccess, onError }: Props) {
  const fiatConnectClientConfig = useFiatConnectConfig()
  const [siweConnecting, setSiweConnecting] = useState(false)
  const [siweSuccess, setSiweSuccess] = useState(false)
  const [siweError, setSiweError] = useState(false)

  const { signMessageAsync } = useSignMessage()

  const account = useAccount()
  const providerName = providerIdToProviderName[providerId]

  // For some reason (not fully understood by me) we need to do this in order
  // to get the fetching to work correctly, despite using the browser SDK.
  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    const response = await originalFetch(...args)
    return response
  }

  const onClick = async () => {
    try {
      if (!fiatConnectClientConfig) {
        throw new Error(`Invalid client config; should never happen`)
      }
      setSiweConnecting(true)
      const response = await login(
        (message) => signMessageAsync({ message }),
        fiatConnectClientConfig,
      )
      if (response.ok) {
        setSiweSuccess(true)
        setSiweConnecting(false)
        onLoginSuccess()
      } else {
        throw new Error(`Error logging in: ${await response.json()}`)
      }
    } catch (e) {
      setSiweError(true)
      onError(
        `There was an error signing in with ${providerName}.`,
        'This may be due to a misconfiguration by your wallet provider.',
      )
      setSiweConnecting(false)
    }
  }

  const getText = () => {
    if (!siweConnecting && !(siweSuccess || siweError)) {
      return `Sign in with ${providerName}`
    }
    if (siweError) {
      return 'Error signing in with Ethereum'
    } else {
      return 'Connecting...'
    }
  }

  return (
    <button
      onClick={onClick}
      id="SIWESignInButton"
      disabled={!account.isConnected || siweConnecting || siweSuccess}
    >
      {getText()}
    </button>
  )
}

export default SIWEConnectButton
