import { Steps, QueryParams } from '../types'
import { fiatAccountSchemaToPaymentMethod } from '../constants'

interface Props {
  onError: (title: string, message: string) => void
  onNext: (step: Steps) => void
  params: QueryParams
}

export function PaymentInfoScreen({ onError, onNext, params }: Props) {
  // TODO: First thing we should do here is check if an account is already on file
  // that shares the same FiatAccountSchema as the one in the params. If we have one,
  // we should immediately skip to step 3 (show a little spinner while we do this)
  return (
    <div className="ContentContainer">
      <div id="PaymentInfo-Title">Payment Info</div>
      <div id="PaymentInfo-Subtitle">
        {fiatAccountSchemaToPaymentMethod[params.fiatAccountSchema]}
      </div>
    </div>
  )
}
