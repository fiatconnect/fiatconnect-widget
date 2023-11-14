import { Steps } from '../types'
import { TransferType } from '@fiatconnect/fiatconnect-types'
import styled from 'styled-components'

interface Props {
  step: Steps
  transferType?: TransferType
}

const MAX_STEPS = 4

const STEP_TO_TITLE: Record<number, string> = {
  1: 'Sign In',
  2: 'Payment Info',
  3: 'Review',
  4: 'Pay',
}

export function StepsHeader({
  step,
  transferType = TransferType.TransferIn,
}: Props) {
  // TODO M2: Update this to take into account transfers out

  const makeSections = () => {
    const sections = []
    for (let curStep = 1; curStep <= MAX_STEPS; curStep++) {
      const Component =
        step === curStep
          ? StepsCircleCurrent
          : step > curStep
          ? StepsCircleComplete
          : StepsCircleInactive
      sections.push(
        <Component key={`StepsCircle-${curStep}`}>
          <div>{curStep}</div>
          <StepsHeaderTitle>{STEP_TO_TITLE[curStep]}</StepsHeaderTitle>
        </Component>,
      )
      if (curStep !== MAX_STEPS) {
        sections.push(
          <StepsCircleDivider key={`StepsCircle-Divider-${curStep}`} />,
        )
      }
    }
    return sections
  }
  return (
    <Container>
      <StepsHeaderProgress>{makeSections()}</StepsHeaderProgress>
    </Container>
  )
}

const Container = styled.div`
  padding: 10px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  font-weight: 200;
  font-size: 11px;
  line-height: 17px;
`

const StepsCircleComplete = styled.div`
  position: relative;
  display: flex;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  border: 1px solid #bacdff;
  color: #bacdff;
  display: flex;
  justify-content: center;
`

const StepsCircleCurrent = styled.div`
  position: relative;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  border: 1px solid #5987ff;
  color: #5987ff;
  display: flex;
  justify-content: center;
`

const StepsCircleInactive = styled.div`
  position: relative;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  border: 1px solid #868686;
  color: #868686;
  display: flex;
  justify-content: center;
`

const StepsHeaderProgress = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const StepsCircleDivider = styled.div`
  align-self: center;
  display: flex;
  height: 0px;
  width: 27%;
  border: 1px solid #cbcbcb;
`

const StepsHeaderTitle = styled.div`
  position: absolute;
  display: table;
  top: 100%;
  white-space: nowrap;
  text-align: center;
  font-size: 10px;
  justify-content: space-between;
  color: black;
`
