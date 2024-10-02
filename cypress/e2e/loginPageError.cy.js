describe('The Home Page', () => {
    it('successfully loads', () => {
      cy.visit('http://localhost:5173') 
      cy.url().should('include', '/login')      

      const email = "wrong@nifty.com";
      const pass = "99"

      cy.get('input[name=name]').type(`${email}`)
      cy.get('input[name=pass]').type(`${pass}`)
      cy.get('button[type=submit]').click()

      cy.on('window:alert', (text) => {
        expect(text).to.contains('Usuario o contraseña incorrecta');
      });

      cy.url().should('include', '/login')  

    })
  })