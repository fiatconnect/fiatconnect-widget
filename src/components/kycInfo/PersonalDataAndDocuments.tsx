import { KycFieldMetadata } from '../../types'

export const personalDataAndDocumentsSchemaMetadata: Record<
  string,
  KycFieldMetadata
> = {
  firstName: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'First Name',
      placeholder: 'Your First Name',
    },
  },
  lastName: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Last Name',
      placeholder: 'Your Last Name',
    },
  },
  day: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Day of Birth',
      placeholder: 'DD',
    },
    group: 'dateOfBirth',
  },
  month: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Month of Birth',
      placeholder: 'MM',
    },
    group: 'dateOfBirth',
  },
  year: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Year of Birth',
      placeholder: 'YYYY',
    },
    group: 'dateOfBirth',
  },
  address1: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Address Line 1',
      placeholder: 'Your Address',
    },
    group: 'address',
  },
  address2: {
    required: false,
    userField: true,
    displayInfo: {
      title: 'Address Line 2',
      placeholder: 'Your Address',
    },
    group: 'address',
  },
  city: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'City',
      placeholder: 'Your city',
    },
    group: 'address',
  },
  isoRegionCode: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Region',
      placeholder: 'Your region',
    },
    group: 'address',
  },
  isoCountryCode: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Country',
      placeholder: 'Your country',
    },
    group: 'address',
  },
  postalCode: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Postal Code',
      placeholder: 'Your postal code',
    },
    group: 'address',
  },
  phoneNumber: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Phone Number',
      placeholder: 'Your phone number',
    },
    // TODO(M3): validation and formatting
  },
  // TODO(M3): selfie and ID documents
}
