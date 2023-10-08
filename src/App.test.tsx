import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders connect wallet', () => {
  render(<App />)
  const connectWalletElement = screen.getByText(/Connect wallet/i)
  expect(connectWalletElement).toBeTruthy()
})
