describe('Settings', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('#username').type('admin@kumon.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#login-button').click();

    cy.wait(2000);
    cy.get('#configurações').click({ multiple: true, force: true });
  });

  it('should display the settings', () => {
    cy.url().should('include', '/home/configuracoes');
  });

  it('should validate cancel button behaviour', () => {
    cy.get('#edit_user').click();
    cy.get('#btn_cancel').click();

    cy.get('#edit_user').should('exist');
  });

  it('should search by existing admin name', () => {
    cy.get('#search_admin').type('Dionartass');

    cy.get('#admin-list tr').should('have.length.greaterThan', 0);
  });

  it('should search by non existing admin name', () => {
    cy.get('#search_admin').type('Não existe');

    cy.get('#admin-list tr').should('have.length.lessThan', 1);
  });

  it('should edit user by searching existing admin name', () => {
    cy.get('#search_admin').type('Dionartass');

    cy.get('#admin-list tr').should('have.length.greaterThan', 0);
    cy.get('#edit-button').click();

    cy.get('#fullname')
      .clear()
      .type('Dionartasss');
    cy.get('#btn_save').click();

    cy.get('#modal-success-user').should('be.visible');
  });

  it('should go to next page, then come back to previous on admin list', () => {
    cy.get('#pagination li')
      .last()
      .click();

    cy.get('#admin-list tr').should('have.length.greaterThan', 0);

    cy.get('#pagination li')
      .first()
      .click();

    cy.get('#admin-list tr').should('have.length.greaterThan', 0);
  });

  it.skip('should create new admin', () => {
    cy.get('#fullname')
      .clear()
      .type('Usuário criado');

    cy.get('#email').type('teste@hotmail.com');
    cy.get('#password').type('senha123');
    cy.get('#confirm_password').type('senha123');
    cy.get('#btn_save').click();
    cy.get('#modal-success-user').should('be.visible');
  });

  it('should edit last admin name on last page', () => {
    cy.get('#pagination li')
      .last()
      .click();

    cy.get('#admin-list tr').should('have.length.greaterThan', 0);

    cy.get('#edit-button')
      .last()
      .click();

    cy.get('#fullname')
      .clear()
      .type('Usuário editado');
    cy.get('#btn_save').click();
    cy.get('#modal-success-user').should('be.visible');
  });

  it('should delete last admin name on last page', () => {
    cy.get('#pagination li')
      .last()
      .click();

    cy.get('#admin-list tr').should('have.length.greaterThan', 0);

    cy.get('#delete-button')
      .last()
      .click();

    cy.get('#modal-delete-user').should('be.visible');
  });
});
