describe('Smoke Test', () => {
  it('Able to connect via MetaMask', () => {
    cy.visit('/?providerId=test-provider&transferType=TransferIn&fiatAmount=10&cryptoAmount=25&fiatType=USD&cryptoType=CELO&quoteId=123abc&fiatAccountType=BankAccount&fiatAccountSchema=AccountNumber&country=USA&userActionDetailsSchema=AccountNumberUserAction')
    cy.get('[data-testid="connected-wallet-button"]').should('not.exist')
    cy.get('[data-testid="connect-wallet-button"]').click()
    cy.get('[data-testid="rk-wallet-option-metaMask"]').click()
    cy.acceptMetamaskAccess()
    cy.get('#SIWESignInButton').should('be.visible')
  })

  it('Able to view connected wallet address', () => {
    cy.get('[data-testid="connect-wallet-button"]').should('not.exist')
    cy.get('[data-testid="connected-wallet-button"]').should('have.text', 'Connected to 0x64…09b9')
  })

  it('Able to sign in with Ethereum', () => {
    cy.get('#SIWESignInButton').click()
    cy.confirmMetamaskSignatureRequest()
    cy.wait(5000) // Allow time for UI to update
    cy.get('[data-testid="error-section"]').should('not.exist')
  })
})
