import {ContentContainer, SectionSubtitle, sectionSubtitle, SectionTitle} from '../styles'
import {
  accountNumberUserActionSchema,
  TransferInUserActionDetails,
  UserActionDetails as UserActionDetailsType,
} from '@fiatconnect/fiatconnect-types'
import { ProviderIds } from '../types'
import { providerIdToProviderName } from '../constants'
import { z } from 'zod'

interface Props {
  userActionDetails: UserActionDetailsType
  providerId: ProviderIds
}

function AccountNumberUserActionDetailsBody({
  institutionName,
  accountNumber,
  accountName,
  transactionReference,
}: z.infer<typeof accountNumberUserActionSchema>) {
  // TODO styling
  // TODO include fiat amount, fiat type
  // TODO make some fields copyable (fiat amount, account number, transaction reference)
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

export function UserActionDetails(props: Props) {
  let body = null
  if (
    props.userActionDetails.userActionType ===
    TransferInUserActionDetails.AccountNumberUserAction
  ) {
    body = AccountNumberUserActionDetailsBody(props.userActionDetails)
  }
  return (
    <ContentContainer>
      <SectionTitle>Payment Information</SectionTitle>
      <SectionSubtitle style={{textAlign: 'left'}}>
        Complete your purchase by sending funds to
        {' ' + providerIdToProviderName[props.providerId]} using the merchant
        details below.
      </SectionSubtitle>
      {body}
    </ContentContainer>
  ) // TODO add 'done' button
}
