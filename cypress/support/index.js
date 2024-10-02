Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('navigate is not defined')) {
      return false;
    }
    return true;
  });