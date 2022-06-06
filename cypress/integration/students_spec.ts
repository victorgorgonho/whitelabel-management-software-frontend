describe('Students', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('#username').type('admin@kumon.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#login-button').click();

    cy.wait(2000);
    cy.get('#alunos').click();
  });

  it('should display the students', () => {
    cy.url().should('include', '/home/alunos');
  });

  it('should search for a existing student by name', () => {
    cy.get('#search-input').type('Arthur');
    cy.get('#search-input').should('have.value', 'Arthur');

    cy.get('#students-list tr').should('have.length.greaterThan', 0);
  });

  it('should search for a inexistent student by name', () => {
    cy.get('#search-input').type('Inexistente');
    cy.get('#search-input').should('have.value', 'Inexistente');

    cy.get('#students-list tr').should('have.length.lessThan', 1);
  });

  it('should search for a existing student by registration', () => {
    cy.get('#search-input').type('2018');
    cy.get('#search-input').should('have.value', '2018');

    cy.get('#students-list tr').should('have.length.greaterThan', 0);
  });

  it('should search for a inexistent student by registration', () => {
    cy.get('#search-input').type('999999');
    cy.get('#search-input').should('have.value', '999999');

    cy.get('#students-list tr').should('have.length.lessThan', 1);
  });

  it('should reset filters for student', () => {
    cy.get('#search-input').type('Inexistente');
    cy.get('#search-input').should('have.value', 'Inexistente');

    cy.get('#students-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#students-list tr').should('have.length.greaterThan', 0);
  });

  it('should go to next page, then come back to previous on students list', () => {
    cy.get('#pagination li')
      .last()
      .click();

    cy.get('#students-list tr').should('have.length.greaterThan', 1);

    cy.get('#pagination li')
      .first()
      .click();

    cy.get('#students-list tr').should('have.length.greaterThan', 1);
  });

  it('should register new student', () => {
    cy.get('#create-student').click();
    cy.url().should('include', '/alunos/cadastrar');

    cy.get('#fullname').type('Teste automático cypress');
    cy.get('#birthDate').type('01012000');

    cy.get('#gender')
      .click()
      .get('#gender li')
      .first()
      .click();

    cy.get('#parent_name').type('Parente automático cypress');

    cy.get('#parent_gender')
      .click()
      .get('#parent_gender li')
      .first()
      .click();

    cy.get('#parent_cpf').type('00122021002');
    cy.get('#parent_email').type('automaticocypress@hotmail.com');
    cy.get('#parent_phone').type('83999999999');
    cy.get('#parent_whatsapp').type('83999999999');
    cy.get('#street').type('Rua teste');
    cy.get('#neighborhood').type('bairro teste');
    cy.get('#number').type('14');
    cy.get('#zipcode').type('99999999');
    cy.get('#state')
      .click()
      .get('#state li')
      .first()
      .click();

    cy.get('#city')
      .click()
      .get('#city li')
      .first()
      .click();

    cy.get('#registration').type('99999');
    cy.get('#payment_day').type('15');
    cy.get('#first_payment_date').type('06072022');
    cy.get('#monthly_cost').type('50000');
    cy.get('#Português').click({ force: true });
    cy.get('#btn_save').click();

    cy.wait(2000);
    cy.url().should('include', '/home/alunos');
  });

  it('should desactive new student', () => {
    cy.get('#search-input').type('99999');
    cy.get('#search-input').should('have.value', '99999');
    cy.get('#desactive-student-0').click();

    cy.get('#modal-success-user').should('be.visible');
  });

  it('should active new student', () => {
    cy.get('#search-input').type('99999');
    cy.get('#search-input').should('have.value', '99999');
    cy.get('#active-student-0').click();

    cy.get('#modal-success-user').should('be.visible');
  });

  it('should edit new student', () => {
    cy.get('#search-input').type('99999');
    cy.get('#search-input').should('have.value', '99999');
    cy.get('#edit-student-0').click();

    cy.url().should('include', '/alunos/editar');

    cy.get('#fullname')
      .clear()
      .type('Teste automático cypress editado');

    cy.get('#btn_save').click();

    cy.get('#modal-success-user').should('be.visible');
  });
});
