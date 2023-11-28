import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn().mockReturnValue([
    new URLSearchParams({
      apiKey: 'mock-api-key',
      providerId: 'test-provider',
      transferType: 'TransferIn',
      fiatAmount: '10',
      cryptoAmount: '15',
      fiatType: 'NGN',
      cryptoType: 'CELO',
      country: 'NG',
      fiatAccountType: 'BankAccount',
      fiatAccountSchema: 'AccountNumber',
      quoteId: 'mock-quote-id',
      userActionDetailsSchema: 'AccountNumberUserAction',
    }),
    jest.fn(),
  ]),
}))
describe('App', () => {
  it('renders wallet connect element', () => {
    render(<App />)
    const connectWalletElement = screen.getByText(/Connect Your Wallet/i)
    expect(connectWalletElement).toBeTruthy()
  })
})
