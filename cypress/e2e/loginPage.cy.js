describe('The Home Page', () => {
    beforeEach(() => {
      cy.clearLocalStorage(); 
    });
    it('It obtains the API token', () => {
      const MIAPI = process.env.VITE_MIAPI;
      const name = process.env.VITE_NAME;
      const password = process.env.VITE_PASSWORD; 


      cy.request({
        method: 'POST',
        url: `${MIAPI}/login`, 
        body: {
          name,
          password
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        const token = response.body.token;
        
        cy.log('Token recibido:', token);
        cy.window().then((window) => {
          window.localStorage.setItem('authorization', token);
        });
      });
    });

    it('successfully loads', () => {
      cy.visit('/') 
      cy.url().should('include', '/login')      

      const email = process.env('VITE_NAME');
      const pass = process.env('VITE_PASSWORD');

      cy.get('input[name=name]').type(`${email}`)
      cy.get('input[type=password]').type(`${pass}`)
      cy.wait(2000);
      cy.get('button[type=submit]').click()
      cy.wait(10000);

      cy.url().should('eq', 'http://localhost:5173/home')

      cy.get('[data-testid="navbar-burger"]').should('be.visible');
    })
  })