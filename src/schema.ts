import { z } from 'zod'
import {
  cryptoTypeSchema,
  FiatAccountType,
  fiatTypeSchema,
  transferTypeSchema,
  FiatAccountSchema,
  TransferInUserActionDetails,
} from '@fiatconnect/fiatconnect-types'
import { ProviderIds } from './types'

const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof Object>> => {
    try {
      return JSON.parse(str)
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  })

const stringifiedNumberSchema = z.string().regex(/^(\d+|\d*\.\d+)$/)
export const queryParamsSchema = z.object({
  providerId: z.nativeEnum(ProviderIds),
  apiKey: z.string().optional(),
  transferType: transferTypeSchema,
  fiatAmount: stringifiedNumberSchema,
  cryptoAmount: stringifiedNumberSchema,
  fiatType: fiatTypeSchema,
  cryptoType: cryptoTypeSchema,
  quoteId: z.string(),
  settlementTimeLowerBound: z.string().optional(),
  settlementTimeUpperBound: z.string().optional(),
  fiatAccountType: z.enum([FiatAccountType.BankAccount]), // TODO(M3): add mobile money from fiatconnect-types when support is added
  fiatAccountSchema: z.enum([FiatAccountSchema.AccountNumber]), // TODO(M3): add mobile money from fiatconnect-types when support is added
  userActionDetailsSchema: z
    .enum([TransferInUserActionDetails.AccountNumberUserAction])
    .optional(),
  allowedValues: stringToJSONSchema
    .pipe(z.record(z.array(z.string()).nonempty()))
    .optional(),
  country: z.string(),
})
export type QueryParams = z.infer<typeof queryParamsSchema>
