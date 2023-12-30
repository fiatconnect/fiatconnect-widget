export enum ProviderIds {
  Bitmama = 'bitmama',
  TestProvider = 'test-provider',
}

export enum Steps {
  SignIn = 'SignIn',
  AddFiatAccount = 'AddFiatAccount',
  AddKyc = 'AddKyc',
  KycPending = 'KycPending',
  ReviewTransfer = 'ReviewTransfer',
  UserAction = 'UserAction',
  SendCrypto = 'SendCrypto',
  Done = 'Done',
}

export interface FiatAccountFieldMetadata {
  required: boolean
  displayInfo?: {
    title: string
    placeholder?: string
    moreInfo?: string
  }
  userField?: boolean
  formatter?: (input: string) => string
  validator?: (input: string) => {
    valid: boolean
    error?: string
  }
}

export interface KycFieldMetadata extends FiatAccountFieldMetadata {
  group?: string // e.g. dateOfBirth, address
  image?: boolean
}
