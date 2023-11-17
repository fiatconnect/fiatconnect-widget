import {
  Button,
  ContentContainer,
  SectionSubtitle,
  SectionTitle,
} from '../styles'
import {
  accountNumberUserActionSchema,
  FiatType,
  TransferInUserActionDetails,
  UserActionDetails as UserActionDetailsType,
} from '@fiatconnect/fiatconnect-types'
import { ProviderIds, Steps } from '../types'
import { fiatTypeToSymbol, providerIdToProviderName } from '../constants'
import { z } from 'zod'
import styled from 'styled-components'

interface Props {
  userActionDetails: UserActionDetailsType
  providerId: ProviderIds
  fiatAmount: string
  fiatType: FiatType
  onNext: (step: Steps) => void
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

function AccountNumberUserActionDetailsBody({
  institutionName,
  accountNumber,
  accountName,
  transactionReference,
}: z.infer<typeof accountNumberUserActionSchema>) {
  return (
    <BodyCard>
      <BodyTable>
        <tbody>
          {Row({ label: 'Institution Name', value: institutionName })}
          {Row({ label: 'Account Name', value: accountName })}
          {Row({
            label: 'Account Number',
            value: accountNumber,
            copyable: true,
          })}
          {transactionReference &&
            Row({
              label: 'Transaction Reference',
              value: transactionReference,
              copyable: true,
            })}
        </tbody>
      </BodyTable>
    </BodyCard>
  )
}

export function UserActionDetails({
  onNext,
  userActionDetails,
  fiatAmount,
  fiatType,
  providerId,
}: Props) {
  let body = null
  if (
    userActionDetails.userActionType ===
    TransferInUserActionDetails.AccountNumberUserAction
  ) {
    body = AccountNumberUserActionDetailsBody(userActionDetails)
  }
  const amountPrefix =
    fiatType in fiatTypeToSymbol ? fiatTypeToSymbol[fiatType] : ''
  // TODO make amount copyable
  const amountString = parseFloat(fiatAmount).toLocaleString()
  return (
    <ContentContainer>
      <SectionTitle>Payment Information</SectionTitle>
      <SectionSubtitle style={{ textAlign: 'left' }}>
        Complete your purchase by sending {amountPrefix}
        {amountString} to
        {' ' + providerIdToProviderName[providerId]} using the merchant details
        below.
      </SectionSubtitle>
      {body}
      <Button
        onClick={() => onNext(Steps.Five)}
        style={{ width: '100%', marginTop: '10px' }}
      >
        Done
      </Button>
    </ContentContainer>
  )
}
