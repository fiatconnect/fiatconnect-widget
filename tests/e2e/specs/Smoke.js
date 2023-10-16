describe('Smoke Test', () => {
  it('Able to connect via MetaMask', () => {
    cy.visit('')
    cy.get('[data-testid="rk-account-button"]').should('not.exist')
    cy.get('[data-testid="rk-connect-button"]').click()
    cy.get('[data-testid="rk-wallet-option-metaMask"]').click()
    cy.acceptMetamaskAccess()
    cy.get('[data-testid="rk-account-button"]').should('be.visible')
  })

  it('Able to view connected wallet address', () => {
    cy.get('[data-testid="rk-account-button"]').click()
    cy.get('#rk_profile_title').should('have.text', '0x64…09b9')
  })
})
