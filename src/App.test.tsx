import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

jest.mock('react-router-dom')
describe('App', () => {
  it('renders wallet connect element', () => {
    render(<App />)
    const connectWalletElement = screen.getByText(/Connect wallet/i)
    expect(connectWalletElement).toBeTruthy()
  })
})
