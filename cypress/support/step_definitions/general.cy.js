import { Given } from "@badeball/cypress-cucumber-preprocessor";
const generalElements = require("../../fixtures/pages/general.json");

Given("user clicks the button", function () {
  cy.get(generalElements.submitButton).click();
});
