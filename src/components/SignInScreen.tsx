import { fiatAccountSchemaToPaymentMethod } from '../constants'
import {
  TransferType,
  ObfuscatedFiatAccountData,
} from '@fiatconnect/fiatconnect-types'
import { QuoteAmountBox } from './QuoteAmountBox'
import SIWEConnectButton from './SIWEConnectButton'
import ConnectWalletButton from './ConnectWalletButton'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import { getLinkedAccount } from '../FiatConnectClient'
import { useFiatConnectConfig } from '../hooks'
import { providerIdToProviderName } from '../constants'
import { QueryParams } from '../schema'

interface Props {
  onError: (title: string, message: string) => void
  onNext: () => Promise<void>
  setLinkedAccount: (fiatAccount: ObfuscatedFiatAccountData) => void
  params: QueryParams
}

const ButtonSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-self: flex-end;
`

const ButtonRow = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
`

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

export function SignInScreen({
  onError,
  onNext,
  setLinkedAccount,
  params,
}: Props) {
  const fiatAmount = parseFloat(params.fiatAmount)
  const cryptoAmount = parseFloat(params.cryptoAmount)
  const fiatConnectClientConfig = useFiatConnectConfig()

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

  const account = useAccount()

  const onLoginSuccess = async () => {
    // Should never happen
    if (!fiatConnectClientConfig) {
      return
    }

    try {
      await onNext()
    } catch {
      const providerName = providerIdToProviderName[params.providerId]
      onError(
        `There was an error signing in with ${providerName}.`,
        'This may be due to a misconfiguration by your wallet provider.',
      )
    }
  }

  return (
    <div className="ContentContainer">
      <div id="PaymentMethodLine">
        <div id="PaymentMethodLine-Title">Payment Method:</div>{' '}
        {fiatAccountSchemaToPaymentMethod[params.fiatAccountSchema]}
      </div>
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
      <ButtonSection>
        <ButtonRow>
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
        </ButtonRow>
        <ButtonRow>
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
            onLoginSuccess={onLoginSuccess}
            onError={onError}
          />
        </ButtonRow>
      </ButtonSection>
    </div>
  )
}
