import React, { useState, useEffect, useRef } from 'react'
import PendingIcon from '../../icons/Pending'
import { KycStatus, KycSchema } from '@fiatconnect/fiatconnect-types'
import {
  StatusContentContainer,
  StatusTitle,
  StatusIconContainer,
  StatusText,
} from '../../styles'
import { getKycStatus, deleteKyc } from '../../FiatConnectClient'
import { useFiatConnectConfig } from '../../hooks'
import { ProviderIds } from '../../types'
import { providerIdToProviderName } from '../../constants'
import ExpiredIcon from '../../icons/Expired'

interface Props {
  kycSchema: KycSchema
  providerId: ProviderIds
  setKycStatus: (kycStatus: KycStatus | undefined) => void
  onError: (title: string, message: string) => void
}

export function KycExpired({
  kycSchema,
  providerId,
  setKycStatus,
  onError,
}: Props) {
  const fiatConnectClientConfig = useFiatConnectConfig()

  const onSubmit = async () => {
    if (!fiatConnectClientConfig) return

    try {
      await deleteKyc({ kycSchema }, fiatConnectClientConfig)
      const kycStatus = await getKycStatus(
        { kycSchema },
        fiatConnectClientConfig,
      )
      setKycStatus(kycStatus)
    } catch (error) {
      onError(
        'There was an error while trying to proceed',
        'This may be due to a problem with the provider.',
      )
    }
  }
  const providerName = providerIdToProviderName[providerId]
  return (
    <StatusContentContainer>
      <StatusTitle>Your information has expired</StatusTitle>
      <StatusIconContainer>
        <ExpiredIcon />
      </StatusIconContainer>
      <StatusText>
        Your identification information with {providerName} has expired.
      </StatusText>
      <StatusText>
        You'll have to resubmit up-to-date information in order to continue.
      </StatusText>
      <button onClick={onSubmit} id="PrimaryButton">
        Continue
      </button>
    </StatusContentContainer>
  )
}
