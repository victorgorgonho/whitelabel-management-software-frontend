describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('#username').type('admin@kumon.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#login-button').click();

    cy.wait(2000);
  });

  it('should display the dashboard', () => {
    cy.url().should('include', '/home/dashboard');
  });

  it('should enable compliants filter', () => {
    cy.get('#compliants').click();
    cy.get('#compliants').should(
      'have.css',
      'background-color',
      'rgb(24, 176, 135)',
    );
  });

  it('should disable compliants filter', () => {
    cy.get('#compliants').click();
    cy.get('#compliants').click();

    cy.get('#compliants').should(
      'not.have.css',
      'background-color',
      'rgb(24, 176, 135)',
    );
  });

  it('should enable defaulting filter', () => {
    cy.get('#defaulting').click();
    cy.get('#defaulting').should(
      'have.css',
      'background-color',
      'rgb(255, 65, 65)',
    );
  });

  it('should disable defaulting filter', () => {
    cy.get('#defaulting').click();
    cy.get('#defaulting').click();

    cy.get('#defaulting').should(
      'not.have.css',
      'background-color',
      'rgb(255, 65, 65)',
    );
  });

  it('should enable actives filter', () => {
    cy.get('#actives').click();
    cy.get('#actives').should(
      'have.css',
      'background-color',
      'rgb(230, 99, 69)',
    );
  });

  it('should disable actives filter', () => {
    cy.get('#actives').click();
    cy.get('#actives').click();

    cy.get('#actives').should(
      'not.have.css',
      'background-color',
      'rgb(230, 99, 69)',
    );
  });

  it('should enable inactives filter', () => {
    cy.get('#inactives').click();
    cy.get('#inactives').should(
      'have.css',
      'background-color',
      'rgb(253, 214, 96)',
    );
  });

  it('should disable inactives filter', () => {
    cy.get('#inactives').click();
    cy.get('#inactives').click();

    cy.get('#inactives').should(
      'not.have.css',
      'background-color',
      'rgb(253, 214, 96)',
    );
  });

  it('should open modal details for a client', () => {
    cy.get('#view-student-0').click();
    cy.get('#modal-details-student').should('be.visible');
  });

  it('should edit a client', () => {
    cy.get('#edit-student-0').click();
    cy.url().should('include', '/alunos/editar');
  });

  it('should open payment for a client', () => {
    cy.get('#pay-student-0').click();
    cy.url().should('include', '/alunos/pagamentos');
  });
});
