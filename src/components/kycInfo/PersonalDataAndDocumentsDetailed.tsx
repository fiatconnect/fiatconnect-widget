import { KycFieldMetadata } from '../../types'
import { IdentificationDocumentType } from '@fiatconnect/fiatconnect-types'
import { Buffer } from 'buffer'

enum IdTypeFriendlyName {
  IDC = 'Statue-issued ID',
  PAS = 'Passport',
  DL = `Driver's License`,
}

function idTypeFormatter(friendlyName: string): string {
  switch (friendlyName) {
    case IdTypeFriendlyName.IDC: {
      return IdentificationDocumentType.IDC
    }
    case IdTypeFriendlyName.PAS: {
      return IdentificationDocumentType.PAS
    }
    case IdTypeFriendlyName.DL: {
      return IdentificationDocumentType.DL
    }
    default:
      return ''
  }
}

function idTypeReverseFormatter(idType: string | undefined): string {
  switch (idType) {
    case IdentificationDocumentType.IDC: {
      return IdTypeFriendlyName.IDC
    }
    case IdentificationDocumentType.PAS: {
      return IdTypeFriendlyName.PAS
    }
    case IdentificationDocumentType.DL: {
      return IdTypeFriendlyName.DL
    }
    default:
      return ''
  }
}
const b64Encode = (input: string) => Buffer.from(input).toString('base64')

export const personalDataAndDocumentsDetailedSchemaMetadata: Record<
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
  email: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Email',
      placeholder: 'Your email address',
    },
    // TODO(M3): validation and formatting
  },
  selfieDocument: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'Selfie Photo',
      placeholder: 'Please upload a clear image of yourself facing the camera',
    },
    photo: true,
    formatter: b64Encode,
  },
  identificationDocumentType: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'ID Document Type',
      placeholder: 'Your ID type',
    },
    choices: Object.values(IdTypeFriendlyName) as [string, ...string[]],
    formatter: idTypeFormatter,
    reverseFormatter: idTypeReverseFormatter,
  },
  identificationDocumentFront: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'ID Photo Front',
      placeholder:
        'Please upload a clear image of the front of your identification document',
    },
    photo: true,
    formatter: b64Encode,
  },
  identificationDocumentBack: {
    required: true,
    userField: true,
    displayInfo: {
      title: 'ID Photo Back',
      placeholder:
        'Please upload a clear image of the back of your identification document',
    },
    photo: true,
    formatter: b64Encode,
  },
}
