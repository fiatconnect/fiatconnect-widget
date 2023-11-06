import { Steps } from '../types'
import { TransferType } from '@fiatconnect/fiatconnect-types'

interface Props {
  step: Steps
  transferType?: TransferType
}

const MAX_STEPS = 4

const STEP_TO_TITLE: Record<number, string> = {
  1: 'Sign In',
  2: 'Payment Info',
  3: 'Review',
  4: 'Pay'
}

export function StepsHeader({ step, transferType = TransferType.TransferIn}: Props) {
  // TODO M2: Update this to take into account transfers out

  const makeSections = () => {
    const sections = [];
    for (let curStep = 1; curStep <= MAX_STEPS; curStep++) {
      const id = step === curStep ? 'StepsCircle-Current' : (
	(step > curStep) ? 'StepsCircle-Complete' : 'StepsCircle-Inactive'
      )
      sections.push(
      <div key={`StepsCircle-${curStep}`} id={id}>
	  <div>
	{curStep}
	  </div>
	  <div id='StepsHeader-Title'>
	    {STEP_TO_TITLE[curStep]}
	  </div>
      </div>
      )
      if (curStep !== MAX_STEPS) {
	sections.push(<div id='StepsCircle-Divider' key={`StepsCircle-Divider-${curStep}`}/>)
      }

    }
    return sections
  }
  return (
    <div className='StepsHeader'>
      <div className='StepsHeader-Progress'>
	{makeSections()}
      </div>
    </div>
  )
}

