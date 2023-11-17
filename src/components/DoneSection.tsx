import React from 'react'
import DoneIcon from '../icons/Done'
import {
  StatusContentContainer,
  StatusTitle,
  StatusIconContainer,
  StatusText,
} from '../styles'

interface Props {
  settlementTime: string
}

export function DoneSection({ settlementTime }: Props) {
  return (
    <StatusContentContainer>
      <StatusTitle>You're all set!</StatusTitle>
      <StatusIconContainer>
        <DoneIcon />
      </StatusIconContainer>
      <StatusText>
        You should receive your payment in {settlementTime}.
      </StatusText>
      <StatusText>
        Head back to your wallet to monitor the status of your transaction.
      </StatusText>
    </StatusContentContainer>
  )
}
