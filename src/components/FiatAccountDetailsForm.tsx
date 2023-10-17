import React, { ChangeEvent, FormEvent, useState } from 'react'
import { getFiatConnectClient } from '../FiatConnectClient'
import {
  FiatAccountSchema,
  FiatAccountType,
} from '@fiatconnect/fiatconnect-types'
import Button from '@mui/material/Button'

interface Props {
  country: string
}

enum SubmitResult {
  Success = 'Success',
  Error = 'Error',
  NotSubmitted = 'NotSubmitted',
}

export function FiatAccountDetailsForm({ country }: Props) {
  // TODO(M3): make usable for other fiat account schemas (besides mobile money)
  const [accountName, setAccountName] = useState('')
  const [operator, setOperator] = useState('MTN')
  const [phoneNumber, setPhoneNumber] = useState('1234567')
  const [submitResult, setSubmitResult] = useState(SubmitResult.NotSubmitted)
  const [fiatAccountId, setFiatAccountId] = useState('')

  const handleAccountNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value)
  }

  const handleOperatorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOperator(event.target.value)
  }

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // TODO(M1): input validation
    try {
      const fiatConnectClient = getFiatConnectClient()
      const addFiatAccountResult = await fiatConnectClient.addFiatAccount({
        // FIXME this is failing with 401 error. Also, cookies are not being set on the fiatconnect client (according to fiatConnectClient.getCookies()). why?
        fiatAccountSchema: FiatAccountSchema.MobileMoney,
        data: {
          mobile: phoneNumber,
          operator,
          country,
          fiatAccountType: FiatAccountType.MobileMoney,
          accountName,
          institutionName: operator,
        },
      })
      if (addFiatAccountResult.isErr) {
        throw addFiatAccountResult.error
      }
      setFiatAccountId(addFiatAccountResult.value.fiatAccountId)
      setSubmitResult(SubmitResult.Success)
    } catch (e) {
      // TODO(M1): parse the error. if it's a machine-readable fiatconnect error, do something smarter (like give the user instructions for fixing their form inputs)
      // eslint-disable-next-line no-console
      console.error(e)
      setSubmitResult(SubmitResult.Error)
    }
  }

  switch (submitResult) {
    case SubmitResult.Success:
      return <div>Success! Fiat account id: {fiatAccountId}</div>
    case SubmitResult.Error:
      return <div>Error!</div>
    case SubmitResult.NotSubmitted:
    default:
      return (
        <div>
          <h2>Mobile Money Account Information</h2>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="accountName">Account Name:</label>
              <input
                type="text"
                id="accountName"
                value={accountName}
                onChange={handleAccountNameChange}
                required
              />
            </div>
            <div>
              <label htmlFor="mobileMoneyOperator">
                Mobile Money Operator:
              </label>
              {/* TODO(M1): use dropdown for mobile money operator if allowedValues is one quote */}
              <input
                id="mobileMoneyOperator"
                type="text"
                value={operator}
                onChange={handleOperatorChange}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
  }
}
