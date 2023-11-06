import React, { useState, useEffect } from 'react'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Steps, queryParamsSchema } from './types'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { celoAlfajores } from 'viem/chains'
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  Theme,
} from '@rainbow-me/rainbowkit'
import { useActionData, useSearchParams } from 'react-router-dom'
import '@fontsource/inter'
import { StepsHeader } from './components/StepsHeader'
import { ErrorSection } from './components/ErrorSection'
import { providerIdToProviderName } from './constants'
import { SignInScreen } from './components/SignInScreen'
import merge from 'lodash.merge'

const { chains, publicClient } = configureChains(
  [celoAlfajores],
  [publicProvider()],
)
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'ccf8cc7da29e8b1ed52a455b808f2699',
  chains,
})
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

function useQueryParams() {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries(searchParams)
  return queryParamsSchema.safeParse(searchParamsObject)
}

const DEFAULT_ERROR_TITLE = 'There was an error processing your request.'
const DEFAULT_ERROR_MESSAGE =
  'This is typically due to a misconfiguration by your wallet provider.'

function App() {
  const queryParamsResults = useQueryParams()
  const [step, setStep] = useState(Steps.One)
  const [errorTitle, setErrorTitle] = useState(DEFAULT_ERROR_TITLE)
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE)
  const [showError, setShowError] = useState(false)

  const onError = (title: string, message: string) => {
    setErrorTitle(title)
    setErrorMessage(message)
    setShowError(true)
  }

  const getSection = () => {
    // TODO: should never happen
    if (!queryParamsResults.success) {
      return
    }
    if (step === Steps.One) {
      return (
        <SignInScreen
          onError={onError}
          onNext={setStep}
          params={queryParamsResults.data}
        />
      )
    }
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
          <header className="App-header">
            <div className="Container">
              {queryParamsResults.success && !showError ? (
                <div className="SectionContainer">
                  <div className="ProviderTitle">
                    {
                      providerIdToProviderName[
                        queryParamsResults.data.providerId
                      ]
                    }
                  </div>
                  <StepsHeader step={step} />
                  {getSection()}
                </div>
              ) : (
                <div className="ErrorContainer">
                  {queryParamsResults.success && (
                    <div>
                      <div className="ProviderTitle">
                        {
                          providerIdToProviderName[
                            queryParamsResults.data.providerId
                          ]
                        }
                      </div>
                      <StepsHeader step={step} />
                    </div>
                  )}
                  <ErrorSection title={errorTitle} message={errorMessage} />
                </div>
              )}
            </div>
          </header>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
