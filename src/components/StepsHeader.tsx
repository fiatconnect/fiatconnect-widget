import { AppState, TransferInUserActionNoKycScreens, Screens } from '../types'

const SCREEN_NAME_MAP = {
  [Screens.SignInScreen]: 'Sign In',
  [Screens.PaymentInfoScreen]: 'Payment Info',
  [Screens.KYCScreen]: 'KYC',
  [Screens.ReviewScreen]: 'Review',
  [Screens.UserActionDetailsScreen]: 'Pay',
  [Screens.SendCryptoScreen]: 'Pay',
  [Screens.DoneScreen]: 'Done', // This will never be shown
}

interface Props {
  appState?: AppState
}

const DEFAULT_SCREENS = TransferInUserActionNoKycScreens
const DEFAULT_CURRENT_SCREEN = Screens.SignInScreen

export function StepsHeader({ appState }: Props) {
  const screens = appState ? appState.screens : DEFAULT_SCREENS
  const currentScreen = appState
    ? appState.currentScreen
    : DEFAULT_CURRENT_SCREEN

  const currentScreenStep = screens.indexOf(currentScreen)
  const makeSections = () => {
    const sections = []
    for (let curStep = 0; curStep < screens.length; curStep++) {
      const curStepScreen = screens[curStep]

      const id =
        curStepScreen === currentScreen
          ? 'StepsCircle-Current'
          : currentScreenStep > curStep || currentScreen === Screens.DoneScreen
          ? 'StepsCircle-Complete'
          : 'StepsCircle-Inactive'
      sections.push(
        <div key={`StepsCircle-${curStep}`} id={id}>
          <div>{curStep + 1}</div>
          <div id="StepsHeader-Title">{SCREEN_NAME_MAP[curStepScreen]}</div>
        </div>,
      )
      if (curStep !== screens.length - 1) {
        sections.push(
          <div
            id="StepsCircle-Divider"
            key={`StepsCircle-Divider-${curStep}`}
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
