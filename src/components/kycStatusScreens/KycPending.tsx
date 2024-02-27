import React, { useState, useEffect, useRef } from 'react'
import PendingIcon from '../../icons/Pending'
import { KycStatus, KycSchema } from '@fiatconnect/fiatconnect-types'
import {
  StatusContentContainer,
  StatusTitle,
  StatusIconContainer,
  StatusText,
} from '../../styles'
import { getKycStatus } from '../../FiatConnectClient'
import { useFiatConnectConfig } from '../../hooks'
import { ProviderIds } from '../../types'
import { providerIdToProviderName } from '../../constants'
import DoneIcon from '../../icons/Done'

// Adapted from https://stackoverflow.com/questions/46140764/polling-api-every-x-seconds-with-react
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

interface Props {
  kycSchema: KycSchema
  providerId: ProviderIds
  setKycStatus: (kycStatus: KycStatus) => void
  onError: (title: string, message: string) => void
}

export function KycPending({
  kycSchema,
  providerId,
  setKycStatus,
  onError,
}: Props) {
  const [internalKycStatus, setInternalKycStatus] = useState<KycStatus>(
    KycStatus.KycPending,
  )
  const [delay, setDelay] = useState<number | null>(5000)

  const fiatConnectClientConfig = useFiatConnectConfig()

  const onSubmit = () => {
    setKycStatus(internalKycStatus)
  }

  const fetchKycStatus = async () => {
    if (!fiatConnectClientConfig) return

    try {
      const kycStatus = await getKycStatus(
        { kycSchema },
        fiatConnectClientConfig,
      )
      if (kycStatus && kycStatus !== KycStatus.KycPending) {
        setDelay(null)
        // If the user waits on this screen for their KYC status to be approved, we
        // want to show them an "Approved" screen that they must click through. We do
        // not want to show this "Approved" screen to users with pre-approved KYC
        // who have just signed in, however. If we set the global KYC status to "Approved"
        // here, the user would immediately be taken to the next screen in the flow, so
        // we only update the global state after the user has acknowledged it.
        if (kycStatus === KycStatus.KycApproved) {
          setInternalKycStatus(kycStatus)
        } else {
          setKycStatus(kycStatus)
        }
      }
    } catch (error) {
      onError(
        'There was an error while checking your identfication status',
        'This may be due to a problem with the provider.',
      )
    }
  }

  useInterval(fetchKycStatus, delay)

  const providerName = providerIdToProviderName[providerId]

  if (internalKycStatus === KycStatus.KycApproved) {
    return (
      <StatusContentContainer>
        <StatusTitle>Your information has been accepted!</StatusTitle>
        <StatusIconContainer>
          <DoneIcon />
        </StatusIconContainer>
        <StatusText>
          Your identification information has been approved by {providerName}.
        </StatusText>
        <StatusText>You can now continue with your transaction.</StatusText>
        <button onClick={onSubmit} id="PrimaryButton">
          Continue
        </button>
      </StatusContentContainer>
    )
  } else {
    return (
      <StatusContentContainer>
        <StatusTitle>Your information is pending review</StatusTitle>
        <StatusIconContainer>
          <PendingIcon />
        </StatusIconContainer>
        <StatusText>
          You can wait here until your identification information has been
          approved, or return at a later time.
        </StatusText>
        <StatusText>
          If this is taking longer than expected, reach out to your wallet
          provider.
        </StatusText>
      </StatusContentContainer>
    )
  }
}
