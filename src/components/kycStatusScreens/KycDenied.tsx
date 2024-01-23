import React from 'react'
import {
  StatusContentContainer,
  StatusTitle,
  StatusIconContainer,
  StatusText,
} from '../../styles'
import { ProviderIds } from '../../types'
import { providerIdToProviderName } from '../../constants'
import ErrorIcon from '../../icons/Error'

interface Props {
  providerId: ProviderIds
}

export function KycDenied({ providerId }: Props) {
  const providerName = providerIdToProviderName[providerId]
  return (
    <StatusContentContainer>
      <StatusTitle>Your information has been denied</StatusTitle>
      <StatusIconContainer>
        <ErrorIcon />
      </StatusIconContainer>
      <StatusText>
        Your identification information has been denied by {providerName}.
      </StatusText>
      <StatusText>
        If you think this was a mistake, please contact your wallet provider.
      </StatusText>
    </StatusContentContainer>
  )
}
