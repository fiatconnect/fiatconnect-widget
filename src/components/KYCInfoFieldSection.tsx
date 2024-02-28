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
  allowedValues?: Record<string, [string, ...string[]]>
}

function isNonemptyStringArray(
  strings?: string[],
): strings is [string, ...string[]] {
  return !!strings && strings.length > 0
}

function identity<T>(x: T): T {
  return x
}

/**
 * Merge 'allowedValues' and 'choices' into a single array and formats them for presentation to the end-user.
 *
 * @param allowedValues: a concept from the FiatConnect spec that allows the server to constraint the space of allowed values
 * for some fields. This is useful for fields like "country" or "state" where the server would reject a request if the
 * user submitted values from an unsupported region.
 * @param choices: a FiatConnect Widget-specific concept that allows us to provide a dropdown when the spec already has a limited
 * space of possible inputs for something like "identity card type"
 * @param reverseFormatter: a function that returns a user-friendly representation of some value
 */
export function getDropdownValues({
  allowedValues,
  choices,
  reverseFormatter,
}: {
  allowedValues: [string, ...string[]] | undefined
  choices: [string, ...string[]] | undefined
  reverseFormatter?: (x: string) => string
}): [string, ...string[]] | undefined {
  if (!allowedValues) {
    return choices
  }
  const humanReadableAllowedValues = allowedValues.map(
    reverseFormatter ?? identity,
  )
  if (!choices) {
    return isNonemptyStringArray(humanReadableAllowedValues) ? humanReadableAllowedValues : undefined
  }
  const output = choices.filter((choice) =>
    humanReadableAllowedValues.includes(choice),
  )
  if (!isNonemptyStringArray(output)) {
    // eslint-disable-next-line no-console
    console.warn(
      `No valid choices for given allowedValues ${allowedValues}. Just showing allowedValues directly`,
    )
    return humanReadableAllowedValues as [string, ...string[]]
  }
  return output
}

function KYCInfoFieldSection({
  kycInfo,
  setKycInfo,
  setSubmitDisabled,
  kycSchemaMetadata,
  allowedValues,
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
      return groupObj ? groupObj[field] : undefined
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
    for (const requiredField of requiredFields) {
      const fieldMetadata = kycSchemaMetadata[requiredField]
      if (fieldMetadata.group) {
        const groupValue = kycInfo[fieldMetadata.group]
        if (typeof groupValue === 'object' && !groupValue[requiredField]) {
          setErrorMessage(undefined)
          setSubmitDisabled(true)
          return
        }
      } else {
        if (!kycInfo[requiredField]) {
          setErrorMessage(undefined)
          setSubmitDisabled(true)
          return
        }
      }
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
    const formattedInfo: Record<string, string | Record<string, string>> =
      kycInfo
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
            photo={fieldMetadata.photo}
            title={fieldMetadata.displayInfo?.title ?? ''}
            placeholder={fieldMetadata.displayInfo?.placeholder ?? ''}
            onChange={(value) => setKycInfoWrapper({ [field]: value })}
            value={
              (fieldMetadata.reverseFormatter
                ? fieldMetadata.reverseFormatter(getFieldValue(field))
                : getFieldValue(field)) ?? ''
            }
            allowedValues={getDropdownValues({
              allowedValues: allowedValues?.[field],
              choices: fieldMetadata.choices,
              reverseFormatter: fieldMetadata.reverseFormatter,
            })}
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
