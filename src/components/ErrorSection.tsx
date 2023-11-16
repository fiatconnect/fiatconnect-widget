import React from 'react'
import ErrorIcon from '../icons/Error'
import styled from 'styled-components'

interface Props {
  title: string
  message: string
}

export function ErrorSection({ title, message }: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      <IconContainer>
        <ErrorIcon />
      </IconContainer>
      <Text>{message}</Text>
      <Text>
        You can try again, or if the error persists, contact your wallet
        provider for more help.
      </Text>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
`

const Title = styled.div`
  color: black;
  font-size: 18px;
  font-weight: bold;
`

const IconContainer = styled.div`
  padding: 30px;
`

const Text = styled.div`
  color: black;
  font-size: 18px;
  padding-bottom: 20px;
`
