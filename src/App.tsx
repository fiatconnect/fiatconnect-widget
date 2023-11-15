import React, { useState } from 'react'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'
import { ProviderIds, queryParamsSchema, Steps } from './types'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { celoAlfajores } from 'viem/chains'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { useSearchParams } from 'react-router-dom'
import '@fontsource/inter'
import { StepsHeader } from './components/StepsHeader'
import { ErrorSection } from './components/ErrorSection'
import { providerIdToProviderName } from './constants'
import { SignInScreen } from './components/SignInScreen'
import { PaymentInfoScreen } from './components/PaymentInfoScreen'
import { UserActionDetails } from './components/UserActionDetails'
import {
  FiatType,
  TransferInUserActionDetails,
} from '@fiatconnect/fiatconnect-types'

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
  // TODO: We should do some semantic validation here to ensure that stuff doesn't break later in the flow.
  // This includes:
  //  - Check that the FiatAccountSchema is actually supported in this widget currently
  //  - Check that allowedValues is syntactically valid, deserialize it to an object before returning
  //  - Check that fiatAmount and cryptoAmount can be deserialied to floats, and deserialize them before returning
  //  - Check that transferType is currently supported by the widget
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

  const onError = (title: string, message: string) => {
    setErrorTitle(title)
    setErrorMessage(message)
    setShowError(true)
  }

  const getSection = () => {
    if (Date.now() > 0) {
      // fixme remove (just here for testing
      return (
        <UserActionDetails
          userActionDetails={{
            userActionType: TransferInUserActionDetails.AccountNumberUserAction,
            institutionName: 'ProvidusBank',
            accountNumber: '9603494078',
            accountName: 'JOYCE IBIA ANIEDIP',
            transactionReference: 'WDGANZ8WcFOG',
          }}
          fiatAmount={'6000'}
          fiatType={FiatType.NGN}
          providerId={ProviderIds.TestProvider}
        />
      )
    }

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
    if (step === Steps.Two) {
      return (
        <PaymentInfoScreen
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
