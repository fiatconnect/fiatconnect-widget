import React, { useEffect, useMemo, useState } from 'react'
import { UserInfoLineItem } from './UserInfoLineItem'
import { KycFieldMetadata } from '../types'
import styled from 'styled-components'

interface Props {
  kycInfo: Record<string, string | Record<string, string>>
  setKycInfo: (
    newDetails: Record<string, string | Record<string, string>>,
  ) => void
  setSubmitDisabled: (disabled: boolean) => void
  kycSchemaMetadata: Record<string, KycFieldMetadata>
}

function KYCInfoFieldSection({
  kycInfo,
  setKycInfo,
  setSubmitDisabled,
  kycSchemaMetadata,
}: Props) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  function getFieldValue(field: string): string | undefined {
    const fieldMetadata = kycSchemaMetadata[field]
    if (fieldMetadata.group) {
      const groupObj = kycInfo[fieldMetadata.group]
      if (typeof groupObj === 'string') {
        throw new Error(
          `kycInfo key ${fieldMetadata.group} has been improperly set to a string, should be object`,
        )
      }
      return groupObj[field]
    } else {
      const fieldValue = kycInfo[field]
      if (typeof fieldValue === 'object') {
        throw new Error(
          `kycInfo key ${field} has been improperly set to an object, should be string`,
        )
      }
      return fieldValue
    }
  }

  const userFields = Object.entries(kycSchemaMetadata)
    .filter(([_, metadata]) => metadata.userField)
    .map(([field, _]) => field)

  useMemo(() => {
    const requiredFields = Object.entries(kycSchemaMetadata)
      .filter(([_, metadata]) => metadata.required)
      .map(([field, _]) => field)
    const fieldValues = requiredFields.map((field) => kycInfo[field])
    if (!fieldValues.every((value) => !!value)) {
      setErrorMessage(undefined)
      setSubmitDisabled(true)
      return
    }

    for (const field of requiredFields) {
      const fieldMetadata = kycSchemaMetadata[field]
      if (!fieldMetadata.validator) {
        continue
      }
      const fieldValue = getFieldValue(field)
      const { valid, error } = fieldValue
        ? fieldMetadata.validator(fieldValue)
        : {
            valid: false,
            error: `${fieldMetadata.displayInfo?.title ?? field} is required`,
          }
      if (!valid) {
        setSubmitDisabled(true)
        setErrorMessage(error)
        return
      }
    }
    setSubmitDisabled(false)
    setErrorMessage(undefined)
  }, [kycInfo])

  const setKycInfoWrapper = (newDetails: Record<string, string>) => {
    const formattedInfo: Record<string, string | Record<string, string>> = {}
    for (const [field, value] of Object.entries(newDetails)) {
      const fieldMetadata = kycSchemaMetadata[field]
      const formattedValue = fieldMetadata?.formatter
        ? fieldMetadata.formatter(value)
        : value
      if (fieldMetadata.group) {
        const group = formattedInfo[fieldMetadata.group]
        if (!group) {
          formattedInfo[fieldMetadata.group] = { [field]: formattedValue }
        } else if (typeof group === 'string') {
          throw new Error(
            `formattedInfo key ${fieldMetadata.group} has been improperly set to a string, should be object`,
          )
        } else {
          group[field] = formattedValue
        }
      } else {
        formattedInfo[field] = formattedValue
      }
    }
    setKycInfo(formattedInfo)
  }

  return (
    <Container>
      {userFields.map((field) => {
        const fieldMetadata = kycSchemaMetadata[field]
        return (
          <UserInfoLineItem
            key={field}
            title={fieldMetadata.displayInfo?.title ?? ''}
            placeholder={fieldMetadata.displayInfo?.placeholder ?? ''}
            onChange={(value) => setKycInfoWrapper({ [field]: value })}
            value={getFieldValue(field) ?? ''}
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

export default KYCInfoFieldSection
