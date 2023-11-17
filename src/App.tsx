import React, { useMemo, useState } from 'react'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Steps } from './types'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { useSearchParams } from 'react-router-dom'
import '@fontsource/inter'
import { StepsHeader } from './components/StepsHeader'
import { ErrorSection } from './components/ErrorSection'
import { providerIdToProviderName } from './constants'
import { SignInScreen } from './components/SignInScreen'
import { PaymentInfoScreen } from './components/PaymentInfoScreen'
import { UserActionDetails } from './components/UserActionDetails'
import { ReviewScreen } from './components/ReviewScreen'
import {
  ObfuscatedFiatAccountData,
  TransferResponse,
} from '@fiatconnect/fiatconnect-types'
import { loadConfig } from './config'
import { queryParamsSchema } from './schema'

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
  if (!queryParamsResults.success) {
    //eslint-disable-next-line no-console
    console.error('Invalid query params: ', queryParamsResults.error)
  }
  const [step, setStep] = useState(Steps.One)
  const [errorTitle, setErrorTitle] = useState(DEFAULT_ERROR_TITLE)
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE)
  const [showError, setShowError] = useState(false)
  const [linkedAccount, setLinkedAccount] = useState<
    ObfuscatedFiatAccountData | undefined
  >(undefined)
  const [transferResponse, setTransferResponse] = useState<
    TransferResponse | undefined
  >(undefined)

  const config = loadConfig()
  const { chains, publicClient } = useMemo(
    () => configureChains(config.wagmi.defaultChains, [publicProvider()]),
    [config],
  )
  const wagmiConfig = useMemo(() => {
    const { connectors } = getDefaultWallets({
      appName: config.walletConnect.appName,
      projectId: config.walletConnect.projectId,
      chains,
    })
    return createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    })
  }, [config])

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
          setLinkedAccount={setLinkedAccount}
        />
      )
    }
    if (step === Steps.Two) {
      return (
        <PaymentInfoScreen
          onError={onError}
          onNext={setStep}
          params={queryParamsResults.data}
          setLinkedAccount={setLinkedAccount}
        />
      )
    }
    if (step === Steps.Three && linkedAccount) {
      return (
        <ReviewScreen
          onError={onError}
          onNext={setStep}
          params={queryParamsResults.data}
          linkedAccount={linkedAccount}
          setTransferResponse={setTransferResponse}
        />
      )
    }

    if (
      step === Steps.Four &&
      transferResponse &&
      'userActionDetails' in transferResponse &&
      transferResponse.userActionDetails
    ) {
      return (
        <UserActionDetails
          userActionDetails={transferResponse.userActionDetails}
          fiatAmount={queryParamsResults.data.fiatAmount}
          fiatType={queryParamsResults.data.fiatType}
          providerId={queryParamsResults.data.providerId}
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
