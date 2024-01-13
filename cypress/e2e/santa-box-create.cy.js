const users = require("../fixtures/users.json");
const generalElements = require("../fixtures/pages/general.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const drawPage = require("../fixtures/pages/drawPage.json");
const boxPage = require("../fixtures/pages/boxPage.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let newBoxIdentifier;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.contains("Создать коробку").click();
    cy.waitUntil(
      () => cy.contains("Придумайте название коробке").should("be.visible"),
      { timeout: 10000 }
    );
    cy.get(boxPage.boxIdentifierField)
      .invoke("val")
      .then((value) => {
        newBoxIdentifier = value;
      });
    cy.createBox(newBoxName, maxAmount, currency);
  });

  it("add participants via link", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("approve as user1 and user2", () => {
    const participants = [users.user1, users.user2];
    participants.forEach((participant) => {
      let wishes = `${faker.word.noun()} ${faker.word.adverb()} ${faker.word.adjective()}`;
      cy.approveParticipant(
        participant.email,
        participant.password,
        wishes,
        inviteLink
      );
    });
  });

  it("add user 3 and user 4 manually", () => {
    const participantsToAdd = [users.user3, users.user4];
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);

    cy.addParticipantsManually(participantsToAdd);
  });

  it("add the organizer as participant", () => {
    let wishes = `${faker.word.noun()} ${faker.word.adverb()} ${faker.word.adjective()}`;
    cy.get(invitePage.organizerCardButton).click();
    cy.createParticipantCard(wishes);
  });

  it("conduct the draw", () => {
    const numberOfParticipants = 5;

    cy.conductDraw();
    cy.get(drawPage.santaTableLink).click();

    for (let i = 1; i <= numberOfParticipants; i++) {
      cy.showSecreSanta(i);
    }
  });

  after("delete box", () => {
    cy.deleteBoxApi(newBoxIdentifier);
    cy.get(newBoxName).should("not.exist");
  });
});
