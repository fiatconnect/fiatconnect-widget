import React, { useState } from 'react'
import { useAsync } from 'react-use'
import Button from '@mui/material/Button'
import { signMessage } from '@wagmi/core'
import { useAccount, useNetwork } from 'wagmi'
import {
  createFiatConnectClient,
  chainIdToFiatConnectNetwork,
  providerIdToBaseUrl,
  getFiatConnectClient,
} from '../FiatConnectClient'
import { FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'

interface Props {
  onLoginSuccess: () => any
}

function SIWEConnectButton({ onLoginSuccess }: Props) {
  const account = useAccount()
  const network = useNetwork()
  // TODO: The "right" way to do this is probably through react-router-dom's "useSearchParams" hook
  const searchParams = new URLSearchParams(window.location.search)
  const apiKey = searchParams.get('apiKey')
  const providerId = searchParams.get('providerId') ?? undefined

  const [client, setClient] = useState<FiatConnectClient | undefined>(undefined)
  const [siweConnecting, setSiweConnecting] = useState(false)
  const [siweSuccess, setSiweSuccess] = useState(false)
  const [siweError, setSiweError] = useState(false)

  // For some reason (not fully understood by me) we need to do this in order
  // to get the fetching to work correctly, despite using the browser SDK.
  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    const response = await originalFetch(...args)
    return response
  }

  useAsync(async () => {
    if (!client) {
      return
    }
    try {
      const result = await client.login()
      result.unwrap()
      setSiweSuccess(true)
      setSiweConnecting(false)
      onLoginSuccess()
    } catch (e) {
      setSiweError(true)
      setSiweConnecting(false)
    }
  }, [client])

  const onClick = () => {
    if (
      !account.address ||
      network?.chain?.unsupported ||
      !network.chain ||
      !providerId
    ) {
      return
    }
    const baseUrl = providerIdToBaseUrl[providerId]
    if (!apiKey || !baseUrl) {
      return
    }

    const fiatConnectNetwork = chainIdToFiatConnectNetwork[network.chain.id]
    const signMessageWrapper = async (msg: string): Promise<string> => {
      const signedMessage = await signMessage({ message: msg })
      return signedMessage
    }

    const client = createFiatConnectClient({
      baseUrl,
      network: fiatConnectNetwork,
      accountAddress: account.address,
      apiKey,
      signingFunction: signMessageWrapper,
    })
    setClient(client)
    setSiweConnecting(true)
  }

  const getText = () => {
    if (!siweConnecting && !(siweSuccess || siweError)) {
      return `Sign in with Ethereum to ${providerId}`
    }
    if (siweSuccess) {
      return `Successfully signed in with Ethereum to ${providerId}!`
    }
    if (siweError) {
      return 'Error signing in with Ethereum'
    } else {
      return 'SIWE connecting, check your wallet...'
    }
  }

  const getTheme = () => {
    if (siweSuccess) {
      return {
        '&.Mui-disabled': {
          background: 'green',
          color: 'white',
        },
      }
    }
    if (siweError) {
      return {
        '&.Mui-disabled': {
          background: 'red',
          color: 'white',
        },
      }
    }
    if (siweConnecting) {
      return {
        '&.Mui-disabled': {
          background: 'grey',
          color: 'white',
        },
      }
    }
  }

  return (
    <div>
      <Button
        onClick={onClick}
        sx={getTheme()}
        variant="contained"
        disabled={!account.isConnected || siweConnecting || siweSuccess}
      >
        {getText()}
      </Button>
    </div>
  )
}
export default SIWEConnectButton
