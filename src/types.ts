import { KycSchema, KycSchemas } from '@fiatconnect/fiatconnect-types'

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
  photo?: boolean
}

export enum Screens {
  SignInScreen = 'SignInScreen',
  PaymentInfoScreen = 'PaymentInfoScreen',
  KYCScreen = 'KYCScreen',
  ReviewScreen = 'ReviewScreen',
  UserActionDetailsScreen = 'UserActionDetailsScreen',
  SendCryptoScreen = 'SendCryptoScreen',
  DoneScreen = 'DoneScreen',
}

export interface AddKycParams<T extends KycSchema> {
  kycSchemaName: T
  data: KycSchemas[T]
}

export interface AppState {
  currentScreen: Screens
  screens: Array<Screens>
}

// Note that all flows end in Screens.DoneScreen, however this
// is omitted from the screen lists since we do not want to
// display a "Step" number in the flow UI -- kind of a hack.

// Transfer in screen lists
export const TransferInUserActionNoKycScreens = [
  Screens.SignInScreen,
  Screens.PaymentInfoScreen,
  Screens.ReviewScreen,
  Screens.UserActionDetailsScreen,
]

export const TransferInUserActionKycScreens = [
  Screens.SignInScreen,
  Screens.KYCScreen,
  Screens.PaymentInfoScreen,
  Screens.ReviewScreen,
  Screens.UserActionDetailsScreen,
]

export const TransferInNoUserActionKycScreens = [
  Screens.SignInScreen,
  Screens.KYCScreen,
  Screens.PaymentInfoScreen,
  Screens.ReviewScreen,
]

export const TransferInNoUserActionNoKycScreens = [
  Screens.SignInScreen,
  Screens.PaymentInfoScreen,
  Screens.ReviewScreen,
]

// Transfer out screen lists
export const TransferOutNoKycScreens = [
  Screens.SignInScreen,
  Screens.PaymentInfoScreen,
  Screens.ReviewScreen,
  Screens.SendCryptoScreen,
]

export const TransferOutKycScreens = [
  Screens.SignInScreen,
  Screens.KYCScreen,
  Screens.PaymentInfoScreen,
  Screens.ReviewScreen,
  Screens.SendCryptoScreen,
]
