import React, { useState, useEffect, useMemo } from 'react'
import {
  FiatAccountSchema,
  FiatAccountType,
} from '@fiatconnect/fiatconnect-types'
import { PaymentInfoLineItem } from './PaymentInfoLineItem'
import styled from 'styled-components'

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
  useEffect(() => {
    const initialDetails = {
      fiatAccountType: FiatAccountType.BankAccount,
      country,
    }
    setFiatAccountDetails({
      ...initialDetails,
      ...(allowedValues?.institutionName
        ? { institutionName: allowedValues.institutionName[0] }
        : {}),
      ...(allowedValues?.accountName
        ? { accountName: allowedValues.accountName[0] }
        : {}),
      ...(allowedValues?.accountNumber
        ? { accountNumber: allowedValues.accountNumber[0] }
        : {}),
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
    <Container>
      <PaymentInfoLineItem
        title={'Institution Name'}
        placeholder={'Your Institution Name'}
        onChange={(value) => setFiatAccountDetails({ institutionName: value })}
        value={fiatAccountDetails.institutionName ?? ''}
        allowedValues={allowedValues?.institutionName}
      />
      <PaymentInfoLineItem
        title={'Account Name'}
        placeholder={'Your Account Name'}
        onChange={(value) => setFiatAccountDetails({ accountName: value })}
        value={fiatAccountDetails.accountName ?? ''}
        allowedValues={allowedValues?.accountName}
      />
      <PaymentInfoLineItem
        title={'Account Number'}
        placeholder={'1234567890'}
        onChange={(value) => setFiatAccountDetails({ accountNumber: value })}
        value={fiatAccountDetails.accountNumber ?? ''}
        allowedValues={allowedValues?.accountNumber}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  width: 100%;
`
