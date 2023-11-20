import React from 'react'
import ErrorIcon from '../icons/Error'
import {
  StatusContentContainer,
  StatusTitle,
  StatusIconContainer,
  StatusText,
} from '../styles'

interface Props {
  title: string
  message: string
}

export function ErrorSection({ title, message }: Props) {
  return (
    <StatusContentContainer>
      <StatusTitle>{title}</StatusTitle>
      <StatusIconContainer>
        <ErrorIcon />
      </StatusIconContainer>
      <StatusText>{message}</StatusText>
      <StatusText>
        You can try again, or if the error persists, contact your wallet
        provider for more help.
      </StatusText>
    </StatusContentContainer>
  )
}
