import { queryParamsSchema } from './schema'

describe('schema', () => {
  describe('queryParamsSchema', () => {
    const validQueryParams = {
      providerId: 'bitmama',
      apiKey: '123',
      transferType: 'TransferIn',
      fiatAmount: '10',
      cryptoAmount: '0.103',
      fiatType: 'NGN',
      cryptoType: 'CELO',
      quoteId: 'mock-quote-id',
      fiatAccountType: 'BankAccount',
      fiatAccountSchema: 'AccountNumber',
      userActionDetailsSchema: 'AccountNumberUserAction',
      country: 'NG',
      fiatAccountAllowedValues: JSON.stringify({
        institutionName: ['Access Bank', 'Covenant Microfinance Bank'],
        country: ['NG'],
      }),
      kycAllowedValues: JSON.stringify({
        isoCountryCode: ['NG', 'GH'],
      }),
    }
    it('accepts valid input', () => {
      expect(queryParamsSchema.safeParse(validQueryParams).success).toEqual(
        true,
      )

      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          fiatAccountType: 'MobileMoney',
          fiatAccountSchema: 'MobileMoney',
        }).success,
      ).toEqual(true)

      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          kycAllowedValues: undefined,
        }).success,
      ).toEqual(true)

      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          fiatAccountAllowedValues: undefined,
        }).success,
      ).toEqual(true)
    })

    it('rejects invalid input', () => {
      // unsupported user action details schema
      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          userActionDetailsSchema: 'URLUserAction',
        }).success,
      ).toEqual(false)

      // invalid amount
      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          fiatAmount: '-1',
        }).success,
      ).toEqual(false)

      // missing required field
      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          quoteId: undefined,
        }).success,
      ).toEqual(false)

      // invalid JSON for allowedValues
      expect(
        queryParamsSchema.safeParse({
          ...validQueryParams,
          fiatAccountAllowedValues: 'invalid-json',
        }).success,
      ).toEqual(false)
    })
  })
})
