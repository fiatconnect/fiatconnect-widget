import { Steps, QueryParams } from '../types'
import { fiatAccountSchemaToPaymentMethod } from '../constants'
import { TransferType } from '@fiatconnect/fiatconnect-types'
import { QuoteAmountBox } from './QuoteAmountBox'
import SIWEConnectButton from './SIWEConnectButton'
import ConnectWalletButton from './ConnectWalletButton'
import { useAccount } from 'wagmi'

interface Props {
  onError: (title: string, message: string) => void
  onNext: (step: Steps) => void
  params: QueryParams
}

const circleCompletedStepStyle = {
  border: '1px solid #BACDFF',
  color: '#BACDFF',
}

const circleCurrentStepStyle = {
  border: '1px solid #5987FF',
  color: '#5987FF',
}

const circleInactiveStepStyle = {
  border: '1px solid #7C7C7C',
  color: '#7C7C7C',
}

export function SignInScreen({ onError, onNext, params }: Props) {
  const fiatAmount = parseFloat(params.fiatAmount)
  const cryptoAmount = parseFloat(params.cryptoAmount)

  let exchangeRateString = ''
  if (params.transferType === TransferType.TransferIn) {
    const exchangeRate = fiatAmount / cryptoAmount
    exchangeRateString = `1 ${params.fiatType} = ${exchangeRate.toFixed(2)} ${
      params.cryptoType
    }`
  } else {
    const exchangeRate = cryptoAmount / fiatAmount
    exchangeRateString = `1 ${params.fiatType} = ${exchangeRate.toFixed(2)} ${
      params.cryptoType
    }`
  }
  // TODO: Actually figure this out, and have sensible defaults like we do in the wallet
  const settlementTimeString = '1 - 3 Days'

  const account = useAccount()

  return (
    <div className="ContentContainer">
      <p id="PaymentMethodLine">
        <div id="PaymentMethodLine-Title">Payment Method:</div>{' '}
        {fiatAccountSchemaToPaymentMethod[params.fiatAccountSchema]}
      </p>
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
      <div id="Spacer" />
      <div id="ButtonSection">
        <div id="ButtonRow">
          <div
            id="SignInStepCircle"
            style={
              account.isConnected
                ? circleCompletedStepStyle
                : circleCurrentStepStyle
            }
          >
            1
          </div>
          <ConnectWalletButton />
        </div>
        <div id="ButtonRow">
          <div
            id="SignInStepCircle"
            style={
              account.isConnected
                ? circleCurrentStepStyle
                : circleInactiveStepStyle
            }
          >
            2
          </div>
          <SIWEConnectButton
            providerId={params.providerId}
            apiKey={params.apiKey}
            onLoginSuccess={() => onNext(Steps.Two)}
            onError={onError}
          />
        </div>
      </div>
    </div>
  )
}
