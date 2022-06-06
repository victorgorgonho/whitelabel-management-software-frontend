describe('Payments', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('#username').type('admin@kumon.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#login-button').click();

    cy.wait(2000);
    cy.get('#alunos').click();

    cy.get('#search-input').type('99999');
    cy.get('#search-input').should('have.value', '99999');
    cy.get('#pay-student-0').click();
  });

  it('should display the payments', () => {
    cy.url().should('include', '/alunos/pagamentos');
  });

  it('should confirm payment', () => {
    const now = new Date();

    const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
    const month =
      now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;

    cy.get('#confirm-payment')
      .first()
      .click();

    cy.get('#payment_date')
      .clear()
      .type(`${day}${month}${now.getFullYear()}`);

    cy.get('#payment_type')
      .click()
      .get('#payment_type li')
      .last()
      .click();

    cy.get('#payment_value')
      .clear()
      .type('50000');

    cy.get('#btn_save').click();

    // We should have at least one toast being shown
    cy.get('.Toastify').should('have.length.greaterThan', 0);
  });

  it('should go to next page, then come back to previous on payments list', () => {
    cy.get('#pagination li')
      .last()
      .click();

    cy.get('#payments-list tr').should('have.length.greaterThan', 0);

    cy.get('#pagination li')
      .first()
      .click();

    cy.get('#payments-list tr').should('have.length.greaterThan', 0);
  });
});
