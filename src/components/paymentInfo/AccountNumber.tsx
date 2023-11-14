import React, { useState, useEffect, useMemo } from 'react'
import {
  FiatAccountSchema,
  FiatAccountType,
} from '@fiatconnect/fiatconnect-types'
import { PaymentInfoLineItem } from './PaymentInfoLineItem'

interface Props {
  country: string
  fiatAccountDetails: Record<string, string>
  setFiatAccountDetails: (newDetails: Record<string, string>) => void
  setSubmitDisabled: (disabled: boolean) => void
  allowedValues?: Record<string, [string, ...string[]]>
}

const REQUIRED_FIELDS = [
  'country',
  'fiatAccountType',
  'accountName',
  'institutionName',
  'accountNumber',
]

export function AccountNumberSection({
  country,
  fiatAccountDetails,
  setFiatAccountDetails,
  setSubmitDisabled,
  allowedValues,
}: Props) {
  // TODO: Pass allowedValues through once it's been implemented

  useEffect(() => {
    setFiatAccountDetails({
      fiatAccountType: FiatAccountType.BankAccount,
      country,
    })
  }, []) // Empty array required to only run this effect once ever

  // TODO: Can this be re-used among the other fiat account schema implementations?
  useMemo(() => {
    const fieldValues = REQUIRED_FIELDS.map(
      (field) => fiatAccountDetails[field],
    )
    if (fieldValues.every((value) => !!value)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
  }, [fiatAccountDetails])

  return (
    <div>
      <PaymentInfoLineItem
        title={'Institution Name'}
        placeholder={'Your Institution Name'}
        onChange={(value) => setFiatAccountDetails({ institutionName: value })}
        value={fiatAccountDetails.institutionName ?? ''}
      />
      <PaymentInfoLineItem
        title={'Account Name'}
        placeholder={'Your Account Name'}
        onChange={(value) => setFiatAccountDetails({ accountName: value })}
        value={fiatAccountDetails.accountName ?? ''}
      />
      <PaymentInfoLineItem
        title={'Account Number'}
        placeholder={'1234567890'}
        onChange={(value) => setFiatAccountDetails({ accountNumber: value })}
        value={fiatAccountDetails.accountNumber ?? ''}
      />
    </div>
  )
}
