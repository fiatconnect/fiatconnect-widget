import { Steps } from '../types'
import { TransferType } from '@fiatconnect/fiatconnect-types'

interface Props {
  step: Steps
  transferType: TransferType
  kycRequired: boolean
}

const STEP_TO_TITLE: Record<Steps, string> = {
  [Steps.SignIn]: 'Sign In',
  [Steps.AddFiatAccount]: 'Payment Info',
  [Steps.ReviewTransfer]: 'Review',
  [Steps.UserAction]: 'Pay',
  [Steps.Kyc]: 'Verify Identity',
  [Steps.Done]: 'Done',
  [Steps.SendCrypto]: 'Pay',
}

function getSteps(transferType: TransferType, kycRequired: boolean): Steps[] {
  const output = [Steps.SignIn, Steps.AddFiatAccount]
  if (kycRequired) {
    output.push(Steps.Kyc)
  }
  output.push(transferType === TransferType.TransferOut ? Steps.SendCrypto : Steps.UserAction)
  output.push(Steps.Done)
  return output
}

export function StepsHeader({
  step,
  transferType,
  kycRequired
}: Props) {
  // TODO M2: Update this to take into account transfers out
  const steps = getSteps(transferType, kycRequired)
  const curStepNumber = steps.indexOf(step) + 1
  if (curStepNumber === -1) {
    throw new Error(`step ${step} not found in steps ${steps.join(',')} for transferType ${transferType}, kycRequired ${kycRequired}`)
  }
  const makeSections = () => {
    const sections = []
    for (let stepNumber = 1; stepNumber <= steps.length; stepNumber++) {
      const id =
        curStepNumber === stepNumber
          ? 'StepsCircle-Current'
          : curStepNumber > stepNumber
          ? 'StepsCircle-Complete'
          : 'StepsCircle-Inactive'
      sections.push(
        <div key={`StepsCircle-${stepNumber}`} id={id}>
          <div>{stepNumber}</div>
          <div id="StepsHeader-Title">{STEP_TO_TITLE[step]}</div>
        </div>,
      )
      if (stepNumber !== steps.length) {
        sections.push(
          <div
            id="StepsCircle-Divider"
            key={`StepsCircle-Divider-${stepNumber}`}
          />,
        )
      }
    }
    return sections
  }
  return (
    <div className="StepsHeader">
      <div className="StepsHeader-Progress">{makeSections()}</div>
    </div>
  )
}
