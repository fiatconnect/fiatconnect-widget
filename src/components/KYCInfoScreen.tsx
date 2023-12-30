import { QueryParams } from '../schema'
import { Steps } from '../types'
import React, { useState } from 'react'
import { ContentContainer, SectionSubtitle, SectionTitle } from '../styles'
import {
  providerIdToPrivacyPolicyURL,
  providerIdToProviderName,
} from '../constants'
import styled from 'styled-components'
import KYCInfoFieldSection from './KYCInfoFieldSection'
import { personalDataAndDocumentsSchemaMetadata } from './kycInfo/PersonalDataAndDocuments'

interface Props {
  onError: (title: string, message: string) => void
  onNext: () => void
  params: QueryParams
}

export function KYCInfoScreen({ onError, onNext, params }: Props) {
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [kycInfo, setKycInfo] = useState({})

  const onSubmit = () => {
    // TODO post kyc info, then start polling for kyc status?
  }

  const providerName = providerIdToProviderName[params.providerId]
  return (
    <ContentContainer>
      <SectionTitle>Verify your identity</SectionTitle>
      <SectionSubtitle>
        {providerName} requires that you verify your identity before you
        continue
      </SectionSubtitle>
      <KYCInfoFieldSection
        kycInfo={kycInfo}
        setKycInfo={setKycInfo}
        setSubmitDisabled={setSubmitDisabled}
        kycSchemaMetadata={personalDataAndDocumentsSchemaMetadata}
      />
      <p>
        By continuing, I agree to share my information with {providerName} and I
        agree to their{' '}
        <a href={providerIdToPrivacyPolicyURL[params.providerId]}>
          Privacy Policy
        </a>
      </p>
      <button onClick={onSubmit} disabled={submitDisabled} id="SubmitKYCInfo">
        Submit
      </button>
    </ContentContainer>
  )
}
