describe('Reports', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('#username').type('admin@kumon.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#login-button').click();

    cy.wait(2000);
    cy.get('#relatórios').click({ multiple: true, force: true });
  });

  it('should display the reports', () => {
    cy.url().should('include', '/home/relatorios');
  });

  it('should filter by reports year 2020', () => {
    cy.get('#select_year')
      .click()
      .get('#select_year li')
      .contains('2020')
      .first()
      .click();
  });

  it('should compare reports from year 2020 to 2021', () => {
    cy.get('#select_year')
      .click()
      .get('#select_year li')
      .contains('2021')
      .first()
      .click();

    cy.get('#select_year')
      .click()
      .get('#select_year li')
      .contains('2020')
      .first()
      .click();
  });
});
