import {
  ContentContainer,
  SectionSubtitle,
  sectionSubtitle,
  SectionTitle,
} from '../styles'
import {
  accountNumberUserActionSchema,
  FiatType,
  TransferInUserActionDetails,
  UserActionDetails as UserActionDetailsType,
} from '@fiatconnect/fiatconnect-types'
import { ProviderIds } from '../types'
import { fiatTypeToSymbol, providerIdToProviderName } from '../constants'
import { z } from 'zod'

interface Props {
  userActionDetails: UserActionDetailsType
  providerId: ProviderIds
  fiatAmount: string
  fiatType: FiatType
}

function AccountNumberUserActionDetailsBody({
  institutionName,
  accountNumber,
  accountName,
  transactionReference,
}: z.infer<typeof accountNumberUserActionSchema>) {
  // TODO styling
  // TODO make some fields copyable (account number, transaction reference)
  return (
    <div id="AccountNumberUserActionDetails-Body">
      <table>
        <tbody>
          <tr>
            <td>Institution Name:</td>
            <td>{institutionName}</td>
          </tr>
          <tr>
            <td>Account Name:</td>
            <td>{accountName}</td>
          </tr>
          <tr>
            <td>Account Number:</td>
            <td>{accountNumber}</td>
          </tr>
          {transactionReference && (
            <tr>
              <td>Transaction Reference:</td>
              <td>{transactionReference}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function UserActionDetails({
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
    </ContentContainer>
  ) // TODO add 'done' button
}
