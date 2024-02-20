import React, { useMemo, useState } from 'react'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  Steps,
  Screens,
  AppState,
  TransferInUserActionNoKycScreens,
  TransferInUserActionKycScreens,
  TransferInNoUserActionKycScreens,
  TransferInNoUserActionNoKycScreens,
  TransferOutNoKycScreens,
  TransferOutKycScreens,
} from './types'
import { createConfig, usePublicClient, WagmiProvider } from 'wagmi'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
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
  TransferType,
  KycStatus,
} from '@fiatconnect/fiatconnect-types'
import { loadConfig } from './config'
import { queryParamsSchema, QueryParams } from './schema'
import { DoneSection } from './components/DoneSection'
import { SendCrypto } from './components/SendCrypto'
import { KYCInfoScreen } from './components/KYCInfoScreen'
import { celo, celoAlfajores } from 'viem/chains'
import { walletConnect } from 'wagmi/connectors'

function useQueryParams() {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries(searchParams)
  return queryParamsSchema.safeParse(searchParamsObject)
}

const DEFAULT_ERROR_TITLE = 'There was an error processing your request.'
const DEFAULT_ERROR_MESSAGE =
  'This is typically due to a misconfiguration by your wallet provider.'

// Gets current app "state" (i.e. progress) based off of query params etc.
function useAppState(
  queryParams: QueryParams | undefined,
  finishedSignIn: boolean,
  finishedUserActionDetails: boolean,
  finishedSendCrypto: boolean,
  kycStatus: undefined | KycStatus,
  linkedAccount: ObfuscatedFiatAccountData | undefined,
  transferResponse: TransferResponse | undefined,
): AppState | undefined {
  if (!queryParams) {
    return undefined
  }

  const screens = getScreens(queryParams)

  if (!finishedSignIn) {
    return {
      currentScreen: Screens.SignInScreen,
      screens,
    }
  }
  if (queryParams.kycSchema && kycStatus !== KycStatus.KycApproved) {
    return {
      currentScreen: Screens.KYCScreen,
      screens,
    }
  }
  if (!linkedAccount) {
    return {
      currentScreen: Screens.PaymentInfoScreen,
      screens,
    }
  }
  if (!transferResponse) {
    return {
      currentScreen: Screens.ReviewScreen,
      screens,
    }
  }
  if (queryParams.userActionDetailsSchema && !finishedUserActionDetails) {
    return {
      currentScreen: Screens.UserActionDetailsScreen,
      screens,
    }
  }
  if (
    queryParams.transferType === TransferType.TransferOut &&
    !finishedSendCrypto
  ) {
    return {
      currentScreen: Screens.SendCryptoScreen,
      screens,
    }
  }
  return {
    currentScreen: Screens.DoneScreen,
    screens,
  }
}

function getScreens(queryParams: QueryParams): Array<Screens> {
  if (queryParams.transferType === TransferType.TransferIn) {
    if (queryParams.kycSchema) {
      if (queryParams.userActionDetailsSchema) {
        return TransferInUserActionKycScreens
      } else {
        return TransferInNoUserActionKycScreens
      }
    } else {
      if (queryParams.userActionDetailsSchema) {
        return TransferInUserActionNoKycScreens
      } else {
        return TransferInNoUserActionNoKycScreens
      }
    }
  } else {
    if (queryParams.kycSchema) {
      return TransferOutKycScreens
    } else {
      return TransferOutNoKycScreens
    }
  }
}

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

  const [finishedSignIn, setFinishedSignIn] = useState(false)
  const [finishedUserActionDetails, setFinishedUserActionDetails] =
    useState(false)
  const [finishedSendCrypto, setFinishedSendCrypto] = useState(false)
  const [kycStatus, setKycStatus] = useState<undefined | KycStatus>(undefined)

  const appState = useAppState(
    queryParamsResults.success ? queryParamsResults.data : undefined,
    finishedSignIn,
    finishedUserActionDetails,
    finishedSendCrypto,
    kycStatus,
    linkedAccount,
    transferResponse,
  )

  const config = loadConfig()
  const chains = [celo, celoAlfajores] as const
  const wagmiConfig = useMemo(() => {
    return getDefaultConfig({
      appName: config.walletConnect.appName,
      projectId: config.walletConnect.projectId,
      chains,
    })
  }, [config])

  const onError = (title: string, message: string) => {
    setErrorTitle(title)
    setErrorMessage(message)
    setShowError(true)
  }

  const getSection = () => {
    // TODO: should never happen
    if (!queryParamsResults.success || !appState) {
      return
    }
    switch (appState.currentScreen) {
      case Screens.SignInScreen: {
        return (
          <SignInScreen
            setKycStatus={setKycStatus}
            onError={onError}
            onNext={() => setFinishedSignIn(true)}
            params={queryParamsResults.data}
            setLinkedAccount={setLinkedAccount}
          />
        )
      }
      case Screens.KYCScreen: {
        if (!queryParamsResults.data.kycSchema) return
        return (
          <KYCInfoScreen
            setKycStatus={setKycStatus}
            kycStatus={kycStatus}
            onError={onError}
            params={{
              ...queryParamsResults.data,
              kycSchema: queryParamsResults.data.kycSchema,
            }}
          />
        )
      }
      case Screens.PaymentInfoScreen: {
        return (
          <PaymentInfoScreen
            onError={onError}
            params={queryParamsResults.data}
            setLinkedAccount={setLinkedAccount}
          />
        )
      }
      case Screens.ReviewScreen: {
        if (!linkedAccount) return
        return (
          <ReviewScreen
            onError={onError}
            params={queryParamsResults.data}
            linkedAccount={linkedAccount}
            setTransferResponse={setTransferResponse}
          />
        )
      }
      case Screens.UserActionDetailsScreen: {
        if (
          !transferResponse ||
          !('userActionDetails' in transferResponse) ||
          !transferResponse.userActionDetails
        )
          return
        return (
          <UserActionDetails
            onNext={() => setFinishedUserActionDetails(true)}
            userActionDetails={transferResponse.userActionDetails}
            fiatAmount={queryParamsResults.data.fiatAmount}
            fiatType={queryParamsResults.data.fiatType}
            providerId={queryParamsResults.data.providerId}
          />
        )
      }
      case Screens.SendCryptoScreen: {
        if (!transferResponse) return
        return (
          <SendCrypto
            onNext={() => setFinishedSendCrypto(true)}
            onError={onError}
            transferAddress={transferResponse.transferAddress}
            cryptoAmount={queryParamsResults.data.cryptoAmount}
            cryptoType={queryParamsResults.data.cryptoType}
            providerId={queryParamsResults.data.providerId}
          />
        )
      }
      case Screens.DoneScreen: {
        // TODO: Actually figure this out, and have sensible defaults like we do in the wallet
        const settlementTime = '1 - 3 days'
        return <DoneSection settlementTime={settlementTime} />
      }
    }
  }
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider>
        <div className="App">
          <header className="App-header">
            <div className="Container">
              {queryParamsResults.success && appState && !showError ? (
                <div className="SectionContainer">
                  <div className="ProviderTitle">
                    {
                      providerIdToProviderName[
                        queryParamsResults.data.providerId
                      ]
                    }
                  </div>
                  <StepsHeader appState={appState} />
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
                      <StepsHeader appState={appState} />
                    </div>
                  )}
                  <ErrorSection title={errorTitle} message={errorMessage} />
                </div>
              )}
            </div>
          </header>
        </div>
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

export default App
