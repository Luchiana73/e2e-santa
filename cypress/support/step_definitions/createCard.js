import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";
const generalElements = require("../../fixtures/pages/general.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const menuBoxesPage = require("../../fixtures/pages/menuBoxesPage.json");
let wishes;

Given("user clicks the button create participant card", function () {
  cy.get(generalElements.submitButton).click();
  cy.contains("войдите").click();
});

Given("user creates participants card", function () {
  wishes = `${faker.word.noun()} ${faker.word.adverb()} ${faker.word.adjective()}`;
  cy.contains("Создать карточку участника").should("exist");
  cy.get(generalElements.submitButton).click();
  cy.createParticipantCard(wishes);
});

Given("user chooses to participate in the draw", function () {
  cy.get(invitePage.organizerCardButton).click();
});

Given("user creates participant card for himself", function () {
  wishes = `${faker.word.noun()} ${faker.word.adverb()} ${faker.word.adjective()}`;
  cy.createParticipantCard(wishes);
});

Given("user visits invite page", function () {
  cy.get(menuBoxesPage.menuBoxesLink).click();
  cy.get(menuBoxesPage.boxCard).click();
  cy.get(menuBoxesPage.menuButtonToggle).click();
  cy.contains("Добавить участников").click({ force: true });
});
