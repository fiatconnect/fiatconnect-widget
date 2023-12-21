import { UserInfoFieldMetadata } from '../../types'

const accountNumberSchemaMetadata: Record<string, UserInfoFieldMetadata> = {
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
  accountNumber: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Account Number',
      placeholder: '1234567890',
    },
  },
}

export default accountNumberSchemaMetadata
