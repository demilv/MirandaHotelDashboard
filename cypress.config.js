import { defineConfig } from "cypress";

require('dotenv').config();

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      config.env.VITE_MIAPI = process.env.VITE_MIAPI;
      config.env.VITE_NAME = process.env.VITE_NAME;
      config.env.VITE_PASSWORD = process.env.VITE_PASSWORD;
      
      return config;
    },
  },
};

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 120000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/index.js'
  },
});
