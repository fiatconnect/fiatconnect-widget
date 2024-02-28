import { QueryParams } from '../schema'
import {
  KycStatus,
  KycSchemas,
  KycSchema,
} from '@fiatconnect/fiatconnect-types'
import React, { useState } from 'react'
import { ContentContainer, SectionSubtitle, SectionTitle } from '../styles'
import KYCInfoFieldSection from './KYCInfoFieldSection'
import { useFiatConnectConfig } from '../hooks'
import { addKyc } from '../FiatConnectClient'
import { KycPending } from './kycStatusScreens/KycPending'
import { KycDenied } from './kycStatusScreens/KycDenied'
import { KycExpired } from './kycStatusScreens/KycExpired'
import { KycFieldMetadata } from '../types'
import { personalDataAndDocumentsSchemaMetadata } from './kycInfo/PersonalDataAndDocuments'
import { personalDataAndDocumentsDetailedSchemaMetadata } from './kycInfo/PersonalDataAndDocumentsDetailed'
import {
  providerIdToPrivacyPolicyURL,
  providerIdToProviderName,
} from '../providerConfig'

const kycSchemaToMetadata: Record<
  KycSchema,
  Record<KycSchema, KycFieldMetadata>
> = {
  [KycSchema.PersonalDataAndDocuments]: personalDataAndDocumentsSchemaMetadata,
  [KycSchema.PersonalDataAndDocumentsDetailed]:
    personalDataAndDocumentsDetailedSchemaMetadata,
}

interface Props {
  kycStatus: KycStatus | undefined
  setKycStatus: (kycStatus: KycStatus | undefined) => void
  onError: (title: string, message: string) => void
  params: QueryParams & { kycSchema: KycSchema }
}

export function KYCInfoScreen({
  onError,
  params,
  kycStatus,
  setKycStatus,
}: Props) {
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [kycInfo, setKycInfo] = useState({})
  const providerName = providerIdToProviderName[params.providerId]
  const fiatConnectClientConfig = useFiatConnectConfig()

  const setKycInfoWrapper = (
    newKycInfo: Record<string, string | Record<string, string>>,
  ) => {
    setKycInfo({
      ...kycInfo,
      ...newKycInfo,
    })
  }
  const onSubmit = async () => {
    try {
      if (!fiatConnectClientConfig) {
        throw new Error()
      }

      const addKycStatus = await addKyc(
        {
          kycSchemaName: params.kycSchema,
          data: kycInfo as KycSchemas[typeof params.kycSchema],
        },
        fiatConnectClientConfig,
      )
      setKycStatus(addKycStatus)
    } catch (error) {
      onError(
        `There was an error while submitting your KYC information to ${providerName}`,
        'This may be due to a problem with the provider.',
      )
    }
  }

  if (kycStatus === KycStatus.KycPending) {
    return (
      <ContentContainer>
        <KycPending
          kycSchema={params.kycSchema}
          providerId={params.providerId}
          setKycStatus={setKycStatus}
          onError={onError}
        />
      </ContentContainer>
    )
  }

  if (kycStatus === KycStatus.KycDenied) {
    return (
      <ContentContainer>
        <KycDenied providerId={params.providerId} />
      </ContentContainer>
    )
  }

  if (kycStatus === KycStatus.KycExpired) {
    return (
      <ContentContainer>
        <KycExpired
          kycSchema={params.kycSchema}
          providerId={params.providerId}
          setKycStatus={setKycStatus}
          onError={onError}
        />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <SectionTitle>Verify your Identity</SectionTitle>
      <SectionSubtitle>
        {providerName} requires that you verify your identity before you
        continue.
      </SectionSubtitle>
      <div id="KYCFormContainer">
        <KYCInfoFieldSection
          kycInfo={kycInfo}
          setKycInfo={setKycInfoWrapper}
          setSubmitDisabled={setSubmitDisabled}
          kycSchemaMetadata={kycSchemaToMetadata[params.kycSchema]}
        />
      </div>
      <div id="KYCBottomSection">
        <p>
          By continuing, I agree to share my information with {providerName} and
          I agree to their{' '}
          <a href={providerIdToPrivacyPolicyURL[params.providerId]}>
            Privacy Policy.
          </a>
        </p>
        <button onClick={onSubmit} id="PrimaryButton" disabled={submitDisabled}>
          Submit
        </button>
      </div>
    </ContentContainer>
  )
}
