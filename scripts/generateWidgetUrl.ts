/* eslint-disable no-console */
import yargs from 'yargs'
import { ProviderIds } from '../src/types'
import { CryptoType, FiatType } from '@fiatconnect/fiatconnect-types'

function loadConfig() {
  return yargs
    .env('')
    .options({
      apiKey: {
        type: 'string',
        description: 'API key to use',
        demandOption: true,
      },
      address: {
        type: 'string',
        description: 'Address to get a quote for',
        demandOption: true,
      },
      providerId: {
        description: 'Provider ID to use',
        default: 'bitmama',
        choices: Object.values(ProviderIds),
      },
      baseUrl: {
        type: 'string',
        description: 'Base URL of the FiatConnect server to get a quote from',
        default: 'https://cico-staging.bitmama.io',
      },
      country: {
        type: 'string',
        description: 'Country to get a quote for',
        default: 'NG',
      },
      cryptoAmount: {
        type: 'string',
        description: 'Amount of crypto to get a quote for',
        default: '2',
      },
      cryptoType: {
        description: 'Type of crypto to get a quote for',
        choices: Object.values(CryptoType),
        default: CryptoType.cUSD,
      },
      fiatType: {
        description: 'Type of fiat to get a quote for',
        choices: Object.values(FiatType),
        default: FiatType.NGN,
      },
      transferType: {
        description: 'Type of transfer to get a quote for',
        choices: ['in', 'out'],
        default: 'in',
      },
      widgetBaseUrl: {
        type: 'string',
        description: 'Base URL of the widget to use',
        default: 'http://localhost:3000',
      },
    })
    .parseSync()
}

export async function generateWidgetUrl() {
  const config = loadConfig()
  const response = await fetch(
    `${config.baseUrl}/quote/${config.transferType}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        address: config.address,
        country: config.country,
        cryptoAmount: config.cryptoAmount,
        cryptoType: config.cryptoType,
        fiatType: config.fiatType,
      }),
    },
  )
  const quoteJson = await response.json()
  if (!response.ok) {
    throw new Error(`quote response error json: ${JSON.stringify(quoteJson)}`)
  }
  console.log(`quote json: ${JSON.stringify(quoteJson)}`)
  const {
    quote: { fiatAmount, quoteId, transferType },
    kyc: { kycRequired, kycSchemas },
    fiatAccount: fiatAccountJson,
  } = quoteJson
  // todo allowed values
  let widgetUrl =
    `${config.widgetBaseUrl}/fiatconnect-widget/#?` +
    `providerId=${config.providerId}` +
    `&apiKey=${config.apiKey}` +
    `&transferType=${transferType}` +
    `&fiatAmount=${fiatAmount}` +
    `&cryptoAmount=${config.cryptoAmount}` +
    `&fiatType=${config.fiatType}` +
    `&cryptoType=${config.cryptoType}` +
    `&quoteId=${quoteId}` +
    `&country=${config.country}`
  if (kycRequired) {
    widgetUrl += `&kycSchema=${kycSchemas[0]}`
  }
  const fiatAccountType = Object.keys(fiatAccountJson)[0]
  if (!fiatAccountType) {
    throw new Error('fiat account type not found in quote response')
  }
  widgetUrl += `&fiatAccountType=${fiatAccountType}`
  const fiatAccountSchema = fiatAccountJson[fiatAccountType].fiatAccountSchemas[0].fiatAccountSchema
  if (!fiatAccountSchema) {
    throw new Error('fiat account schema not found in quote response')
  }
  widgetUrl += `&fiatAccountSchema=${fiatAccountSchema}`
  const userActionType = fiatAccountJson[fiatAccountType].fiatAccountSchemas[0].userActionType
  if (userActionType) {
    widgetUrl += `&userActionDetailsSchema=${userActionType}`
  }

  console.log(widgetUrl)
}

generateWidgetUrl()
  .then(() => console.log('done'))
  .catch(console.error)
