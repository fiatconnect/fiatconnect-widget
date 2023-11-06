import { Steps, QueryParams } from '../types'
import { fiatAccountSchemaToPaymentMethod } from '../constants'

interface Props {
  onError: (title: string, message: string) => void
  onNext: (step: Steps) => void
  params: QueryParams
}

export function SignInScreen({ onError, onNext, params }: Props) {
  return (
    <div className='SignInScreen'>
      <p id='PaymentMethodLine'>

	  <div id='PaymentMethodLine-Title'>Payment Method:</div> {fiatAccountSchemaToPaymentMethod[params.fiatAccountSchema]}

      </p>
    </div>
  )
}
