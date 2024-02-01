// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "cypress-wait-until";

const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
const deleteBoxApi = require("../fixtures/pages/deleteBoxApiPage.json");
const menuBoxesPage = require("../fixtures/pages/menuBoxesPage.json");
const drawPage = require("../fixtures/pages/drawPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

Cypress.Commands.add("createParticipantCard", (giftWishes) => {
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(inviteeBoxPage.wishesInput).type(giftWishes);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
});

Cypress.Commands.add("createBox", (boxName, amount, currency) => {
  cy.get(boxPage.boxNameField).should("be.visible").type(boxName);
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.sixthIcon).should("be.visible").click();
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.giftPriceToggle).check({ force: true });
  cy.get(boxPage.maxAnount).should("be.visible").type(amount);
  cy.get(boxPage.currency).should("be.visible").select(currency);
  cy.get(generalElements.arrowRight).should("be.visible").click();
  cy.get(generalElements.arrowRight).click();
  cy.waitUntil(
    () => cy.contains("Дополнительные настройки").should("be.visible"),
    { timeout: 10000 }
  );
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(dashboardPage.createdBoxName).should("have.text", boxName);
  cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

Cypress.Commands.add("showSecreSanta", (index) => {
  cy.get(`:nth-child(${index}) > :nth-child(4) > .table-cell`).click();
  cy.get(`:nth-child(${index}) > :nth-child(6) > .table-cell`).click();
});

Cypress.Commands.add("deleteBoxApi", (identifier) => {
  cy.request({
    method: "DELETE",
    headers: {
      Cookie: deleteBoxApi.cookie,
    },
    url: `/api/box/${identifier}`,
  }).then((response) => {
    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");
  });
});

Cypress.Commands.add(
  "approveParticipant",
  (email, password, giftWishes, link) => {
    cy.visit(link);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(email, password);
    cy.contains("Создать карточку участника").should("exist");
    cy.get(generalElements.submitButton).click();
    cy.createParticipantCard(giftWishes);
    cy.clearCookies();
  }
);

Cypress.Commands.add("addUserManually", (user, index) => {
  cy.get(`:nth-child(${index}) > .frm-wrapper`).type(user.name);
  cy.get(`:nth-child(${index + 1}) > .frm-wrapper`).type(user.email);
});

Cypress.Commands.add("addParticipantsManually", (users) => {
  cy.waitUntil(() => cy.get(menuBoxesPage.menuBoxesLink).should("be.visible"), {
    timeout: 10000,
  });
  cy.get(menuBoxesPage.menuBoxesLink).click();
  cy.get(menuBoxesPage.boxCard).click();
  cy.get(menuBoxesPage.menuButtonToggle).click();
  cy.contains("Добавить участников").click({ force: true });
  cy.get(invitePage.invitationToggle).check({ force: true });

  users.forEach((user, index) => {
    cy.addUserManually(user, index * 2 + 1);
  });
  cy.get(invitePage.inviteButton).click();
});

Cypress.Commands.add("conductDraw", () => {
  cy.get(menuBoxesPage.menuBoxesLink).click();
  cy.get(menuBoxesPage.boxCard).click();
  cy.get(drawPage.drawLink).click({ force: true });
  cy.get(generalElements.submitButton).click();
  cy.get(drawPage.modalSubmitButton).click({ force: true });
  cy.waitUntil(() => cy.get(drawPage.santaTableLink).should("be.visible"), {
    timeout: 10000,
  });
});
