it('Login with valid credentials', () => {
  cy.visit('/login');

  cy.get('#username').type('admin@kumon.com', { delay: 150 });
  cy.get('#password').type('a1b2c3d4e5', { delay: 150 });
  cy.get('#login-button').click();

  cy.wait(2000);
  cy.url().should('include', '/home');
});

it('Login with invalid email', () => {
  cy.visit('/login');

  cy.get('#username').type('invalidEmail', { delay: 150 });
  cy.get('#password').type('a1b2c3d4e5', { delay: 150 });
  cy.get('#login-button').click();

  cy.wait(2000);
  cy.url().should('include', '/login');
});

it('Login with invalid credentials', () => {
  cy.visit('/login');

  cy.get('#username').type('invalidUser@email.com', { delay: 150 });
  cy.get('#password').type('invalidPassword', { delay: 150 });
  cy.get('#login-button').click();

  cy.wait(2000);
  cy.url().should('include', '/login');
});

it('Login with empty fields', () => {
  cy.visit('/login');

  cy.get('#login-button').click();

  cy.wait(2000);
  cy.url().should('include', '/login');
});
