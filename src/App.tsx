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
  FiatAccountSchema,
  FiatAccountType,
  KycSchema,
  KycStatus,
  ObfuscatedFiatAccountData,
  TransferResponse,
  TransferType,
} from '@fiatconnect/fiatconnect-types'
import { loadConfig } from './config'
import { queryParamsSchema } from './schema'
import { DoneSection } from './components/DoneSection'
import { SendCrypto } from './components/SendCrypto'
import { KYCInfoScreen } from './components/KYCInfoScreen'
import { getKycStatus, getLinkedAccount } from './FiatConnectClient'
import { useFiatConnectConfig } from './hooks/useFiatConnectConfig'
import { FiatConnectClientConfig } from '@fiatconnect/fiatconnect-sdk'
import { useQueryParams } from './hooks/useQueryParams'
import { useSteps } from './hooks/useSteps'

const DEFAULT_ERROR_TITLE = 'There was an error processing your request.'
const DEFAULT_ERROR_MESSAGE =
  'This is typically due to a misconfiguration by your wallet provider.'

function App() {
  const queryParamsResults = useQueryParams()
  if (!queryParamsResults.success) {
    //eslint-disable-next-line no-console
    console.error('Invalid query params: ', queryParamsResults.error)
  }
  const [errorTitle, setErrorTitle] = useState(DEFAULT_ERROR_TITLE)
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE)
  const [showError, setShowError] = useState(false)

  const {
    step,
    linkedAccount,
    transferResponse,
    onSignInSuccess,
    onAddKycSuccess,
    onUserActionSuccess,
    onReviewTransferSuccess,
    onSendCryptoSuccess,
    onAddFiatAccountSuccess,
  } = useSteps()

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
    if (step === Steps.Kyc) {
      return (
        <KYCInfoScreen
          onError={onError}
          onNext={onAddKycSuccess}
          params={queryParamsResults.data}
        />
      )
    }
    if (step === Steps.SignIn) {
      return (
        <SignInScreen
          onError={onError}
          onNext={onSignInSuccess}
          params={queryParamsResults.data}
        />
      )
    }
    if (step === Steps.AddFiatAccount) {
      return (
        <PaymentInfoScreen
          onError={onError}
          onNext={onAddFiatAccountSuccess}
          params={queryParamsResults.data}
        />
      )
    }
    if (step === Steps.ReviewTransfer) {
      if (!linkedAccount) {
        throw new Error(
          `Invalid state transition to ReviewTransfer: linkedAccount missing`,
        )
      }
      return (
        <ReviewScreen
          onError={onError}
          onNext={onReviewTransferSuccess}
          params={queryParamsResults.data}
          linkedAccount={linkedAccount}
        />
      )
    }

    if (step === Steps.UserAction) {
      if (
        !(
          transferResponse &&
          'userActionDetails' in transferResponse &&
          transferResponse.userActionDetails
        )
      ) {
        throw new Error(
          `Invalid transition to UserActionDetails step: transferResponse.userActionDetails must be defined`,
        )
      }
      return (
        <UserActionDetails
          onNext={onUserActionSuccess}
          userActionDetails={transferResponse.userActionDetails}
          fiatAmount={queryParamsResults.data.fiatAmount}
          fiatType={queryParamsResults.data.fiatType}
          providerId={queryParamsResults.data.providerId}
        />
      )
    }

    if (step === Steps.SendCrypto) {
      if (!transferResponse) {
        throw new Error(
          'Invalid transition to SendCrypto step: transferResponse must be defined',
        )
      }
      return (
        <SendCrypto
          onNext={onSendCryptoSuccess}
          onError={onError}
          transferAddress={transferResponse.transferAddress}
          cryptoAmount={queryParamsResults.data.cryptoAmount}
          cryptoType={queryParamsResults.data.cryptoType}
          providerId={queryParamsResults.data.providerId}
        />
      )
    }

    if (step === Steps.Done) {
      // TODO: Actually figure this out, and have sensible defaults like we do in the wallet
      const settlementTime = '1 - 3 days'
      return <DoneSection settlementTime={settlementTime} />
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
                  <StepsHeader
                    step={step}
                    transferType={queryParamsResults.data.transferType}
                    kycRequired={!!queryParamsResults.data.kycSchema}
                  />
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
                      <StepsHeader
                        step={step}
                        transferType={queryParamsResults.data.transferType}
                        kycRequired={!!queryParamsResults.data.kycSchema}
                      />
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
