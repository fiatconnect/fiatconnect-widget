import React, { useEffect, useMemo, useState } from 'react'
import { UserInfoLineItem } from './UserInfoLineItem'
import { FiatAccountType } from '@fiatconnect/fiatconnect-types'
import { FiatAccountFieldMetadata } from '../types'
import styled from 'styled-components'

interface Props {
  country: string
  fiatAccountDetails: Record<string, string>
  setFiatAccountDetails: (newDetails: Record<string, string>) => void
  setSubmitDisabled: (disabled: boolean) => void
  allowedValues?: Record<string, [string, ...string[]]>
  fiatAccountType: FiatAccountType
  fiatAccountSchemaMetadata: Record<string, FiatAccountFieldMetadata>
}

function PaymentInfoFieldSection({
  country,
  fiatAccountDetails,
  setFiatAccountDetails,
  setSubmitDisabled,
  allowedValues,
  fiatAccountType,
  fiatAccountSchemaMetadata,
}: Props) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const userFields = Object.entries(fiatAccountSchemaMetadata)
    .filter(([_, metadata]) => metadata.userField)
    .map(([field, _]) => field)

  useEffect(() => {
    const initialDetails = {
      fiatAccountType,
      country,
    }

    const defaultFields = userFields.reduce((acc, field) => {
      return {
        ...acc,
        ...(allowedValues?.[field] ? { [field]: allowedValues[field][0] } : {}),
      }
    }, {})

    setFiatAccountDetailsWrapper({
      ...initialDetails,
      ...defaultFields,
    })
  }, []) // Empty array required to only run this effect once ever

  useMemo(() => {
    const requiredFields = Object.entries(fiatAccountSchemaMetadata)
      .filter(([_, metadata]) => metadata.required)
      .map(([field, _]) => field)
    const fieldValues = requiredFields.map((field) => fiatAccountDetails[field])
    if (!fieldValues.every((value) => !!value)) {
      setErrorMessage(undefined)
      setSubmitDisabled(true)
      return
    }

    for (const field of requiredFields) {
      const fieldMetadata = fiatAccountSchemaMetadata[field]
      if (!fieldMetadata.validator) {
        continue
      }
      const { valid, error } = fieldMetadata.validator(
        fiatAccountDetails[field],
      )
      if (!valid) {
        setSubmitDisabled(true)
        setErrorMessage(error)
        return
      }
    }
    setSubmitDisabled(false)
    setErrorMessage(undefined)
  }, [fiatAccountDetails])

  const setFiatAccountDetailsWrapper = (newDetails: Record<string, string>) => {
    const formattedDetails: Record<string, string> = {}
    for (const [field, value] of Object.entries(newDetails)) {
      const fieldMetadata = fiatAccountSchemaMetadata[field]
      const formattedValue = fieldMetadata?.formatter
        ? fieldMetadata.formatter(value)
        : value
      formattedDetails[field] = formattedValue
    }
    setFiatAccountDetails(formattedDetails)
  }

  return (
    <Container>
      {userFields.map((field) => {
        return (
          <UserInfoLineItem
            key={field}
            title={fiatAccountSchemaMetadata[field].displayInfo?.title ?? ''}
            placeholder={
              fiatAccountSchemaMetadata[field].displayInfo?.placeholder ?? ''
            }
            onChange={(value) =>
              setFiatAccountDetailsWrapper({ [field]: value })
            }
            value={fiatAccountDetails[field] ?? ''}
            allowedValues={allowedValues?.[field]}
          />
        )
      })}
      {errorMessage && <ErrorSection>{errorMessage}</ErrorSection>}
    </Container>
  )
}

const ErrorSection = styled.div`
  align-self: center;
  text-align: center;
  color: #ff7e7e;
`
const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  width: 100%;
`

export default PaymentInfoFieldSection
