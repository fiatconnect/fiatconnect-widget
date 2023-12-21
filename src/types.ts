export enum ProviderIds {
  Bitmama = 'bitmama',
  TestProvider = 'test-provider',
}

export enum Steps {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

export interface FiatAccountFieldMetadata {
  required: boolean
  displayInfo?: {
    title: string
    placeholder: string
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
}
