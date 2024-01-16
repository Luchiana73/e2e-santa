import { Given } from "@badeball/cypress-cucumber-preprocessor";
const invitePage = require("../../fixtures/pages/invitePage.json");
let inviteLink;

Given("user copies invite link", function () {
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
    });
});

Given("user access secret santa page after clicking invite link", function () {
  cy.visit(inviteLink);
});

Given("user adds partisipants manually with table", function (dataTable) {
  const participants = dataTable.hashes().map((row) => ({
    name: row.name,
    email: row.email,
  }));
  cy.addParticipantsManually(participants);
});
