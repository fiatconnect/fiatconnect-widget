import { FiatAccountFieldMetadata } from '../../types'

const mobileFormatter = (input: string) => {
  if (input.length && input[0] !== '+') {
    return `+${input}`
  }
  return input
}

const mobileValidator = (input: string) => {
  const regex = /^\+[0-9]{6,15}$/
  const valid = regex.test(input)
  const errorMessage = 'Invalid Phone Number'
  return {
    valid,
    error: valid ? undefined : errorMessage,
  }
}

const mobileMoneySchemaMetadata: Record<string, FiatAccountFieldMetadata> = {
  country: {
    required: true,
  },
  fiatAccountType: {
    required: true,
  },
  institutionName: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Institution Name',
      placeholder: 'Your Institution Name',
    },
  },
  accountName: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Account Name',
      placeholder: 'Your Account Name',
    },
  },
  mobile: {
    required: true,
    userField: true,
    formatter: mobileFormatter,
    validator: mobileValidator,
    displayInfo: {
      title: 'Mobile Number',
      placeholder: '+234123234566',
    },
  },
  operator: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Operator',
      placeholder: 'Your Mobile Operator',
    },
  },
}

export default mobileMoneySchemaMetadata
