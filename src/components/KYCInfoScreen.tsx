import { QueryParams } from '../schema'
import { Steps } from '../types'
import React, { useState } from 'react'
import { ContentContainer, SectionTitle } from '../styles'
import {
  providerIdToPrivacyPolicyURL,
  providerIdToProviderName,
} from '../constants'

interface Props {
  onError: (title: string, message: string) => void
  onNext: (step: Steps) => void
  params: QueryParams
}

export function KYCInfoScreen({ onError, onNext, params }: Props) {
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [agreeToShareInfo, setAgreeToShareInfo] = useState(false)

  const handleAgreeToShareInfoChange = () => {
    setAgreeToShareInfo(!agreeToShareInfo)
    setSubmitDisabled(submitDisabled && agreeToShareInfo)
  }

  const onSubmit = () => {
    // TODO post kyc info, then start polling for kyc status?
  }

  return (
    <ContentContainer>
      <SectionTitle>Verify your identity</SectionTitle>
      <input
        type="checkbox"
        checked={agreeToShareInfo}
        onChange={handleAgreeToShareInfoChange}
      >
        By continuing, I agree to share my information with{' '}
        {providerIdToProviderName[params.providerId]} and I agree to their{' '}
        <a href={providerIdToPrivacyPolicyURL[params.providerId]}>
          Privacy Policy
        </a>
      </input>
      <button onClick={onSubmit} disabled={submitDisabled} id="SubmitKYCInfo">
        Submit
      </button>
    </ContentContainer>
  )
}
