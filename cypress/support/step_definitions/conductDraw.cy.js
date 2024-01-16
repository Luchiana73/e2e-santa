import { Given } from "@badeball/cypress-cucumber-preprocessor";
const drawPage = require("../../fixtures/pages/drawPage.json");

Given("user starts the draw", function () {
  cy.conductDraw();
});

Given("user clicks on secret santa table link", function () {
  cy.get(drawPage.santaTableLink).click();
});

Given("user can see who is whose Santa", function () {
  const numberOfParticipants = 5;
  for (let i = 1; i <= numberOfParticipants; i++) {
    cy.showSecreSanta(i);
  }
});
