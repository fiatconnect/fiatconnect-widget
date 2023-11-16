import React, { useState } from 'react'
import { Steps } from '../types'
import { fiatAccountSchemaToPaymentMethod } from '../constants'
import {
  FiatAccountSchema,
  PostFiatAccountRequestBody,
  ObfuscatedFiatAccountData,
} from '@fiatconnect/fiatconnect-types'
import { AccountNumberSection } from './paymentInfo/AccountNumber'
import { addFiatAccount, getLinkedAccount } from '../FiatConnectClient'
import { useFiatConnectConfig } from '../hooks'
import { providerIdToProviderName } from '../constants'
import { ContentContainer, SectionSubtitle, SectionTitle } from '../styles'
import { QueryParams } from '../schema'

interface Props {
  onError: (title: string, message: string) => void
  onNext: (step: Steps) => void
  setLinkedAccount: (fiatAccount: ObfuscatedFiatAccountData) => void
  params: QueryParams
}

export function PaymentInfoScreen({
  onError,
  onNext,
  setLinkedAccount,
  params,
}: Props) {
  // TODO: First thing we should do here is check if an account is already on file
  // that shares the same FiatAccountSchema as the one in the params. If we have one,
  // we should immediately skip to step 3 (show a little spinner while we do this)
  // Actually we can just do this in the SIWE sign in step.
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [fiatAccountDetails, setFiatAccountDetails] = useState({})
  const fiatConnectClientConfig = useFiatConnectConfig()

  const setFiatAccountDetailsWrapper = (newDetails: Record<string, string>) => {
    setFiatAccountDetails({
      ...fiatAccountDetails,
      ...newDetails,
    })
  }

  const onSubmit = async () => {
    if (!fiatConnectClientConfig) {
      return
    }

    const providerName = providerIdToProviderName[params.providerId]
    const errorTitle = 'There was an error submitting your payment info.'
    const errorMessage = `${providerName} encountered an issue while processing your payment info.`

    setSubmitDisabled(true)
    try {
      const response = await addFiatAccount(
        {
          data: fiatAccountDetails as PostFiatAccountRequestBody['data'],
          fiatAccountSchema: params.fiatAccountSchema,
        } as PostFiatAccountRequestBody, // todo avoid type casts
        fiatConnectClientConfig,
      )
      if (response.ok) {
        try {
          const linkedAccount = await getLinkedAccount(
            params.fiatAccountType,
            params.fiatAccountSchema,
            fiatConnectClientConfig,
          )
          if (linkedAccount) {
            setLinkedAccount(linkedAccount)
            onNext(Steps.Three)
          } else {
            onError(errorTitle, errorMessage)
          }
        } catch {
          onError(errorTitle, errorMessage)
        }
      } else {
        onError(errorTitle, errorMessage)
      }
    } catch (e) {
      onError(errorTitle, errorMessage)
    }
    // TODO: try submitting fiat account info
    // TODO: Go to step three
  }

  const getSection = () => {
    switch (params.fiatAccountSchema) {
      case FiatAccountSchema.AccountNumber: {
        return (
          <AccountNumberSection
            country={params.country}
            fiatAccountDetails={fiatAccountDetails}
            setFiatAccountDetails={setFiatAccountDetailsWrapper}
            setSubmitDisabled={setSubmitDisabled}
          />
        )
      }
      default: {
        onError(
          'There was an error signing in with Bitmama.',
          'This may be due to a misconfiguration by your wallet provider.',
        )
      }
    }
  }

  return (
    <ContentContainer>
      <SectionTitle>Payment Info</SectionTitle>
      <SectionSubtitle>
        {fiatAccountSchemaToPaymentMethod[params.fiatAccountSchema]}
      </SectionSubtitle>
      {getSection()}
      <div id="Spacer" />
      <button onClick={onSubmit} id="PrimaryButton" disabled={submitDisabled}>
        Submit Payment Info
      </button>
    </ContentContainer>
  )
}
