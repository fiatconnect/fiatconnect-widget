import { z } from 'zod'
import {
  cryptoTypeSchema,
  FiatAccountType,
  fiatTypeSchema,
  TransferType,
  FiatAccountSchema,
  TransferInUserActionDetails,
} from '@fiatconnect/fiatconnect-types'
import { ProviderIds } from './types'

const stringifiedNumberSchema = z.string().regex(/^(\d+|\d*\.\d+)$/)
export const queryParamsSchema = z.object({
  providerId: z.nativeEnum(ProviderIds),
  apiKey: z.string().optional(),
  transferType: z.enum([TransferType.TransferIn]), // TODO(M2): switch to transferTypeSchema from fiatconnect-types when support for transfers out is added
  fiatAmount: stringifiedNumberSchema,
  cryptoAmount: stringifiedNumberSchema,
  fiatType: fiatTypeSchema,
  cryptoType: cryptoTypeSchema,
  quoteId: z.string(),
  settlementTimeLowerBound: z.string().optional(),
  settlementTimeUpperBound: z.string().optional(),
  fiatAccountType: z.enum([FiatAccountType.BankAccount]), // TODO(M3): add mobile money from fiatconnect-types when support is added
  fiatAccountSchema: z.enum([FiatAccountSchema.AccountNumber]), // TODO(M3): add mobile money from fiatconnect-types when support is added
  userActionDetailsSchema: z.enum([
    TransferInUserActionDetails.AccountNumberUserAction,
  ]),
  allowedValues: z.string().optional(),
  country: z.string(),
})
export type QueryParams = z.infer<typeof queryParamsSchema>
