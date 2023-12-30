import { QueryParams } from '../schema'
import { useState } from 'react'
import { Steps } from '../types'
import { FiatConnectClientConfig } from '@fiatconnect/fiatconnect-sdk'
import {
  FiatAccountSchema,
  FiatAccountType,
  KycSchema,
  KycStatus,
  ObfuscatedFiatAccountData, TransferResponse, TransferType,
} from '@fiatconnect/fiatconnect-types'
import { getKycStatus, getLinkedAccount } from '../FiatConnectClient'
import { useQueryParams } from './useQueryParams'
import { useFiatConnectConfig } from './useFiatConnectConfig'

export function useSteps() {
  const queryParamsResults = useQueryParams()
  const fiatConnectClientConfig = useFiatConnectConfig()

  const [step, setStep] = useState(Steps.SignIn)
  const [linkedAccount, setLinkedAccount] = useState<
    ObfuscatedFiatAccountData | undefined
  >(undefined)
  const [transferResponse, setTransferResponse] = useState<
    TransferResponse | undefined
  >(undefined)

  async function handleTransitionToKycStep(
    fiatConnectClientConfig: FiatConnectClientConfig,
    kycSchema?: KycSchema,
  ) {
    const kycStatus = kycSchema
      ? await getKycStatus(kycSchema, fiatConnectClientConfig)
      : undefined

    if (!kycSchema || kycStatus === KycStatus.KycApproved) {
      setStep(Steps.ReviewTransfer)
      return
    }
    setStep(Steps.Kyc)
    return
  }

  async function updateLinkedAccount(
    fiatConnectClientConfig: FiatConnectClientConfig,
    fiatAccountType: FiatAccountType,
    fiatAccountSchema: FiatAccountSchema,
  ) {
    const linkedAccount = await getLinkedAccount(
      fiatAccountType,
      fiatAccountSchema,
      fiatConnectClientConfig,
    )
    setLinkedAccount(linkedAccount)
    return linkedAccount
  }

  async function onAddFiatAccountSuccess() {
    if (!queryParamsResults.success || !fiatConnectClientConfig) {
      // should never happen
      throw new Error(
        `success callback cannot be called with invalid query params or missing fiatconnect client config`,
      )
    }
    const { fiatAccountType, fiatAccountSchema, kycSchema } =
      queryParamsResults.data
    const linkedAccount = await updateLinkedAccount(
      fiatConnectClientConfig,
      fiatAccountType,
      fiatAccountSchema,
    )
    if (!linkedAccount) {
      throw new Error(`No linkedAccount found in onAddFiatAccountSuccess`)
    }
    await handleTransitionToKycStep(fiatConnectClientConfig, kycSchema)
  }

  async function onSignInSuccess() {
    if (!queryParamsResults.success || !fiatConnectClientConfig) {
      // should never happen
      throw new Error(
        `onSignInSuccess cannot be called with invalid query params or missing fiatconnect client config`,
      )
    }
    const { fiatAccountType, fiatAccountSchema, kycSchema } =
      queryParamsResults.data

    const linkedAccount = await updateLinkedAccount(
      fiatConnectClientConfig,
      fiatAccountType,
      fiatAccountSchema,
    )

    if (!linkedAccount) {
      setStep(Steps.AddFiatAccount)
      return
    }
    await handleTransitionToKycStep(fiatConnectClientConfig, kycSchema)
  }

  async function onAddKycSuccess() {
    // todo
  }

  async function onUserActionSuccess() {
    setStep(Steps.Done)
  }

  async function onReviewTransferSuccess(
    transferResponseData: TransferResponse,
  ) {
    if (!queryParamsResults.success) {
      // should never happen
      throw new Error(
        `success callback cannot be called with invalid query params`,
      )
    }
    setTransferResponse(transferResponseData)
    if (
      transferResponseData &&
      'userActionDetails' in transferResponseData &&
      transferResponseData.userActionDetails
    ) {
      setStep(Steps.UserAction)
      return
    }
    if (queryParamsResults.data.transferType === TransferType.TransferOut) {
      setStep(Steps.SendCrypto)
      return
    }
    setStep(Steps.Done)
  }

  async function onSendCryptoSuccess() {
    setStep(Steps.Done)
  }

  return {
    // todo at some point we could make the api a bit nicer with just an "onNext" with smart routing based on the current step. however, onReviewTransferSuccess requires a param the others don't, so this is currently blocked..
    step,
    linkedAccount,
    transferResponse,
    onSignInSuccess,
    onAddKycSuccess,
    onUserActionSuccess,
    onReviewTransferSuccess,
    onSendCryptoSuccess,
    onAddFiatAccountSuccess,
  }
}
