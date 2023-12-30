import React, { useState } from 'react'
import { Steps } from '../types'
import { fiatAccountSchemaToPaymentMethod } from '../constants'
import {
  FiatAccountSchema,
  FiatAccountType,
  PostFiatAccountRequestBody,
  ObfuscatedFiatAccountData,
} from '@fiatconnect/fiatconnect-types'
import accountNumberSchemaMetadata from './paymentInfo/AccountNumber'
import mobileMoneySchemaMetadata from './paymentInfo/MobileMoney'
import PaymentInfoFieldSection from './PaymentInfoFieldSection'
import { addFiatAccount, getLinkedAccount } from '../FiatConnectClient'
import { useFiatConnectConfig } from '../hooks/useFiatConnectConfig'
import { providerIdToProviderName } from '../constants'
import { ContentContainer, SectionSubtitle, SectionTitle } from '../styles'
import { QueryParams } from '../schema'

interface Props {
  onError: (title: string, message: string) => void
  onNext: () => Promise<void>
  params: QueryParams
}

export function PaymentInfoScreen({
  onError,
  onNext,
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
          await onNext()
        } catch {
          onError(errorTitle, errorMessage)
        }
      } else {
        onError(errorTitle, errorMessage)
      }
    } catch (e) {
      onError(errorTitle, errorMessage)
    }
  }

  const getSection = () => {
    switch (params.fiatAccountSchema) {
      case FiatAccountSchema.AccountNumber: {
        return (
          <PaymentInfoFieldSection
            country={params.country}
            fiatAccountDetails={fiatAccountDetails}
            setFiatAccountDetails={setFiatAccountDetailsWrapper}
            setSubmitDisabled={setSubmitDisabled}
            allowedValues={params.allowedValues}
            fiatAccountType={FiatAccountType.BankAccount}
            fiatAccountSchemaMetadata={accountNumberSchemaMetadata}
          />
        )
      }
      case FiatAccountSchema.MobileMoney: {
        return (
          <PaymentInfoFieldSection
            country={params.country}
            fiatAccountDetails={fiatAccountDetails}
            setFiatAccountDetails={setFiatAccountDetailsWrapper}
            setSubmitDisabled={setSubmitDisabled}
            allowedValues={params.allowedValues}
            fiatAccountType={FiatAccountType.MobileMoney}
            fiatAccountSchemaMetadata={mobileMoneySchemaMetadata}
          />
        )
      }
      default: {
        onError(
          'There was an error signing in.',
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
