import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { signMessage } from '@wagmi/core'
import { useAccount, useNetwork } from 'wagmi'
import { login } from '../FiatConnectClient'
import { useFiatConnectConfig } from '../hooks'

interface Props {
  onLoginSuccess: () => any
}

function SIWEConnectButton({ onLoginSuccess }: Props) {
  const fiatConnectClientConfig = useFiatConnectConfig()
  const [siweConnecting, setSiweConnecting] = useState(false)
  const [siweSuccess, setSiweSuccess] = useState(false)
  const [siweError, setSiweError] = useState(false)

  const searchParams = new URLSearchParams(window.location.search)
  const providerId = searchParams.get('providerId') ?? undefined

  const account = useAccount()

  // For some reason (not fully understood by me) we need to do this in order
  // to get the fetching to work correctly, despite using the browser SDK.
  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    const response = await originalFetch(...args)
    return response
  }

  const loginAsync = async () => {
    if (!fiatConnectClientConfig) {
      return
    }
    try {
      const response = await login(
        (message) => signMessage({ message }),
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
      setSiweConnecting(false)
    }
  }

  const onClick = () => {
    if (!fiatConnectClientConfig) {
      return
    }

    setSiweConnecting(true)
    void loginAsync()
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
