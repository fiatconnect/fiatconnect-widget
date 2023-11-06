import {
  FiatType,
  CryptoType,
  TransferType,
} from '@fiatconnect/fiatconnect-types'
import { fiatTypeToImage, cryptoTypeToImage } from '../constants'

interface Props {
  fiatAmount: string
  cryptoAmount: string
  fiatType: FiatType
  cryptoType: CryptoType
  transferType: TransferType
}

export function QuoteAmountBox({
  fiatAmount,
  cryptoAmount,
  fiatType,
  cryptoType,
  transferType,
}: Props) {
  // TODO: Make these not Partials and remove the non-null assertion
  const CryptoIcon = cryptoTypeToImage[cryptoType]!
  const FiatIcon = fiatTypeToImage[fiatType]!

  return (
    <div className="QuoteAmountBox">
      <div id="QuoteAmountBox-Top">
        <div id="QuoteAmountBox-Left">
          <div id="QuoteAmountBox-LeftTitle">You Pay</div>
          <div id="QuoteAmountBox-LeftAmount">
            {transferType === TransferType.TransferIn
              ? fiatAmount
              : cryptoAmount}
          </div>
        </div>
        <div id="QuoteAmountBox-Right">
          <div id="QuoteAmountBox-RightSymbol">
            {transferType === TransferType.TransferIn ? FiatIcon : CryptoIcon}
          </div>
          <div id="QuoteAmountBox-RightAmount">
            {transferType === TransferType.TransferIn ? fiatType : cryptoType}
          </div>
        </div>
      </div>
      <div id="QuoteAmountBox-Bottom">
        <div id="QuoteAmountBox-Left">
          <div id="QuoteAmountBox-LeftTitle">You Receive</div>
          <div id="QuoteAmountBox-LeftAmount">
            {transferType === TransferType.TransferIn
              ? cryptoAmount
              : fiatAmount}
          </div>
        </div>
        <div id="QuoteAmountBox-Right">
          <div id="QuoteAmountBox-RightSymbol">
            {transferType === TransferType.TransferIn ? CryptoIcon : FiatIcon}
          </div>
          <div id="QuoteAmountBox-RightAmount">
            {transferType === TransferType.TransferIn ? cryptoType : fiatType}
          </div>
        </div>
      </div>
    </div>
  )
}
