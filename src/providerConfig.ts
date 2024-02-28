export enum ProviderIds {
  Bitmama = 'bitmama',
  TestProvider = 'test-provider',
}

export const providerIdToBaseUrl: Record<ProviderIds, string> = {
  [ProviderIds.Bitmama]: 'https://cico-staging.bitmama.io',
  [ProviderIds.TestProvider]:
    'https://mock-fc-provider-dot-celo-mobile-alfajores.appspot.com',
}
export const providerIdToProviderName: Record<ProviderIds, string> = {
  [ProviderIds.Bitmama]: 'Bitmama',
  [ProviderIds.TestProvider]: 'Test Provider',
}
export const providerIdToPrivacyPolicyURL: Record<ProviderIds, string> = {
  [ProviderIds.Bitmama]: 'https://bitmama.io/privacy',
  [ProviderIds.TestProvider]: 'https://valoraapp.com/privacy',
}
export const providerIdToSupportEmail: Record<ProviderIds, string> = {
  [ProviderIds.Bitmama]: 'support@bitmama.io',
  [ProviderIds.TestProvider]: 'support@valoraapp.com',
}
