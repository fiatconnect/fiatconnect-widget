import { useState } from 'react'
import { Steps } from '../types'
import { fiatAccountSchemaToPaymentMethod } from '../constants'
import {
  TransferType,
  ObfuscatedFiatAccountData,
  TransferResponse,
} from '@fiatconnect/fiatconnect-types'
import { QuoteAmountBox } from './QuoteAmountBox'
import { transferIn, transferOut } from '../FiatConnectClient'
import { useFiatConnectConfig } from '../hooks/useFiatConnectConfig'
import { providerIdToProviderName } from '../constants'
import { QueryParams } from '../schema'

interface Props {
  onError: (title: string, message: string) => void
  onNext: () => Promise<void>
  linkedAccount: ObfuscatedFiatAccountData
  setTransferResponse: (transferResponse: TransferResponse) => void
  params: QueryParams
}

export function ReviewScreen({
  onError,
  onNext,
  linkedAccount,
  setTransferResponse,
  params,
}: Props) {
  const fiatAmount = parseFloat(params.fiatAmount)
  const cryptoAmount = parseFloat(params.cryptoAmount)

  const fiatConnectClientConfig = useFiatConnectConfig()

  const [transferStarted, setTransferStarted] = useState(false)

  let exchangeRateString = ''
  if (params.transferType === TransferType.TransferIn) {
    const exchangeRate = cryptoAmount / fiatAmount
    exchangeRateString = `1 ${params.fiatType} = ${exchangeRate.toFixed(2)} ${
      params.cryptoType
    }`
  } else {
    const exchangeRate = fiatAmount / cryptoAmount
    exchangeRateString = `1 ${params.cryptoType} = ${exchangeRate.toFixed(2)} ${
      params.fiatType
    }`
  }
  // TODO: Actually figure this out, and have sensible defaults like we do in the wallet
  const settlementTimeString = '1 - 3 Days'

  const onClick = async () => {
    if (!fiatConnectClientConfig) {
      return
    }

    setTransferStarted(true)
    let transferResponse

    if (params.transferType === TransferType.TransferIn) {
      transferResponse = await transferIn(
        {
          quoteId: params.quoteId,
          fiatAccountId: linkedAccount.fiatAccountId,
        },
        fiatConnectClientConfig,
      )
    } else {
      transferResponse = await transferOut(
        {
          quoteId: params.quoteId,
          fiatAccountId: linkedAccount.fiatAccountId,
        },
        fiatConnectClientConfig,
      )
    }

    const providerName = providerIdToProviderName[params.providerId]
    const errorTitle = 'There was an error submitting your order.'
    const errorMessage = `${providerName} encountered an issue while processing your order.`
    if (!transferResponse.ok) {
      onError(errorTitle, errorMessage)
    }

    const transferResponseData =
      (await transferResponse.json()) as TransferResponse
    setTransferResponse(transferResponseData)
    await onNext()
  }

  return (
    <div className="ContentContainer">
      <QuoteAmountBox
        fiatAmount={params.fiatAmount}
        cryptoAmount={params.cryptoAmount}
        fiatType={params.fiatType}
        cryptoType={params.cryptoType}
        transferType={params.transferType}
      />
      <div id="LineItem">
        <div id="LineItem-Left">Exchange Rate</div>
        <div id="LineItem-Right">{exchangeRateString}</div>
      </div>
      <div id="LineItem">
        <div id="LineItem-Left">Settlement Time</div>
        <div id="LineItem-Right">{settlementTimeString}</div>
      </div>
      <hr id="SectionBorder" />
      <div id="AccountInfoSectionTitle">Linked Account</div>
      <div id="LineItem">
        <div id="LineItem-Left">Account Type</div>
        <div id="LineItem-Right">
          {fiatAccountSchemaToPaymentMethod[linkedAccount.fiatAccountSchema]}
        </div>
      </div>
      <div id="LineItem">
        <div id="LineItem-Left">Account Name</div>
        <div id="LineItem-Right">{linkedAccount.accountName}</div>
      </div>
      <hr id="SectionBorder" />
      <div id="Spacer" />
      <button onClick={onClick} id="PrimaryButton" disabled={transferStarted}>
        Submit Order
      </button>
    </div>
  )
}
