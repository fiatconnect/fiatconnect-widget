import {
  transferTypeSchema,
  fiatTypeSchema,
  cryptoTypeSchema,
  fiatAccountTypeSchema,
  fiatAccountSchemaSchema,
} from '@fiatconnect/fiatconnect-types'
import { z } from 'zod'

export enum ProviderIds {
  Bitmama = 'bitmama',
  TestProvider = 'test-provider',
}

export enum Steps {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
}

export const queryParamsSchema = z.object({
  providerId: z.nativeEnum(ProviderIds),
  apiKey: z.string().optional(),
  transferType: transferTypeSchema,
  fiatAmount: z.string(),
  cryptoAmount: z.string(),
  fiatType: fiatTypeSchema,
  cryptoType: cryptoTypeSchema,
  quoteId: z.string(),
  settlementTimeLowerBound: z.string().optional(),
  settlementTimeUpperBound: z.string().optional(),
  fiatAccountType: fiatAccountTypeSchema,
  fiatAccountSchema: fiatAccountSchemaSchema,
  allowedValues: z.string().optional(),
})

export type QueryParams = z.infer<typeof queryParamsSchema>
