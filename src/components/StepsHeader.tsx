import { Steps } from '../types'
import { TransferType } from '@fiatconnect/fiatconnect-types'

interface Props {
  step: Steps
  transferType?: TransferType
}

export function StepsHeader({ step, transferType = TransferType.TransferIn}: Props) {
  // TODO M2: Update this to take into account transfers out
  return (
    <div className='StepsHeader'>
      <hr className='StepsLine'/>
    </div>
  )
}

