import React, { useEffect } from 'react'
import {
  Button,
  ContentContainer,
  SectionSubtitle,
  SectionTitle,
} from '../styles'
import { CryptoType } from '@fiatconnect/fiatconnect-types'
import { ProviderIds, Steps } from '../types'
import { providerIdToProviderName } from '../constants'
import styled from 'styled-components'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { loadConfig } from '../config'
import { cryptoTypeToAddress } from '../constants'
import { getAddress, parseEther } from 'viem'

interface Props {
  cryptoType: CryptoType
  cryptoAmount: string
  transferAddress: string
  providerId: ProviderIds
  onNext: () => Promise<void>
  onError: (title: string, message: string) => void
}

const BodyCard = styled.div`
  background-color: #f0f8ff; /* Pale blue background color */
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  margin-top: 20px;
  align-self: center;
  font-size: 14px;
`

function Row({
  label,
  value,
}: {
  label: string
  value: string
  copyable?: boolean
}) {
  // TODO make copyable if copyable is true
  return (
    <tr>
      <td
        style={{
          textAlign: 'left',
          fontWeight: 'bold',
        }}
      >
        {label}
      </td>
      <td
        style={{
          textAlign: 'right',
        }}
      >
        {value}
      </td>
    </tr>
  )
}

const BodyTable = styled.table`
  width: 100%;
`

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
function SendPaymentBody({
  cryptoAmount,
  cryptoType,
  transferAddress,
}: {
  cryptoAmount: string
  cryptoType: CryptoType
  transferAddress: string
}) {
  return (
    <BodyCard>
      <BodyTable>
        <tbody>
          {Row({ label: 'Amount', value: `${cryptoAmount} ${cryptoType}` })}
          {Row({ label: 'Address', value: formatAddress(transferAddress) })}
        </tbody>
      </BodyTable>
    </BodyCard>
  )
}

export function SendCrypto({
  onNext,
  onError,
  transferAddress,
  cryptoAmount,
  cryptoType,
  providerId,
}: Props) {
  const appConfig = loadConfig()
  const tokenAddress =
    cryptoTypeToAddress[appConfig.fiatConnectNetwork][cryptoType]!
  const { config } = usePrepareContractWrite({
    address: getAddress(tokenAddress),
    abi: [
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'transfer',
    args: [getAddress(transferAddress), parseEther(cryptoAmount)],
  })
  const { isLoading, isSuccess, write, isError } = useContractWrite(config)

  const onClick = () => {
    write?.()
  }

  useEffect(() => {
    if (isSuccess) {
      void onNext()
    }
    if (isError) {
      onError(
        'There was an error sending your payment.',
        `There was an issue while sending your payment to ${providerIdToProviderName[providerId]}`,
      )
    }
  }, [isSuccess, isError])

  return (
    <ContentContainer>
      <SectionTitle>Send Payment</SectionTitle>
      <SectionSubtitle style={{ textAlign: 'left' }}>
        To complete your transfer, please send a payment of {cryptoAmount}{' '}
        {cryptoType} to
        {' ' + providerIdToProviderName[providerId]} using the button below.
      </SectionSubtitle>
      <SendPaymentBody
        cryptoAmount={cryptoAmount}
        transferAddress={transferAddress}
        cryptoType={cryptoType}
      />
      <Button
        onClick={onClick}
        disabled={isLoading}
        style={{ width: '100%', marginTop: '10px' }}
      >
        {isLoading ? 'Sending Payment...' : 'Send Payment'}
      </Button>
    </ContentContainer>
  )
}
